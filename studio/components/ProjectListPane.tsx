import {useEffect, useMemo, useState} from 'react'
import {useClient} from 'sanity'
import {IntentLink} from 'sanity/router'

type ProjectLayout = 'twoColumns' | 'fourColumns' | 'mosaic'

type ProjectListFilter = {
  title?: string
  layout?: ProjectLayout
  featuredOnly?: boolean
  draftsOnly?: boolean
}

type ProjectDocument = {
  _id: string
  _type: 'project'
  title?: string
  campaign?: string
  layout?: ProjectLayout
  featured?: boolean
  order?: number
  imageUrl?: string
}

type ProjectListPaneProps = {
  options?: ProjectListFilter
}

const layoutLabels: Record<ProjectLayout, string> = {
  twoColumns: 'Dos columnas',
  fourColumns: 'Cuatro columnas',
  mosaic: 'Mosaico',
}

function getPublishedId(id: string) {
  return id.replace(/^drafts\./, '')
}

function normalizeProjects(projects: ProjectDocument[]) {
  const groupedProjects = new Map<string, ProjectDocument>()

  for (const project of projects) {
    const publishedId = getPublishedId(project._id)
    const currentProject = groupedProjects.get(publishedId)
    const isDraft = project._id.startsWith('drafts.')

    if (!currentProject || isDraft) {
      groupedProjects.set(publishedId, project)
    }
  }

  return Array.from(groupedProjects.values()).sort((firstProject, secondProject) => {
    const firstOrder = firstProject.order ?? 9999
    const secondOrder = secondProject.order ?? 9999

    if (firstOrder !== secondOrder) {
      return firstOrder - secondOrder
    }

    return (firstProject.title || '').localeCompare(secondProject.title || '')
  })
}

function getProjectSubtitle(project: ProjectDocument) {
  const labels = [
    project.featured ? 'Destacado' : '',
    project.campaign || '',
    project.layout ? layoutLabels[project.layout] : '',
  ].filter(Boolean)

  return labels.join(' · ')
}

export function ProjectListPane({options}: ProjectListPaneProps) {
  const client = useClient({apiVersion: '2026-03-01'})
  const [projects, setProjects] = useState<ProjectDocument[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [busyProjectId, setBusyProjectId] = useState<string | null>(null)

  const fetchProjects = async () => {
    const fetchedProjects = await client.fetch<ProjectDocument[]>(`
      *[_type == "project"]{
        _id,
        _type,
        title,
        campaign,
        layout,
        featured,
        order,
        "imageUrl": coalesce(coverMedia.image.asset->url, coverImage.asset->url)
      }
    `)

    setProjects(normalizeProjects(fetchedProjects))
    setIsLoading(false)
  }

  useEffect(() => {
    fetchProjects().catch((error) => {
      console.error(error)
      setIsLoading(false)
    })

    const subscription = client.listen('*[_type == "project"]').subscribe(() => {
      fetchProjects().catch(console.error)
    })

    return () => subscription.unsubscribe()
  }, [client])

  const visibleProjects = useMemo(() => {
    return projects.filter((project) => {
      if (options?.layout && project.layout !== options.layout) return false
      if (options?.featuredOnly && !project.featured) return false
      if (options?.draftsOnly && !project._id.startsWith('drafts.')) return false

      return true
    })
  }, [options?.draftsOnly, options?.featuredOnly, options?.layout, projects])

  const duplicateProject = async (project: ProjectDocument) => {
    const publishedId = getPublishedId(project._id)
    setBusyProjectId(project._id)

    try {
      const sourceDocument = await client.fetch<ProjectDocument | null>(
        '*[_id == $draftId || _id == $publishedId][0]',
        {
          draftId: `drafts.${publishedId}`,
          publishedId,
        },
      )

      if (!sourceDocument) return

      const duplicatedProject = JSON.parse(JSON.stringify(sourceDocument))

      delete duplicatedProject._id
      delete duplicatedProject._rev
      delete duplicatedProject._createdAt
      delete duplicatedProject._updatedAt
      delete duplicatedProject.slug

      duplicatedProject._id = `drafts.${crypto.randomUUID()}`
      duplicatedProject.title = `${sourceDocument.title || 'Proyecto'} copia`

      await client.create(duplicatedProject)
      await fetchProjects()
      setOpenMenuId(null)
    } catch (error) {
      console.error(error)
      window.alert('No se ha podido duplicar el proyecto.')
    } finally {
      setBusyProjectId(null)
    }
  }

  const deleteProject = async (project: ProjectDocument) => {
    const confirmed = window.confirm(
      `Vas a borrar "${project.title || 'este proyecto'}". Esta accion no se puede deshacer.`,
    )

    if (!confirmed) return

    const publishedId = getPublishedId(project._id)
    setBusyProjectId(project._id)

    try {
      await client.transaction().delete(publishedId).delete(`drafts.${publishedId}`).commit()
      await fetchProjects()
      setOpenMenuId(null)
    } catch (error) {
      console.error(error)
      window.alert('No se ha podido borrar el proyecto.')
    } finally {
      setBusyProjectId(null)
    }
  }

  return (
    <div className="project-list-pane">
      <div className="project-list-pane__header">
        <h2>{options?.title || 'Proyectos'}</h2>
        <IntentLink
          className="project-list-pane__create"
          intent="create"
          params={{type: 'project'}}
        >
          Nuevo proyecto
        </IntentLink>
      </div>

      {isLoading ? (
        <p className="project-list-pane__state">Cargando proyectos...</p>
      ) : visibleProjects.length === 0 ? (
        <p className="project-list-pane__state">No hay proyectos en esta vista.</p>
      ) : (
        <ul className="project-list-pane__list">
          {visibleProjects.map((project) => {
            const publishedId = getPublishedId(project._id)
            const isBusy = busyProjectId === project._id

            return (
              <li className="project-list-pane__item" key={project._id}>
                <IntentLink
                  className="project-list-pane__link"
                  intent="edit"
                  params={{id: publishedId, type: 'project'}}
                >
                  <span className="project-list-pane__media">
                    {project.imageUrl ? (
                      <img src={project.imageUrl} alt="" />
                    ) : (
                      <span className="project-list-pane__media-placeholder" aria-hidden="true" />
                    )}
                  </span>
                  <span className="project-list-pane__content">
                    <strong>{project.title || 'Proyecto sin titulo'}</strong>
                    <small>{getProjectSubtitle(project) || 'Sin datos secundarios'}</small>
                  </span>
                </IntentLink>

                <div className="project-list-pane__actions">
                  {project.featured ? (
                    <span className="project-list-pane__status" title="Proyecto destacado" />
                  ) : null}

                  <button
                    aria-expanded={openMenuId === project._id}
                    aria-label={`Acciones de ${project.title || 'proyecto'}`}
                    className="project-list-pane__menu-button"
                    disabled={isBusy}
                    type="button"
                    onClick={() => setOpenMenuId(openMenuId === project._id ? null : project._id)}
                  >
                    <span />
                    <span />
                    <span />
                  </button>

                  {openMenuId === project._id ? (
                    <div className="project-list-pane__menu">
                      <IntentLink
                        className="project-list-pane__menu-item"
                        intent="edit"
                        params={{id: publishedId, type: 'project'}}
                        onClick={() => setOpenMenuId(null)}
                      >
                        Editar
                      </IntentLink>
                      <button
                        className="project-list-pane__menu-item"
                        disabled={isBusy}
                        type="button"
                        onClick={() => duplicateProject(project)}
                      >
                        Duplicar
                      </button>
                      <button
                        className="project-list-pane__menu-item project-list-pane__menu-item--danger"
                        disabled={isBusy}
                        type="button"
                        onClick={() => deleteProject(project)}
                      >
                        Borrar
                      </button>
                    </div>
                  ) : null}
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <style>{`
        .project-list-pane {
          min-height: 100%;
          background: #f7f6f2;
          color: #111;
        }

        .project-list-pane__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 18px 18px 14px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        }

        .project-list-pane__header h2 {
          margin: 0;
          font-size: 16px;
          font-weight: 500;
        }

        .project-list-pane__create {
          color: #111;
          font-size: 13px;
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .project-list-pane__list {
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin: 0;
          padding: 8px;
          list-style: none;
        }

        .project-list-pane__item {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: center;
          min-height: 74px;
          background: #fff;
          border: 1px solid transparent;
        }

        .project-list-pane__item:hover,
        .project-list-pane__item:focus-within {
          border-color: rgba(0, 0, 0, 0.14);
        }

        .project-list-pane__link {
          display: grid;
          grid-template-columns: 38px minmax(0, 1fr);
          align-items: center;
          gap: 12px;
          min-width: 0;
          padding: 10px;
          color: inherit;
          text-decoration: none;
        }

        .project-list-pane__media {
          display: grid;
          width: 32px;
          height: 32px;
          place-items: center;
          border: 1px solid rgba(0, 0, 0, 0.12);
          background: #f4f3ef;
        }

        .project-list-pane__media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .project-list-pane__media-placeholder {
          width: 12px;
          height: 16px;
          border: 1px solid rgba(0, 0, 0, 0.24);
          background: #fff;
        }

        .project-list-pane__content {
          display: flex;
          min-width: 0;
          flex-direction: column;
          gap: 3px;
        }

        .project-list-pane__content strong,
        .project-list-pane__content small {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .project-list-pane__content strong {
          font-size: 14px;
          font-weight: 500;
        }

        .project-list-pane__content small {
          color: #9b978f;
          font-size: 12px;
        }

        .project-list-pane__actions {
          position: relative;
          display: flex;
          align-items: center;
          gap: 12px;
          padding-right: 12px;
        }

        .project-list-pane__status {
          width: 5px;
          height: 5px;
          border-radius: 999px;
          background: #1c6f3a;
        }

        .project-list-pane__menu-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 3px;
          width: 34px;
          height: 34px;
          border: 0;
          background: transparent;
          color: #111;
          cursor: pointer;
        }

        .project-list-pane__menu-button span {
          width: 4px;
          height: 4px;
          border-radius: 999px;
          background: currentColor;
        }

        .project-list-pane__menu-button:hover {
          background: rgba(0, 0, 0, 0.06);
        }

        .project-list-pane__menu {
          position: absolute;
          top: calc(100% + 4px);
          right: 8px;
          z-index: 10;
          display: grid;
          min-width: 132px;
          padding: 6px;
          background: #fff;
          border: 1px solid rgba(0, 0, 0, 0.12);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.14);
        }

        .project-list-pane__menu-item {
          display: block;
          width: 100%;
          padding: 8px 10px;
          border: 0;
          background: transparent;
          color: #111;
          font: inherit;
          font-size: 13px;
          text-align: left;
          text-decoration: none;
          cursor: pointer;
        }

        .project-list-pane__menu-item:hover {
          background: #f1f0eb;
        }

        .project-list-pane__menu-item--danger {
          color: #9c1f1f;
        }

        .project-list-pane__state {
          margin: 0;
          padding: 18px;
          color: #77736c;
          font-size: 13px;
        }
      `}</style>
    </div>
  )
}

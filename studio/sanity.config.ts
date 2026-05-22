import {useState} from 'react'
import {defineConfig, useClient} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

function DuplicateProjectAction(props: any) {
  const client = useClient({apiVersion: '2026-03-01'})
  const [isDuplicating, setIsDuplicating] = useState(false)
  const sourceDocument = props.draft || props.published

  return {
    label: isDuplicating ? 'Duplicando...' : 'Duplicar proyecto',
    disabled: isDuplicating || !sourceDocument,
    onHandle: async () => {
      if (!sourceDocument) return

      setIsDuplicating(true)

      try {
        const duplicatedProject = JSON.parse(JSON.stringify(sourceDocument))

        delete duplicatedProject._id
        delete duplicatedProject._rev
        delete duplicatedProject._createdAt
        delete duplicatedProject._updatedAt
        delete duplicatedProject.slug

        duplicatedProject._id = `drafts.${crypto.randomUUID()}`
        duplicatedProject.title = `${sourceDocument.title || 'Proyecto'} copia`

        await client.create(duplicatedProject)
        props.onComplete()
        window.alert('Proyecto duplicado como borrador. Revisa el título y crea una URL nueva antes de publicarlo.')
      } catch (error) {
        console.error(error)
        window.alert('No se ha podido duplicar el proyecto.')
      } finally {
        setIsDuplicating(false)
      }
    },
  }
}

(DuplicateProjectAction as any).action = 'duplicateProject'

export default defineConfig({
  name: 'default',
  title: 'calle-web-sanity',

  projectId: '84i991bj',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (prev, context) => {
      if (context.schemaType !== 'project') {
        return prev
      }

      return [
        ...prev.filter((action) => action.action !== 'duplicate'),
        DuplicateProjectAction,
      ]
    },
  },
})

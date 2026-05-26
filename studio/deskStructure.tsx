import type {StructureResolver} from 'sanity/structure'

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 11.5 12 5l8 6.5V20h-5v-5.5H9V20H4v-8.5Z" fill="currentColor" />
    </svg>
  )
}

function ProjectIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 5h7v7H4V5Zm9 0h7v7h-7V5ZM4 14h7v5H4v-5Zm9 0h7v5h-7v-5Z" fill="currentColor" />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m12 4 2.35 4.76 5.25.76-3.8 3.7.9 5.23L12 16l-4.7 2.45.9-5.23-3.8-3.7 5.25-.76L12 4Z" fill="currentColor" />
    </svg>
  )
}

function GalleryIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 5h16v4H4V5Zm0 6h7v8H4v-8Zm9 0h7v8h-7v-8Z" fill="currentColor" />
    </svg>
  )
}

function DraftIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 4h9l3 3v13H6V4Zm8 1.5V8h2.5L14 5.5ZM8 11h8v1.5H8V11Zm0 4h6v1.5H8V15Z" fill="currentColor" />
    </svg>
  )
}

export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title('Calle Studio')
    .items([
      S.listItem()
        .title('Home')
        .icon(HomeIcon)
        .child(S.documentTypeList('homeSettings').title('Slider de la home')),

      S.divider(),

      S.listItem()
        .title('Proyectos')
        .icon(ProjectIcon)
        .child(
          S.list()
            .title('Proyectos')
            .items([
              S.listItem()
                .title('Todos los proyectos')
                .icon(ProjectIcon)
                .child(
                  S.documentTypeList('project')
                    .title('Todos los proyectos')
                    .defaultOrdering([{field: 'order', direction: 'asc'}]),
                ),

              S.listItem()
                .title('Proyectos destacados')
                .icon(StarIcon)
                .child(
                  S.documentTypeList('project')
                    .title('Proyectos destacados')
                    .filter('_type == "project" && featured == true')
                    .defaultOrdering([{field: 'order', direction: 'asc'}]),
                ),

              S.divider(),

              S.listItem()
                .title('Galería dos columnas')
                .icon(GalleryIcon)
                .child(
                  S.documentTypeList('project')
                    .title('Dos columnas')
                    .filter('_type == "project" && layout == "twoColumns"')
                    .defaultOrdering([{field: 'order', direction: 'asc'}]),
                ),

              S.listItem()
                .title('Galería cuatro columnas')
                .icon(GalleryIcon)
                .child(
                  S.documentTypeList('project')
                    .title('Cuatro columnas')
                    .filter('_type == "project" && layout == "fourColumns"')
                    .defaultOrdering([{field: 'order', direction: 'asc'}]),
                ),

              S.listItem()
                .title('Galería mosaico')
                .icon(GalleryIcon)
                .child(
                  S.documentTypeList('project')
                    .title('Mosaico')
                    .filter('_type == "project" && layout == "mosaic"')
                    .defaultOrdering([{field: 'order', direction: 'asc'}]),
                ),
            ]),
        ),

      S.listItem()
        .title('Borradores')
        .icon(DraftIcon)
        .child(
          S.documentTypeList('project')
            .title('Borradores de proyectos')
            .filter('_type == "project" && _id in path("drafts.**")')
            .defaultOrdering([{field: '_updatedAt', direction: 'desc'}]),
        ),
    ])

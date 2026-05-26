import type {StructureResolver} from 'sanity/structure'
import {ProjectListPane} from './components/ProjectListPane'

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
      <path
        d="M4 5h7v7H4V5Zm9 0h7v7h-7V5ZM4 14h7v5H4v-5Zm9 0h7v5h-7v-5Z"
        fill="currentColor"
      />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="m12 4 2.35 4.76 5.25.76-3.8 3.7.9 5.23L12 16l-4.7 2.45.9-5.23-3.8-3.7 5.25-.76L12 4Z"
        fill="currentColor"
      />
    </svg>
  )
}

function GalleryTwoColumnsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 5h7v14H4V5Zm9 0h7v14h-7V5Z" fill="currentColor" />
    </svg>
  )
}

function GalleryFourColumnsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 5h16v6H4V5Zm0 9h3.5v5H4v-5Zm5.5 0H13v5H9.5v-5Zm5.5 0h3.5v5H15v-5Zm5.5 0H20v5h-3.5v-5Z"
        fill="currentColor"
      />
    </svg>
  )
}

function GalleryMosaicIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 5h7v6H4V5Zm9 0h7v14h-7V5ZM4 13h3v6H4v-6Zm5 0h2v6H9v-6Z" fill="currentColor" />
    </svg>
  )
}

function DraftIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6 4h9l3 3v13H6V4Zm8 1.5V8h2.5L14 5.5ZM8 11h8v1.5H8V11Zm0 4h6v1.5H8V15Z"
        fill="currentColor"
      />
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
                  S.component(ProjectListPane)
                    .id('project-list-all')
                    .title('Todos los proyectos')
                    .options({title: 'Todos los proyectos'}),
                ),

              S.listItem()
                .title('Proyectos destacados')
                .icon(StarIcon)
                .child(
                  S.component(ProjectListPane)
                    .id('project-list-featured')
                    .title('Proyectos destacados')
                    .options({title: 'Proyectos destacados', featuredOnly: true}),
                ),

              S.divider(),

              S.listItem()
                .title('Galeria dos columnas')
                .icon(GalleryTwoColumnsIcon)
                .child(
                  S.component(ProjectListPane)
                    .id('project-list-two-columns')
                    .title('Dos columnas')
                    .options({title: 'Galeria dos columnas', layout: 'twoColumns'}),
                ),

              S.listItem()
                .title('Galeria cuatro columnas')
                .icon(GalleryFourColumnsIcon)
                .child(
                  S.component(ProjectListPane)
                    .id('project-list-four-columns')
                    .title('Cuatro columnas')
                    .options({title: 'Galeria cuatro columnas', layout: 'fourColumns'}),
                ),

              S.listItem()
                .title('Galeria mosaico')
                .icon(GalleryMosaicIcon)
                .child(
                  S.component(ProjectListPane)
                    .id('project-list-mosaic')
                    .title('Mosaico')
                    .options({title: 'Galeria mosaico', layout: 'mosaic'}),
                ),
            ]),
        ),

      S.listItem()
        .title('Borradores')
        .icon(DraftIcon)
        .child(
          S.component(ProjectListPane)
            .id('project-list-drafts')
            .title('Borradores de proyectos')
            .options({title: 'Borradores de proyectos', draftsOnly: true}),
        ),
    ])

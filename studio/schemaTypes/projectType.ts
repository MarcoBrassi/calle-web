import {defineArrayMember, defineField, defineType} from 'sanity'
import {MosaicBlockLayoutInput} from '../components/MosaicBlockLayoutInput'
import {
    MosaicBlockFallbackPreviewIcon,
    mosaicBlockPreviewIcons,
} from '../components/MosaicBlockPreviewIcons'
import {MosaicCoverNotice} from '../components/MosaicCoverNotice'
import {ProjectLayoutInput} from '../components/ProjectLayoutInput'
import {validateAllDocumentImages, validateWebpImageAsset} from './imageValidation'

export const projectType = defineType({
    name: 'project',
    title: 'Proyectos',
    type: 'document',
    validation: (rule) => rule.custom((document, context) => validateAllDocumentImages(document, context)),
    groups: [
        {name: 'content', title: 'Contenido', default: true},
        {name: 'gallery', title: 'Galería'},
        {name: 'settings', title: 'Ajustes'},
    ],
    preview: {
        select: {
        title: 'title',
        campaign: 'campaign',
        layout: 'layout',
        featured: 'featured',
        media: 'coverMedia.image',
        },
        prepare({title, campaign, layout, featured, media}) {
        const galleryLabels: Record<string, string> = {
            twoColumns: 'Dos columnas',
            fourColumns: 'Cuatro columnas',
            mosaic: 'Mosaico',
        }

        return {
            title: title || 'Proyecto sin título',
            subtitle: `${featured ? 'Destacado · ' : ''}${campaign || 'Sin campaña'} · ${galleryLabels[layout] || 'Galería'}`,
            media,
        }
        },
    },

    fields: [
        defineField({
        name: 'title',
        title: 'Título del proyecto',
        type: 'string',
        group: 'content',
        validation: (rule) => rule.required(),
        }),

        defineField({
        name: 'slug',
        title: 'URL del proyecto',
        type: 'slug',
        group: 'settings',
        options: {
            source: 'title',
        },
        validation: (rule) => rule.required(),
        }),

        defineField({
        name: 'featured',
        title: 'Proyecto destacado',
        type: 'boolean',
        group: 'settings',
        initialValue: false,
        description: 'Activa esta casilla para que el proyecto aparezca en el menú dinámico de About.',
        }),

        defineField({
        name: 'campaign',
        title: 'Campaña',
        type: 'string',
        group: 'content',
        }),

        defineField({
        name: 'services',
        title: 'Servicios',
        type: 'array',
        group: 'content',
        of: [defineArrayMember({type: 'string'})],
        }),

        defineField({
        name: 'description',
        title: 'Descripción',
        type: 'text',
        group: 'content',
        }),

        defineField({
        name: 'layout',
        title: 'Tipo de galería',
        type: 'string',
        group: 'gallery',
        initialValue: 'twoColumns',
        components: {
            input: ProjectLayoutInput,
        },
        options: {
            list: [
            {title: 'Dos columnas', value: 'twoColumns'},
            {title: 'Cuatro columnas', value: 'fourColumns'},
            {title: 'Mosaico', value: 'mosaic'},
            ],
            layout: 'radio',
        },
        }),

        defineField({
        name: 'mosaicCoverNotice',
        title: 'Imagen principal',
        type: 'string',
        group: 'gallery',
        hidden: ({document}) => document?.layout !== 'mosaic',
        components: {
            input: MosaicCoverNotice,
        },
        }),

        defineField({
        name: 'coverMedia',
        title: 'Medio principal',
        type: 'object',
        group: 'gallery',
        hidden: ({document}) => document?.layout === 'mosaic',
        fields: [
            defineField({
            name: 'mediaType',
            title: 'Tipo de medio',
            type: 'string',
            initialValue: 'image',
            options: {
                list: [
                {title: 'Imagen', value: 'image'},
                {title: 'Vídeo', value: 'video'},
                ],
            },
            validation: (rule) => rule.required(),
            }),

            defineField({
            name: 'image',
            title: 'Imagen',
            description: 'Sube una imagen .webp de maximo 500 KB.',
            type: 'image',
            options: {
                hotspot: true,
                accept: 'image/webp',
            },
            hidden: ({parent}) => parent?.mediaType !== 'image',
            validation: (rule) =>
                rule.custom((value, context) => {
                const parent = context.parent as {mediaType?: string} | undefined

                if (parent?.mediaType !== 'image' || !value) {
                    return true
                }

                return validateWebpImageAsset(value, context)
                }),
            }),

            defineField({
            name: 'video',
            title: 'Vídeo',
            type: 'file',
            options: {
                accept: 'video/*',
            },
            hidden: ({parent}) => parent?.mediaType !== 'video',
            }),
        ],
        }),

        defineField({
        name: 'coverImage',
        title: 'Imagen principal antigua',
        type: 'image',
        group: 'settings',
        options: {
            hotspot: true,
            accept: 'image/webp',
        },
        validation: (rule) => rule.custom((value, context) => validateWebpImageAsset(value, context)),
        hidden: true,
        }),

        defineField({
        name: 'gallery',
        title: 'Galería',
        type: 'array',
        group: 'gallery',
        hidden: ({document}) => document?.layout === 'mosaic',
        validation: (rule) =>
            rule
            .custom((value, context) => {
                if (context.document?.layout === 'mosaic') {
                return true
                }

                if (!value || value.length < 5) {
                return 'Sube al menos 5 imágenes para publicar la galería.'
                }

                return true
            }),
        of: [
            defineArrayMember({
            name: 'galleryImage',
            title: 'Imagen de galería',
            type: 'object',
            fields: [
                defineField({
                name: 'image',
                title: 'Imagen',
                description: 'Sube una imagen .webp de maximo 500 KB.',
                type: 'image',
                options: {
                    hotspot: true,
                    accept: 'image/webp',
                },
                validation: (rule) =>
                    rule.required().custom((value, context) => validateWebpImageAsset(value, context)),
                }),

                defineField({
                name: 'alt',
                title: 'Texto alternativo',
                type: 'string',
                }),

                defineField({
                name: 'size',
                title: 'Tamaño en la galería',
                type: 'string',
                initialValue: 'medium',
                options: {
                    list: [
                    {title: 'Pequeña', value: 'small'},
                    {title: 'Mediana', value: 'medium'},
                    {title: 'Grande', value: 'large'},
                    ],
                },
                }),
            ],
            }),
        ],
        }),

        defineField({
        name: 'galleryBlocks',
        title: 'Bloques de mosaico',
        type: 'array',
        group: 'gallery',
        hidden: ({document}) => document?.layout !== 'mosaic',
        validation: (rule) =>
            rule.custom((value, context) => {
                if (context.document?.layout !== 'mosaic') {
                return true
                }

                if (!value || value.length < 1) {
                return 'Añade al menos un bloque de mosaico.'
                }

                return true
            }),
        of: [
            defineArrayMember({
            name: 'galleryBlock',
            title: 'Bloque de mosaico',
            type: 'object',
            options: {
                collapsible: true,
                collapsed: false,
            },
            preview: {
                select: {
                blockType: 'blockType',
                items: 'items',
                },
                prepare({blockType, items}) {
                const blockLabels: Record<string, string> = {
                    stackedFull: 'Dos horizontales apiladas',
                    threeColumns: 'Tres columnas verticales',
                    dynamicTwoColumns: 'Dos columnas dinámicas',
                    fullWidth: 'Ancho completo',
                    squareTwoColumns: 'Dos columnas cuadradas',
                }

                return {
                    title: blockLabels[blockType] || 'Bloque de mosaico',
                    subtitle: `${items?.length || 0} medios`,
                    media: mosaicBlockPreviewIcons[blockType] || MosaicBlockFallbackPreviewIcon,
                }
                },
            },
            fields: [
                defineField({
                name: 'blockType',
                title: 'Tipo de bloque',
                type: 'string',
                initialValue: 'stackedFull',
                components: {
                    input: MosaicBlockLayoutInput,
                },
                options: {
                    list: [
                    {title: 'Dos horizontales apiladas', value: 'stackedFull'},
                    {title: 'Tres columnas verticales', value: 'threeColumns'},
                    {title: 'Dos columnas dinámicas', value: 'dynamicTwoColumns'},
                    {title: 'Ancho completo', value: 'fullWidth'},
                    {title: 'Dos columnas cuadradas', value: 'squareTwoColumns'},
                    ],
                    layout: 'radio',
                },
                validation: (rule) => rule.required(),
                }),

                defineField({
                name: 'title',
                title: 'Título interno opcional',
                type: 'string',
                }),

                defineField({
                name: 'items',
                title: 'Medios del bloque',
                type: 'array',
                validation: (rule) =>
                    rule.required().custom((value, context) => {
                    const parent = context.parent as {blockType?: string} | undefined

                    if (!value || value.length < 1) {
                        return 'Añade al menos un medio.'
                    }

                    if (parent?.blockType === 'squareTwoColumns' && value.length !== 2) {
                        return 'Este bloque necesita exactamente 2 medios.'
                    }

                    return true
                    }),
                of: [
                    defineArrayMember({
                    name: 'blockMedia',
                    title: 'Medio',
                    type: 'object',
                    options: {
                        collapsible: true,
                        collapsed: false,
                    },
                    fields: [
                        defineField({
                        name: 'mediaType',
                        title: 'Tipo de medio',
                        type: 'string',
                        initialValue: 'image',
                        options: {
                            list: [
                            {title: 'Imagen', value: 'image'},
                            {title: 'Vídeo', value: 'video'},
                            ],
                        },
                        validation: (rule) => rule.required(),
                        }),

                        defineField({
                        name: 'image',
                        title: 'Imagen',
                        description: 'Sube una imagen .webp de maximo 500 KB.',
                        type: 'image',
                        options: {
                            hotspot: true,
                            accept: 'image/webp',
                        },
                        hidden: ({parent}) => parent?.mediaType !== 'image',
                        validation: (rule) =>
                            rule.custom((value, context) => {
                            const parent = context.parent as {mediaType?: string} | undefined

                            if (parent?.mediaType !== 'image' || !value) {
                                return true
                            }

                            return validateWebpImageAsset(value, context)
                            }),
                        }),

                        defineField({
                        name: 'video',
                        title: 'Vídeo',
                        type: 'file',
                        options: {
                            accept: 'video/*',
                        },
                        hidden: ({parent}) => parent?.mediaType !== 'video',
                        }),

                        defineField({
                        name: 'alt',
                        title: 'Texto alternativo',
                        type: 'string',
                        }),

                        defineField({
                        name: 'size',
                        title: 'Tamaño en mosaico dinámico',
                        type: 'string',
                        initialValue: 'normal',
                        options: {
                            list: [
                            {title: 'Normal', value: 'normal'},
                            {title: 'Alta', value: 'tall'},
                            {title: 'Ancha', value: 'wide'},
                            {title: 'Grande', value: 'large'},
                            ],
                        },
                        }),
                    ],
                    }),
                ],
                }),
            ],
            }),
        ],
        }),

        defineField({
        name: 'order',
        title: 'Orden de aparición',
        type: 'number',
        group: 'settings',
        initialValue: 0,
        }),
    ],
})

import {defineArrayMember, defineField, defineType} from 'sanity'

export const projectType = defineType({
    name: 'project',
    title: 'Proyectos',
    type: 'document',

    fields: [
        defineField({
        name: 'title',
        title: 'Título del proyecto',
        type: 'string',
        validation: (rule) => rule.required(),
        }),

        defineField({
        name: 'slug',
        title: 'URL del proyecto',
        type: 'slug',
        options: {
            source: 'title',
        },
        validation: (rule) => rule.required(),
        }),

        defineField({
        name: 'featured',
        title: 'Proyecto destacado',
        type: 'boolean',
        initialValue: false,
        description: 'Activa esta casilla para que el proyecto aparezca en el menú dinámico de About.',
        }),

        defineField({
        name: 'campaign',
        title: 'Campaña',
        type: 'string',
        }),

        defineField({
        name: 'services',
        title: 'Servicios',
        type: 'array',
        of: [defineArrayMember({type: 'string'})],
        }),

        defineField({
        name: 'description',
        title: 'Descripción',
        type: 'text',
        }),

        defineField({
        name: 'layout',
        title: 'Tipo de galería',
        type: 'string',
        initialValue: 'twoColumns',
        options: {
            list: [
            {title: 'Dos columnas', value: 'twoColumns'},
            {title: 'Cuatro columnas', value: 'fourColumns'},
            {title: 'Mosaico', value: 'mosaic'},
            ],
        },
        }),

        defineField({
        name: 'coverMedia',
        title: 'Medio principal',
        type: 'object',
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
            type: 'image',
            options: {
                hotspot: true,
            },
            hidden: ({parent}) => parent?.mediaType !== 'image',
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
        options: {
            hotspot: true,
        },
        hidden: true,
        }),

        defineField({
        name: 'gallery',
        title: 'Galería',
        type: 'array',
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
                type: 'image',
                options: {
                    hotspot: true,
                },
                validation: (rule) => rule.required(),
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
                }

                return {
                    title: blockLabels[blockType] || 'Bloque de mosaico',
                    subtitle: `${items?.length || 0} medios`,
                }
                },
            },
            fields: [
                defineField({
                name: 'blockType',
                title: 'Tipo de bloque',
                type: 'string',
                initialValue: 'stackedFull',
                options: {
                    list: [
                    {title: 'Dos horizontales apiladas', value: 'stackedFull'},
                    {title: 'Tres columnas verticales', value: 'threeColumns'},
                    {title: 'Dos columnas dinámicas', value: 'dynamicTwoColumns'},
                    {title: 'Ancho completo', value: 'fullWidth'},
                    ],
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
                validation: (rule) => rule.required().min(1).error('Añade al menos un medio.'),
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
                        type: 'image',
                        options: {
                            hotspot: true,
                        },
                        hidden: ({parent}) => parent?.mediaType !== 'image',
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
        initialValue: 0,
        }),
    ],
})

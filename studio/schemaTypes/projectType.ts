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
        validation: (rule) =>
            rule
            .required()
            .min(5)
            .error('Sube al menos 5 imágenes para publicar la galería.'),
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
        name: 'order',
        title: 'Orden de aparición',
        type: 'number',
        initialValue: 0,
        }),
    ],
})

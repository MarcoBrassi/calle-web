import {defineArrayMember, defineField, defineType} from 'sanity'

export const homeType = defineType({
    name: 'homeSettings',
    title: 'Home',
    type: 'document',
    fields: [
        defineField({
        name: 'title',
        title: 'Título',
        type: 'string',
        initialValue: 'Home',
        readOnly: true,
        }),

        defineField({
        name: 'heroSlides',
        title: 'Slides de la home',
        description: 'Añade entre 1 y 6 slides. Puedes elegir una imagen a pantalla completa o dos imágenes mitad y mitad.',
        type: 'array',
        validation: (rule) =>
            rule
            .required()
            .min(1)
            .max(6)
            .error('Añade entre 1 y 6 slides.'),
        of: [
            defineArrayMember({
            name: 'heroSlide',
            title: 'Slide',
            type: 'object',
            options: {
                collapsible: true,
                collapsed: false,
            },
            preview: {
                select: {
                layout: 'layout',
                media: 'image',
                },
                prepare({layout, media}) {
                return {
                    title: layout === 'split' ? 'Dos imágenes' : 'Imagen completa',
                    subtitle: layout === 'split' ? 'Grid mitad y mitad' : 'Pantalla completa',
                    media,
                }
                },
            },
            fields: [
                defineField({
                name: 'layout',
                title: 'Tipo de slide',
                type: 'string',
                initialValue: 'full',
                options: {
                    list: [
                    {title: 'Imagen a pantalla completa', value: 'full'},
                    {title: 'Dos imágenes mitad y mitad', value: 'split'},
                    ],
                    layout: 'radio',
                },
                validation: (rule) => rule.required(),
                }),

                defineField({
                name: 'image',
                title: 'Imagen principal',
                type: 'image',
                options: {
                    hotspot: true,
                },
                validation: (rule) => rule.required(),
                }),

                defineField({
                name: 'alt',
                title: 'Texto alternativo de la imagen principal',
                type: 'string',
                }),

                defineField({
                name: 'secondImage',
                title: 'Segunda imagen',
                type: 'image',
                options: {
                    hotspot: true,
                },
                hidden: ({parent}) => parent?.layout !== 'split',
                validation: (rule) =>
                    rule.custom((value, context) => {
                    const parent = context.parent as {layout?: string} | undefined

                    if (parent?.layout === 'split' && !value) {
                        return 'Añade la segunda imagen para el slide de dos columnas.'
                    }

                    return true
                    }),
                }),

                defineField({
                name: 'secondAlt',
                title: 'Texto alternativo de la segunda imagen',
                type: 'string',
                hidden: ({parent}) => parent?.layout !== 'split',
                }),
            ],
            }),
        ],
        }),
    ],
})

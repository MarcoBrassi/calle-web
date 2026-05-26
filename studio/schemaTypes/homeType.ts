import {defineArrayMember, defineField, defineType} from 'sanity'
import {SlideLayoutInput, SlideObjectInput} from '../components/SlideLayoutInput'

const heroSlideMember = defineArrayMember({
    name: 'heroSlide',
    title: 'Slide',
    type: 'object',
    options: {
    collapsible: true,
    collapsed: false,
    },
    components: {
    input: SlideObjectInput,
    },
    preview: {
    select: {
        layout: 'layout',
        media: 'image',
    },
    prepare({layout, media}) {
        return {
        title: layout === 'split' ? 'Slide doble' : 'Slide completo',
        subtitle: layout === 'split' ? 'Dos columnas' : 'Pantalla completa',
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
        components: {
        input: SlideLayoutInput,
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
})

export const homeType = defineType({
    name: 'homeSettings',
    title: 'Grupo de slides',
    type: 'document',
    initialValue: {
    title: 'Nuevo grupo de slides',
    isMain: false,
    },
    preview: {
    select: {
        title: 'title',
        isMain: 'isMain',
        slide0: 'slides.0',
        slide1: 'slides.1',
        slide2: 'slides.2',
        slide3: 'slides.3',
        slide4: 'slides.4',
        slide5: 'slides.5',
        media: 'slides.0.image',
    },
    prepare({title, isMain, slide0, slide1, slide2, slide3, slide4, slide5, media}) {
        const slideCount = [slide0, slide1, slide2, slide3, slide4, slide5].filter(Boolean).length

        return {
        title: `${isMain ? 'Principal - ' : ''}${title || 'Grupo sin nombre'}`,
        subtitle: slideCount === 1 ? '1 slide' : `${slideCount} slides`,
        media,
        }
    },
    },
    fields: [
    defineField({
        name: 'title',
        title: 'Nombre del grupo',
        description: 'Uso interno para diferenciar grupos, por ejemplo: Campaña verano, Home mínima o Test editorial.',
        type: 'string',
        validation: (rule) => rule.required(),
    }),

    defineField({
        name: 'isMain',
        title: 'Marcar como principal',
        description: 'La web mostrará el grupo marcado como principal. Si hay varios marcados, se usará el primero encontrado.',
        type: 'boolean',
        initialValue: false,
    }),

    defineField({
        name: 'slides',
        title: 'Slides',
        description: 'Añade entre 1 y 6 slides.',
        type: 'array',
        validation: (rule) =>
        rule
            .required()
            .min(1)
            .max(6)
            .error('Añade entre 1 y 6 slides.'),
        of: [heroSlideMember],
    }),

    defineField({
        name: 'heroSlides',
        title: 'Slides antiguos de la home',
        description: 'Campo antiguo. Se mantiene oculto para no perder datos previos.',
        type: 'array',
        hidden: true,
        of: [heroSlideMember],
    }),

    defineField({
        name: 'slideGroups',
        title: 'Grupos antiguos',
        description: 'Campo antiguo. Se mantiene oculto para no perder datos previos.',
        type: 'array',
        hidden: true,
        of: [
        defineArrayMember({
            name: 'slideGroup',
            title: 'Grupo antiguo',
            type: 'object',
            fields: [
            defineField({
                name: 'title',
                title: 'Nombre del grupo',
                type: 'string',
            }),
            defineField({
                name: 'isMain',
                title: 'Marcar como principal',
                type: 'boolean',
            }),
            defineField({
                name: 'slides',
                title: 'Slides',
                type: 'array',
                of: [heroSlideMember],
            }),
            ],
        }),
        ],
    }),
    ],
})

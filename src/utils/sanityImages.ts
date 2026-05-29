type SanityImageOptions = {
    width?: number
    quality?: number
}

const SANITY_IMAGE_CDN_PATTERN = /^https:\/\/cdn\.sanity\.io\/images\//
const DEFAULT_SRCSET_WIDTHS = [480, 720, 960, 1200, 1500, 1920]

export const sanityImageUrl = (
    src: string | undefined,
    {width = 1600, quality = 76}: SanityImageOptions = {},
) => {
    if (!src || !SANITY_IMAGE_CDN_PATTERN.test(src)) {
        return src
    }

    const url = new URL(src)

    url.searchParams.set('fm', 'webp')
    url.searchParams.set('fit', 'max')
    url.searchParams.set('w', String(width))
    url.searchParams.set('q', String(quality))

    return url.toString()
}

export const sanityImageSrcSet = (
    src: string | undefined,
    {quality = 76}: SanityImageOptions = {},
) => {
    if (!src || !SANITY_IMAGE_CDN_PATTERN.test(src)) {
        return undefined
    }

    return DEFAULT_SRCSET_WIDTHS
        .map((width) => `${sanityImageUrl(src, {width, quality})} ${width}w`)
        .join(', ')
}

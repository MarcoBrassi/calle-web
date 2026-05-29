import type {ValidationContext} from 'sanity'

const IMAGE_MAX_SIZE = 500 * 1024

type ImageValue = {
    asset?: {
        _ref?: string
        _id?: string
    }
}

type ImageAsset = {
    _id: string
    size?: number
    mimeType?: string
    extension?: string
}

const formatKb = (bytes: number) => Math.round(bytes / 1024)

const isImageAssetRef = (value: unknown): value is string =>
    typeof value === 'string' && value.startsWith('image-')

const getImageAssetExtension = (assetId: string) => assetId.split('-').at(-1)

const validateAsset = (asset: ImageAsset, assetId = asset._id) => {
    const extension = asset.extension || getImageAssetExtension(assetId)

    if (asset.mimeType !== 'image/webp' && extension !== 'webp') {
        return 'Todas las imagenes deben subirse en formato .webp.'
    }

    if (!asset.size) {
        return 'No se ha podido comprobar el peso de una imagen. Vuelve a subirla en .webp y maximo 500 KB.'
    }

    if (asset.size > IMAGE_MAX_SIZE) {
        return `Una imagen pesa ${formatKb(asset.size)} KB. El maximo permitido es 500 KB.`
    }

    return true
}

const collectImageAssetIds = (value: unknown, assetIds = new Set<string>()) => {
    if (!value || typeof value !== 'object') {
        return assetIds
    }

    if (Array.isArray(value)) {
        value.forEach((item) => collectImageAssetIds(item, assetIds))
        return assetIds
    }

    const objectValue = value as Record<string, unknown>
    const asset = objectValue.asset as {_ref?: unknown; _id?: unknown} | undefined
    const assetId = asset?._ref || asset?._id

    if (isImageAssetRef(assetId)) {
        assetIds.add(assetId)
    }

    Object.values(objectValue).forEach((item) => collectImageAssetIds(item, assetIds))

    return assetIds
}

export const validateWebpImageAsset = async (
    value: ImageValue | undefined,
    context: ValidationContext,
) => {
    const assetId = value?.asset?._ref || value?.asset?._id

    if (!assetId) {
        return true
    }

    const client = context.getClient({apiVersion: '2026-03-01'}).withConfig({
        perspective: 'previewDrafts',
    })
    const asset = await client.fetch<ImageAsset | null>(
        '*[_id == $assetId][0]{_id, size, mimeType, extension}',
        {assetId},
    )

    if (!asset) {
        return 'No se ha podido comprobar esta imagen. Vuelve a subirla en .webp y maximo 500 KB.'
    }

    return validateAsset(asset, assetId)
}

export const validateAllDocumentImages = async (
    document: unknown,
    context: ValidationContext,
) => {
    const assetIds = Array.from(collectImageAssetIds(document))

    if (assetIds.length === 0) {
        return true
    }

    const client = context.getClient({apiVersion: '2026-03-01'}).withConfig({
        perspective: 'previewDrafts',
    })
    const assets = await client.fetch<ImageAsset[]>(
        '*[_id in $assetIds]{_id, size, mimeType, extension}',
        {assetIds},
    )
    const assetsById = new Map(assets.map((asset) => [asset._id, asset]))

    for (const assetId of assetIds) {
        const asset = assetsById.get(assetId)

        if (!asset) {
            return 'No se ha podido comprobar una imagen. Vuelve a subirla en .webp y maximo 500 KB.'
        }

        const result = validateAsset(asset, assetId)

        if (result !== true) {
            return result
        }
    }

    return true
}

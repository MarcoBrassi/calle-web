import {useEffect, useState} from 'react'
import {PatchEvent, set, type BooleanInputProps, useClient, useFormValue} from 'sanity'

type MainHomeDocument = {
  _id: string
  title?: string
}

function getPublishedId(id: string) {
  return id.replace(/^drafts\./, '')
}

export function MainHomeToggleInput(props: BooleanInputProps) {
  const client = useClient({apiVersion: '2026-03-01'})
  const currentDocumentId = String(useFormValue(['_id']) || '')
  const currentPublishedId = getPublishedId(currentDocumentId)
  const [otherMainDocument, setOtherMainDocument] = useState<MainHomeDocument | null>(null)
  const isSelected = Boolean(props.value)
  const isDisabled = !isSelected && Boolean(otherMainDocument)

  const fetchOtherMainDocument = async () => {
    if (!currentPublishedId) {
      setOtherMainDocument(null)
      return
    }

    const document = await client.fetch<MainHomeDocument | null>(
      `*[
        _type == "homeSettings"
        && isMain == true
        && !(_id in [$draftId, $publishedId])
      ][0]{
        _id,
        title
      }`,
      {
        draftId: `drafts.${currentPublishedId}`,
        publishedId: currentPublishedId,
      },
    )

    setOtherMainDocument(document)
  }

  useEffect(() => {
    fetchOtherMainDocument().catch(console.error)

    const subscription = client.listen('*[_type == "homeSettings"]').subscribe(() => {
      fetchOtherMainDocument().catch(console.error)
    })

    return () => subscription.unsubscribe()
  }, [client, currentPublishedId])

  const handleClick = () => {
    if (isDisabled) return

    props.onChange(PatchEvent.from(set(!isSelected)))
  }

  return (
    <div style={{display: 'grid', gap: '0.65rem'}}>
      <button
        type="button"
        aria-pressed={isSelected}
        disabled={isDisabled}
        onClick={handleClick}
        style={{
          alignItems: 'center',
          background: 'transparent',
          border: 0,
          borderRadius: 0,
          color: '#111111',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          display: 'flex',
          font: 'inherit',
          gap: '0.75rem',
          justifyContent: 'flex-start',
          minHeight: '1.75rem',
          opacity: isDisabled ? 0.55 : 1,
          padding: 0,
          textAlign: 'left',
          width: 'fit-content',
        }}
      >
        <span
          aria-hidden="true"
          style={{
            alignItems: 'center',
            background: isSelected ? '#111111' : '#d4d0c7',
            borderRadius: '999px',
            display: 'flex',
            flexShrink: 0,
            height: '1.25rem',
            justifyContent: isSelected ? 'flex-end' : 'flex-start',
            padding: '0.15rem',
            width: '2.25rem',
          }}
        >
          <span
            style={{
              background: '#fbfaf7',
              borderRadius: '999px',
              display: 'block',
              height: '0.95rem',
              width: '0.95rem',
            }}
          />
        </span>
        <span>{isSelected ? 'Grupo principal activo' : 'Marcar como principal'}</span>
      </button>

      {isDisabled ? (
        <p style={{color: '#a2352f', fontSize: '0.85rem', lineHeight: 1.35, margin: 0}}>
          Ya existe un grupo principal:
          {' '}
          <strong>{otherMainDocument?.title || 'grupo sin nombre'}</strong>.
          Desmarca ese grupo antes de marcar este.
        </p>
      ) : (
        <p style={{color: '#7b756c', fontSize: '0.85rem', lineHeight: 1.35, margin: 0}}>
          Solo puede haber un grupo principal publicado para la home.
        </p>
      )}
    </div>
  )
}

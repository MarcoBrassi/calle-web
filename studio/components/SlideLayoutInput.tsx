import {PatchEvent, set, type StringInputProps} from 'sanity'

const layoutOptions = [
  {
    value: 'full',
    title: 'Completa',
    description: 'Una imagen a pantalla completa',
    icon: (
      <svg viewBox="0 0 48 32" aria-hidden="true">
        <rect x="2" y="2" width="44" height="28" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="6" y="6" width="36" height="20" fill="currentColor" opacity="0.12" />
      </svg>
    ),
  },
  {
    value: 'split',
    title: 'Doble',
    description: 'Dos imagenes en dos columnas',
    icon: (
      <svg viewBox="0 0 48 32" aria-hidden="true">
        <rect x="2" y="2" width="44" height="28" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="6" y="6" width="16" height="20" fill="currentColor" opacity="0.12" />
        <rect x="26" y="6" width="16" height="20" fill="currentColor" opacity="0.12" />
      </svg>
    ),
  },
]

export function SlideLayoutInput(props: StringInputProps) {
  const currentValue = props.value || 'full'

  return (
    <div style={{display: 'grid', gap: '0.65rem', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))'}}>
      {layoutOptions.map((option) => {
        const isSelected = currentValue === option.value

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => props.onChange(PatchEvent.from(set(option.value)))}
            style={{
              alignItems: 'stretch',
              background: isSelected ? '#111111' : '#fbfaf7',
              border: `1px solid ${isSelected ? '#111111' : '#d4d0c7'}`,
              borderRadius: 0,
              color: isSelected ? '#fbfaf7' : '#111111',
              cursor: 'pointer',
              display: 'grid',
              gap: '0.55rem',
              minHeight: '8.5rem',
              padding: '1rem',
              textAlign: 'left',
            }}
          >
            <span style={{display: 'block', width: '4.75rem'}}>{option.icon}</span>
            <span style={{display: 'grid', gap: '0.25rem'}}>
              <strong style={{fontSize: '0.95rem', lineHeight: 1.1}}>{option.title}</strong>
              <span style={{fontSize: '0.78rem', lineHeight: 1.35, opacity: 0.72}}>
                {option.description}
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}

export function SlideObjectInput(props: any) {
  const closeEditor = () => {
    const closeButton = document.querySelector<HTMLButtonElement>(
      '[aria-label="Close dialog"], [aria-label="Close"], [aria-label="Cerrar"]',
    )

    if (closeButton) {
      closeButton.click()
      return
    }

    window.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape', code: 'Escape', bubbles: true}))
  }

  return (
    <div style={{display: 'grid', gap: '0.85rem'}}>
      {props.renderDefault(props)}

      <button
        type="button"
        onClick={closeEditor}
        style={{
          background: '#111111',
          border: '1px solid #111111',
          borderRadius: 0,
          color: '#fbfaf7',
          cursor: 'pointer',
          fontSize: '0.9rem',
          fontWeight: 600,
          minHeight: '2.75rem',
          padding: '0.8rem 1rem',
          width: '100%',
        }}
      >
        Aceptar
      </button>
    </div>
  )
}

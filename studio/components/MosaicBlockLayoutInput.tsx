import {PatchEvent, set, type StringInputProps} from 'sanity'

const blockOptions = [
  {
    value: 'stackedFull',
    title: 'Apiladas',
    description: 'Dos filas completas',
    icon: (
      <svg viewBox="0 0 56 36" aria-hidden="true">
        <rect x="2" y="2" width="52" height="32" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <rect x="7" y="7" width="42" height="9" fill="currentColor" opacity="0.13" />
        <rect x="7" y="20" width="42" height="9" fill="currentColor" opacity="0.13" />
      </svg>
    ),
  },
  {
    value: 'threeColumns',
    title: '3 columnas',
    description: 'Verticales',
    icon: (
      <svg viewBox="0 0 56 36" aria-hidden="true">
        <rect x="2" y="2" width="52" height="32" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <rect x="7" y="7" width="11" height="22" fill="currentColor" opacity="0.13" />
        <rect x="22.5" y="7" width="11" height="22" fill="currentColor" opacity="0.13" />
        <rect x="38" y="7" width="11" height="22" fill="currentColor" opacity="0.13" />
      </svg>
    ),
  },
  {
    value: 'dynamicTwoColumns',
    title: 'Dinámico',
    description: 'Alturas mixtas',
    icon: (
      <svg viewBox="0 0 56 36" aria-hidden="true">
        <rect x="2" y="2" width="52" height="32" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <rect x="7" y="7" width="19" height="22" fill="currentColor" opacity="0.16" />
        <rect x="30" y="7" width="19" height="9" fill="currentColor" opacity="0.13" />
        <rect x="30" y="20" width="19" height="9" fill="currentColor" opacity="0.13" />
      </svg>
    ),
  },
  {
    value: 'fullWidth',
    title: 'Completo',
    description: 'Ancho total',
    icon: (
      <svg viewBox="0 0 56 36" aria-hidden="true">
        <rect x="2" y="2" width="52" height="32" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <rect x="7" y="8" width="42" height="20" fill="currentColor" opacity="0.14" />
      </svg>
    ),
  },
  {
    value: 'squareTwoColumns',
    title: '2 cuadrados',
    description: 'Dos columnas 1:1',
    icon: (
      <svg viewBox="0 0 56 36" aria-hidden="true">
        <rect x="2" y="2" width="52" height="32" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <rect x="7" y="8" width="18" height="18" fill="currentColor" opacity="0.13" />
        <rect x="31" y="8" width="18" height="18" fill="currentColor" opacity="0.13" />
      </svg>
    ),
  },
]

export function MosaicBlockLayoutInput(props: StringInputProps) {
  const currentValue = props.value || 'stackedFull'

  return (
    <div style={{display: 'grid', gap: '0.5rem', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))'}}>
      {blockOptions.map((option) => {
        const isSelected = currentValue === option.value

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => props.onChange(PatchEvent.from(set(option.value)))}
            style={{
              background: isSelected ? '#111111' : '#fbfaf7',
              border: `1px solid ${isSelected ? '#111111' : '#d4d0c7'}`,
              borderRadius: 0,
              color: isSelected ? '#fbfaf7' : '#111111',
              cursor: 'pointer',
              display: 'grid',
              gap: '0.4rem',
              minHeight: '7rem',
              padding: '0.65rem',
              textAlign: 'left',
            }}
          >
            <span style={{display: 'block', width: '100%'}}>{option.icon}</span>
            <span style={{display: 'grid', gap: '0.15rem'}}>
              <strong style={{fontSize: '0.78rem', lineHeight: 1.1}}>{option.title}</strong>
              <span style={{fontSize: '0.68rem', lineHeight: 1.25, opacity: 0.68}}>
                {option.description}
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}

import {PatchEvent, set, type StringInputProps} from 'sanity'

const layoutOptions = [
  {
    value: 'twoColumns',
    title: 'Dos columnas',
    description: 'Grid editorial de dos columnas',
    icon: (
      <svg viewBox="0 0 72 48" aria-hidden="true">
        <rect x="2" y="2" width="68" height="44" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="7" y="7" width="27" height="15" fill="currentColor" opacity="0.12" />
        <rect x="38" y="7" width="27" height="15" fill="currentColor" opacity="0.12" />
        <rect x="7" y="26" width="27" height="15" fill="currentColor" opacity="0.12" />
        <rect x="38" y="26" width="27" height="15" fill="currentColor" opacity="0.12" />
      </svg>
    ),
  },
  {
    value: 'fourColumns',
    title: 'Cuatro columnas',
    description: 'Imagen principal y grid de cuatro',
    icon: (
      <svg viewBox="0 0 72 48" aria-hidden="true">
        <rect x="2" y="2" width="68" height="44" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="7" y="7" width="58" height="15" fill="currentColor" opacity="0.16" />
        <rect x="7" y="27" width="11" height="14" fill="currentColor" opacity="0.12" />
        <rect x="22" y="27" width="11" height="14" fill="currentColor" opacity="0.12" />
        <rect x="38" y="27" width="11" height="14" fill="currentColor" opacity="0.12" />
        <rect x="54" y="27" width="11" height="14" fill="currentColor" opacity="0.12" />
      </svg>
    ),
  },
  {
    value: 'mosaic',
    title: 'Mosaico',
    description: 'Bloques combinables y dinamicos',
    icon: (
      <svg viewBox="0 0 72 48" aria-hidden="true">
        <rect x="2" y="2" width="68" height="44" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="7" y="7" width="28" height="15" fill="currentColor" opacity="0.12" />
        <rect x="39" y="7" width="26" height="34" fill="currentColor" opacity="0.16" />
        <rect x="7" y="26" width="12" height="15" fill="currentColor" opacity="0.12" />
        <rect x="23" y="26" width="12" height="15" fill="currentColor" opacity="0.12" />
      </svg>
    ),
  },
]

export function ProjectLayoutInput(props: StringInputProps) {
  const currentValue = props.value || 'twoColumns'

  return (
    <div style={{display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))'}}>
      {layoutOptions.map((option) => {
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
              gap: '0.65rem',
              minHeight: '10rem',
              padding: '1rem',
              textAlign: 'left',
            }}
          >
            <span style={{display: 'block', width: '100%'}}>{option.icon}</span>
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

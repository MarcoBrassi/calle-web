import type {LogoProps} from 'sanity'

export function CalleStudioLogo({title}: LogoProps) {
  return (
    <div
      aria-label={title}
      style={{
        alignItems: 'baseline',
        color: '#111111',
        display: 'flex',
        gap: '0.55rem',
        letterSpacing: 0,
        paddingInline: '0.25rem',
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: '1.45rem',
          fontWeight: 400,
          lineHeight: 1,
        }}
      >
        Calle
      </span>
      <span
        style={{
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: '0.68rem',
          fontWeight: 500,
          letterSpacing: '0.08em',
          lineHeight: 1,
          textTransform: 'uppercase',
        }}
      >
        Studio
      </span>
    </div>
  )
}

export function MosaicCoverNotice() {
  return (
    <div
      style={{
        background: '#fbfaf7',
        border: '1px solid #d4d0c7',
        color: '#111111',
        display: 'grid',
        gap: '0.35rem',
        padding: '1rem',
      }}
    >
      <strong style={{fontSize: '0.95rem', lineHeight: 1.2}}>Imagen principal automática</strong>
      <span style={{fontSize: '0.85rem', lineHeight: 1.45, opacity: 0.72}}>
        En la galeria mosaico no se sube una imagen principal aparte. El primer medio que
        anadas dentro de los bloques de mosaico se usara automaticamente como imagen principal.
      </span>
    </div>
  )
}

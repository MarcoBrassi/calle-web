type IconProps = {
  children: React.ReactNode
}

function PreviewIcon({children}: IconProps) {
  return (
    <div
      style={{
        alignItems: 'center',
        background: '#f1efea',
        color: '#8c8880',
        display: 'flex',
        height: '2.35rem',
        justifyContent: 'center',
        width: '2.35rem',
      }}
    >
      <svg viewBox="0 0 56 36" aria-hidden="true" style={{display: 'block', width: '2rem'}}>
        {children}
      </svg>
    </div>
  )
}

export function StackedFullPreviewIcon() {
  return (
    <PreviewIcon>
      <rect x="5" y="5" width="46" height="11" fill="currentColor" opacity="0.72" />
      <rect x="5" y="20" width="46" height="11" fill="currentColor" opacity="0.72" />
    </PreviewIcon>
  )
}

export function ThreeColumnsPreviewIcon() {
  return (
    <PreviewIcon>
      <rect x="5" y="5" width="13" height="26" fill="currentColor" opacity="0.72" />
      <rect x="21.5" y="5" width="13" height="26" fill="currentColor" opacity="0.72" />
      <rect x="38" y="5" width="13" height="26" fill="currentColor" opacity="0.72" />
    </PreviewIcon>
  )
}

export function DynamicTwoColumnsPreviewIcon() {
  return (
    <PreviewIcon>
      <rect x="5" y="5" width="21" height="26" fill="currentColor" opacity="0.78" />
      <rect x="30" y="5" width="21" height="11" fill="currentColor" opacity="0.58" />
      <rect x="30" y="20" width="21" height="11" fill="currentColor" opacity="0.58" />
    </PreviewIcon>
  )
}

export function FullWidthPreviewIcon() {
  return (
    <PreviewIcon>
      <rect x="5" y="7" width="46" height="22" fill="currentColor" opacity="0.72" />
    </PreviewIcon>
  )
}

export function SquareTwoColumnsPreviewIcon() {
  return (
    <PreviewIcon>
      <rect x="7" y="8" width="18" height="18" fill="currentColor" opacity="0.72" />
      <rect x="31" y="8" width="18" height="18" fill="currentColor" opacity="0.72" />
    </PreviewIcon>
  )
}

export function MosaicBlockFallbackPreviewIcon() {
  return (
    <PreviewIcon>
      <rect x="5" y="5" width="21" height="11" fill="currentColor" opacity="0.58" />
      <rect x="30" y="5" width="21" height="26" fill="currentColor" opacity="0.78" />
      <rect x="5" y="20" width="21" height="11" fill="currentColor" opacity="0.58" />
    </PreviewIcon>
  )
}

export const mosaicBlockPreviewIcons: Record<string, () => React.ReactNode> = {
  dynamicTwoColumns: DynamicTwoColumnsPreviewIcon,
  fullWidth: FullWidthPreviewIcon,
  squareTwoColumns: SquareTwoColumnsPreviewIcon,
  stackedFull: StackedFullPreviewIcon,
  threeColumns: ThreeColumnsPreviewIcon,
}

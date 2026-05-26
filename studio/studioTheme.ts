import {buildLegacyTheme} from 'sanity'

export const calleStudioTheme = buildLegacyTheme({
  '--font-family-base': 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  '--font-family-monospace': '"SFMono-Regular", Consolas, "Liberation Mono", monospace',

  '--black': '#111111',
  '--white': '#fbfaf7',
  '--gray': '#8c8880',
  '--gray-base': '#ebe8e3',

  '--brand-primary': '#111111',
  '--component-bg': '#fbfaf7',
  '--component-text-color': '#111111',
  '--default-button-color': '#111111',
  '--default-button-primary-color': '#111111',
  '--default-button-success-color': '#111111',
  '--default-button-warning-color': '#9a6a20',
  '--default-button-danger-color': '#a2352f',
  '--focus-color': '#111111',

  '--main-navigation-color': '#111111',
  '--main-navigation-color--inverted': '#fbfaf7',
  '--state-info-color': '#111111',
  '--state-success-color': '#1f5f3f',
  '--state-warning-color': '#9a6a20',
  '--state-danger-color': '#a2352f',
})

import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {CalleStudioLogo} from './components/CalleStudioLogo'
import {StudioLayout} from './components/StudioLayout'
import {deskStructure} from './deskStructure'
import {calleStudioTheme} from './studioTheme'

export default defineConfig({
  name: 'default',
  title: 'Calle Web',

  projectId: '84i991bj',
  dataset: 'production',

  theme: calleStudioTheme,

  studio: {
    components: {
      layout: StudioLayout,
      logo: CalleStudioLogo,
    },
  },

  plugins: [structureTool({structure: deskStructure}), visionTool()],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (prev, context) => {
      if (context.schemaType !== 'project') {
        return prev
      }

      return prev.filter((action) => action.action === 'publish')
    },
  },
})

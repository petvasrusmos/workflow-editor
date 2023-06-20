// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'

export default createVuetify({
  defaults: {
    VTextField: {
     variant: 'outlined'
    },
    VComboboxField: {
     variant: 'outlined'
    },
    VSelect: {
     variant: 'outlined'
    }
   }
  // https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
})

import Form from './components/form'
import FormItem from './components/form-item'
import Checkbox from './components/checkbox'
import CheckboxGroup from './components/checkbox-group'
import notification from './components/notification'
import Table from './components/table'
import Tree from './components/tree'
import Input from './components/input'

const components = {
  Form,
  FormItem,
  Checkbox,
  CheckboxGroup,
  Table,
  Tree,
  Input
}

// eslint-disable-next-line no-unused-vars
const install = function (Vue, opts = {}) {
  if (install.installed) return
  // locale.use(opts.locale)
  // locale.i18n(opts.i18n)

  Object.keys(components).forEach(key => {
    Vue.component(key, components[key])
    // Vue.use(components[key])
  })

  Vue.prototype.$notification = notification
}

// auto install
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export {
  Form,
  FormItem,
  Checkbox,
  CheckboxGroup,
  Table,
  Tree,
  Input
}

export default {
  version: process.env.VERSION,
  install
}

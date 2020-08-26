import Alert from './Alert.vue'
import Vue from 'vue'

Alert.newInstance = props => {
  const _props = props || {}

  const Instance = new Vue({
    render (h) {
      return h(Alert, {
        props: _props
      })
    }
  })

  const component = Instance.$mount()
  document.body.appendChild(component.$el)

  const alert = Instance.$children[0]

  return {
    add (noticeProps) {
      alert.add(noticeProps)
    },
    remove (name) {
      alert.remove(name)
    }
  }
}

export default Alert

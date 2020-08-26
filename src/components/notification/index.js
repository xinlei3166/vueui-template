import Notification from './notification.js'

let messageInstance

function getMessageInstance () {
  messageInstance = messageInstance || Notification.newInstance()
  return messageInstance
}

function notice({ duration = 2, content = '' }) {
  let instance = getMessageInstance()

  instance.add({
    content: content,
    duration: duration
  })
}

export default {
  info (options) {
    let _options
    if (typeof options === 'string') {
      _options = { content: options }
    } else {
      _options = options
    }
    return notice(_options)
  }
}

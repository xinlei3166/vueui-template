<template>
  <transition-group name="list" tag="div" class="alert">
    <div class="alert-main" v-for="item in notices" :key="item.name">
      <div class="alert-content">{{ item.content }}</div>
    </div>
  </transition-group>
</template>

<script>
  let seed = 0
  function getUuid() {
    return 'alert_' + (seed++)
  }

  export default {
    name: 'xlAlert',
    data() {
      return {
        notices: []
      }
    },
    methods: {
      add (notice) {
        const name = getUuid()

        let _notice = Object.assign({
          name: name
        }, notice)

        this.notices.push(_notice)

        // 定时移除，单位：秒
        const duration = notice.duration
        setTimeout(() => {
          this.remove(name)
        }, duration * 2000)
      },
      remove (name) {
        const notices = this.notices

        for (let i = 0; i < notices.length; i++) {
          if (notices[i].name === name) {
            this.notices.splice(i, 1)
            break
          }
        }
      }
    }
  }
</script>

<style scoped></style>

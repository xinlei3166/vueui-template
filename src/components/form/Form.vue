<template>
  <form>
    <slot></slot>
  </form>
</template>

<script>
  export default {
    name: 'xlForm',
    props: {
      model: { type: Object, default: () => {} },
      rules: { type: Object, default: () => {} }
    },
    provide () {
      return { FormInstance: this }
    },
    data () {
      return {
        fields: []
      }
    },
    created () {
      this.$on('on-form-item-add', (field) => {
        if (field) this.fields.push(field)
      })
      this.$on('on-form-item-remove', (field) => {
        if (field.prop) this.fields.splice(this.fields.indexOf(field), 1)
      })
    },
    methods: {
      validate (callback) {
        return new Promise(resolve => {
          let valid = true
          let count = 0
          this.fields.forEach(field => {
            field.validate('', errors => {
              if (errors) {
                valid = false
              }
              if (++count === this.fields.length) {
                // 全部完成
                resolve(valid)
                if (typeof callback === 'function') {
                  callback(valid)
                }
              }
            })
          })
        })
      }
    }
  }
</script>

<style scoped>

</style>

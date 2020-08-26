<template>
  <input class="xl-input" type="text" :value="currentValue" @input="handleInput" @blur="handleBlur"/>
</template>
<script>
  import Emitter from '../../mixins/emitter.js'

  export default {
    name: 'xlInput',
    mixins: [Emitter],
    props: {
      value: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        currentValue: this.value
      }
    },
    watch: {
      value (val) {
        alert(val)
        this.currentValue = val
      }
    },
    methods: {
      handleInput (event) {
        const value = event.target.value
        this.currentValue = value
        this.$emit('input', value)
        this.dispatch('xlFormItem', 'on-form-change', value)
      },
      handleBlur () {
        this.dispatch('xlFormItem', 'on-form-blur', this.currentValue)
      }
    }
  }
</script>

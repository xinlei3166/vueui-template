<template>
  <label>
    <span>
      <input v-if="group" type="checkbox" :value="label" v-model="model" :checked="currentValue" :disabled="disabled" @change="onChange">
      <input v-else type="checkbox" :checked="currentValue" :disabled="disabled" @change="onChange">
    </span>
    <slot><span v-if="showSlot">{{ label }}</span></slot>
  </label>
</template>

<script>
  import Emitter from '../../mixins/emitter'
  import { findComponentUpward } from '../../utils/assist'

  export default {
    name: 'xlCheckbox',
    mixins: [Emitter],
    props: {
      disabled: { type: Boolean, default: false },
      label: { type: [String, Number, Boolean] },
      value: { type: [String, Number, Boolean], default: false },
      trueValue: { type: [String, Number, Boolean], default: true },
      falseValue: { type: [String, Number, Boolean], default: false },
      showSlot: { type: Boolean, default: true }
    },
    data () {
      return {
        currentValue: this.value,
        model: [],
        group: false,
        parent: null
      }
    },
    mounted () {
      this.parent = findComponentUpward(this, 'xlCheckboxGroup')

      if (this.parent) {
        this.group = true
      }

      if (this.group) {
        this.parent.updateModel(true)
      } else {
        this.updateModel()
      }
    },
    methods: {
      onChange (event) {
        if (this.disabled) return false
        const checked = event.target.checked
        this.currentValue = checked
        const value = checked ? this.trueValue : this.falseValue
        this.$emit('input', value)
        if (this.group) {
          this.parent.change(this.model)
        } else {
          this.$emit('on-change', value)
          this.dispatch('xlFormItem', 'on-form-change', value)
        }
      },
      updateModel () {
        this.currentValue = this.value === this.trueValue
      }
    },
    watch: {
      value (val) {
        if (val === this.trueValue || val === this.falseValue) {
          this.updateModel()
        } else {
          throw 'Value should be trueValue or falseValue.'
        }
      }
    }
  }
</script>

<style scoped>

</style>

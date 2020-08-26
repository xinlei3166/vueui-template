<template>
  <div>
    <label v-if="label" :class="{ 'xl-form-item-label-required': isRequired }">{{ label }}</label>
    <div>
      <slot></slot>
      <div v-if="validateState === 'error'" class="xl-form-item-message">{{ validateMessage }}</div>
    </div>
  </div>
</template>

<script>
  import AsyncValidator from 'async-validator'
  import Emitter from '../../mixins/emitter'

  export default {
    name: 'xlFormItem',
    mixins: [Emitter],
    props: {
      label: { type: String, default: '' },
      prop: { type: String, default: '' }
    },
    inject: ['FormInstance'],
    data () {
      return {
        isRequired: false,  // 是否为必填
        validateState: '',  // 校验状态
        validateMessage: ''  // 校验不通过时的提示信息
      }
    },
    computed: {
      // 从 Form 的 model 中动态得到当前表单组件的数据
      fieldValue () {
        return this.FormInstance.model[this.prop]
      }
    },
    // 组件渲染时，将实例缓存在 Form 中
    mounted () {
      // 如果没有传入 prop，则无需校验，也就无需缓存
      if (this.prop) {
        this.initialValue = this.fieldValue
        this.dispatch('xlForm', 'on-form-item-add', this)
        this.setRules()
      }
    },
    // 组件销毁前，将实例从 Form 的缓存中移除
    beforeDestroy () {
      this.dispatch('xlForm', 'on-form-item-remove', this)
    },
    methods: {
      setRules () {
        let rules = this.getRules()
        if (rules.length && this.required) {
          return
        } else if (rules.length) {
          rules.every((rule) => {
            this.isRequired = rule.required
          })
        } else if (this.required) {
          this.isRequired = this.required
        }
        this.$off('on-form-blur', this.onFieldBlur)
        this.$off('on-form-change', this.onFieldChange)
        this.$on('on-form-blur', this.onFieldBlur)
        this.$on('on-form-change', this.onFieldChange)
      },
      getRules () {
        let formRules = this.FormInstance.rules
        const selfRules = this.rules

        formRules = formRules ? formRules[this.prop] : []

        return [].concat(selfRules || formRules || [])
      },
      getFilteredRule (trigger) {
        const rules = this.getRules()
        return rules.filter(rule => !rule.trigger || rule.trigger.indexOf(trigger) !== -1)
      },
      validate (trigger, callback = function () {}) {
        let rules = this.getFilteredRule(trigger)
        if (!rules || rules.length === 0) {
          if (!this.required) {
            callback()
            return true
          } else {
            rules = [{ required: true }]
          }
        }

        this.validateState = 'validating'

        // 以下为 async-validator 库的调用方法
        let descriptor = {}
        descriptor[this.prop] = rules

        const validator = new AsyncValidator(descriptor)
        let model = {}

        model[this.prop] = this.fieldValue

        validator.validate(model, { firstFields: true }, errors => {
          this.validateState = !errors ? 'success' : 'error'
          this.validateMessage = errors ? errors[0].message : ''

          callback(this.validateMessage)

          this.FormInstance && this.FormInstance.$emit('on-validate', this.prop, !errors, this.validateMessage || null)
        })
        this.validateDisabled = false
      },
      onFieldBlur () {
        this.validate('blur')
      },
      onFieldChange () {
        if (this.validateDisabled) {
          this.validateDisabled = false
          return
        }
        this.validate('change')
      },
      resetField () {
        this.validateState = ''
        this.validateMessage = ''

        this.form.model[this.prop] = this.initialValue
      }
    }
  }
</script>

<style scoped></style>

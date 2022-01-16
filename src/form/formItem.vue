<template>
  <div>
    <!-- 1.label -->
    <label v-if="label">{{label}}</label>
    <!-- 2.slot -->
    <slot></slot>
    <!-- 3.校验信息 -->
    <p v-if="error">{{error}}</p>
  </div>
</template>
<script>
import Validator from 'async-validator'
  export default {
    inject: ['form'],
    props: {
      label: {
        type: String,
        default: ''
      },
      prop: String
    },
    data() {
      return {
        error: ''
      }
    },
    mounted() {
      this.$on('validata', () => {
        this.validata()
      })
    },
    methods: {
      validata() {
        console.log('validata')
        const rules = this.form.rules[this.prop]
        const value = this.form.model[this.prop]
        // 校验规则
        const validator = new Validator({[this.prop]: rules})
        // 校验值
        return validator.validate({[this.prop]: value}, errors => { // 返回promise
          // 处理校验结果
          if (errors) {
            this.error = errors[0].message // 自己传入的错误提示信息
          } else {
            this.error = ''
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>
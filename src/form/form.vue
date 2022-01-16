<template>
  <div>
    <slot></slot>
  </div>
</template>
<script>
  export default {
    provide() {
      return {
        form: this
      }
    },
    props: {
      model: {
        type: Object,
        required: true
      },
      rules: Object
    },
    methods: {
      validata(cb) {
        // 校验内部所有表单项
        // 获取所有的items item.validata()返回promise结果
        const results = this.$children
          .filter(item => item.prop) // 有prop才校验
          .map(item => item.validata())
        // 统一处理所有的promise
        Promise.all(results)
          .then(() => cb(true))
          .catch(() => cb(false))
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>
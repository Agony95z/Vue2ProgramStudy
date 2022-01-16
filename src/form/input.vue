<template>
  <div>
    <!-- 事件和属性 -->
    <input type="text" :value="value" @input="onInput" v-bind="$attrs">
  </div>
</template>

<script>
  export default {
    inheritAttrs: false, // 属性不作用在子组件的根节点上
    props: {
      value: {
        type: String,
        default: ''
      }
    },
    methods: {
      onInput(e) {
        this.$emit('input', e.target.value)
        this.validata()
      },
      validata() {
        // 通知校验
        this.$parent.$emit('validata')
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>
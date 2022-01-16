<template>
<!-- 当组件的根元素不具备一些DOM事件，但是根元素内部元素具备相对应的DOM事件，那么可以使用$listeners获取父组件传递进来的所有事件函数，再通过v-on="xxxx"绑定到相对应的内部元素上即可。 -->
  <svg :class="svgClass" v-on="$listeners">
    <use :xlink:href="iconName" />
  </svg>
</template>
<script>
export default {
  name: "SvgIcon",
  props: {
    iconClass: {
      type: String,
      required: true,
    },
    className: {
      type: String,
      default: "",
    },
  },
  computed: {
    iconName() {
      return `#icon-${this.iconClass}`;
    },
    svgClass() {
      if (this.className) {
        return "svg-icon " + this.className;
      } else {
        return "svg-icon";
      }
    },
  },
};
</script>
<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
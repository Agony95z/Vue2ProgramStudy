<template>
  <div>
    <Form :model="model" :rules="rules" ref="loginForm">
      <FormItem label="用户名" prop="username">
        <!-- 被解析成FormItem的插槽内容 -->
        <Input v-model="model.username" placeholder="请输入用户名"></Input>
      </FormItem>
      <FormItem>
        <button @click="onLogin">登录</button>
      </FormItem>
    </Form>
    {{ model }}
  </div>
</template>

<script>
import Input from "./input.vue";
import Form from "./form.vue";
import FormItem from "./formItem.vue";
// import Notice from "../dialog/notice.vue";
// import create from "../utils/create.js";
export default {
  components: {
    Input,
    FormItem,
    Form,
    // Notice,
  },
  data() {
    return {
      model: {
        username: "tom",
      },
      rules: {
        username: [{ required: true, message: "用户名为必填项" }],
      },
    };
  },
  methods: {
    onLogin() {
      this.$refs.loginForm.validata((result) => {
        this.$notice({
          title: "社会你海哥喊你来搬砖",
          message: result ? "请求登录!" : "校验失败!",
          duration: 1000,
        })
        /* const notice = create(Notice, {
          title: "社会你海哥喊你来搬砖",
          message: result ? "请求登录!" : "校验失败!",
          duration: 1000,
        });
        notice.show() */
        // if (result) {
        //   console.log("sumbit login");
        // } else {
        //   alert("校验失败");
        // }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
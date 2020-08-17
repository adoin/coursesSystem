<template>
  <el-container v-show="this.$store.state.studentType">
    <el-aside><topbar></topbar></el-aside>
    <el-main>
      <el-form label-width="100px" class="form">
        <el-form-item label="旧密码">
          <el-input
            v-model="inputOldPassword"
            placeholder="请输入旧密码"
            clearable
            class="formInput"
          ></el-input>
        </el-form-item>

        <el-form-item label="新密码">
          <el-input
            v-model="inputNewPassword"
            placeholder="请输入新密码"
            clearable
            class="formInput"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button
            class="formButton"
            @click="resetPassword()"
            icon="el-icon-check"
            type="primary"
            >重置密码</el-button
          >
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
import topbar from "../Topbar.vue";
export default {
  data() {
    return {
      inputOldPassword: "",
      inputNewPassword: ""
    };
  },
  components: {
    topbar
  },
  methods: {
    resetPassword() {
      //获取旧密码
      console.log(1)
      for (let i = 0; i < this.$store.state.students.length - 1; i++) {
        if (
          this.$store.state.students[i].studentId ==
          this.$store.state.currentStudentId
        ) {

          let index = i;
          if (
            this.$store.state.students[i].studentPassword ==
            this.$store.state.currentStudentPassword
          ) {
            this.$store.state.students.splice(i, 1, {
              studentId: this.$store.state.students[i].studentId,
              studentName: this.$store.state.students[i].studentName,
              studentPassword: this.inputNewPassword,
              regCourse: this.$store.state.students[i].regCourse,
              regId: this.$store.state.students[i].regId
            });
            alert('修改成功')
          } else {
            alert('旧密码错误');
          }
        }
      }
    }
  }
};
</script>

<style scoped>

.form {
  margin-top: 50px;
}
.formInput {
  float: left;
  width: 350px;
}
.formButton {
  float: left;
}
</style>

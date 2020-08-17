<template>
  <div>
    <div v-show="!this.$store.state.loginStatus">
      <el-form label-width="100px" class="form">
        <el-form-item label="账号">
          <el-input
            v-model="inputId"
            placeholder="请输入账号"
            clearable
            class="formInput"
          ></el-input>
        </el-form-item>

        <el-form-item label="密码">
          <el-input
            v-model="inputPassword"
            placeholder="请输入密码"
            clearable
            class="formInput"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button
            class="formButton"
            @click="login()"
            icon="el-icon-check"
            type="primary"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div>tips: 账号admin, 密码任意</div>
    <div class="user" v-show="this.$store.state.loginStatus">
      <div class="header" v-show="this.$store.state.adminType">
        课程信息系统(管理员)
      </div>
      <div class="header" v-show="this.$store.state.studentType">
        课程信息系统(学生)
      </div>
      <el-button @click="logOut">注销当前用户</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputId: "",
      inputPassword: "",
      accountFound: false
    };
  },
  methods: {
    login() {
      if (this.inputId == "admin") {
        this.$store.state.loginStatus = true;
        this.$store.state.adminType = true;
        alert("登录成功");
        this.$router.push("/courses");
      } else {
        for (let item of this.$store.state.students) {
          if (
            item.studentId == this.inputId &&
            item.studentPassword == this.inputPassword
          ) {
            this.$store.state.loginStatus = true;
            this.$store.state.studentType = true;
            this.accountFound = true;
            [
              this.$store.state.currentStudentId,
              this.$store.state.currentStudentName,
              this.$store.state.currentStudentPassword,
              this.$store.state.currentRegId,
              this.$store.state.currentRegCourse
            ] = [
              item.studentId,
              item.studentName,
              item.studentPassword,
              item.regId,
              item.regCourse
            ];
            alert("登录成功");
            console.log(this.$store.state.studentName)
            this.$router.push("/enrollments");
          }

          if (
            item.studentId == this.inputId &&
            item.studentPassword != this.inputPassword
          ) {
            this.accountFound = true;
            alert("密码错误");
          }
        }
        if (this.accountFound == false) {
          alert("账号不存在");
        }
      }
    },
    logOut() {
      this.$store.state.loginStatus = false;
      this.$store.state.adminType = true
        ? (this.$store.state.adminType = false)
        : (this.$store.state.studentType = false);
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

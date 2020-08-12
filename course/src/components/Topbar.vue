<template>
  <div>
    <el-menu
      :default-active="$route.path"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#66ccff"
      text-color="#fff"
      active-text-color="#ffd04b"
      router
    >
      <el-menu-item index="/courses">
        <el-badge value="管理员" class="item" type="warning" width="200px"
          >课程管理</el-badge
        >
      </el-menu-item>

      <el-menu-item index="/students">
        <el-badge value="管理员" class="item" type="warning">学生管理</el-badge>
      </el-menu-item>

      <el-menu-item index="/enrollments">
        <el-badge value="学生" class="item">我要选课</el-badge>
      </el-menu-item>
    </el-menu>

<!-- 未启用的侧栏
    <el-row class="tac">
      <el-col :span="12">
        <el-menu default-active="2" class="el-menu-vertical-demo" router>
          <el-menu-item index="/courses">
            <i class="el-icon-menu"></i>
            <span slot="title">课程管理</span>
          </el-menu-item>
          <el-menu-item index="/students">
            <i class="el-icon-document"></i>
            <span slot="title">学生管理</span>
          </el-menu-item>
          <el-menu-item index="/enrollments">
            <i class="el-icon-setting"></i>
            <span slot="title">我要选课</span>
          </el-menu-item>
        </el-menu>
      </el-col>
    </el-row>
-->
  </div>
</template>

<script>
export default {
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>

<style scoped>
.header {
  padding: 0;
  margin: 0px;
}
.el-aside {
  text-align: center;
  line-height: 200px;
}
</style>

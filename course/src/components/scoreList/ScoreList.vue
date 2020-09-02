<template>
  <el-container v-show="this.$store.state.studentType">
    <el-aside><topbar></topbar></el-aside>
    <el-main>


      

    </el-main>
  </el-container>

</template>

<script>
import topbar from "../Topbar.vue";

export default {
  data() {
    return {

    };
  },

  
  components: {
    topbar
  }
};
</script>

<style scoped></style>

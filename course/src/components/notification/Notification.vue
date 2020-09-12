<template>
  <el-container v-show="this.$store.state.adminType">
    <el-aside><topbar></topbar></el-aside>
    <el-main>

      <el-row>
            <span style="float:left; background:#909399; width:498px; 
            height:50px; font-size:28px; color:white; text-align:left; text-indent:1em; margin-bottom:0px;">通知预览</span>
        </el-row>

        <vxe-list height="250" class="my-list" :data="notificationList">
            <template v-slot="{ items }" >
              <div class="my-list-item" v-for="(item, index) in items" :key="index" style="border-style:solid; border-width: 1px; width:496px; height:40px">
                  <vxe-button style="width:496px; height:40px; text-align:left; text-indent:1em; font-size:26px;">{{ item.label }}</vxe-button>
                  </div>
            </template>
        </vxe-list>


      <el-row>
        <vxe-form :data="notificationForm" @submit="setNotificationList">
            <vxe-form-item title="位置" field="index">
                <template v-slot>
                    <vxe-input v-model="notificationForm.index" placeholder="请输入位置" clearable></vxe-input>
                </template>
            </vxe-form-item>

            <vxe-form-item title="通知信息" field="label">
                <template v-slot>
                    <vxe-input v-model="notificationForm.label" placeholder="请输入通知信息"></vxe-input>
                </template>
            </vxe-form-item>

            <vxe-form-item>
                <template v-slot>
                    <vxe-button type="submit" status="primary">提交</vxe-button>
                </template>
            </vxe-form-item>
        </vxe-form>
      </el-row>

      

    </el-main>
  </el-container>

</template>

<script>
import topbar from "../Topbar.vue";
import { mapState } from "vuex";

export default {
  data() {
    return {

    };
  },

  methods:{
    setNotificationList(){
        this.notificationList.splice(parseInt(this.notificationForm.index)-1,1,{label:this.notificationForm.label})
        console.log(parseInt(this.notificationForm.index)-1)
    },
  },
  
  computed:{
    ...mapState(["notificationList"]),
    ...mapState(["notificationForm"]),
  },
  components: {
    topbar
  }

};
</script>

<style scoped></style>

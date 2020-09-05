<template>
  <el-container v-show="this.$store.state.studentType">
    <el-aside><topbar></topbar></el-aside>
    <el-main>


<el-row>

    <el-col class="box">

        <el-row>
            <span style="float:left; background:linear-gradient(to bottom , white, grey); width:498px; 
            height:50px; font-size:30px; text-align:left; text-indent:1em; margin-bottom:10px;">学业信息</span>
        </el-row>

        <el-row>

            <vxe-button style="width:150px; height:80px; text-align:left; margin-left:10px; margin-bottom:10px; margin-right:0px;"> 
            <i class="el-icon-notebook-2">&nbsp;&nbsp;99</i>
            <p>已修读的课程门数</p>
            </vxe-button>

            <vxe-button style="width:150px; height:80px; text-align:left; margin-left:10px;"> 
            <i class="el-icon-circle-close">&nbsp;&nbsp;99</i>
            <p>尚不及格课程门数</p>
            </vxe-button>

            <vxe-button style="width:150px; height:80px; text-align:left; margin-left:10px;"> 
            <i class="el-icon-document">&nbsp;&nbsp;99</i>
            <p>我的绩点成绩</p>
            </vxe-button>

        </el-row>
    
        <el-row>
            <vxe-button style="width:315px; height:80px; text-align:left; float:left; margin-left:15px;"> 
            <i class="el-icon-suitcase">{{1}}</i>
            <p>我的所属学院</p>
            </vxe-button>
        </el-row>

    </el-col>


    <el-col class="box2" :offset="1">

        <el-row>
            <span style="float:left; background:linear-gradient(to bottom , white, grey); width:498px; 
            height:50px; font-size:30px; text-align:left; text-indent:1em; margin-bottom:0px;">通知</span>
        </el-row>

        <vxe-list height="250" class="my-list" :data="notificationList">
            <template v-slot="{ items }" >
              <div class="my-list-item" v-for="(item, index) in items" :key="index" style="border-style:solid; border-width: 1px; width:496px; height:40px">
                  <vxe-button style="width:496px; height:40px; text-align:left; text-indent:1em; font-size:26px;">{{ item.label }}</vxe-button>
                  
                  
                  </div>
            </template>
        </vxe-list>

    </el-col>

</el-row>


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

export default {
  data() {
    return {
        notificationList:[{label:''},{label:''},{label:''},{label:''},{label:''}],
        notificationForm:{
            index:0,
            label:''
        }
    };
  },

  methods:{
      setNotificationList(){
        this.notificationList.splice(parseInt(this.notificationForm.index)-1,1,{label:this.notificationForm.label})
        console.log(parseInt(this.notificationForm.index)-1)
      }
  },
  created(){

  },
  components: {
    topbar
  }
};
</script>

<style scoped>

.box{
    border: 1px solid;
    border-color: grey;
    height:300px;
    width:500px;
    float: left;

}

.box2{
    border: 1px solid;
    border-color: grey;
    height:262px;
    width:500px;
    float: left;

}

</style>

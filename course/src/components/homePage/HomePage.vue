<template>
  <el-container v-show="this.$store.state.studentType">
    <el-aside><topbar></topbar></el-aside>
    <el-main>


<el-row>

    <el-col class="box">

        <el-row>
            <span style="float:left; background: #909399; width:498px; 
            height:50px; font-size:28px; color:white; text-align:left; text-indent:1em; margin-bottom:10px; 
            ">学业信息</span>
        </el-row>

        <el-row>

            <vxe-button @click="navigateTo('selected')" style="width:150px; height:80px; text-align:left; margin-left:10px; margin-bottom:10px; margin-right:0px;"> 
            <i class="el-icon-notebook-2">&nbsp;&nbsp;{{regCount}}</i>
            <p>已修读的课程门数</p>
            </vxe-button>

            <vxe-button @click="navigateTo('selected')" style="width:150px; height:80px; text-align:left; margin-left:10px;"> 
            <i class="el-icon-circle-close">&nbsp;&nbsp;{{failedCount}}</i>
            <p>尚不及格课程门数</p>
            </vxe-button>

            <vxe-button @click="navigateTo('selected')" style="width:150px; height:80px; text-align:left; margin-left:10px;"> 
            <i class="el-icon-document">&nbsp;&nbsp;{{GPA}}</i>
            <p>我的绩点成绩</p>
            </vxe-button>

        </el-row>
    
        <el-row>
            <vxe-button style="width:315px; height:80px; text-align:left; float:left; margin-left:15px;"> 
            <i class="el-icon-suitcase">{{institution}}</i>
            <p>我的所属学院</p>
            </vxe-button>
        </el-row>

    </el-col>


    <el-col class="box2" :offset="1">

        <el-row>
            <span style="float:left; background:#909399; width:498px; 
            height:50px; font-size:28px; color:white; text-align:left; text-indent:1em; margin-bottom:0px;">通知</span>
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
import { mapState } from "vuex"; 

export default {
  data() {
    return {
        institution:'',
        GPA:0,
        regCount:0,
        failedCount:0
    };
  },

  methods:{

    setNotificationList(){
        this.notificationList.splice(parseInt(this.notificationForm.index)-1,1,{label:this.notificationForm.label})
        console.log(parseInt(this.notificationForm.index)-1)
    },

    navigateTo(index){
        this.$router.push('/'+index);
    },

    calcGPA(){
        let currentStudentId= this.$store.state.currentStudentId
        let studentIdList= this.$store.state.resultList.map(item => item.studentId)
        let courseScoreList= this.$store.state.resultList.map(item => item.courseScore)
        let courseResultList= this.$store.state.resultList.map(item => item.courseResult)
        let trueIndex=[]
        studentIdList.filter(function(element,index){
            if (element=currentStudentId){
                trueIndex.push(index)
            }
        })
        
        

        let scoreSum =0
        let resultSum=0
        for(let i=0;i<=trueIndex.length-1;i++){
            resultSum += this.toPoint(courseResultList[trueIndex[i]]) * courseScoreList[trueIndex[i]]
            scoreSum += courseScoreList[trueIndex[i]]
            //console.log(i, resultSum, scoreSum)
            //console.log(this.$store.state.resultList)
        }
        //console.log(resultSum,scoreSum)
        this.GPA = (resultSum/scoreSum).toFixed(2)

    },

    findInstitution(){
        const studentIdList= this.$store.state.students.map(item => item.studentId)
        let index = studentIdList.indexOf(this.$store.state.currentStudentId)
        this.institution= this.$store.state.students[index].regInstitution
    },

    findRegCount(){
        const studentIdList = this.$store.state.students.map(item => item.studentId)
        let index = studentIdList.indexOf(this.$store.state.currentStudentId)

        this.regCount = this.$store.state.students[index].regId.length
    },

    findFailedCount(){
        this.failedCount =0
        let count =0
        let resultList = this.$store.state.resultList
        const studentIdList = this.$store.state.students.map(item => item.studentId)
        let index = studentIdList.indexOf(this.$store.state.currentStudentId)

        let studentId = this.$store.state.currentStudentId
        let regIdArray = this.$store.state.students[0].regId

        let primaryKeyList = regIdArray.map(item => `${studentId}`+item)
        
        
        primaryKeyList.forEach(function(element){
            for(let item of resultList){
                console.log(item.courseResult)
                if(item.primaryKey==element && item.courseResult!= '' && item.courseResult<60 ){
                    count ++ 
                }
            }
        })
        this.failedCount = count
    },
      
    toPoint(score) {
      let point = 0;
      if (score >= 90) point = 4;
      else if (score >= 85 && score < 90) point = 3.7;
      else if (score >= 82 && score < 85) point = 3.3;
      else if (score >= 78 && score < 82) point = 3.0;
      else if (score >= 75 && score < 78) point = 2.7;
      else if (score >= 72 && score < 75) point = 2.3;
      else if (score >= 68 && score < 72) point = 2.0;
      else if (score >= 64 && score < 68) point = 1.5;
      else if (score > 60 && score < 64) point = 1.3;
      else if (score == 60) point = 1.0;
      else if (score < 60) point = 0;
      return point;
    },

  },
  created(){
      this.findInstitution()
      this.calcGPA()
      this.findRegCount()
      this.findFailedCount()
  },

  computed:{
      ...mapState(["notificationList"]),
      ...mapState(["notificationForm"])
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

<template>
  <div v-show="this.$store.state.studentType">
    <el-container>
      <el-aside><topbar></topbar></el-aside>
      <el-main>

        <div>
          欢迎回来,学号:{{ this.$store.state.currentStudentId }},{{ this.$store.state.currentStudentName }}同学
        </div>

        <div>
          <vxe-toolbar custom print :refresh="{ query: queryItem }">
            <template v-slot:buttons>
              <vxe-input
                v-model="searchItem"
                type="search"
                placeholder="搜索"
                @input="queryItem()"
              ></vxe-input>
              <vxe-button @click="regCompulsion">注册必修课程</vxe-button>
            </template>
          </vxe-toolbar>

          <vxe-table :data="queryList">
            <vxe-table-column type="seq" width="60"></vxe-table-column>
            <vxe-table-column type="checkbox" width="60"></vxe-table-column>

            <vxe-table-column
              field="courseId"
              title="课程编号"
              sortable
              width="100"
            >
              <template slot-scope="scope">
                <span
                  v-if="checkCourseId() && searchItem != ''"
                  style="color:red"
                  >{{ scope.row.courseId }}</span
                >
                <span v-else>{{ scope.row.courseId }}</span>
              </template>
            </vxe-table-column>

            <vxe-table-column field="courseName" title="课程名称" sortable>
              <template slot-scope="scope">
                <span
                  v-if="checkCourseName() && searchItem != ''"
                  style="color:red"
                  >{{ scope.row.courseName }}</span
                >
                <span v-else>{{ scope.row.courseName }}</span>
              </template>
            </vxe-table-column>

            <vxe-table-column
              field="courseInstitution"
              title="教学学院"
              sortable
            >
              <template slot-scope="scope">
                <span
                  v-if="checkCourseInstitution() && searchItem != ''"
                  style="color:red"
                  >{{ scope.row.courseInstitution }}</span
                >
                <span v-else>{{ scope.row.courseInstitution }}</span>
              </template>
            </vxe-table-column>

            <vxe-table-column field="courseLecturer" title="教学老师" sortable>
              <template slot-scope="scope">
                <span
                  v-if="checkCourseLecturer() && searchItem != ''"
                  style="color:red"
                  >{{ scope.row.courseLecturer }}</span
                >
                <span v-else>{{ scope.row.courseLecturer }}</span>
              </template>
            </vxe-table-column>

            <vxe-table-column field="courseScore" title="课程学分" sortable>
              <template slot-scope="scope">
                <span
                  v-if="checkCourseScore() && searchItem != ''"
                  style="color:red"
                  >{{ scope.row.courseScore }}</span
                >
                <span v-else>{{ scope.row.courseScore }}</span>
              </template>
            </vxe-table-column>

             <vxe-table-column field="courseType" title="课程类型" sortable>
            </vxe-table-column>

            <vxe-table-column title="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="viewDetails(scope.row)">详细信息</el-button>
                <el-button
                  type="text"
                  size="small"
                  v-if="checkReg(scope.row)"
                  @click="register(scope.row)"
                  >注册课程</el-button
                >
                <el-button
                  type="text"
                  size="small"
                  v-else
                  @click="cancel(scope.row)"
                  style="color:red"
                  >取消课程</el-button
                >
              </template>
            </vxe-table-column>
          </vxe-table>

          <vxe-modal v-model="showDetails" title="查看详情" width="600" height="400" :mask="false" :lock-view="false" resize>
          <template v-slot>
            <vxe-table
              border="inner"
              auto-resize
              show-overflow
              highlight-hover-row
              height="auto"
              :show-header="false"
              :sync-resize="showDetails"
              :data="detailData">
              <vxe-table-column field="label" width="40%"></vxe-table-column>
              <vxe-table-column field="value"></vxe-table-column>
            </vxe-table>
          </template>
        </vxe-modal>

        </div>
      </el-main>
    </el-container>
  </div>
</template>



<script>
import { mapState } from "vuex";
import topbar from "../Topbar.vue";
export default {
  data() {
    return {
      inputId: '',
      inputPassword: '',
      loginStatus: false,
      accountFound: false,
      currentStudentId: '',
      showselected:false,
      showDetails:false,
      searchItem: '',
      queryList: [],
      detailData:[]
    };
  },

  created: function() {
    this.queryItem();
  },

  methods: {

    //定位学生,输出索引
    locate(){
      //取得一个学号数组
      let studentIdList= this.students.map(item => item.studentId)
      //定位索引
      let index = studentIdList.indexOf(this.$store.state.currentStudentId)
      return index
    },
    
    showSelected(){
      this.showSelected==true;
    },


    regCompulsion(){
        //取得当前登录学生的专业,已注册课程
        let currentStudentInstitution=''
        let currentStudentRegId=''

        for(let item of this.students){
          if(this.$store.state.currentStudentId==item.studentId){
            console.log(item)
            currentStudentInstitution=item.regInstitution
            currentStudentRegId=item.regId
          }
        }

        //遍历已有课程,查询学生对应专业的所有必修课程
        for(let item of this.courses){
          if(item.courseInstitution==currentStudentInstitution){
            if(item.courseType=='必修'){
              console.log(item.courseName)
              this.register(item.courseId,item.courseName)
            }
          }
        }
        
    },

    queryItem() {
      if (this.searchItem) {
        this.queryList = [];
        this.courses.filter(item => {
          //查询courseId
          if (item.courseId.indexOf(this.searchItem) != -1) {
            this.queryList.push(item);
          }
          //查询courseName
          if (item.courseName.indexOf(this.searchItem) != -1) {
            this.queryList.push(item);
          }
          //查询courseInstitution
          if (item.courseInstitution.indexOf(this.searchItem) != -1) {
            this.queryList.push(item);
          }
          //查询courseLecturer
          if (item.courseLecturer.indexOf(this.searchItem) != -1) {
            this.queryList.push(item);
          }
          if(item.courseScore.toFixed(0).indexOf(this.searchItem)!=-1){
            this.queryList.push(item);
          }
        });
      } else if (this.searchItem == "") {
        this.queryList = this.courses;
      }
    },
    checkCourseId() {
      for (let item of this.queryList) {
        if (item.courseId.indexOf(this.searchItem) != -1) {
          return true;
        } else {
          return false;
        }
      }
    },
    checkCourseName() {
      for (let item of this.queryList) {
        if (item.courseName.indexOf(this.searchItem) != -1) {
          return true;
        } else {
          return false;
        }
      }
    },
    checkCourseInstitution() {
      for (let item of this.queryList) {
        if (item.courseInstitution.indexOf(this.searchItem) != -1) {
          return true;
        } else {
          return false;
        }
      }
    },
    checkCourseLecturer() {
      for (let item of this.queryList) {
        if (item.courseLecturer.indexOf(this.searchItem) != -1) {
          return true;
        } else {
          return false;
        }
      }
    },
    checkCourseScore() {
      return true
    },

    //检查某课程是否已被该学生注册
    checkReg(row) {
      //获得当前学生的索引
      let index = this.locate()
      //检索已注册课程数组中是否存在该courseId
      if(this.students[index].regId.indexOf(row.courseId) == -1){
        //console.log(`${row.courseId}未被注册`)
        return true
      }else{
        //console.log(`${row.courseId}被注册`)
        return false
      }
    },

    viewDetails (row) {
      this.detailData = [{pk:'courseId',name:'课程编号'},
      {pk:'courseName',name:'课程名称'},
      {pk:'courseInstitution',name:'教学学院'},
      {pk:'courseLecturer',name:'教学老师'},
      {pk:'courseType',name:'课程类型'},
      {pk:'courseScore',name:'课程学分'},
      {pk:'courseSize',name:'已注册人数'},
      {pk:'courseVolume',name:'课程容量'},
      {pk:'courseArea',name:'教学地点'},
      {pk:'courseTime',name:'教学时间'}].map(field => {
        return {label:field.name ,value:row[field.pk]}
        })
      this.showDetails =true
      },


    register(row){
      //获得当前学生的索引
      let index = this.locate()

      //写入数据到students中的regId和regCourse中
      this.students[index].regId.push(row.courseId)
      this.students[index].regCourse.push(row.courseName)
      //console.log(this.students[index])

      //增加一个resultList元素
      this.resultList.push({
        primaryKey:this.students[index].studentId + row.courseId,
        studentId: this.students[index].studentId,
        studentName: this.students[index].studentName,
        courseId: row.courseId,
        courseName: row.courseName,
        courseScore: row.courseScore,
        courseResult:''
        })
      console.log(this.resultList)

      //本门课程的注册人数增加1
      this.courses[this.courses.indexOf(row)].courseSize ++
    },

    cancel(row) {
      //获得当前学生的索引
      let index = this.locate()

      //查询该课程是否已经锁定
      if(this.students[index].lockedId.indexOf(row.courseId.toString())!=-1){
        alert('课程已锁定,无法取消')
      }else{//执行删除操作
        //删除regId数组中对应的courseId
        let index_regId = this.students[index].regId.indexOf(row.courseId)
        this.students[index].regId.splice(index_regId,1)
        //删除regCourse数组中对应的courseName
        let index_regName = this.students[index].regCourse.indexOf(row.courseName)
        this.students[index].regCourse.splice(index_regName,1)

        //删除对应的resultList元素
        let primaryKeyList = this.resultList.map(item => item.primaryKey)
        let primaryKey= this.students[index].studentId + row.courseId
        let index_primaryKey= primaryKeyList.indexOf(primaryKey)
        this.resultList.splice(index_primaryKey,1)

        //本门课程的注册人数减少1
        this.courses[this.courses.indexOf(row)].courseSize --
      }
    }
  },
  computed: {
    ...mapState(["students"]),
    ...mapState(["courses"]),
    ...mapState(["resultList"]),
  },
  components: {
    topbar
  }
};
</script>

<style scoped>
.column {
  color: aqua;
}

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
.toolBarButton {
  float: left;
  margin-top: 50px;
  margin-bottom: 20px;
}
.bottom {
  margin-top: 300px;
}
</style>

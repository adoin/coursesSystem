<template>
  <el-container v-show="this.$store.state.studentType">
    <el-aside><topbar></topbar></el-aside>
    <el-main>

          <vxe-toolbar custom print :refresh="{ query: selectedItem }">
          </vxe-toolbar>


      <vxe-table :data="selectedList">
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
              >{{ scope.row.courseId }}</span
            >
          </template>
        </vxe-table-column>

        <vxe-table-column field="courseName" title="课程名称" sortable>
          <template slot-scope="scope">

            <span>{{ scope.row.courseName }}</span>
          </template>
        </vxe-table-column>

        <vxe-table-column field="courseInstitution" title="教学学院" sortable>
          <template slot-scope="scope">

            <span>{{ scope.row.courseInstitution }}</span>
          </template>
        </vxe-table-column>

        <vxe-table-column field="courseLecturer" title="教学老师" sortable>
          <template slot-scope="scope">
            <span>{{ scope.row.courseLecturer }}</span>
          </template>
        </vxe-table-column>

        <vxe-table-column field="courseResult" title="我的成绩" sortable>
          <template slot-scope="scope">
            <span>{{ scope.row.courseResult }}</span>
          </template>
        </vxe-table-column>

        <vxe-table-column title="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small">详细信息</el-button>

                <el-button
                  type="text"
                  size="small"
                  v-if="checkReg(scope.row.courseId)"
                  @click="register(scope.row.courseId, scope.row.courseName)"
                  >注册课程</el-button
                >
                <el-button
                  type="text"
                  size="small"
                  v-else
                  @click="cancel(scope.row.courseId, scope.row.courseName)"
                  style="color:red"
                  >取消课程</el-button
                >

          </template>
        </vxe-table-column>
      </vxe-table>
    </el-main>
  </el-container>

</template>

<script>
import topbar from "../Topbar.vue";

export default {
  data() {
    return {
        selectedList:[],
    };
  },
  created:function(){
      this.selectedItem()
  },
  methods: {
    selectedItem() {
        this.selectedList = [];
        for(let i=0;i<this.$store.state.students.length-1;i++){
            if(this.$store.state.students[i].studentId==this.$store.state.currentStudentId){
                let regIdStr=this.$store.state.students[i].regId 
                let regIdArr=regIdStr.split(' ') //String 转 array

                //遍历这个array
                for(let j=0;j<regIdArr.length-1;j++){

                    //遍历courses
                     for(let k=0;k<this.$store.state.courses.length-1;k++){

                         //找到对应的id
                        if(regIdArr[j]==this.$store.state.courses[k].courseId){

                            //push数据进去
                            this.selectedList.push({
                                courseId:this.$store.state.courses[k].courseId,
                                courseName:this.$store.state.courses[k].courseName,
                                courseInstitution:this.$store.state.courses[k].courseInstitution,
                                courseLecturer:this.$store.state.courses[k].courseLecturer,
                            })
                        }
                    }
                }
            }
        }
    },

    checkReg(id) {
      //通过遍历定位学生,输出index
      let index = "";
      let studentFound = false;
      for (let i = 0; i < this.$store.state.students.length - 1; i++) {
        if (this.$store.state.students[i].studentId == this.$store.state.currentStudentId) {
          index = i;
          studentFound = true;
        }
      }

      if (studentFound == false) {
        console.log("未找到学生");
        return true;
      }

      if (this.$store.state.students[index].regId.search(id) != -1) {
        //找到有重复的
        return false;
      } else {
        //未找到有重复的
        return true;
      }
    },

    register(id, name) {
      if (this.$store.state.currentStudentId== "") {
        alert("请先登录账号");
      } else {
        for (let i = 0; i < this.$store.state.students.length - 1; i++) {
          if (this.$store.state.students[i].studentId == this.$store.state.currentStudentId) {
            //定位该学生

            let [regId, regCourse] = [id, name];

            if (this.$store.state.students[i].regId != "None") {
              //如果该学生已经注册过任意课程了
              regId = id + " " + this.$store.state.students[i].regId;
              regCourse = name + " " + this.$store.state.students[i].regCourse;
            }

            this.$store.state.students.splice(i, 1, {
              //改变该学生对应的数组内存储的对象
              studentId: this.$store.state.students[i].studentId,
              studentName: this.$store.state.students[i].studentName,
              studentPassword: this.$store.state.students[i].studentPassword,
              regId: regId,
              regCourse: regCourse
            });
            console.log("注册成功");
            break;
          }
        }
      }
    },

    cancel(id, name) {
      for (let i = 0; i < this.$store.state.students.length - 1; i++) {
        if (this.$store.state.students[i].studentId == this.$store.state.currentStudentId) {
          let regId = this.$store.state.students[i].regId.replace(id, ""); //删除regId中对应的courseId
          let regCourse = this.$store.state.students[i].regCourse.replace(name, ""); //删除regCourse中对于的courseName
          console.log(regId);

          this.$store.state.students.splice(i, 1, {
            //改变该学生对应的数组内存储的对象
            studentId: this.$store.state.students[i].studentId,
            studentName: this.$store.state.students[i].studentName,
            studentPassword: this.$store.state.students[i].studentPassword,
            regId: regId,
            regCourse: regCourse
          });

          alert('取消成功')
        }
      }
    }
  },
  components: {
    topbar
  }
};
</script>

<style scoped></style>

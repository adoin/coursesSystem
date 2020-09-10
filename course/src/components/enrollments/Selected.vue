<template>
  <el-container v-show="this.$store.state.studentType">
    <el-aside><topbar></topbar></el-aside>
    <el-main>
      <vxe-toolbar custom print :refresh="{ query: selectedItem }">
      </vxe-toolbar>

      <vxe-table :data="selectedList" show-footer :footer-method="footerMethod">
        <vxe-table-column type="seq" width="60"></vxe-table-column>
        <vxe-table-column type="checkbox" width="60"></vxe-table-column>

        <vxe-table-column
          field="courseId"
          title="课程编号"
          sortable
          width="100"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.courseId }}</span>
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

        <vxe-table-column field="courseScore" title="课程学分" sortable>
          <template slot-scope="scope">
            <span>{{ scope.row.courseScore }}</span>
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
import "xe-utils";
import XEUtils from "xe-utils";

export default {
  data() {
    return {
      selectedList: []
    };
  },
  created: function() {
    this.selectedItem();
  },
  methods: {
    footerMethod({ columns, data }) {
      const means = [];
      const sums = [];
      const others = [];
      console.log({ columns, data });
      columns.forEach((column, columnIndex) => {
        console.log(columnIndex);
        if (columnIndex === 0) {
          means.push("平均");
          sums.push("总修学分");
          others.push("GPA");
        } else {
          let meanCell = null;
          let sumCell = null;
          let otherCell = null;

          let courseScoreSum = 0;
          switch (column.property) {
            case "courseResult":
              for (let i = 0; i <= data.length - 1; i++) {
                otherCell +=
                  data[i].courseScore * this.toPoint(data[i].courseResult);
                console.log(
                  data[i].courseScore,
                  this.toPoint(data[i].courseResult)
                );
                courseScoreSum += parseInt(data[i].courseScore);
                console.log(courseScoreSum);
              }
              otherCell = (otherCell / courseScoreSum).toFixed(2);
              break;
              case "courseScore":
                sumCell = XEUtils.sum(data, column.property)
                break;
          }
          means.push(meanCell);
          sums.push(sumCell);
          others.push(otherCell);
        }
      });
      // 返回一个二维数组的表尾合计
      return [means, sums, others];
    },

    //bug
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
    selectedItem() {
      this.selectedList = [];

      //遍历学生数组
      for (let i = 0; i < this.$store.state.students.length - 1; i++) {
        //用studentId这个主键找对象
        if (this.$store.state.students[i].studentId == this.$store.state.currentStudentId) {
          console.log(this.$store.state.students[i]);
          let regIdStr = this.$store.state.students[i].regId;
          let regIdArr = regIdStr.split(" "); //String 转 array
          let courseResult = "";

          //遍历这个array
          for (let j = 0; j < regIdArr.length - 1; j++) {
            //遍历courses
            for (let k = 0; k < this.$store.state.courses.length - 1; k++) {
              //找到对应的id
              if (regIdArr[j] == this.$store.state.courses[k].courseId) {
                //用resultList里面对象存的名为primaryKey的主键来找对象
                for (let item of this.$store.state.resultList) {
                  if (item.primaryKey == this.$store.state.students[i].studentId + this.$store.state.courses[k].courseId)
                    courseResult = item.courseResult;
                }

                //push数据进去
                this.selectedList.push({
                  courseId: this.$store.state.courses[k].courseId,
                  courseName: this.$store.state.courses[k].courseName,
                  courseInstitution: this.$store.state.courses[k].courseInstitution,
                  courseLecturer: this.$store.state.courses[k].courseLecturer,
                  courseScore: this.$store.state.courses[k].courseScore,
                  courseResult: courseResult
                });
              }
            }
          }
        }
      }

      console.log(this.selectedList);
    },

    checkReg(id) {
      //通过遍历定位学生,输出index
      let index = "";
      let studentFound = false;
      for (let i = 0; i < this.$store.state.students.length - 1; i++) {
        if (
          this.$store.state.students[i].studentId ==
          this.$store.state.currentStudentId
        ) {
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
      if (this.$store.state.currentStudentId == "") {
        alert("请先登录账号");
      } else {
        for (let i = 0; i < this.$store.state.students.length - 1; i++) {
          if (
            this.$store.state.students[i].studentId ==
            this.$store.state.currentStudentId
          ) {
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
              regInstitution: this.$store.state.students[i].regInstitution,
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
        if (
          this.$store.state.students[i].studentId ==
          this.$store.state.currentStudentId
        ) {
          let regId = this.$store.state.students[i].regId.replace(id, ""); //删除regId中对应的courseId
          let regCourse = this.$store.state.students[i].regCourse.replace(
            name,
            ""
          ); //删除regCourse中对于的courseName
          console.log(regId);

          this.$store.state.students.splice(i, 1, {
            //改变该学生对应的数组内存储的对象
            studentId: this.$store.state.students[i].studentId,
            studentName: this.$store.state.students[i].studentName,
            studentPassword: this.$store.state.students[i].studentPassword,
            regInstitution: this.$store.state.students[i].regInstitution,
            regId: regId,
            regCourse: regCourse
          });

          alert("取消成功");
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

<template>
  <div>
    <el-form label-width="100px" class="form" v-show="!loginStatus">
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
          @click="login"
          icon="el-icon-check"
          type="primary"
          >登录</el-button
        >
        <el-button class="formButton" @click="reset()" icon="el-icon-close"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <div v-show="loginStatus">
      欢迎回来,学号:{{ currentStudentId }},{{ currentStudentName }}同学
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

        <vxe-table-column field="courseInstitution" title="教学学院" sortable>
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
            <el-button type="text" size="small" @click="print">打印</el-button>
          </template>
        </vxe-table-column>
      </vxe-table>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      inputId: "",
      inputPassword: "",
      loginStatus: false,
      accountFound: false,
      currentStudentId: "",
      currentStudentName: "",
      currentStudentPassword: "",
      currentStudentIndex: "",
      searchItem: "",
      queryList: []
    };
  },

  created: function() {
    this.queryItem();
    this.reset();
  },

  methods: {
    reset() {
      [
        this.currentStudentId,
        this.currentStudentName,
        this.currentStudentPassword,
        this.currentStudentIndex
      ] = ["", "", "", ""];
    },
    //尝试登录账号
    login() {
      for (let item of this.students) {
        if (
          item.studentId == this.inputId &&
          item.studentPassword == this.inputPassword
        ) {
          this.loginStatus = true;
          this.accountFound = true;
          this.currentStudentId = item.studentId;
          this.currentStudentName = item.studentName;
          this.currentStudentPassword = item.studentPassword;
          alert("登录成功");
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
    //检查某课程是否已被该学生注册
    checkReg(id) {
      for (let i = 0; i < this.students.length - 1; i++) {
        if (this.students[i].studentId == this.currentStudentId) {
          //定位该学生
          if (this.students[i].regId.search(id) != -1) {
            //查询该学生的regId中是否已存在该courseId
            return false; //存在,返回false
          } else {
            return true; //不存在,返回true
          }
        } else {
          return true;
        }
      }
    },
    print() {
      console.log(
        this.currentStudentId,
        this.currentStudentName,
        this.currentStudentPassword
      );
    },
    register(id, name) {
      if (this.currentStudentId == "") {
        alert("请先登录账号");
      } else {
        for (let i = 0; i < this.students.length - 1; i++) {
          if (this.students[i].studentId == this.currentStudentId) {
            //定位该学生

            let [regId, regCourse] = [id, name];

            if (this.students[i].regId != undefined) {
              //如果该学生已经注册过任意课程了
              regId = id + " " + this.students[i].regId;
              regCourse = name + " " + this.students[i].regCourse;
            }

            this.students.splice(i, 1, {
              //改变该学生对应的数组内存储的对象
              studentId: this.students[i].studentId,
              studentName: this.students[i].studentName,
              studentPassword: this.students[i].studentPassword,
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
      for (let i = 0; i < this.students.length - 1; i++) {
        if (this.students[i].studentId == this.currentStudentId) {
          let regId = this.students[i].regId.replace(id, ""); //删除regId中对应的courseId
          let regCourse = this.students[i].regCourse.replace(name, ""); //删除regCourse中对于的courseName
          console.log(regId);

          this.students.splice(i, 1, {
            //改变该学生对应的数组内存储的对象
            studentId: this.students[i].studentId,
            studentName: this.students[i].studentName,
            studentPassword: this.students[i].studentPassword,
            regId: regId,
            regCourse: regCourse
          });
        }
      }
    }
  },
  computed: {
    ...mapState(["globalOptions"]),
    ...mapState(["value"]),
    ...mapState(["students"]),
    ...mapState(["courses"]),
    value: {
      get: function() {
        return this.$store.state.value;
      },
      set: function(val) {
        this.$store.state.value = val;
      }
    }
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

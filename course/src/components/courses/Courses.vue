<template>
  <div v-show="this.$store.state.adminType">
    <el-container>
      <el-aside>
        <topbar></topbar>
      </el-aside>
      <el-main>
        <el-form label-width="100px" class="form" v-show="customReg">
          <el-form-item label="课程编号">
            <el-input
              v-model="id"
              placeholder="请输入课程编号"
              clearable
              class="formInput"
            ></el-input>
          </el-form-item>

          <el-form-item label="课程名称">
            <el-input
              v-model="name"
              placeholder="请输入课程名称"
              clearable
              class="formInput"
            ></el-input>
          </el-form-item>

          <el-form-item label="教学学院">
            <el-input
              v-model="institution"
              placeholder="请输入教学学院"
              clearable
              class="formInput"
            ></el-input>
          </el-form-item>

          <el-form-item label="教学老师">
            <el-input
              v-model="lecturer"
              placeholder="请输入教学老师"
              clearable
              class="formInput"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button
              class="formButton"
              @click="submit"
              icon="el-icon-check"
              type="primary"
              >注册课程</el-button
            >
            <el-button
              class="formButton"
              @click="CustomRegister()"
              icon="el-icon-close"
              >取消</el-button
            >
          </el-form-item>
        </el-form>

        <div v-show="!customReg">
          <el-button
            @click="add"
            class="toolBarButton"
            icon="el-icon-circle-plus"
            >新增空白课程</el-button
          >
          <el-button
            @click="randomCourse(5)"
            class="toolBarButton"
            icon="el-icon-question"
            >新增随机课程</el-button
          >
          <el-button
            @click="CustomRegister()"
            class="toolBarButton"
            icon="el-icon-info"
            >新增自定义课程</el-button
          >
          <el-button
            @click="remove"
            class="toolBarButton"
            icon="el-icon-error"
            type="danger"
            >移除选择课程</el-button
          >

          <el-table
            :data="courses"
            border
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"> </el-table-column>

            <el-table-column prop="courseId" label="课程编号" width="180">
              <template scope="scope">
                <!-- 编辑时显示该input -->
                <el-input
                  size="small"
                  v-model="scope.row.courseId"
                  v-show="editStatus"
                ></el-input>
                <!-- 未编辑时显示该span -->
                <span v-show="!editStatus">{{ scope.row.courseId }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="courseName" label="课程名称">
              <template scope="scope">
                <!-- 编辑时显示该input -->
                <el-input
                  size="small"
                  v-model="scope.row.courseName"
                  v-show="editStatus"
                ></el-input>
                <!-- 未编辑时显示该span -->
                <span v-show="!editStatus">{{ scope.row.courseName }}</span>
              </template>
            </el-table-column>

            <el-table-column
              prop="courseInstitution"
              label="教学学院"
              width="180"
            >
              <template scope="scope">
                <!-- 编辑时显示该input -->
                <el-input
                  size="small"
                  v-model="scope.row.courseInstitution"
                  v-show="editStatus"
                ></el-input>
                <!-- 未编辑时显示该span -->
                <span v-show="!editStatus">{{
                  scope.row.courseInstitution
                }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="courseLecturer" label="教学老师" width="180">
              <template scope="scope">
                <!-- 编辑时显示该input -->
                <el-input
                  size="small"
                  v-model="scope.row.courseLecturer"
                  v-show="editStatus"
                ></el-input>
                <!-- 未编辑时显示该span -->
                <span v-show="!editStatus">{{ scope.row.courseLecturer }}</span>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="180">
              <template scope="scope">
                <!-- 未编辑时显示该button -->
                <!-- 记录原始数据,开启编辑框,一旦输入数据就会立刻改变存储的值-->
                <el-button
                  type="text"
                  size="small"
                  @click="record(scope.$index)"
                  v-show="!editStatus"
                  >编辑信息</el-button
                >

                <!-- 编辑时显示该button -->
                <!-- 关闭编辑框-->
                <el-button
                  type="text"
                  size="small"
                  @click="changeEditStatus()"
                  v-show="editStatus"
                  >确认修改</el-button
                >

                <!-- 编辑时显示该button -->
                <!-- 将数组改变为原来的值,关闭编辑框-->
                <el-button
                  type="text"
                  size="small"
                  @click="undo(scope.$index)"
                  v-show="editStatus"
                  >撤销修改</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="bottom"></div>
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
      id: "",
      name: "",
      institution: "",
      lecturer: "",
      tempCourses: [],
      editStatus: false,
      multipleSelection: [],
      customReg: false
    };
  },
  methods: {
    //注册一个课程对象
    submit() {
      this.courses.push({
        courseId: this.id,
        courseName: this.name,
        courseInstitution: this.institution,
        courseLecturer: this.lecturer
      });
      alert("提交成功");
    },
    //将一个空的课程对象添加到courses数组内
    add() {
      this.courses.push({
        courseId: "",
        courseName: "",
        courseInstitution: "",
        courseLecturer: ""
      });
    },
    //将现有的数组数据存储到当前组件本地的一个临时数组里面
    record(index) {
      let id = this.courses[index].courseId;
      let name = this.courses[index].courseName;
      let institution = this.courses[index].courseInstitution;
      let lecturer = this.courses[index].courseLecturer;
      this.tempCourses.splice(index, 1, {
        courseId: id,
        courseName: name,
        courseInstitution: institution,
        courseLecturer: lecturer
      });
      this.changeEditStatus();
    },
    //调用之前存储的临时数组里面的数据
    undo(index) {
      this.courses[index] = this.tempCourses[index];
      this.changeEditStatus();
    },
    //改变编辑状态
    changeEditStatus() {
      this.editStatus = !this.editStatus;
    },
    CustomRegister() {
      this.customReg = !this.customReg;
    },
    //处理选中
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection);
    },
    //移除被勾选框选中的若干行
    remove() {
      for (let item1 of this.multipleSelection) {
        for (let item2 of this.courses) {
          if (item2 == item1) {
            this.courses.splice(this.courses.indexOf(item2), 1);
          }
        }
      }
    },
    //随机生成size门课程
    randomCourse(size) {
      const levelSeed = ["初级课程", "中级课程", "高级课程", "进阶课程"];
      for (let i = 0; i < size; i++) {
        //生成随机课程
        let randomCourse = this.allCourses[
          Math.round(Math.random() * (this.allCourses.length - 1))
        ];
        let randomLevel =
          levelSeed[Math.round(Math.random() * (levelSeed.length - 1))];
        let randomId = randomCourse.substring(0, 6);
        let randomCourseName = randomCourse.substring(6) + randomLevel;

        //设置对应学院
        let randomInstitution =
          this.allcourseInstitution[
            parseInt(randomCourse.substring(0, 2)) - 1
          ] + "院";

        //生成随机老师
        let randomLecturer = "";
        if (Math.floor(Math.round(Math.random())) == 1) {
          randomLecturer =
            this.familyNameSeed[
              Math.round(Math.random() * (this.familyNameSeed.length - 1))
            ] +
            this.givenNameSeed[
              Math.round(Math.random() * (this.givenNameSeed.length - 1))
            ] +
            this.givenNameSeed[
              Math.round(Math.random() * (this.givenNameSeed.length - 1))
            ];
        } else {
          randomLecturer =
            this.familyNameSeed[
              Math.round(Math.random() * (this.familyNameSeed.length - 1))
            ] +
            this.givenNameSeed[
              Math.round(Math.random() * (this.givenNameSeed.length - 1))
            ];
        }

        //检查重复
        if (this.courses.indexOf(randomId) != -1) {
          i--;
          continue;
        }

        //push数组
        this.courses.push({
          courseId: randomId,
          courseName: randomCourseName,
          courseInstitution: randomInstitution,
          courseLecturer: randomLecturer
        });
      }
    }
  },
  computed: {
    ...mapState(["courses"]),
    ...mapState(["allCourses"]),
    ...mapState(["allcourseInstitution"]),
    ...mapState(["familyNameSeed"]),
    ...mapState(["givenNameSeed"])
  },
  components: {
    topbar
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
.toolBarButton {
  float: left;
  margin-top: 50px;
  margin-bottom: 20px;
}
.bottom {
  margin-top: 300px;
}
</style>

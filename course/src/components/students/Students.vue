<template>
  <div v-show="this.$store.state.adminType">
    <el-container>
      <el-aside>
        <topbar></topbar>
      </el-aside>
      <el-main>
        <el-form label-width="100px" class="form" v-show="customReg">
          <el-form-item label="学生姓名">
            <el-input
              v-model="name"
              placeholder="请输入学生姓名"
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
              >注册</el-button
            >
            <el-button
              class="formButton"
              @click="CustomRegister()"
              icon="el-icon-close"
              >取消</el-button
            >
          </el-form-item>
        </el-form>

        <el-button
          @click="randomInitData(5)"
          class="toolBarButton"
          icon="el-icon-question"
          >新增随机学生</el-button
        >
        <el-button
          @click="CustomRegister()"
          class="toolBarButton"
          icon="el-icon-info"
          >新增自定义学生</el-button
        >

        <el-table :data="students" border style="width: 100%">
          <el-table-column prop="studentId" label="学号" width="180">
          </el-table-column>

          <el-table-column prop="studentName" label="姓名" width="180">
          </el-table-column>

          <el-table-column prop="studentPassword" label="初始密码" width="180">
          </el-table-column>

          <el-table-column prop="regCourse" label="已注册课程">
          </el-table-column>

          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="changePassword(scope.$index)"
                >修改密码</el-button
              >
            </template>
          </el-table-column>
        </el-table>
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
      name: "",
      customReg: false
    };
  },
  methods: {
    //提交注册
    submit() {
      let randomStudentId = this.randomInitStudentId("seed");
      let randomStudentPassword = this.randomInitPassword("seed", 6);
      this.students.push({
        studentId: randomStudentId,
        studentName: this.name,
        studentPassword: randomStudentPassword,
        regCourse: "none",
        regId: "none"
      });
      console.log(this.students);
      if (true) {
        alert(
          "学生:" +
            this.name +
            "\n分配学号:" +
            randomStudentId +
            "\n初始密码:" +
            randomStudentPassword +
            "\n注册成功"
        );
      }
    },
    CustomRegister() {
      this.customReg = !this.customReg;
    },
    //随机生成一个200000~209999的学号,重复检验
    randomInitStudentId(seed) {
      let randomStudentId = 200000 + Math.floor(Math.random(seed) * 9999);
      //如果students数组为空,不进行重复检验
      if (this.students.length != 0) {
        //遍历students数组,检验是否已有重复的id
        for (let item of this.students) {
          if (randomStudentId == item.studentId) {
            randomInitStudentId(1);
          } else {
            return randomStudentId;
          }
        }
      } else {
        return randomStudentId;
      }
    },
    //随机生成一个size大小的密码(A~Z,a~z,1~9)
    randomInitPassword(seed, size) {
      const passwordSeed = [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "m",
        "n",
        "p",
        "Q",
        "r",
        "s",
        "t",
        "u",
        "v",
        "w",
        "x",
        "y",
        "z",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9"
      ];
      let password = "";
      for (let i = 0; i < size; i++) {
        password +=
          passwordSeed[
            Math.round(Math.random(seed) * (passwordSeed.length - 1))
          ];
      }
      console.log(password);
      return password;
    },
    //随机生成一个名字
    randomInitName(seed) {
      const familyNameSeed = [
        "前",
        "湛",
        "夕",
        "南",
        "东",
        "方",
        "戏",
        "曲",
        "言",
        "墨",
        "花",
        "居",
        "多",
        "巧",
        "贸",
        "声",
        "波"
      ];
      const givenNameSeed = [
        "依",
        "白",
        "暄",
        "和",
        "向",
        "雪",
        "俊",
        "美",
        "从",
        "筠",
        "香",
        "薇",
        "线",
        "翰",
        "海",
        "腾",
        "云",
        "霞",
        "蓓",
        "蕾",
        "天",
        "青",
        "正",
        "娴",
        "婉",
        "以",
        "珊",
        "慕",
        "傲",
        "双"
      ];
      let fullname = "";
      if (Math.floor(Math.round(Math.random(seed))) == 1) {
        fullname =
          familyNameSeed[
            Math.round(Math.random(seed) * (familyNameSeed.length - 1))
          ] +
          givenNameSeed[
            Math.round(Math.random(seed) * (givenNameSeed.length - 1))
          ] +
          givenNameSeed[
            Math.round(Math.random(seed) * (givenNameSeed.length - 1))
          ];
      } else {
        fullname =
          familyNameSeed[
            Math.round(Math.random(seed) * (familyNameSeed.length - 1))
          ] +
          givenNameSeed[
            Math.round(Math.random(seed) * (givenNameSeed.length - 1))
          ];
      }
      return fullname;
    },
    //随机生成size组学号,名字,密码
    randomInitData(size) {
      for (let i = 0; i < size; i++) {
        let randomStudentId = this.randomInitStudentId("seed1");
        let randomName = this.randomInitName("seed2");
        let randomStudentPassword = this.randomInitPassword("seed3", 6);
        this.students.push({
          studentId: randomStudentId,
          studentName: randomName,
          studentPassword: randomStudentPassword,
          regCourse: "None",
          regId: "None",
          studentScore:[]
        });
      }
    },
    //弹出消息框,修改密码
    changePassword(index) {
      this.$prompt("请输入新的密码", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          console.log(index);
          let [id, name, regCourse, regId, score] = [
            this.students[index].studentId,
            this.students[index].studentName,
            this.students[index].regCourse,
            this.students[index].regId,
            this.students[index].studentScore
          ];
          this.students.splice(index, 1, {
            studentId: id,
            studentName: name,
            studentPassword: value,
            regCourse: regCourse,
            regId: regId,
            studentScore:score
          });
          this.$message({
            type: "success",
            message: "修改成功,新密码是：" + value
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
    }
  },
  computed: {
    ...mapState(["students"])
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

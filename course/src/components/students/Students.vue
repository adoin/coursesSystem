<template>
  <div v-show="this.$store.state.adminType">
    <el-container>
      <el-aside>
        <topbar></topbar>
      </el-aside>
      <el-main>
        <!--
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
        -->

        <vxe-toolbar>
          <template v-slot:buttons>
            <vxe-button icon="el-icon-plus" @click="randomInitData(5)"
              >新增随机学生</vxe-button
            >
            <vxe-button icon="el-icon-plus" @click="createEvent()"
              >新增自定义学生</vxe-button
            >
            <vxe-button icon="el-icon-delete" @click="remove" status="danger"
              >移除选中学生</vxe-button
            >
          </template>
        </vxe-toolbar>

        <vxe-table
          border
          resizable
          show-overflow
          keep-source
          ref="xTable"
          :loading="loading"
          :data="students"
          :edit-config="{ trigger: 'manual', mode: 'row' }"
        >
          <vxe-table-column type="seq" width="60"></vxe-table-column>
          <vxe-table-column type="checkbox" width="60"></vxe-table-column>

          <vxe-table-column
            field="studentId"
            title="学号"
            :edit-render="{
              name: 'input',
              immediate: true,
              attrs: { type: 'text' }
            }"
            width="130"
            sortable
          ></vxe-table-column>

          <vxe-table-column
            field="studentName"
            title="姓名"
            width="300"
            sortable
            :edit-render="{
              name: 'input',
              immediate: true,
              attrs: { type: 'text' }
            }"
          ></vxe-table-column>

          <vxe-table-column
            field="studentPassword"
            title="登录密码"
            :edit-render="{
              name: 'input',
              immediate: true,
              attrs: { type: 'text' }
            }"
            width="130"
            sortable
          ></vxe-table-column>

          <vxe-table-column
            field="regInstitution"
            title="所属学院"
            :edit-render="{
              name: 'input',
              immediate: true,
              attrs: { type: 'text' }
            }"
            width="130"
            sortable
          ></vxe-table-column>

          <vxe-table-column
            field="regCourse"
            title="已注册课程"
            :edit-render="{
              name: 'input',
              immediate: true,
              attrs: { type: 'text' }
            }"
            width="130"
            sortable
          ></vxe-table-column>

          <vxe-table-column title="操作">
            <template v-slot="{ row }">
              <template v-if="$refs.xTable.isActiveByRow(row)">
                <vxe-button icon="el-icon-check" @click="saveRowEvent(row)"
                  >保存</vxe-button
                >
                <vxe-button icon="el-icon-close" @click="cancelRowEvent(row)"
                  >取消</vxe-button
                >
              </template>
              <template v-else>
                <vxe-button icon="el-icon-edit" @click="editRowEvent(row)"
                  >编辑</vxe-button
                >
              </template>
            </template>
          </vxe-table-column>
        </vxe-table>

        <vxe-modal
          v-model="showCustom"
          :title="'创建自定义学生'"
          width="800"
          resize
          destroy-on-close
        >
          <template v-slot>
            <vxe-form
              :data="formData"
              :items="formItems"
              title-align="right"
              title-width="100"
              @submit="customStudentSubmitEvent"
            ></vxe-form>
          </template>
        </vxe-modal>

        <!--
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
-->
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
      customReg: false,
      loading: false,
      submitLoading: false,
      selectRow: null,
      showCustom: false, //控制modal框的显示

      formData: {
        studentId: null,
        studentName: null,
        studentPassword: null,
        regInstitution: null
      },

      formItems: [
        {
          title: "填入学生信息",
          span: 24,
          titleAlign: "left",
          titleWidth: 200,
          titlePrefix: { icon: "fa fa-address-card-o" }
        },
        {
          field: "studentId",
          title: "学生学号",
          span: 12,
          itemRender: {
            name: "$input",
            props: { placeholder: "请输入学生学号" }
          }
        },
        {
          field: "studentName",
          title: "学生姓名",
          span: 12,
          itemRender: {
            name: "$input",
            props: { placeholder: "请输入学生姓名" }
          }
        },
        {
          field: "studentPassword",
          title: "登录密码",
          span: 12,
          itemRender: {
            name: "$input",
            props: { placeholder: "请输入登录密码" }
          }
        },
        {
          field: "regInstitution",
          title: "所属学院",
          span: 12,
          itemRender: {
            name: "$input",
            props: { placeholder: "请输入所属学院" }
          }
        },
        {
          align: "center",
          span: 24,
          titleAlign: "left",
          itemRender: {
            name: "$buttons",
            children: [
              {
                props: {
                  type: "submit",
                  content: "提交",
                  status: "primary"
                }
              },
              {
                props: {
                  type: "reset",
                  content: "重置"
                }
              }
            ]
          }
        }
      ]
    };
  },

  methods: {
    editRowEvent(row) {
      this.$refs.xTable.setActiveRow(row);
    },

    saveRowEvent(row) {
      this.$refs.xTable.clearActived().then(() => {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.$XModal.message({ message: "保存成功！", status: "success" });
        }, 300);
      });
    },

    cancelRowEvent(row) {
      const xTable = this.$refs.xTable;
      xTable.clearActived().then(() => {
        // 还原行数据
        xTable.revertData(row);
      });
    },

    createEvent() {
      this.formData = {
        studentId: "",
        studentName: "",
        studentPassword: "",
        regInstitution: ""
      };
      this.selectRow = null;
      this.showCustom = true;
    },

    remove() {
      this.$confirm("此操作将永久删除选中的学生信息, 是否继续?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let selectRecords = this.$refs.xTable.getCheckboxRecords();
          for (let item1 of selectRecords) {
            for (let item2 of this.students) {
              if (item2 == item1) {
                this.students.splice(this.students.indexOf(item2), 1);
              }
            }
          }

          this.$message({
            type: "success",
            message: "删除成功"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消删除"
          });
        });
    },

    //modal框 提交自定义学生注册
    customStudentSubmitEvent() {
      console.log(this.formData);
      this.students.push({
        studentId: this.formData.studentId,
        studentName: this.formData.studentName,
        studentPassword: this.formData.studentPassword,
        regInstitution: this.formData.regInstitution
      });
      console.log(this.students);
      this.$XModal.message({ message: "创建成功", status: "success" });
      this.showCustom = false;
    },

    //提交注册
    submit() {
      let randomStudentId = this.randomInitStudentId("seed");
      let randomStudentPassword = this.randomInitPassword("seed", 6);
      this.students.push({
        studentId: randomStudentId,
        studentName: this.name,
        studentPassword: randomStudentPassword,
        regCourse: "",
        regId: ""
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
          regCourse: "",
          regId: "",
          regInstitution:
            this.$store.state.allcourseInstitution[
              Math.round(Math.random() * 12)
            ] + "院",
          studentScore: []
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
          let [id, name, regCourse, regId, regInstitution, score] = [
            this.students[index].studentId,
            this.students[index].studentName,
            this.students[index].regCourse,
            this.students[index].regId,
            this.students[index].regInstitution,
            this.students[index].studentScore
          ];
          this.students.splice(index, 1, {
            studentId: id,
            studentName: name,
            studentPassword: value,
            regCourse: regCourse,
            regId: regId,
            regInstitution: regInstitution,
            studentScore: score
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

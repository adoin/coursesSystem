<template>
  <div v-show="this.$store.state.adminType">
    <el-container>
      <el-aside>
        <topbar></topbar>
      </el-aside>
      <el-main>

        <el-button @click="randomlyAssign()">为所有项随机赋分</el-button>
        <vxe-pulldown ref="xDown1">
          <template v-slot>
            <vxe-input
              v-model="searchName"
              placeholder="以学生名字查询"
              @focus="focusEvent1"
              @keyup="keyupEvent1"
              clearable
            ></vxe-input>
          </template>
          <template v-slot:dropdown>
            <div class="my-dropdown">
              <div
                class="list-item"
                v-for="item in studentNameList"
                :key="item.value"
                @click="selectEvent1(item)"
              >
                <i class="fa fa-user-o"></i>
                <span>{{ item.label }}</span>
              </div>
            </div>
          </template>
        </vxe-pulldown>

        <vxe-pulldown ref="xDown2">
          <template v-slot>
            <vxe-input
              v-model="searchCourseName"
              placeholder="以课程名称查询"
              @focus="focusEvent2"
              @keyup="keyupEvent2"
              clearable
            ></vxe-input>
          </template>
          <template v-slot:dropdown>
            <div class="my-dropdown">
              <div
                class="list-item"
                v-for="item in courseNameList"
                :key="item.value"
                @click="selectEvent2(item)"
              >
                <i class="fa fa-user-o"></i>
                <span>{{ item.label }}</span>
              </div>
            </div>
          </template>
        </vxe-pulldown>

        <vxe-table
          :data="this.queryList"
          :edit-config="{ trigger: 'click', mode: 'cell' }"
        >
          <vxe-table-column type="seq" width="60"></vxe-table-column>
          <vxe-table-column type="checkbox" width="60"></vxe-table-column>

          <vxe-table-column field="studentId" title="学生学号" sortable>
          </vxe-table-column>

          <vxe-table-column field="studentName" title="学生姓名" sortable>
          </vxe-table-column>

          <vxe-table-column field="courseId" title="课程编号" sortable>
          </vxe-table-column>

          <vxe-table-column field="courseName" title="课程名称" sortable>
          </vxe-table-column>

          <vxe-table-column
            field="courseResult"
            title="学生得分"
            :edit-render="{
              name: '$input',
              props: { type: 'float', digits: 1 }
            }"
          >
          </vxe-table-column>

        <vxe-table-column title="评价等级">
            <template scope="scope">
                <span v-if="scope.row.courseResult>=90">A</span>
                <span v-else-if="scope.row.courseResult>=85&&scope.row.courseResult<90">A-</span>
                <span v-else-if="scope.row.courseResult>=82&&scope.row.courseResult<85">B+</span>
                <span v-else-if="scope.row.courseResult>=78&&scope.row.courseResult<82">B</span>
                <span v-else-if="scope.row.courseResult>=75&&scope.row.courseResult<78">B-</span>
                <span v-else-if="scope.row.courseResult>=72&&scope.row.courseResult<75">C+</span>
                <span v-else-if="scope.row.courseResult>=68&&scope.row.courseResult<72">C</span>
                <span v-else-if="scope.row.courseResult>=64&&scope.row.courseResult<68">C-</span>
                <span v-else-if="scope.row.courseResult>60&&scope.row.courseResult<64">D</span>
                <span v-else-if="scope.row.courseResult==60">D-</span>
                <span v-else-if="scope.row.courseResult<60">F</span>
            </template>
          </vxe-table-column>

        <vxe-table-column title="单科绩点">
            <template scope="scope">
                <span v-if="scope.row.courseResult>=90">4.0</span>
                <span v-else-if="scope.row.courseResult>=85&&scope.row.courseResult<90">3.7</span>
                <span v-else-if="scope.row.courseResult>=82&&scope.row.courseResult<85">3.3</span>
                <span v-else-if="scope.row.courseResult>=78&&scope.row.courseResult<82">3.0</span>
                <span v-else-if="scope.row.courseResult>=75&&scope.row.courseResult<78">2.7</span>
                <span v-else-if="scope.row.courseResult>=72&&scope.row.courseResult<75">2.3</span>
                <span v-else-if="scope.row.courseResult>=68&&scope.row.courseResult<72">2.0</span>
                <span v-else-if="scope.row.courseResult>=64&&scope.row.courseResult<68">1.5</span>
                <span v-else-if="scope.row.courseResult>60&&scope.row.courseResult<64">1.3</span>
                <span v-else-if="scope.row.courseResult==60">1.0</span>
                <span v-else-if="scope.row.courseResult<60">0</span>

            </template>
          </vxe-table-column>

          <vxe-table-column title="操作">
            <template> </template>
          </vxe-table-column>
        </vxe-table>
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
      searchName: "", //搜索名字
      searchCourseName:'',
      studentNameList: [{ label: "all", value: 1 }],
      courseNameList:[{ label: "all", value: 1 }],
      record: [], //记录学生名字,用于检查下拉框的重复项
      courseRecord:[],
      queryList: []
    };
  },
  created() {

    //初始化以'学生名字'进行查询的下拉框
    for (let i = 0, index = 1; i < this.resultList.length - 1; i++) {
      if (this.record.indexOf(this.resultList[i].studentName) == -1) {
        index++;

        this.studentNameList.push({
          label: `${this.resultList[i].studentName}`,
          value: index
        });
      }

      this.record.push(this.resultList[i].studentName);
      console.log(this.record);
    }
    this.data1 = this.studentNameList;

//初始化以'课程名称'进行查询的下拉框
    for (let i = 0, index = 1; i < this.resultList.length - 1; i++) {
      if (this.courseRecord.indexOf(this.resultList[i].courseName) == -1) {
        index++;

        this.courseNameList.push({
          label: `${this.resultList[i].courseName}`,
          value: index
        });
      }

      this.courseRecord.push(this.resultList[i].courseName);
      console.log(this.courseRecord);
    }
    this.data2 = this.courseNameList;

  },
  methods: {
    focusEvent1() {
      this.$refs.xDown1.showPanel();
    },
    keyupEvent1() {
      const { searchName } = this;
      this.studentNameList = searchName
        ? this.data1.filter(item => item.label.indexOf(searchName) > -1)
        : this.data1;
    },
    selectEvent1(item) {
      this.searchName = item.label;
      this.$refs.xDown1.hidePanel().then(() => {
        this.studentNameList = this.data1;
      });
      console.log(this.searchName);
      this.queryByName(this.searchName);
    },
    focusEvent2() {
      this.$refs.xDown2.showPanel();
    },
    keyupEvent2() {
      const { searchCourseName } = this;
      this.courseNameList = searchCourseName
        ? this.data2.filter(item => item.label.indexOf(searchCourseName) > -1)
        : this.data2;
    },
    selectEvent2(item) {
      this.searchCourseName = item.label;
      this.$refs.xDown2.hidePanel().then(() => {
        this.studentNameList = this.data2;
      });
      this.queryByCourseName(this.searchCourseName);
    },

    queryByName() {
      if (this.searchName.indexOf("all") != -1) {
        this.queryList = this.resultList;
      } else {
        this.queryList = [];
        this.resultList.filter(item => {
          //查询studentName
          if (item.studentName.indexOf(this.searchName) != -1) {
            this.queryList.push(item);
          }
        });
      }
    },
    queryByCourseName() {
      if (this.searchCourseName.indexOf("all") != -1) {
        this.queryList = this.resultList;
      } else {
        this.queryList = [];
        this.resultList.filter(item => {
          //查询courseName
          if (item.courseName.indexOf(this.searchCourseName) != -1) {
            this.queryList.push(item);
          }
        });
      }
    },

    randomlyAssign(){
        for(let item of this.resultList){
            item.courseResult=Math.round(Math.random(1)*25)+Math.round(Math.random(2)*25)+Math.round(Math.random(3)*25)+Math.round(Math.random(4)*25)+25
            if(item.courseResult>=90){
                item.courseResult-=10
            if(item.courseResult>=100){
                item.courseResult=90+Math.round(Math.random(5)*10)
            }
            }
        }
    }
  },
  computed: {
    ...mapState(["students"]),
    ...mapState(["courses"]),
    ...mapState(["resultList"])
  },

  components: {
    topbar
  }
};
</script>

<style scoped>
.my-dropdown {
  height: 200px;
  overflow: auto;
  border-radius: 4px;
  background-color: #fff;
  border: 1px solid #dcdfe6;
}
.list-item:hover {
  background-color: #f5f7fa;
}
</style>

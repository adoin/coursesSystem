<template>
  <div v-show="this.$store.state.adminType">
    <el-container>
      <el-aside>
        <topbar></topbar>
      </el-aside>

      <el-main>
        <vxe-toolbar>
          <template v-slot:buttons>
            <vxe-input v-model="filterName" type="search" placeholder="试试全表搜索"></vxe-input>
            <vxe-button icon="el-icon-plus" @click="add">新增空白课程</vxe-button>
            <vxe-button icon="el-icon-plus" @click="randomCourseEvent">新增随机课程</vxe-button>
            <vxe-button icon="el-icon-plus" @click="insertEvent">新增自定义课程</vxe-button>
            <vxe-button icon="el-icon-delete" @click="remove" status="danger">移除选择课程</vxe-button>
          </template>
        </vxe-toolbar>

        <vxe-table
          border
          resizable
          show-overflow
          keep-source
          ref="xTable"
          :loading="loading"
          :data="list"
          :edit-config="{trigger: 'manual', mode: 'row'}"
        >
          <vxe-table-column type="seq" width="60"></vxe-table-column>
          <vxe-table-column type="checkbox" width="60"></vxe-table-column>
          <vxe-table-column
            field="courseId"
            title="课程编号"
            :edit-render="{
              name: 'input',
              immediate: true,
              attrs: { type: 'text' }
            }"
            width="130"
            sortable
            type="html"
          ></vxe-table-column>

          <vxe-table-column
            field="courseName"
            title="课程名称"
            width="300"
            sortable
            :edit-render="{
              name: 'input',
              immediate: true,
              attrs: { type: 'text' }
            }"
            type="html"
            :filter-multiple="true"
            :filters="courseNameFilter"
            :filter-method="filtercourseNameMethod"
          ></vxe-table-column>

          <vxe-table-column
            field="courseInstitution"
            title="教学学院"
            :edit-render="{
              name: 'input',
              immediate: true,
              attrs: { type: 'text' }
            }"
            width="130"
            sortable
            type="html"
            :filter-multiple="true"
            :filters="courseInstitutionFilter"
            :filter-method="filtercourseInstitutionMethod"
          ></vxe-table-column>
          <vxe-table-column
            field="courseLecturer"
            title="教学老师"
            :edit-render="{
              name: 'input',
              immediate: true,
              attrs: { type: 'text' }
            }"
            width="130"
            sortable
            type="html"
          ></vxe-table-column>
          <vxe-table-column
            field="courseType"
            title="课程类型"
            :edit-render="{
              name: 'input',
              immediate: true,
              attrs: { type: 'text' }
            }"
            width="130"
            sortable
            type="html"
          ></vxe-table-column>

          <vxe-table-column
            field="courseScore"
            title="课程学分"
            width="140"
            sortable
            type="html"
            :edit-render="{
              name: 'input',
              immediate: true,
              attrs: { type: 'text' }
            }"
            :filters="[{ data: '' }]"
            :filter-method="filterCourseScoreMethod"
          >
            <template v-slot:filter="{ $panel, column }">
              <input
                type="type"
                placeholder="输入搜索内容"
                v-for="(option, index) in column.filters"
                :key="index"
                v-model="option.data"
                @input="$panel.changeOption($event, !!option.data, option)"
              />
            </template>
          </vxe-table-column>

          <vxe-table-column title="操作">
            <template v-slot="{ row }">
              <vxe-button icon="el-icon-check" @click="viewDetails(row)">详细信息</vxe-button>
              <vxe-button icon="el-icon-edit" @click="editEvent(row)">编辑</vxe-button>
            </template>
          </vxe-table-column>

          <template v-slot:empty>
            <span style="color: red;">
              <p>没有更多数据了！</p>
            </span>
          </template>
        </vxe-table>

        <!-- 新增空白课程 -->
        <vxe-modal
          v-model="showEdit"
          :title="selectRow ? '编辑&保存' : '新增&保存'"
          width="800"
          :loading="submitLoading"
          resize
          destroy-on-close
        >
          <template v-slot>
            <vxe-form
              :data="formData"
              :items="formItems"
              title-align="right"
              title-width="100"
              @submit="submitEvent"
            ></vxe-form>
          </template>
        </vxe-modal>

        <!-- 新增随机课程 -->
        <vxe-modal v-model="showRandom" :title="'创建随机课程'" width="800" resize destroy-on-close>
          <template v-slot>
            <vxe-form
              :data="formData_random"
              :items="formItems_random"
              title-align="right"
              title-width="100"
              @submit="randomCourseSubmitEvent"
            ></vxe-form>
          </template>
        </vxe-modal>

        <!-- 查看课程详细信息 -->

        <vxe-modal
          v-model="showDetails"
          title="查看详情"
          width="600"
          height="400"
          :mask="false"
          :lock-view="false"
          resize
        >
          <template v-slot>
            <vxe-table
              border="inner"
              auto-resize
              show-overflow
              highlight-hover-row
              height="auto"
              :show-header="false"
              :sync-resize="showDetails"
              :data="detailData"
            >
              <vxe-table-column field="label" width="40%"></vxe-table-column>
              <vxe-table-column field="value"></vxe-table-column>
            </vxe-table>
          </template>
        </vxe-modal>

        <div class="bottom"></div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { mapState } from "vuex";
import topbar from "../Topbar.vue";
import XEUtils from "xe-utils";

export default {
  data() {
    return {
      loading: false,
      submitLoading: false,
      id: "",
      name: "",
      institution: "",
      lecturer: "",
      score: "",
      type: "",
      selectRow: null,
      showEdit: false,
      showDetails: false,

      showRandom: false,
      filterName: "",
      detailData: [],

      formData: {
        courseId: null,
        courseName: null,
        courseInstitution: null,
        courseLecturer: null,
        courseType: null,
        courseScore: null,
        courseSize: null,
        courseVolume: null,
        courseArea: null,
        courseTime: null,
      },

      formItems: [
        {
          title: "Basic information",
          span: 24,
          titleAlign: "left",
          titleWidth: 200,
          titlePrefix: { icon: "fa fa-address-card-o" },
        },
        {
          field: "courseId",
          title: "课程编号",
          span: 12,
          itemRender: {
            name: "$input",
            props: { placeholder: "请输入课程编号" },
          },
        },
        {
          field: "courseName",
          title: "课程名称",
          span: 12,
          itemRender: {
            name: "$input",
            props: { placeholder: "请输入课程名称" },
          },
        },
        {
          field: "courseInstitution",
          title: "教学学院",
          span: 12,
          itemRender: {
            name: "$input",
            props: { placeholder: "请输入教学学院" },
          },
        },
        {
          field: "courseLecturer",
          title: "教学老师",
          span: 12,
          itemRender: {
            name: "$input",
            props: { placeholder: "请输入教学老师" },
          },
        },
        {
          field: "courseType",
          title: "课程类型",
          span: 12,
          itemRender: {
            name: "$input",
            props: { placeholder: "请输入课程类型" },
          },
        },
        {
          field: "courseScore",
          title: "课程学分",
          span: 12,
          itemRender: {
            name: "$input",
            props: { placeholder: "请输入课程学分" },
          },
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
                  status: "primary",
                },
              },
              {
                props: {
                  type: "reset",
                  content: "重置",
                },
              },
            ],
          },
        },
      ],

      formData_random: {
        size: null,
        institution: null,
        type: null,
        score: null,
      },

      formItems_random: [
        {
          title: "课程信息",
          span: 24,
          titleAlign: "left",
          titleWidth: 200,
          titlePrefix: { icon: "fa fa-address-card-o" },
        },

        {
          field: "size",
          title: "创建数量",
          span: 12,
          itemRender: {
            name: "$input",
            props: { placeholder: "请输入创建数量" },
          },
        },

        {
          field: "institution",
          title: "指定学院",
          span: 12,
          itemRender: {
            name: "$select",
            options: [
              { label: "随机", value: "-1" },
              { label: "哲学院", value: "01" },
              { label: "经济学院", value: "02" },
              { label: "法学院", value: "03" },
              { label: "教育学院", value: "04" },
              { label: "文学院", value: "05" },
              { label: "历史学院", value: "06" },
              { label: "理学院", value: "07" },
              { label: "工学院", value: "08" },
              { label: "农学院", value: "09" },
              { label: "医学院", value: "10" },
              { label: "军事学院", value: "11" },
              { label: "管理学院", value: "12" },
              { label: "艺术学院", value: "13" },
            ],
          },
        },

        {
          field: "type",
          title: "指定类型",
          span: 12,
          itemRender: {
            name: "$select",
            options: [
              { label: "随机", value: "随机" },
              { label: "必修", value: "必修" },
              { label: "选修", value: "选修" },
            ],
          },
        },

        {
          field: "score",
          title: "指定学分",
          span: 12,
          itemRender: {
            name: "$input",
            props: { placeholder: "请输入指定学分(输入0为随机)" },
          },
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
                  status: "primary",
                },
              },
              {
                props: {
                  type: "reset",
                  content: "重置",
                },
              },
            ],
          },
        },
      ],

      courseNameFilter: [
        //匹配任意开头,'xx课程'结尾的值
        { label: "初级课程", value: /.*初级课程$/ },
        { label: "中级课程", value: /.*中级课程$/ },
        { label: "高级课程", value: /.*高级课程$/ },
        { label: "进阶课程", value: /.*进阶课程$/ },
      ],

      courseInstitutionFilter: [],
    };
  },

  created() {
    this.initcourseInstitutionFilter();
  },

  methods: {
    filtercourseNameMethod({ value, row, column }) {
      return row.courseName.match(value);
    },

    filterCourseScoreMethod({ option, row }) {
      return row.courseScore === Number(option.data);
    },

    //在created中调用,用于初始化courseInstitutionFilter
    initcourseInstitutionFilter() {
      let element = "";
      this.allcourseInstitution.forEach((item, index) => {
        element = item + "院";
        this.courseInstitutionFilter.push({ label: element, value: element });
      });
    },

    filtercourseInstitutionMethod({ value, row }) {
      return row.courseInstitution == value;
    },

    //在点击表格单元格时调用
    viewDetails(row) {
      this.detailData = [
        { pk: "courseId", name: "课程编号" },
        { pk: "courseName", name: "课程名称" },
        { pk: "courseInstitution", name: "教学学院" },
        { pk: "courseLecturer", name: "教学老师" },
        { pk: "courseType", name: "课程类型" },
        { pk: "courseScore", name: "课程学分" },
        { pk: "courseSize", name: "已注册人数" },
        { pk: "courseVolume", name: "课程容量" },
        { pk: "courseArea", name: "教学地点" },
        { pk: "courseTime", name: "教学时间" },
      ].map((field) => {
        return { label: field.name, value: row[field.pk] };
      });
      this.showDetails = true;
    },

    editEvent(row) {
      this.formData = {
        courseId: row.courseId,
        courseName: row.courseName,
        courseInstitution: row.courseInstitution,
        courseLecturer: row.courseLecturer,
        courseType: row.courseType,
        courseScore: row.courseScore,
        courseSize: row.courseSize,
        courseVolume: row.courseVolume,
        courseArea: row.courseArea,
        courseTime: row.courseTime,
      };
      this.selectRow = row;
      this.showEdit = true;
    },

    //新建一个空白课程信息
    insertEvent() {
      this.formData = {
        courseId: "",
        courseName: "",
        courseInstitution: "",
        courseLecturer: "",
        courseType: "",
        courseScore: "",
        courseSize: "",
        courseVolume: "",
        courseArea: "",
        courseTime: "",
      };
      this.selectRow = null;
      this.showEdit = true;
    },

    randomCourseEvent() {
      (this.formData_random = {
        size: "",
        institution: "",
        type: "",
        score: "",
      }),
        (this.showRandom = true);
    },

    randomCourseSubmitEvent() {
      this.showRandom = false;
      this.courseGenerator(
        this.formData_random.size,
        this.formData_random.institution,
        this.formData_random.type,
        this.formData_random.score
      );
      this.$XModal.message({ message: "创建成功", status: "success" });
    },

    courseGenerator(size, institutionPrefix, type, score) {
      for (let i = 0; i < size; i++) {
        let index = 0; //index用于取出allcourseInstitution里面的学院

        //设定学院
        let randomInstitution = "";

        if (institutionPrefix == "-1") {
          index = Math.round(Math.random() * 12);
          randomInstitution = this.allcourseInstitution[index] + "院";
        } else {
          index = parseInt(institutionPrefix) - 1;
          randomInstitution = this.allcourseInstitution[index] + "院";
        }

        //设定学院可对应的课程编号
        let suitableArray = [];
        let reg = "";

        //遍历获得可对应的课程信息
        if (institutionPrefix == "-1") {
          let prefix = "0";
          index < 9
            ? (prefix = "0" + (index + 1).toString())
            : (prefix = (index + 1).toString());
          reg = new RegExp("^" + prefix + ".*$");
        } else {
          reg = new RegExp("^" + institutionPrefix + ".*$");
        }

        for (let j = 0; j < this.allCourses.length - 1; j++) {
          if (this.allCourses[j].match(reg)) {
            suitableArray.push(this.allCourses[j]);
          }
        }

        /*
        //查询次数
        if(i>suitableArray.length-1){
          alert('课程溢出')
          break
        }
        */

        //从可对应的课程信息里面选一个
        const levelSeed = ["初级课程", "中级课程", "高级课程", "进阶课程"];
        let [randomCourse, randomLevel, randomId, randomCourseName] = [
          "",
          "",
          "",
          "",
        ];
        for (let k = 0; k < suitableArray.length - 1; k++) {
          randomCourse =
            suitableArray[
              Math.round(Math.random() * (suitableArray.length - 1))
            ]; //随机取出一个元素
          randomLevel =
            levelSeed[Math.round(Math.random() * (levelSeed.length - 1))]; //课程难度
          randomId = randomCourse.substring(0, 6); //取出课程编号
          randomCourseName = randomCourse.substring(6) + randomLevel; //取出课程名称
        }

        /*
        //查询重复
        let findRepeat=false
        for(let item of this.courses){
          if(item.courseId.indexOf(randomId)!=-1){
            findRepeat=true
            break
          }
        }

        if(findRepeat==true){
          i--
          continue
        }
        */
        //设定课程类型
        let randomType = "";

        if (type == "随机") {
          randomType = Math.round(Math.random() * 3) >= 2 ? "必修" : "选修"; //0~3
        } else {
          randomType = type;
        }

        //设定学分
        let randomScore = "";

        if (score == "0") {
          randomScore = Math.round(Math.random() * 5);
        } else {
          randomScore = score;
        }

        //设定教师
        let randomLecturer = "";
        let modifier = Math.floor(Math.random()*100)
        if(modifier <=80){
            randomLecturer = this.familyNameSeed[Math.round(Math.random() * (this.familyNameSeed.length - 1))] +
            this.givenNameSeed[Math.round(Math.random() * (this.givenNameSeed.length - 1))]
        }
        else if(modifier >80 && modifier<=95){
          randomLecturer = this.rareFamilyNameSeed[Math.round(Math.random() * (this.familyNameSeed.length - 1))] +
            this.givenNameSeed[Math.round(Math.random() * (this.givenNameSeed.length - 1))]
        }
        else if(modifier>95){
          randomLecturer = this.extremeRareFamilyNameSeed[Math.round(Math.random() * (this.familyNameSeed.length - 1))] +
            this.givenNameSeed[Math.round(Math.random() * (this.givenNameSeed.length - 1))]
        }
        if(Math.round(Math.random()==1)){
          randomLecturer = randomLecturer + this.givenNameSeed[Math.round(Math.random() * (this.givenNameSeed.length - 1))];
        }


        //设定课程容量
        let randomCourseVolume = Math.round(Math.random() * 100) + 50;

        //设定课程地点
        let buildingIndicator = Math.round(Math.random() * 5) + 1;
        let floorIndicator = Math.round(Math.random() * 5) + 1;
        let roomIndicator = Math.round(Math.random() * 8) + 1;
        let randomCourseArea =
          buildingIndicator.toString() +
          floorIndicator.toString() +
          "0" +
          roomIndicator.toString();

        //设定课程时间
        const daySeed = ["周一", "周二", "周三", "周四", "周五"];
        let day = daySeed[Math.round(Math.random() * (daySeed.length -1))];
        const sessionSeed = ["一", "二", "三", "四", "五", "六"];
        let session =
          "第" +
          sessionSeed[Math.round(Math.random() * (sessionSeed.length-1))] +
          "大节";
        let randomCourseTime = day + " " + session;

        //导入数据
        this.courses.push({
          courseId: randomId,
          courseName: randomCourseName,
          courseInstitution: randomInstitution,
          courseLecturer: randomLecturer,
          courseScore: randomScore,
          courseType: randomType,
          courseSize: 0,
          courseVolume: randomCourseVolume,
          courseArea: randomCourseArea,
          courseTime: randomCourseTime,
        });
      }
    },

    submitEvent() {
      this.submitLoading = true;
      setTimeout(() => {
        this.submitLoading = false;
        this.showEdit = false;
        if (this.selectRow) {
          this.$XModal.message({ message: "保存成功", status: "success" });
          Object.assign(this.selectRow, this.formData);
        } else {
          this.$XModal.message({ message: "新增成功", status: "success" });
          this.$refs.xTable.insert(this.formData);
        }
      }, 500);
    },

    //将一个空的课程对象添加到courses数组内
    add() {
      this.courses.push({
        courseId: "",
        courseName: "",
        courseInstitution: "",
        courseLecturer: "",
        courseScore: "",
      });
    },

    //移除被勾选框选中的若干行
    remove() {
      let selectRecords = this.$refs.xTable.getCheckboxRecords();
      for (let item1 of selectRecords) {
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

        //设置一个随机学分
        let randomScore = Math.round(Math.random() * 4 + 1);

        //设置一个随机类型
        let randomType = "";
        if (Math.round(Math.random() * 5) <= 3) {
          randomType = "必修";
        } else {
          randomType = "选修";
        }

        //push数组
        this.courses.push({
          courseId: randomId,
          courseName: randomCourseName,
          courseInstitution: randomInstitution,
          courseLecturer: randomLecturer,
          courseScore: randomScore,
          courseType: randomType,
        });
      }
    },
  },
  computed: {
    ...mapState(["courses"]),
    ...mapState(["allCourses"]),
    ...mapState(["allcourseInstitution"]),
    ...mapState(["familyNameSeed"]),
    ...mapState(["rareFamilyNameSeed"]),
    ...mapState(["extremeRareFamilyNameSeed"]),
    ...mapState(["givenNameSeed"]),

    list() {
      const filterName = XEUtils.toString(this.filterName).trim().toLowerCase(); //转字符串,清除空格,转小写
      if (filterName) {
        const filterRE = new RegExp(filterName, "gi"); //全局匹配,大小写不敏感
        const searchProps = [
          "courseId",
          "courseName",
          "courseInstitution",
          "courseLecturer",
          "courseScore",
          "courseType",
        ]; //搜索项
        //some() 方法用于检测数组中的元素是否满足指定条件
        const rest = this.courses.filter((item) =>
          searchProps.some(
            (key) =>
              XEUtils.toString(item[key]).toLowerCase().indexOf(filterName) > -1
          )
        );
        return rest.map((row) => {
          const item = Object.assign({}, row);
          searchProps.forEach((key) => {
            item[key] = XEUtils.toString(item[key]).replace(
              filterRE,
              (match) => `<span class="keyword-lighten">${match}</span>`
            );
          });
          return item;
        });
      }
      return this.courses;
    },
  },
  components: {
    topbar,
  },
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
.keyword-lighten {
  color: #000;
  background-color: #ffff00;
}
</style>

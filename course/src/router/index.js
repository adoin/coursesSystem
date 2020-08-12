import Vue from 'vue'
import Router from 'vue-router'
import Students from "@/components/students/Students"
import Courses from "@/components/courses/Courses"
import Enrollments from "@/components/enrollments/Enrollments"

Vue.use(Router)

export default new Router({
  routes: [
    {
      path:"/students",
      name:"students",
      component:Students
    },
    {
      path:"/courses",
      name:"courses",
      component:Courses
    },
    {
      path:"/enrollments",
      name:"enrollments",
      component:Enrollments
    }
  ]
})

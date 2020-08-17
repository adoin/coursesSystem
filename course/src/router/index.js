import Vue from 'vue'
import Router from 'vue-router'
import Students from "@/components/students/Students"
import Courses from "@/components/courses/Courses"
import Enrollments from "@/components/enrollments/Enrollments"
import Selected from "@/components/enrollments/selected"
import PasswordManager from "@/components/enrollments/PasswordManager"

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
    },
    {
      path:"/selected",
      name:"selected",
      component:Selected
    },
    {
      path:"/passwordManager",
      name:"passwordManager",
      component:PasswordManager
    }
  ]
})

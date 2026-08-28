// statCardData.js
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  UserPlus,
  BookText,
  Users2,
  Building,
  CheckCircle,
  FileCheck,
  MessageCircle
} from 'lucide-react';

export const statsData = [
  {
    title: 'dashboard.totalStudents',
    value: "1,234",
    change: "+12%",
    icon: GraduationCap,
    color: "blue",
    gradient: "bg-gradient-to-r from-blue-500 to-blue-600",
    route: "/students"
  },
  {
    title: 'dashboard.totalStaff',
    value: "45",
    change: "+5%", 
    icon: Users,
    color: "green",
    gradient: "bg-gradient-to-r from-green-500 to-green-600",
    route: "/staff"
  },
  {
    title: 'dashboard.activeCourses',
    value: "89",
    change: "+8%",
    icon: BookOpen,
    color: "purple",
    gradient: "bg-gradient-to-r from-purple-500 to-purple-600",
    route: "/courses"
  },
  {
    title: 'common.departments',
    value: "12",
    change: "+2%",
    icon: Building,
    color: "teal",
    gradient: "bg-gradient-to-r from-teal-500 to-teal-600",
    route: "/departments"
  }
];

export const recentActivitiesData = [
  {
    message: 'dashboard.newStudentRegistered',
    type: 'student',
    hoursAgo: 1,
    icon: UserPlus,
    color: 'blue',
    user: 'John Doe',
    route: '/students'
  },
  {
    message: 'dashboard.courseCompleted',
    type: 'course',
    hoursAgo: 3,
    icon: CheckCircle,
    color: 'green',
    course: 'Mathematics 101',
    route: '/courses'
  },
  {
    message: 'dashboard.staffMemberAdded',
    type: 'staff',
    hoursAgo: 5,
    icon: Users2,
    color: 'purple',
    staff: 'Sarah Wilson',
    route: '/staff'
  },
  {
    message: 'dashboard.departmentUpdated',
    type: 'department',
    hoursAgo: 8,
    icon: Building,
    color: 'orange',
    department: 'Computer Science',
    route: '/departments'
  },
  {
    message: 'dashboard.courseCreated',
    type: 'course',
    hoursAgo: 12,
    icon: FileCheck,
    color: 'teal',
    assignment: 'Final Project',
    route: '/courses'
  },
];

export const quickActionsData = [
  {
    title: 'dashboard.quickActionsSection.addNewStudent',
    type: 'student',
    description: 'dashboard.quickActionsSection.addNewStudentDesc',
    icon: UserPlus,
    color: 'blue',
    route: '/students'
  },
  {
    title: 'dashboard.quickActionsSection.createCourse',
    type: 'course',
    description: 'dashboard.quickActionsSection.createCourseDesc',
    icon: BookText,
    color: 'green',
    route: '/courses'
  },
  {
    title: 'dashboard.quickActionsSection.manageStaff',
    type: 'staff',
    description: 'dashboard.quickActionsSection.manageStaffDesc',
    icon: Users2,
    color: 'purple',
    route: '/staff'
  },
  {
    title: 'dashboard.quickActionsSection.viewDepartments',
    type: 'department',
    description: 'dashboard.quickActionsSection.viewDepartmentsDesc',
    icon: Building,
    color: 'orange',
    route: '/departments'
  }
];

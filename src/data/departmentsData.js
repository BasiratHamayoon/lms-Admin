import { 
  Building, 
  Users, 
  BookOpen, 
  GraduationCap,
  CheckCircle,
  AlertCircle,
  PauseCircle,
  Clock
} from 'lucide-react';

export const DEPARTMENTS_DATA = {
  stats: [
    {
      title: "departments.totalDepartments",
      value: "8",
      change: "+1",
      icon: Building,
      color: "blue" 
    },
    {
      title: "departments.activeDepartments",
      value: "7",
      change: "+2%",
      icon: CheckCircle,
      color: "green" 
    },
    {
      title: "departments.totalTeachers",
      value: "42",
      change: "+5%",
      icon: Users,
      color: "purple" 
    },
    {
      title: "departments.activeSubjects",
      value: "28",
      change: "+8%",
      icon: BookOpen,
      color: "teal" 
    }
  ],
  departments: [
    {
      id: 1,
      name: "Mathematics",
      head: "Mr. David Wilson",
      status: "active",
      teacherCount: 8,
      studentCount: 450,
      avatar: ""
    },
    {
      id: 2,
      name: "Science",
      head: "Ms. Sarah Johnson",
      status: "active",
      teacherCount: 10,
      studentCount: 520,
      avatar: ""
    },
    {
      id: 3,
      name: "Languages",
      head: "Mrs. Maria Garcia",
      status: "active",
      teacherCount: 6,
      studentCount: 380,
      avatar: ""
    },
    {
      id: 4,
      name: "Social Studies",
      head: "Mr. Robert Brown",
      status: "active",
      teacherCount: 5,
      studentCount: 320,
      avatar: ""
    },
    {
      id: 5,
      name: "Arts & Music",
      head: "Ms. Lisa Chen",
      status: "active",
      teacherCount: 4,
      studentCount: 280,
      avatar: ""
    },
    {
      id: 6,
      name: "Physical Education",
      head: "Coach Michael Taylor",
      status: "inactive",
      teacherCount: 3,
      studentCount: 420,
      avatar: ""
    },
    {
      id: 7,
      name: "Computer Studies",
      head: "Mr. James Anderson",
      status: "active",
      teacherCount: 4,
      studentCount: 350,
      avatar: ""
    },
    {
      id: 8,
      name: "Special Education",
      head: "Mrs. Emily Davis",
      status: "inactive",
      teacherCount: 2,
      studentCount: 45,
      avatar: ""
    }
  ]
};

export const DEPARTMENT_STATUSES = [
  "active",
  "inactive"
];
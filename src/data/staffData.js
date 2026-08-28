// staffData.js
import { 
  Users, 
  UserCheck, 
  UserX, 
  TrendingUp 
} from 'lucide-react';

export const STAFF_DATA = {
  stats: [
    {
      title: "staff.totalStaff",
      value: "156",
      change: "+8%",
      icon: Users,
      color: "blue" 
    },
    {
      title: "staff.activeStaff",
      value: "142",
      change: "+5%",
      icon: UserCheck,
      color: "green" 
    },
    {
      title: "staff.onLeave",
      value: "14",
      change: "+2%",
      icon: UserX,
      color: "purple" 
    },
    {
      title: "staff.retentionRate",
      value: "94.2%",
      change: "+1.5%",
      icon: TrendingUp,
      color: "teal" 
    }
  ],
  staff: [
    {
      id: 1,
      name: "Dr. Sarah Wilson",
      email: "sarah.wilson@university.edu",
      phone: "+1 (555) 123-4567",
      role: "Professor",
      department: "Computer Science",
      joinDate: "2020-03-15",
      status: "active",
      avatar: "",
      courses: ["Advanced Algorithms", "Machine Learning"],
      office: "CS Building, Room 301",
      specialization: "Artificial Intelligence"
    },
    {
      id: 2,
      name: "Prof. David Brown",
      email: "david.brown@university.edu",
      phone: "+1 (555) 234-5678",
      role: "Associate Professor",
      department: "Mathematics",
      joinDate: "2019-08-22",
      status: "active",
      avatar: "",
      courses: ["Calculus III", "Linear Algebra"],
      office: "Math Building, Room 205",
      specialization: "Applied Mathematics"
    },
    {
      id: 3,
      name: "Dr. Maria Garcia",
      email: "maria.garcia@university.edu",
      phone: "+1 (555) 345-6789",
      role: "Assistant Professor",
      department: "Physics",
      joinDate: "2021-01-10",
      status: "on-leave",
      avatar: "",
      courses: ["Quantum Mechanics", "Thermodynamics"],
      office: "Physics Building, Room 102",
      specialization: "Quantum Physics"
    },
    {
      id: 4,
      name: "Prof. James Anderson",
      email: "james.anderson@university.edu",
      phone: "+1 (555) 456-7890",
      role: "Professor",
      department: "Chemistry",
      joinDate: "2018-11-05",
      status: "on-leave",
      avatar: "",
      courses: ["Organic Chemistry", "Biochemistry"],
      office: "Chemistry Building, Room 401",
      specialization: "Organic Chemistry"
    },
    {
      id: 5,
      name: "Dr. Lisa Chen",
      email: "lisa.chen@university.edu",
      phone: "+1 (555) 567-8901",
      role: "Lecturer",
      department: "Biology",
      joinDate: "2022-06-18",
      status: "active",
      avatar: "",
      courses: ["Genetics", "Cell Biology"],
      office: "Biology Building, Room 156",
      specialization: "Molecular Biology"
    },
    {
      id: 6,
      name: "Prof. Robert Taylor",
      email: "robert.taylor@university.edu",
      phone: "+1 (555) 678-9012",
      role: "Administrative Staff",
      department: "Business Administration",
      joinDate: "2019-04-30",
      status: "on-leave",
      avatar: "",
      courses: [],
      office: "Admin Building, Room 101",
      specialization: "Administration"
    },
    {
      id: 7,
      name: "Dr. Emily Davis",
      email: "emily.davis@university.edu",
      phone: "+1 (555) 789-0123",
      role: "Support Staff",
      department: "Engineering",
      joinDate: "2023-02-14",
      status: "active",
      avatar: "",
      courses: [],
      office: "Engineering Building, Room 210",
      specialization: "Technical Support"
    },
    {
      id: 8,
      name: "Prof. Michael Johnson",
      email: "michael.johnson@university.edu",
      phone: "+1 (555) 890-1234",
      role: "Professor",
      department: "Computer Science",
      joinDate: "2017-09-08",
      status: "on-leave",
      avatar: "",
      courses: ["Data Structures", "Database Systems"],
      office: "CS Building, Room 305",
      specialization: "Database Systems"
    }
  ]
};
// src/data/attendanceData.js
import { 
  Users, 
  UserCheck, 
  UserX, 
  Clock,
  TrendingUp,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  UserCog
} from 'lucide-react';

export const ATTENDANCE_DATA = {
  stats: [
    {
      title: "attendance.staff",
      value: "156",
      change: "+2%",
      icon: Users,
      color: "blue" 
    },
    {
      title: "attendance.presentToday",
      value: "142",
      change: "+3%",
      icon: UserCheck,
      color: "green" 
    },
    {
      title: "attendance.absentToday",
      value: "8",
      change: "-1%",
      icon: UserX,
      color: "purple" 
    },
    {
      title: "attendance.lateToday",
      value: "6",
      change: "+2%",
      icon: Clock,
      color: "teal" 
    }
  ],
  
  attendance: [
    {
      id: 1,
      userId: "EMP001",
      name: "Dr. Sarah Wilson",
      department: "Computer Science",
      role: "Professor",
      date: "2024-01-15",
      status: "present",
      timeIn: "08:45",
      timeOut: "17:30",
      totalHours: 8.75,
      method: "manual",
      markedBy: "Admin",
      remarks: ""
    },
    {
      id: 2,
      userId: "EMP002",
      name: "Prof. David Brown",
      department: "Mathematics",
      role: "Associate Professor",
      date: "2024-01-15",
      status: "present",
      timeIn: "09:00",
      timeOut: "17:00",
      totalHours: 8.0,
      method: "manual",
      markedBy: "Admin",
      remarks: ""
    },
    {
      id: 3,
      userId: "EMP003",
      name: "Dr. Maria Garcia",
      department: "Physics",
      role: "Assistant Professor",
      date: "2024-01-15",
      status: "late",
      timeIn: "09:45",
      timeOut: "18:00",
      totalHours: 8.25,
      method: "manual",
      markedBy: "Admin",
      remarks: "Traffic delay"
    },
    {
      id: 4,
      userId: "EMP004",
      name: "Prof. James Anderson",
      department: "Chemistry",
      role: "Professor",
      date: "2024-01-15",
      status: "absent",
      timeIn: null,
      timeOut: null,
      totalHours: 0,
      method: "manual",
      markedBy: "Admin",
      remarks: "Sick leave"
    },
    {
      id: 5,
      userId: "EMP005",
      name: "Dr. Lisa Chen",
      department: "Biology",
      role: "Lecturer",
      date: "2024-01-15",
      status: "present",
      timeIn: "08:30",
      timeOut: "16:30",
      totalHours: 8.0,
      method: "auto",
      markedBy: "System",
      remarks: ""
    },
    {
      id: 6,
      userId: "EMP006",
      name: "Prof. Robert Taylor",
      department: "Administration",
      role: "Administrative Staff",
      date: "2024-01-15",
      status: "half-day",
      timeIn: "08:00",
      timeOut: "12:30",
      totalHours: 4.5,
      method: "manual",
      markedBy: "Admin",
      remarks: "Medical appointment"
    },
    {
      id: 7,
      userId: "EMP007",
      name: "Dr. Emily Davis",
      department: "Engineering",
      role: "Support Staff",
      date: "2024-01-15",
      status: "present",
      timeIn: "09:15",
      timeOut: "17:45",
      totalHours: 8.5,
      method: "auto",
      markedBy: "System",
      remarks: ""
    },
    {
      id: 8,
      userId: "EMP008",
      name: "Prof. Michael Johnson",
      department: "Computer Science",
      role: "Professor",
      date: "2024-01-15",
      status: "excused",
      timeIn: null,
      timeOut: null,
      totalHours: 0,
      method: "manual",
      markedBy: "Admin",
      remarks: "Official duty"
    }
  ]
};

export const ATTENDANCE_STATUS = {
  present: {
    label: "attendance.status.present",
    color: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300",
    icon: CheckCircle
  },
  absent: {
    label: "attendance.status.absent",
    color: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-300",
    icon: XCircle
  },
  late: {
    label: "attendance.status.late",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300",
    icon: Clock
  },
  excused: {
    label: "attendance.status.excused",
    color: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300",
    icon: UserCog
  },
  "half-day": {
    label: "attendance.status.halfDay",
    color: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300",
    icon: AlertCircle
  },
  leave: {
    label: "attendance.status.leave",
    color: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/40 dark:text-gray-300",
    icon: Calendar
  }
};

export const ATTENDANCE_METHODS = {
  manual: {
    label: "attendance.method.manual",
    color: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
  },
  auto: {
    label: "attendance.method.auto",
    color: "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300"
  }
};
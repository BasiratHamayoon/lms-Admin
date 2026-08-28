import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  UserX,

} from 'lucide-react';

export const LEAVE_DATA = {
  stats: [
    {
      title: "leave.totalLeaves",
      value: "156",
      change: "+12%",
      icon: Calendar,
      color: "blue",
      route: "/leave"
    },
    {
      title: "leave.pendingLeaves",
      value: "24",
      change: "+3%",
      icon: Clock,
      color: "green",
      route: "/leave?status=pending"
    },
    {
      title: "leave.approvedLeaves",
      value: "125",
      change: "+8%",
      icon: CheckCircle,
      color: "purple",
      route: "/leave?status=approved"
    },
    {
      title: "leave.onLeave",
      value: "14",
      change: "+2%",
      icon: UserX,
      color: "teal",
      route: "/leave?status=approved&current=true"
    }
  ],
  
  leaves: [
    {
      id: 1,
      userId: "STU2024001",
      userName: "Ahmed Hassan",
      userRole: "student",
      leaveType: "sick",
      startDate: "2024-03-15",
      endDate: "2024-03-17",
      totalDays: 3,
      reason: "High fever and doctor's appointment",
      status: "approved",
      approvedBy: "Dr. Sarah Wilson",
      approvalDate: "2024-03-14",
      academicYear: "2023-2024",
      attachments: [],
      createdAt: "2024-03-13",
      avatar: "",
      grade: "5th Grade",
      class: "Class A"
    },
    {
      id: 2,
      userId: "EMP001",
      userName: "Dr. Sarah Wilson",
      userRole: "teacher",
      leaveType: "annual",
      startDate: "2024-03-20",
      endDate: "2024-03-25",
      totalDays: 6,
      reason: "Family vacation",
      status: "pending",
      academicYear: "2023-2024",
      attachments: [],
      createdAt: "2024-03-15",
      avatar: "",
      department: "Computer Science"
    },
    {
      id: 3,
      userId: "STU2024002",
      userName: "Sarah Johnson",
      userRole: "student",
      leaveType: "casual",
      startDate: "2024-03-18",
      endDate: "2024-03-18",
      totalDays: 1,
      reason: "Personal work",
      status: "rejected",
      approvedBy: "Admin",
      approvalDate: "2024-03-17",
      rejectReason: "Exceeds casual leave limit",
      academicYear: "2023-2024",
      attachments: [],
      createdAt: "2024-03-16",
      avatar: "",
      grade: "4th Grade",
      class: "Class B"
    },
    {
      id: 4,
      userId: "EMP002",
      userName: "Prof. David Brown",
      userRole: "teacher",
      leaveType: "sick",
      startDate: "2024-03-10",
      endDate: "2024-03-12",
      totalDays: 3,
      reason: "Medical procedure",
      status: "approved",
      approvedBy: "Admin",
      approvalDate: "2024-03-09",
      academicYear: "2023-2024",
      attachments: [
        { name: "medical_certificate.pdf", type: "pdf", size: 2048 }
      ],
      createdAt: "2024-03-08",
      avatar: "",
      department: "Mathematics"
    },
    {
      id: 5,
      userId: "STU2024003",
      userName: "Maria Garcia",
      userRole: "student",
      leaveType: "other",
      startDate: "2024-03-22",
      endDate: "2024-03-23",
      totalDays: 2,
      reason: "Religious festival",
      status: "pending",
      academicYear: "2023-2024",
      attachments: [],
      createdAt: "2024-03-20",
      avatar: "",
      grade: "6th Grade",
      class: "Class A"
    },
    {
      id: 6,
      userId: "EMP003",
      userName: "Dr. Lisa Chen",
      userRole: "teacher",
      leaveType: "casual",
      startDate: "2024-03-19",
      endDate: "2024-03-19",
      totalDays: 1,
      reason: "Personal appointment",
      status: "approved",
      approvedBy: "Dr. Sarah Wilson",
      approvalDate: "2024-03-18",
      academicYear: "2023-2024",
      attachments: [],
      createdAt: "2024-03-17",
      avatar: "",
      department: "Biology"
    },
    {
      id: 7,
      userId: "STU2024005",
      userName: "Lisa Chen",
      userRole: "student",
      leaveType: "annual",
      startDate: "2024-04-01",
      endDate: "2024-04-05",
      totalDays: 5,
      reason: "Family trip",
      status: "pending",
      academicYear: "2023-2024",
      attachments: [],
      createdAt: "2024-03-25",
      avatar: "",
      grade: "5th Grade",
      class: "Class B"
    },
    {
      id: 8,
      userId: "EMP007",
      userName: "Dr. Emily Davis",
      userRole: "staff",
      leaveType: "unpaid",
      startDate: "2024-03-28",
      endDate: "2024-04-02",
      totalDays: 6,
      reason: "Personal emergency",
      status: "approved",
      approvedBy: "Admin",
      approvalDate: "2024-03-27",
      academicYear: "2023-2024",
      attachments: [],
      createdAt: "2024-03-25",
      avatar: "",
      department: "Engineering"
    }
  ],
  
  leaveQuotas: [
    {
      id: 1,
      userId: "STU2024001",
      userName: "Ahmed Hassan",
      userRole: "student",
      academicYear: "2023-2024",
      quotas: {
        sick: { total: 10, used: 3, pending: 0, available: 7 },
        casual: { total: 8, used: 2, pending: 1, available: 5 },
        annual: { total: 15, used: 5, pending: 0, available: 10 }
      },
      updatedBy: "Admin",
      updatedAt: "2024-03-15"
    },
    {
      id: 2,
      userId: "EMP001",
      userName: "Dr. Sarah Wilson",
      userRole: "teacher",
      academicYear: "2023-2024",
      quotas: {
        sick: { total: 12, used: 2, pending: 0, available: 10 },
        casual: { total: 10, used: 3, pending: 1, available: 6 },
        annual: { total: 20, used: 8, pending: 6, available: 6 }
      },
      updatedBy: "Admin",
      updatedAt: "2024-03-10"
    },
    {
      id: 3,
      userId: "STU2024002",
      userName: "Sarah Johnson",
      userRole: "student",
      academicYear: "2023-2024",
      quotas: {
        sick: { total: 10, used: 1, pending: 0, available: 9 },
        casual: { total: 8, used: 4, pending: 0, available: 4 },
        annual: { total: 15, used: 3, pending: 0, available: 12 }
      },
      updatedBy: "Admin",
      updatedAt: "2024-03-05"
    }
  ],
  
  chartData: {
    leaveDistribution: [
      { month: 'Jan', approved: 12, pending: 4, rejected: 2 },
      { month: 'Feb', approved: 15, pending: 3, rejected: 1 },
      { month: 'Mar', approved: 18, pending: 6, rejected: 3 },
      { month: 'Apr', approved: 14, pending: 5, rejected: 2 },
      { month: 'May', approved: 16, pending: 4, rejected: 1 },
      { month: 'Jun', approved: 20, pending: 3, rejected: 2 }
    ],
    typeDistribution: [
      { name: 'Sick Leave', value: 35, color: '#8b5cf6' },
      { name: 'Casual Leave', value: 25, color: '#3b82f6' },
      { name: 'Annual Leave', value: 30, color: '#10b981' },
      { name: 'Unpaid Leave', value: 5, color: '#6b7280' },
      { name: 'Other Leave', value: 5, color: '#f59e0b' }
    ]
  },
  
  academicYears: [
    '2022-2023',
    '2023-2024',
    '2024-2025'
  ],
  
  leaveTypes: [
    'sick',
    'casual',
    'annual',
    'unpaid',
    'other'
  ]
};

export const LEAVE_QUOTA_DATA = {
  defaultQuotas: {
    student: {
      sick: { total: 10, used: 0, pending: 0 },
      casual: { total: 8, used: 0, pending: 0 },
      annual: { total: 15, used: 0, pending: 0 }
    },
    teacher: {
      sick: { total: 12, used: 0, pending: 0 },
      casual: { total: 10, used: 0, pending: 0 },
      annual: { total: 20, used: 0, pending: 0 }
    },
    staff: {
      sick: { total: 10, used: 0, pending: 0 },
      casual: { total: 8, used: 0, pending: 0 },
      annual: { total: 15, used: 0, pending: 0 }
    },
    admin: {
      sick: { total: 15, used: 0, pending: 0 },
      casual: { total: 12, used: 0, pending: 0 },
      annual: { total: 25, used: 0, pending: 0 }
    }
  }
};
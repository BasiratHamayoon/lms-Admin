// performanceData.js
import { 
  Star, 
  Users, 
  BarChart3,
  Clock,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
} from 'lucide-react';

export const PERFORMANCE_DATA = {
  stats: [
    {
      title: "performance.totalReviews",
      value: "156",
      change: "+8%",
      icon: BarChart3,
      color: "blue",
      route: "/performance"
    },
    {
      title: "performance.avgRating",
      value: "4.2",
      change: "+0.3",
      icon: Star,
      color: "green",
      route: "/performance"
    },
    {
      title: "performance.staffReviewed",
      value: "84",
      change: "+12%",
      icon: Users,
      color: "purple",
      route: "/performance"
    },
    {
      title: "performance.pendingReviews",
      value: "24",
      change: "-3%",
      icon: Clock,
      color: "teal",
      route: "/performance?status=pending"
    }
  ],
  
  performanceRecords: [
    {
      id: 1,
      userId: "EMP001",
      userName: "Dr. Sarah Wilson",
      userRole: "teacher",
      department: "Computer Science",
      reviewPeriod: {
        startDate: "2024-01-01",
        endDate: "2024-03-31"
      },
      reviewType: "quarterly",
      reviewer: "EMP009",
      reviewerName: "Dr. James Miller",
      ratings: {
        teachingQuality: 4.5,
        punctuality: 4.8,
        classroomManagement: 4.2,
        teamwork: 4.0,
        communication: 4.6,
        initiative: 4.3,
        professionalDevelopment: 4.7,
        overallRating: 4.4
      },
      achievements: [
        {
          description: "Successfully implemented new teaching methodology",
          date: "2024-02-15"
        },
        {
          description: "Published research paper in international journal",
          date: "2024-03-10"
        }
      ],
      areasOfImprovement: [
        {
          description: "Time management in classroom activities",
          actionPlan: "Implement stricter time tracking"
        }
      ],
      reviewerComments: "Excellent performance this quarter. Shows great initiative in implementing new teaching methods.",
      employeeComments: "Thank you for the feedback. Will work on time management.",
      status: "finalized",
      acknowledgementDate: "2024-04-05",
      attachments: [],
      position: "Senior Lecturer",
      createdAt: "2024-04-01",
      avatar: ""
    },
    {
      id: 2,
      userId: "EMP002",
      userName: "Prof. David Brown",
      userRole: "teacher",
      department: "Mathematics",
      reviewPeriod: {
        startDate: "2024-01-01",
        endDate: "2024-03-31"
      },
      reviewType: "quarterly",
      reviewer: "EMP009",
      reviewerName: "Dr. James Miller",
      ratings: {
        teachingQuality: 3.8,
        punctuality: 4.5,
        classroomManagement: 3.5,
        teamwork: 4.2,
        communication: 3.9,
        initiative: 4.0,
        professionalDevelopment: 3.7,
        overallRating: 3.9
      },
      achievements: [
        {
          description: "Improved student engagement scores by 15%",
          date: "2024-02-28"
        }
      ],
      areasOfImprovement: [
        {
          description: "Classroom management needs improvement",
          actionPlan: "Attend classroom management workshop"
        }
      ],
      reviewerComments: "Good progress shown. Need to focus on classroom management skills.",
      employeeComments: "Will work on improving classroom management.",
      status: "acknowledged",
      acknowledgementDate: "2024-04-03",
      attachments: [
        { name: "classroom_analysis.pdf", type: "pdf", size: 2048 }
      ],
      position: "Associate Professor",
      createdAt: "2024-03-28",
      avatar: ""
    },
    {
      id: 3,
      userId: "EMP003",
      userName: "Dr. Lisa Chen",
      userRole: "teacher",
      department: "Biology",
      reviewPeriod: {
        startDate: "2023-10-01",
        endDate: "2024-03-31"
      },
      reviewType: "half-yearly",
      reviewer: "EMP009",
      reviewerName: "Dr. James Miller",
      ratings: {
        teachingQuality: 4.7,
        punctuality: 4.9,
        classroomManagement: 4.5,
        teamwork: 4.8,
        communication: 4.6,
        initiative: 4.7,
        professionalDevelopment: 4.9,
        overallRating: 4.7
      },
      achievements: [
        {
          description: "Led successful research project with students",
          date: "2024-01-20"
        },
        {
          description: "Received 'Teacher of the Year' award",
          date: "2024-03-05"
        }
      ],
      areasOfImprovement: [],
      reviewerComments: "Outstanding performance. Consistently exceeds expectations.",
      employeeComments: "Thank you for the recognition.",
      status: "finalized",
      acknowledgementDate: "2024-04-10",
      attachments: [
        { name: "research_project_report.pdf", type: "pdf", size: 5120 },
        { name: "award_certificate.jpg", type: "image", size: 1024 }
      ],
      position: "Professor",
      createdAt: "2024-03-25",
      avatar: ""
    },
    {
      id: 4,
      userId: "EMP005",
      userName: "Prof. Michael Johnson",
      userRole: "teacher",
      department: "Physics",
      reviewPeriod: {
        startDate: "2024-01-01",
        endDate: "2024-03-31"
      },
      reviewType: "quarterly",
      reviewer: "EMP009",
      reviewerName: "Dr. James Miller",
      ratings: {
        teachingQuality: 4.0,
        punctuality: 4.2,
        classroomManagement: 3.8,
        teamwork: 4.1,
        communication: 3.9,
        initiative: 4.0,
        professionalDevelopment: 4.3,
        overallRating: 4.0
      },
      achievements: [
        {
          description: "Developed new laboratory experiments",
          date: "2024-03-15"
        }
      ],
      areasOfImprovement: [
        {
          description: "Student feedback indicates need for clearer explanations",
          actionPlan: "Attend communication skills workshop"
        }
      ],
      reviewerComments: "Solid performance. Room for improvement in communication.",
      employeeComments: null,
      status: "draft",
      acknowledgementDate: null,
      attachments: [],
      position: "Assistant Professor",
      createdAt: "2024-03-30",
      avatar: ""
    },
    {
      id: 5,
      userId: "EMP012",
      userName: "Ms. Rachel Adams",
      userRole: "teacher",
      department: "Languages",
      reviewPeriod: {
        startDate: "2023-07-01",
        endDate: "2024-06-30"
      },
      reviewType: "annual",
      reviewer: "EMP009",
      reviewerName: "Dr. James Miller",
      ratings: {
        teachingQuality: 4.6,
        punctuality: 4.7,
        classroomManagement: 4.4,
        teamwork: 4.8,
        communication: 4.9,
        initiative: 4.5,
        professionalDevelopment: 4.6,
        overallRating: 4.6
      },
      achievements: [
        {
          description: "Increased student language proficiency by 25%",
          date: "2024-01-15"
        },
        {
          description: "Organized successful language immersion program",
          date: "2024-03-20"
        }
      ],
      areasOfImprovement: [],
      reviewerComments: "Exceptional annual performance. Great team player.",
      employeeComments: "Thank you. Looking forward to next year's challenges.",
      status: "finalized",
      acknowledgementDate: "2024-07-05",
      attachments: [
        { name: "language_proficiency_report.pdf", type: "pdf", size: 3072 }
      ],
      position: "Senior Language Instructor",
      createdAt: "2024-06-25",
      avatar: ""
    },
    {
      id: 6,
      userId: "EMP004",
      userName: "Dr. Alex Turner",
      userRole: "teacher",
      department: "Chemistry",
      reviewPeriod: {
        startDate: "2024-03-01",
        endDate: "2024-03-31"
      },
      reviewType: "probation",
      reviewer: "EMP009",
      reviewerName: "Dr. James Miller",
      ratings: {
        teachingQuality: 3.5,
        punctuality: 4.0,
        classroomManagement: 3.2,
        teamwork: 3.8,
        communication: 3.6,
        initiative: 3.9,
        professionalDevelopment: 4.1,
        overallRating: 3.7
      },
      achievements: [
        {
          description: "Successfully completed probation period",
          date: "2024-03-31"
        }
      ],
      areasOfImprovement: [
        {
          description: "Classroom management needs significant improvement",
          actionPlan: "Weekly mentoring sessions for 2 months"
        },
        {
          description: "Need to adapt teaching style to student needs",
          actionPlan: "Attend student-centered teaching workshop"
        }
      ],
      reviewerComments: "Satisfactory probation completion. Areas identified for growth.",
      employeeComments: "Thank you for the guidance. Will work on improvements.",
      status: "finalized",
      acknowledgementDate: "2024-04-02",
      attachments: [],
      position: "Junior Lecturer",
      createdAt: "2024-03-29",
      avatar: ""
    }
  ],
  
  chartData: {
    monthlyTrend: [
      { month: 'Jan', avgRating: 4.1, reviews: 15 },
      { month: 'Feb', avgRating: 4.2, reviews: 18 },
      { month: 'Mar', avgRating: 4.4, reviews: 22 },
      { month: 'Apr', avgRating: 4.3, reviews: 20 },
      { month: 'May', avgRating: 4.5, reviews: 25 },
      { month: 'Jun', avgRating: 4.6, reviews: 28 }
    ],
    ratingDistribution: [
      { rating: '5 Stars', count: 45, color: '#10b981' },
      { rating: '4 Stars', count: 68, color: '#3b82f6' },
      { rating: '3 Stars', count: 32, color: '#f59e0b' },
      { rating: '2 Stars', count: 8, color: '#ef4444' },
      { rating: '1 Star', count: 3, color: '#dc2626' }
    ],
    departmentPerformance: [
      { department: 'Computer Science', avgRating: 4.5, reviews: 24 },
      { department: 'Mathematics', avgRating: 4.2, reviews: 18 },
      { department: 'Biology', avgRating: 4.7, reviews: 22 },
      { department: 'Physics', avgRating: 4.1, reviews: 16 },
      { department: 'Chemistry', avgRating: 4.0, reviews: 15 },
      { department: 'Languages', avgRating: 4.6, reviews: 20 },
      { department: 'Administration', avgRating: 4.3, reviews: 12 }
    ],
    reviewTypeDistribution: [
      { type: 'Quarterly', count: 85, color: '#3b82f6' },
      { type: 'Half-Yearly', count: 35, color: '#8b5cf6' },
      { type: 'Annual', count: 28, color: '#10b981' },
      { type: 'Probation', count: 12, color: '#f59e0b' },
      { type: 'Special', count: 6, color: '#ec4899' }
    ]
  },
  
  kpiData: {
    averages: {
      overallRating: 4.2,
      teachingQuality: 4.3,
      punctuality: 4.6,
      classroomManagement: 4.1,
      teamwork: 4.4,
      communication: 4.3,
      initiative: 4.2,
      professionalDevelopment: 4.3
    },
    feedbackCount: 142,
    totalKPIs: 156
  }
};
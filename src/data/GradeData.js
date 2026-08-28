import { 
  BookOpen, 
  TrendingUp, 
  Users,
  Award,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  BarChart
} from 'lucide-react';

export const GRADE_DATA = {
  stats: [
    {
      title: "grade.totalStudents",
      value: "245",
      change: "+12%",
      icon: Users,
      color: "blue" 
    },
    {
      title: "grade.averageGrade",
      value: "B+",
      change: "+0.5",
      icon: TrendingUp,
      color: "green" 
    },
    {
      title: "grade.passingRate",
      value: "92%",
      change: "+3%",
      icon: CheckCircle,
      color: "purple" 
    },
    {
      title: "grade.failingRate",
      value: "8%",
      change: "-2%",
      icon: AlertCircle,
      color: "teal" 
    }
  ],
  grades: [
    {
      id: 1,
      student: {
        id: 1001,
        studentId: "STU-2024-001",
        name: "Ahmed Ali",
        class: "Grade 10-A"
      },
      course: {
        id: 201,
        code: "MATH-101",
        name: "Mathematics",
        instructor: "Dr. Sarah Wilson"
      },
      academicYear: "2024-2025",
      term: "first",
      assessments: [
        {
          id: 1,
          name: "Midterm Exam",
          type: "exam",
          maxMarks: 100,
          obtainedMarks: 85,
          percentage: 85,
          date: "2024-10-15",
          remarks: "Excellent work",
          gradedBy: "Dr. Sarah Wilson",
          assessmentId: null,
          assessmentModel: null
        },
        {
          id: 2,
          name: "Chapter 1 Quiz",
          type: "quiz",
          maxMarks: 20,
          obtainedMarks: 18,
          percentage: 90,
          date: "2024-10-05",
          remarks: "Good understanding",
          gradedBy: "Dr. Sarah Wilson",
          assessmentId: null,
          assessmentModel: null
        },
        {
          id: 3,
          name: "Algebra Assignment",
          type: "assignment",
          maxMarks: 50,
          obtainedMarks: 45,
          percentage: 90,
          date: "2024-10-10",
          remarks: "Well structured",
          gradedBy: "Dr. Sarah Wilson",
          assessmentId: null,
          assessmentModel: null
        }
      ],
      totalMarks: 170,
      obtainedMarks: 148,
      percentage: 87.06,
      grade: "B+",
      status: "published",
      teacherRemarks: "Student shows excellent progress in algebra. Needs to work on geometry concepts.",
      createdBy: "Dr. Sarah Wilson",
      createdAt: "2024-10-20T10:30:00Z",
      attendance: {
        totalClasses: 30,
        attended: 28,
        percentage: 93.33
      }
    },
    {
      id: 2,
      student: {
        id: 1002,
        studentId: "STU-2024-002",
        name: "Fatima Khan",
        class: "Grade 10-A"
      },
      course: {
        id: 202,
        code: "SCI-101",
        name: "Science",
        instructor: "Prof. David Brown"
      },
      academicYear: "2024-2025",
      term: "first",
      assessments: [
        {
          id: 4,
          name: "Midterm Exam",
          type: "exam",
          maxMarks: 100,
          obtainedMarks: 92,
          percentage: 92,
          date: "2024-10-16",
          remarks: "Outstanding performance",
          gradedBy: "Prof. David Brown",
          assessmentId: null,
          assessmentModel: null
        },
        {
          id: 5,
          name: "Lab Report",
          type: "practical",
          maxMarks: 30,
          obtainedMarks: 28,
          percentage: 93.33,
          date: "2024-10-08",
          remarks: "Detailed analysis",
          gradedBy: "Prof. David Brown",
          assessmentId: null,
          assessmentModel: null
        }
      ],
      totalMarks: 130,
      obtainedMarks: 120,
      percentage: 92.31,
      grade: "A",
      status: "published",
      teacherRemarks: "Excellent scientific approach and analytical skills.",
      createdBy: "Prof. David Brown",
      createdAt: "2024-10-18T14:20:00Z",
      attendance: {
        totalClasses: 28,
        attended: 26,
        percentage: 92.86
      }
    },
    {
      id: 3,
      student: {
        id: 1003,
        studentId: "STU-2024-003",
        name: "Omar Hassan",
        class: "Grade 10-B"
      },
      course: {
        id: 201,
        code: "MATH-101",
        name: "Mathematics",
        instructor: "Dr. Sarah Wilson"
      },
      academicYear: "2024-2025",
      term: "first",
      assessments: [
        {
          id: 6,
          name: "Midterm Exam",
          type: "exam",
          maxMarks: 100,
          obtainedMarks: 72,
          percentage: 72,
          date: "2024-10-15",
          remarks: "Average performance",
          gradedBy: "Dr. Sarah Wilson",
          assessmentId: null,
          assessmentModel: null
        }
      ],
      totalMarks: 100,
      obtainedMarks: 72,
      percentage: 72,
      grade: "C",
      status: "draft",
      teacherRemarks: "Needs more practice in solving equations.",
      createdBy: "Dr. Sarah Wilson",
      createdAt: "2024-10-17T09:15:00Z",
      attendance: {
        totalClasses: 30,
        attended: 25,
        percentage: 83.33
      }
    },
    {
      id: 4,
      student: {
        id: 1004,
        studentId: "STU-2024-004",
        name: "Layla Mohammed",
        class: "Grade 10-B"
      },
      course: {
        id: 203,
        code: "ENG-101",
        name: "English",
        instructor: "Dr. Maria Garcia"
      },
      academicYear: "2024-2025",
      term: "first",
      assessments: [
        {
          id: 7,
          name: "Essay Assignment",
          type: "assignment",
          maxMarks: 50,
          obtainedMarks: 48,
          percentage: 96,
          date: "2024-10-12",
          remarks: "Excellent writing skills",
          gradedBy: "Dr. Maria Garcia",
          assessmentId: null,
          assessmentModel: null
        },
        {
          id: 8,
          name: "Vocabulary Quiz",
          type: "quiz",
          maxMarks: 30,
          obtainedMarks: 27,
          percentage: 90,
          date: "2024-10-06",
          remarks: "Good vocabulary retention",
          gradedBy: "Dr. Maria Garcia",
          assessmentId: null,
          assessmentModel: null
        }
      ],
      totalMarks: 80,
      obtainedMarks: 75,
      percentage: 93.75,
      grade: "A",
      status: "published",
      teacherRemarks: "Exceptional writing and comprehension skills.",
      createdBy: "Dr. Maria Garcia",
      createdAt: "2024-10-19T11:45:00Z",
      attendance: {
        totalClasses: 32,
        attended: 31,
        percentage: 96.88
      }
    },
    {
      id: 5,
      student: {
        id: 1005,
        studentId: "STU-2024-005",
        name: "Khalid Ahmed",
        class: "Grade 10-A"
      },
      course: {
        id: 204,
        code: "HIS-101",
        name: "History",
        instructor: "Prof. James Anderson"
      },
      academicYear: "2024-2025",
      term: "first",
      assessments: [
        {
          id: 9,
          name: "Midterm Exam",
          type: "exam",
          maxMarks: 100,
          obtainedMarks: 65,
          percentage: 65,
          date: "2024-10-18",
          remarks: "Needs improvement",
          gradedBy: "Prof. James Anderson",
          assessmentId: null,
          assessmentModel: null
        }
      ],
      totalMarks: 100,
      obtainedMarks: 65,
      percentage: 65,
      grade: "D",
      status: "published",
      teacherRemarks: "Requires more focus on historical dates and events.",
      createdBy: "Prof. James Anderson",
      createdAt: "2024-10-20T16:10:00Z",
      attendance: {
        totalClasses: 29,
        attended: 24,
        percentage: 82.76
      }
    },
    {
      id: 6,
      student: {
        id: 1006,
        studentId: "STU-2024-006",
        name: "Sara Abdullah",
        class: "Grade 10-B"
      },
      course: {
        id: 202,
        code: "SCI-101",
        name: "Science",
        instructor: "Prof. David Brown"
      },
      academicYear: "2024-2025",
      term: "first",
      assessments: [
        {
          id: 10,
          name: "Midterm Exam",
          type: "exam",
          maxMarks: 100,
          obtainedMarks: 88,
          percentage: 88,
          date: "2024-10-16",
          remarks: "Very good",
          gradedBy: "Prof. David Brown",
          assessmentId: null,
          assessmentModel: null
        }
      ],
      totalMarks: 100,
      obtainedMarks: 88,
      percentage: 88,
      grade: "B+",
      status: "draft",
      teacherRemarks: "Shows strong understanding of scientific concepts.",
      createdBy: "Prof. David Brown",
      createdAt: "2024-10-19T13:30:00Z",
      attendance: {
        totalClasses: 28,
        attended: 27,
        percentage: 96.43
      }
    },
    {
      id: 7,
      student: {
        id: 1007,
        studentId: "STU-2024-007",
        name: "Yousef Omar",
        class: "Grade 10-A"
      },
      course: {
        id: 205,
        code: "ARB-101",
        name: "Arabic",
        instructor: "Prof. Michael Johnson"
      },
      academicYear: "2024-2025",
      term: "first",
      assessments: [
        {
          id: 11,
          name: "Grammar Test",
          type: "quiz",
          maxMarks: 40,
          obtainedMarks: 35,
          percentage: 87.5,
          date: "2024-10-09",
          remarks: "Good grammar skills",
          gradedBy: "Prof. Michael Johnson",
          assessmentId: null,
          assessmentModel: null
        },
        {
          id: 12,
          name: "Reading Assignment",
          type: "assignment",
          maxMarks: 60,
          obtainedMarks: 52,
          percentage: 86.67,
          date: "2024-10-14",
          remarks: "Excellent comprehension",
          gradedBy: "Prof. Michael Johnson",
          assessmentId: null,
          assessmentModel: null
        }
      ],
      totalMarks: 100,
      obtainedMarks: 87,
      percentage: 87,
      grade: "B+",
      status: "published",
      teacherRemarks: "Strong in reading comprehension, needs work on writing.",
      createdBy: "Prof. Michael Johnson",
      createdAt: "2024-10-18T15:40:00Z",
      attendance: {
        totalClasses: 30,
        attended: 28,
        percentage: 93.33
      }
    },
    {
      id: 8,
      student: {
        id: 1008,
        studentId: "STU-2024-008",
        name: "Noura Khalid",
        class: "Grade 10-B"
      },
      course: {
        id: 206,
        code: "ART-101",
        name: "Art",
        instructor: "Dr. Emily Davis"
      },
      academicYear: "2024-2025",
      term: "first",
      assessments: [
        {
          id: 13,
          name: "Painting Project",
          type: "project",
          maxMarks: 100,
          obtainedMarks: 95,
          percentage: 95,
          date: "2024-10-13",
          remarks: "Excellent creativity",
          gradedBy: "Dr. Emily Davis",
          assessmentId: null,
          assessmentModel: null
        }
      ],
      totalMarks: 100,
      obtainedMarks: 95,
      percentage: 95,
      grade: "A+",
      status: "published",
      teacherRemarks: "Exceptional artistic talent and creativity.",
      createdBy: "Dr. Emily Davis",
      createdAt: "2024-10-20T12:15:00Z",
      attendance: {
        totalClasses: 25,
        attended: 24,
        percentage: 96
      }
    }
  ],
  courses: [
    {
      id: 201,
      code: "MATH-101",
      name: "Mathematics",
      instructor: "Dr. Sarah Wilson",
      department: "Mathematics"
    },
    {
      id: 202,
      code: "SCI-101",
      name: "Science",
      instructor: "Prof. David Brown",
      department: "Science"
    },
    {
      id: 203,
      code: "ENG-101",
      name: "English",
      instructor: "Dr. Maria Garcia",
      department: "Languages"
    },
    {
      id: 204,
      code: "HIS-101",
      name: "History",
      instructor: "Prof. James Anderson",
      department: "Social Studies"
    },
    {
      id: 205,
      code: "ARB-101",
      name: "Arabic",
      instructor: "Prof. Michael Johnson",
      department: "Languages"
    },
    {
      id: 206,
      code: "ART-101",
      name: "Art",
      instructor: "Dr. Emily Davis",
      department: "Arts"
    }
  ],
  classes: [
    { id: 1, name: "Grade 10-A", level: "Grade 10", section: "A" },
    { id: 2, name: "Grade 10-B", level: "Grade 10", section: "B" },
    { id: 3, name: "Grade 11-A", level: "Grade 11", section: "A" },
    { id: 4, name: "Grade 11-B", level: "Grade 11", section: "B" },
    { id: 5, name: "Grade 12-A", level: "Grade 12", section: "A" },
    { id: 6, name: "Grade 12-B", level: "Grade 12", section: "B" }
  ],
  students: [
    { id: 1001, studentId: "STU-2024-001", name: "Ahmed Ali", class: "Grade 10-A" },
    { id: 1002, studentId: "STU-2024-002", name: "Fatima Khan", class: "Grade 10-A" },
    { id: 1003, studentId: "STU-2024-003", name: "Omar Hassan", class: "Grade 10-B" },
    { id: 1004, studentId: "STU-2024-004", name: "Layla Mohammed", class: "Grade 10-B" },
    { id: 1005, studentId: "STU-2024-005", name: "Khalid Ahmed", class: "Grade 10-A" },
    { id: 1006, studentId: "STU-2024-006", name: "Sara Abdullah", class: "Grade 10-B" },
    { id: 1007, studentId: "STU-2024-007", name: "Yousef Omar", class: "Grade 10-A" },
    { id: 1008, studentId: "STU-2024-008", name: "Noura Khalid", class: "Grade 10-B" }
  ],
  assessmentTypes: [
    { value: "exam", label: "Exam" },
    { value: "quiz", label: "Quiz" },
    { value: "assignment", label: "Assignment" },
    { value: "project", label: "Project" },
    { value: "practical", label: "Practical" },
    { value: "other", label: "Other" }
  ],
  terms: [
    { value: "first", label: "First Term" },
    { value: "second", label: "Second Term" },
    { value: "third", label: "Third Term" },
    { value: "fourth", label: "Fourth Term" },
    { value: "final", label: "Final Term" }
  ],
  gradeStatuses: [
    { value: "draft", label: "Draft" },
    { value: "published", label: "Published" },
    { value: "archived", label: "Archived" }
  ]
};
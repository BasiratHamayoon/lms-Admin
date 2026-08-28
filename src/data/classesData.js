// src/data/classesData.js
import { 
  Users, 
  UserCheck, 
  BookOpen, 
  Calendar,
  Clock,
  Building
} from 'lucide-react';

export const CLASSES_DATA = {
  stats: [
    {
      title: "classes.totalClasses",
      value: "42",
      change: "+5%",
      icon: Building,
      color: "blue" 
    },
    {
      title: "classes.activeClasses",
      value: "38",
      change: "+3%",
      icon: UserCheck,
      color: "green" 
    },
    {
      title: "classes.totalStudents",
      value: "1,247",
      change: "+8%",
      icon: Users,
      color: "purple" 
    },
    {
      title: "classes.classesThisSemester",
      value: "15",
      change: "+12%",
      icon: Calendar,
      color: "teal" 
    }
  ],
  
  classes: [
    {
      id: 1,
      name: "Mathematics 101",
      section: "A",
      courseId: 1,
      course: {
        _id: 1,
        name: "Mathematics 101",
        code: "MATH101"
      },
      teacherId: 1,
      teacher: {
        _id: 1,
        id: "T001",
        name: "Dr. Ahmed Hassan"
      },
      students: [101, 102, 103, 104, 105],
      studentsCount: 5,
      startTime: "2024-01-15T08:00:00",
      endTime: "2024-01-15T09:30:00",
      days: ["Monday", "Wednesday", "Friday"],
      academicYear: "2024-2025",
      semester: "Spring",
      active: true,
      createdAt: "2024-01-10",
      updatedAt: "2024-01-10"
    },
    {
      id: 2,
      name: "Physics 201",
      section: "B",
      courseId: 2,
      course: {
        _id: 2,
        name: "Physics 201",
        code: "PHY201"
      },
      teacherId: 2,
      teacher: {
        _id: 2,
        id: "T002",
        name: "Prof. Sarah Johnson"
      },
      students: [106, 107, 108, 109],
      studentsCount: 4,
      startTime: "2024-01-15T10:00:00",
      endTime: "2024-01-15T11:30:00",
      days: ["Tuesday", "Thursday"],
      academicYear: "2024-2025",
      semester: "Spring",
      active: true,
      createdAt: "2024-01-12",
      updatedAt: "2024-01-12"
    },
    {
      id: 3,
      name: "Computer Science 301",
      section: "C",
      courseId: 3,
      course: {
        _id: 3,
        name: "Computer Science 301",
        code: "CS301"
      },
      teacherId: 3,
      teacher: {
        _id: 3,
        id: "T003",
        name: "Dr. Maria Garcia"
      },
      students: [110, 111, 112, 113, 114, 115],
      studentsCount: 6,
      startTime: "2024-01-15T13:00:00",
      endTime: "2024-01-15T14:30:00",
      days: ["Monday", "Wednesday"],
      academicYear: "2024-2025",
      semester: "Spring",
      active: true,
      createdAt: "2024-01-08",
      updatedAt: "2024-01-08"
    },
    {
      id: 4,
      name: "English Literature",
      section: "D",
      courseId: 4,
      course: {
        _id: 4,
        name: "English Literature",
        code: "ENG201"
      },
      teacherId: 4,
      teacher: {
        _id: 4,
        id: "T004",
        name: "Mr. James Wilson"
      },
      students: [116, 117, 118],
      studentsCount: 3,
      startTime: "2024-01-16T09:00:00",
      endTime: "2024-01-16T10:30:00",
      days: ["Tuesday", "Thursday"],
      academicYear: "2024-2025",
      semester: "Spring",
      active: true,
      createdAt: "2024-01-05",
      updatedAt: "2024-01-05"
    },
    {
      id: 5,
      name: "Chemistry Lab",
      section: "A",
      courseId: 5,
      course: {
        _id: 5,
        name: "Chemistry Lab",
        code: "CHEM101L"
      },
      teacherId: 5,
      teacher: {
        _id: 5,
        id: "T005",
        name: "Dr. Lisa Chen"
      },
      students: [119, 120, 121, 122],
      studentsCount: 4,
      startTime: "2024-01-16T14:00:00",
      endTime: "2024-01-16T16:00:00",
      days: ["Wednesday"],
      academicYear: "2024-2025",
      semester: "Spring",
      active: true,
      createdAt: "2024-01-03",
      updatedAt: "2024-01-03"
    },
    {
      id: 6,
      name: "History 101",
      section: "B",
      courseId: 6,
      course: {
        _id: 6,
        name: "History 101",
        code: "HIS101"
      },
      teacherId: 6,
      teacher: {
        _id: 6,
        id: "T006",
        name: "Prof. Michael Brown"
      },
      students: [123, 124, 125, 126, 127],
      studentsCount: 5,
      startTime: "2024-01-17T11:00:00",
      endTime: "2024-01-17T12:30:00",
      days: ["Monday", "Friday"],
      academicYear: "2024-2025",
      semester: "Spring",
      active: false,
      createdAt: "2023-12-15",
      updatedAt: "2023-12-15"
    },
    {
      id: 7,
      name: "Art Studio",
      section: "A",
      courseId: 7,
      course: {
        _id: 7,
        name: "Art Studio",
        code: "ART201"
      },
      teacherId: 7,
      teacher: {
        _id: 7,
        id: "T007",
        name: "Ms. Emily Davis"
      },
      students: [128, 129, 130],
      studentsCount: 3,
      startTime: "2024-01-18T13:00:00",
      endTime: "2024-01-18T15:00:00",
      days: ["Thursday"],
      academicYear: "2024-2025",
      semester: "Spring",
      active: true,
      createdAt: "2024-01-02",
      updatedAt: "2024-01-02"
    },
    {
      id: 8,
      name: "Physical Education",
      section: "All",
      courseId: 8,
      course: {
        _id: 8,
        name: "Physical Education",
        code: "PE101"
      },
      teacherId: 8,
      teacher: {
        _id: 8,
        id: "T008",
        name: "Coach Robert Taylor"
      },
      students: [131, 132, 133, 134, 135, 136, 137, 138],
      studentsCount: 8,
      startTime: "2024-01-19T08:30:00",
      endTime: "2024-01-19T10:00:00",
      days: ["Monday", "Wednesday"],
      academicYear: "2024-2025",
      semester: "Spring",
      active: true,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01"
    }
  ]
};

// Sample courses for dropdown
export const SAMPLE_COURSES = [
  { id: 1, name: "Mathematics 101", code: "MATH101" },
  { id: 2, name: "Physics 201", code: "PHY201" },
  { id: 3, name: "Computer Science 301", code: "CS301" },
  { id: 4, name: "English Literature", code: "ENG201" },
  { id: 5, name: "Chemistry Lab", code: "CHEM101L" },
  { id: 6, name: "History 101", code: "HIS101" },
  { id: 7, name: "Art Studio", code: "ART201" },
  { id: 8, name: "Physical Education", code: "PE101" }
];

// Sample teachers for dropdown
export const SAMPLE_TEACHERS = [
  { id: 1, name: "Dr. Ahmed Hassan", email: "ahmed.hassan@school.edu" },
  { id: 2, name: "Prof. Sarah Johnson", email: "sarah.johnson@school.edu" },
  { id: 3, name: "Dr. Maria Garcia", email: "maria.garcia@school.edu" },
  { id: 4, name: "Mr. James Wilson", email: "james.wilson@school.edu" },
  { id: 5, name: "Dr. Lisa Chen", email: "lisa.chen@school.edu" },
  { id: 6, name: "Prof. Michael Brown", email: "michael.brown@school.edu" },
  { id: 7, name: "Ms. Emily Davis", email: "emily.davis@school.edu" },
  { id: 8, name: "Coach Robert Taylor", email: "robert.taylor@school.edu" }
];
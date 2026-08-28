import { 
  BookOpen, 
  Users, 
  Clock, 
  Award,
  PlayCircle
} from 'lucide-react';

export const COURSES_DATA = {
  stats: [
    {
      title: "courses.totalCourses",
      value: "24",
      change: "+8%",
      icon: BookOpen,
      color: "purple" 
    },
    {
      title: "courses.activeCourses",
      value: "18",
      change: "+5%",
      icon: PlayCircle,
      color: "green" 
    },
    {
      title: "courses.totalEnrollments",
      value: "842",
      change: "+12%",
      icon: Users,
      color: "blue" 
    },
    {
      title: "courses.completionRate",
      value: "82.3%",
      change: "+2.5%",
      icon: Award,
      color: "teal" 
    }
  ],
  courses: [
    {
      id: 1,
      name: "Mathematics - Grade 5",
      category: "Mathematics",
      grade: "5th Grade",
      instructor: "Sarah Johnson",
      enrolledStudents: 45,
      status: "active"
    },
    {
      id: 2,
      name: "English Language Arts",
      category: "Languages",
      grade: "4th Grade",
      instructor: "Michael Brown",
      enrolledStudents: 42,
      status: "active"
    },
    {
      id: 3,
      name: "Science - Living Things",
      category: "Science",
      grade: "6th Grade",
      instructor: "Robert Wilson",
      enrolledStudents: 38,
      status: "active"
    },
    {
      id: 4,
      name: "Art & Creativity",
      category: "Arts",
      grade: "3rd Grade",
      instructor: "Lisa Chen",
      enrolledStudents: 28,
      status: "active"
    },
    {
      id: 5,
      name: "Physical Education",
      category: "Sports",
      grade: "2nd Grade",
      instructor: "David Lee",
      enrolledStudents: 35,
      status: "upcoming"
    },
    {
      id: 6,
      name: "Computer Basics",
      category: "Computer Studies",
      grade: "5th Grade",
      instructor: "Emily Davis",
      enrolledStudents: 30,
      status: "completed"
    },
    {
      id: 7,
      name: "Social Studies",
      category: "Social Studies",
      grade: "4th Grade",
      instructor: "James Wilson",
      enrolledStudents: 32,
      status: "active"
    },
    {
      id: 8,
      name: "Music Appreciation",
      category: "Arts",
      grade: "3rd Grade",
      instructor: "Maria Garcia",
      enrolledStudents: 25,
      status: "inactive"
    }
  ]
};

export const COURSE_CATEGORIES = [
  "Mathematics",
  "Science",
  "Languages",
  "Social Studies",
  "Arts",
  "Sports",
  "Computer Studies"
];

export const COURSE_GRADES = [
  "1st Grade",
  "2nd Grade", 
  "3rd Grade",
  "4th Grade",
  "5th Grade",
  "6th Grade"
];

export const COURSE_STATUSES = [
  "active",
  "upcoming", 
  "completed",
  "inactive"
];
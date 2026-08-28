import { 
  Users, 
  UserCheck, 
  UserX, 
  GraduationCap,
  BookOpen
} from 'lucide-react';

export const STUDENTS_DATA = {
  stats: [
    {
      title: "students.totalStudents",
      value: "1,247",
      change: "+8%",
      icon: Users,
      color: "blue" 
    },
    {
      title: "students.activeStudents",
      value: "1,154",
      change: "+5%",
      icon: UserCheck,
      color: "green" 
    },
    {
      title: "students.newEnrollments",
      value: "93",
      change: "+12%",
      icon: BookOpen,
      color: "purple" 
    },
    {
      title: "students.graduationRate",
      value: "96.2%",
      change: "+1.8%",
      icon: GraduationCap,
      color: "teal" 
    }
  ],
  students: [
    {
      id: 1,
      name: "Ahmed Hassan",
      email: "ahmed.hassan@school.edu",
      phone: "+1 (555) 123-4567",
      studentId: "STU2024001",
      grade: "5th Grade",
      class: "Class A",
      enrollmentDate: "2022-09-15",
      status: "active",
      average: 92.5,
      avatar: "",
      address: "123 School Street, Education City",
      dateOfBirth: "2013-05-15",
      gender: "Male",
      subjects: ["Mathematics", "Science", "English", "Social Studies"],
      guardian: {
        name: "Mohammed Hassan",
        phone: "+1 (555) 987-6543",
        email: "m.hassan@email.com"
      }
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.johnson@school.edu",
      phone: "+1 (555) 234-5678",
      studentId: "STU2024002",
      grade: "4th Grade",
      class: "Class B",
      enrollmentDate: "2023-01-10",
      status: "active",
      average: 88.7,
      avatar: "",
      address: "456 Learning Lane, Knowledge Town",
      dateOfBirth: "2014-08-22",
      gender: "Female",
      subjects: ["Mathematics", "Science", "English", "Art"],
      guardian: {
        name: "Robert Johnson",
        phone: "+1 (555) 876-5432",
        email: "r.johnson@email.com"
      }
    },
    {
      id: 3,
      name: "Maria Garcia",
      email: "maria.garcia@school.edu",
      phone: "+1 (555) 345-6789",
      studentId: "STU2024003",
      grade: "6th Grade",
      class: "Class A",
      enrollmentDate: "2021-09-05",
      status: "active",
      average: 95.2,
      avatar: "",
      address: "789 Education Road, Learning Ville",
      dateOfBirth: "2012-12-10",
      gender: "Female",
      subjects: ["Mathematics", "Science", "English", "Music"],
      guardian: {
        name: "Carlos Garcia",
        phone: "+1 (555) 765-4321",
        email: "c.garcia@email.com"
      }
    },
    {
      id: 4,
      name: "James Wilson",
      email: "james.wilson@school.edu",
      phone: "+1 (555) 456-7890",
      studentId: "STU2024004",
      grade: "3rd Grade",
      class: "Class C",
      enrollmentDate: "2024-01-15",
      status: "active",
      average: 85.8,
      avatar: "",
      address: "321 Knowledge Blvd, School City",
      dateOfBirth: "2015-03-18",
      gender: "Male",
      subjects: ["Mathematics", "Science", "English", "Physical Education"],
      guardian: {
        name: "Thomas Wilson",
        phone: "+1 (555) 654-3210",
        email: "t.wilson@email.com"
      }
    },
    {
      id: 5,
      name: "Lisa Chen",
      email: "lisa.chen@school.edu",
      phone: "+1 (555) 567-8901",
      studentId: "STU2024005",
      grade: "5th Grade",
      class: "Class B",
      enrollmentDate: "2022-09-10",
      status: "active",
      average: 91.3,
      avatar: "",
      address: "654 Study Street, Education Town",
      dateOfBirth: "2013-11-25",
      gender: "Female",
      subjects: ["Mathematics", "Science", "English", "Computer Science"],
      guardian: {
        name: "Wei Chen",
        phone: "+1 (555) 543-2109",
        email: "w.chen@email.com"
      }
    },
    {
      id: 6,
      name: "Michael Brown",
      email: "michael.brown@school.edu",
      phone: "+1 (555) 678-9012",
      studentId: "STU2024006",
      grade: "6th Grade",
      class: "Class D",
      enrollmentDate: "2021-09-12",
      status: "graduated",
      average: 89.6,
      avatar: "",
      address: "987 Learning Road, School Ville",
      dateOfBirth: "2012-07-30",
      gender: "Male",
      subjects: ["Mathematics", "Science", "English", "History"],
      guardian: {
        name: "David Brown",
        phone: "+1 (555) 432-1098",
        email: "d.brown@email.com"
      }
    },
    {
      id: 7,
      name: "Emily Davis",
      email: "emily.davis@school.edu",
      phone: "+1 (555) 789-0123",
      studentId: "STU2024007",
      grade: "4th Grade",
      class: "Class A",
      enrollmentDate: "2023-01-20",
      status: "suspended",
      average: 78.2,
      avatar: "",
      address: "147 Education Ave, Learning City",
      dateOfBirth: "2014-04-12",
      gender: "Female",
      subjects: ["Mathematics", "Science", "English", "Art"],
      guardian: {
        name: "Jennifer Davis",
        phone: "+1 (555) 321-0987",
        email: "j.davis@email.com"
      }
    },
    {
      id: 8,
      name: "Robert Taylor",
      email: "robert.taylor@school.edu",
      phone: "+1 (555) 890-1234",
      studentId: "STU2024008",
      grade: "2nd Grade",
      class: "Class C",
      enrollmentDate: "2024-01-08",
      status: "inactive",
      average: 82.4,
      avatar: "",
      address: "258 School Lane, Education Town",
      dateOfBirth: "2016-09-08",
      gender: "Male",
      subjects: ["Mathematics", "Science", "English", "Music"],
      guardian: {
        name: "Richard Taylor",
        phone: "+1 (555) 210-9876",
        email: "r.taylor@email.com"
      }
    }
  ]
};

export const STUDENT_GRADES = [
  "1st Grade",
  "2nd Grade", 
  "3rd Grade",
  "4th Grade",
  "5th Grade",
  "6th Grade"
];

export const STUDENT_CLASSES = [
  "Class A",
  "Class B",
  "Class C",
  "Class D"
];

export const STUDENT_STATUSES = [
  "active",
  "inactive", 
  "suspended",
  "graduated"
];
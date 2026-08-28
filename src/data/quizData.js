// src/data/quizData.js
export const QUIZ_DATA = {
  quizzes: [
    {
      id: "quiz1",
      title: { en: "Physics Chapter 1 Quiz", ar: "اختبار الفيزياء الفصل الأول" },
      description: { 
        en: "Multiple choice questions covering Newton's Laws", 
        ar: "أسئلة اختيار من متعدد تغطي قوانين نيوتن" 
      },
      classId: { id: "c1", name: "Grade 10-A" },
      courseId: { id: "crs1", name: "Physics 101" },
      teacherId: { id: "t1", name: "Dr. Sarah Wilson" },
      dueDate: "2024-04-10T23:59:00.000Z",
      totalMarks: 50,
      questionsCount: 25,
      status: "published",
      submissionsCount: 24,
      totalStudents: 30,
      createdAt: "2024-03-15T10:30:00.000Z"
    },
    {
      id: "quiz2",
      title: { en: "Mathematics Algebra Test", ar: "اختبار الجبر في الرياضيات" },
      description: { 
        en: "Linear equations and quadratic formulas", 
        ar: "معادلات خطية وصيغ تربيعية" 
      },
      classId: { id: "c1", name: "Grade 10-A" },
      courseId: { id: "crs3", name: "Mathematics" },
      teacherId: { id: "t1", name: "Dr. Sarah Wilson" },
      dueDate: "2024-04-05T23:59:00.000Z",
      totalMarks: 40,
      questionsCount: 20,
      status: "draft",
      submissionsCount: 0,
      totalStudents: 30,
      createdAt: "2024-03-10T14:20:00.000Z"
    },
    {
      id: "quiz3",
      title: { en: "History Ancient Civilizations", ar: "تاريخ الحضارات القديمة" },
      description: { 
        en: "Ancient Egypt, Greece, and Rome civilizations", 
        ar: "حضارات مصر القديمة واليونان وروما" 
      },
      classId: { id: "c2", name: "Grade 11-B" },
      courseId: { id: "crs2", name: "History" },
      teacherId: { id: "t1", name: "Dr. Sarah Wilson" },
      dueDate: "2024-03-20T23:59:00.000Z",
      totalMarks: 60,
      questionsCount: 30,
      status: "closed",
      submissionsCount: 28,
      totalStudents: 28,
      createdAt: "2024-02-28T09:15:00.000Z"
    }
  ],
  submissions: [
    {
      _id: "quizsub1",
      quizId: "quiz1",
      quizTitle: { en: "Physics Chapter 1 Quiz", ar: "اختبار الفيزياء الفصل الأول" },
      student: { 
        id: "s1", 
        name: "Ahmed Ali", 
        email: "ahmed@school.com",
        avatar: "" 
      },
      submissionDate: "2024-04-09T14:30:00.000Z",
      status: "graded",
      marks: 45,
      totalMarks: 50,
      feedback: { en: "Excellent work!", ar: "عمل ممتاز!" },
      className: "Grade 10-A",
      duration: "45 minutes"
    },
    {
      _id: "quizsub2",
      quizId: "quiz1",
      quizTitle: { en: "Physics Chapter 1 Quiz", ar: "اختبار الفيزياء الفصل الأول" },
      student: { 
        id: "s2", 
        name: "John Doe", 
        email: "john@school.com",
        avatar: "" 
      },
      submissionDate: "2024-04-10T10:00:00.000Z",
      status: "submitted",
      marks: null,
      totalMarks: 50,
      feedback: { en: "", ar: "" },
      className: "Grade 10-A",
      duration: "50 minutes"
    },
    {
      _id: "quizsub3",
      quizId: "quiz3",
      quizTitle: { en: "History Ancient Civilizations", ar: "تاريخ الحضارات القديمة" },
      student: { 
        id: "s3", 
        name: "Sarah Johnson", 
        email: "sarah@school.com",
        avatar: "" 
      },
      submissionDate: "2024-03-19T16:45:00.000Z",
      status: "graded",
      marks: 55,
      totalMarks: 60,
      feedback: { en: "Good analysis of Roman Empire", ar: "تحليل جيد للإمبراطورية الرومانية" },
      className: "Grade 11-B",
      duration: "60 minutes"
    }
  ],
  meta: {
    classes: [
      { id: "c1", name: "Grade 10-A" },
      { id: "c2", name: "Grade 11-B" },
      { id: "c3", name: "Grade 12-Science" }
    ],
    courses: [
      { id: "crs1", name: "Physics 101" },
      { id: "crs2", name: "History" },
      { id: "crs3", name: "Mathematics" },
      { id: "crs4", name: "Biology" }
    ],
    quizStatus: ["draft", "published", "closed"],
    submissionStatus: ["pending", "submitted", "graded"],
    questionTypes: ["multiple-choice", "true-false", "short-answer", "essay"]
  }
};
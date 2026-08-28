export const ASSIGNMENT_DATA = {
  assignments: [
    {
      id: "65d4c12345",
      title: { en: "Physics Mid-Term Project", ar: "مشروع الفيزياء النصفي" },
      description: { 
        en: "Create a working model demonstrating Newton's three laws of motion.", 
        ar: "إنشاء نموذج عملي يوضح قوانين نيوتن الثلاثة للحركة." 
      },
      classId: { id: "c1", name: "Grade 10-A" },
      courseId: { id: "crs1", name: "Physics 101" },
      teacherId: { id: "t1", name: "Dr. Sarah Wilson" },
      dueDate: "2024-03-25T23:59:00.000Z",
      totalMarks: 100,
      files: [
        { name: "guidelines.pdf", size: 102400, type: "application/pdf" }
      ],
      status: "published",
      visibleToStudents: true,
      academicYear: "2023-2024",
      submissionsCount: 24,
      totalStudents: 30
    },
    {
      id: "65d4c67890",
      title: { en: "Ancient History Essay", ar: "مقال التاريخ القديم" },
      description: { 
        en: "Write 1000 words on the fall of the Roman Empire.", 
        ar: "اكتب 1000 كلمة عن سقوط الإمبراطورية الرومانية." 
      },
      classId: { id: "c2", name: "Grade 11-B" },
      courseId: { id: "crs2", name: "History" },
      teacherId: { id: "t1", name: "Dr. Sarah Wilson" },
      dueDate: "2024-03-20T23:59:00.000Z",
      totalMarks: 50,
      files: [],
      status: "draft",
      visibleToStudents: false,
      academicYear: "2023-2024",
      submissionsCount: 0,
      totalStudents: 28
    },
    {
      id: "65d4c54321",
      title: { en: "Algebra Quiz 1", ar: "اختبار الجبر 1" },
      description: { en: "Chapter 1-3 review.", ar: "مراجعة الفصول 1-3" },
      classId: { id: "c1", name: "Grade 10-A" },
      courseId: { id: "crs3", name: "Mathematics" },
      teacherId: { id: "t1", name: "Dr. Sarah Wilson" },
      dueDate: "2024-02-15T23:59:00.000Z",
      totalMarks: 20,
      files: [],
      status: "archived",
      visibleToStudents: true,
      academicYear: "2023-2024",
      submissionsCount: 30,
      totalStudents: 30
    }
  ],
  submissions: [
    {
      _id: "sub1",
      assignmentId: "65d4c12345",
      assignmentTitle: { en: "Physics Mid-Term Project", ar: "مشروع الفيزياء النصفي" },
      student: { 
        id: "s1", 
        name: "Ahmed Ali", 
        email: "ahmed@school.com",
        avatar: "" 
      },
      submissionDate: "2024-03-24T14:30:00.000Z",
      files: [{ name: "project_report.pdf", path: "/files/p1.pdf" }],
      comment: { en: "Here is my project sir.", ar: "هذا هو مشروعي يا سيدي." },
      status: "submitted",
      marks: null,
      feedback: { en: "", ar: "" },
      className: "Grade 10-A"
    },
    {
      _id: "sub2",
      assignmentId: "65d4c12345",
      assignmentTitle: { en: "Physics Mid-Term Project", ar: "مشروع الفيزياء النصفي" },
      student: { 
        id: "s2", 
        name: "John Doe", 
        email: "john@school.com", 
        avatar: "" 
      },
      submissionDate: "2024-03-25T10:00:00.000Z",
      files: [{ name: "newton_model.jpg", path: "/files/p2.jpg" }],
      comment: { en: "Hope this is correct.", ar: "" },
      status: "graded",
      marks: 85,
      feedback: { en: "Great work, improve the conclusion.", ar: "عمل رائع، حسن الخاتمة." },
      className: "Grade 10-A"
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
    ]
  }
};
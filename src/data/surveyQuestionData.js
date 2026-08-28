import { 
  HelpCircle, 
  CheckCircle, 
  XCircle, 
  ListChecks,
  Star,
  FileText
} from 'lucide-react';

export const SURVEY_QUESTION_DATA = {
  stats: [
    {
      title: "survey.totalQuestions",
      value: "48",
      change: "+12%",
      icon: HelpCircle,
      color: "blue" 
    },
    {
      title: "survey.activeQuestions",
      value: "42",
      change: "+8%",
      icon: CheckCircle,
      color: "green" 
    },
    {
      title: "survey.inactiveQuestions",
      value: "6",
      change: "-2%",
      icon: XCircle,
      color: "purple" 
    },
    {
      title: "survey.categories",
      value: "8",
      change: "+3",
      icon: ListChecks,
      color: "teal" 
    }
  ],
  questions: [
    {
      id: 1,
      questionText: {
        en: "How satisfied are you with the teaching quality?",
        ar: "ما مدى رضاك عن جودة التدريس؟"
      },
      category: "teaching",
      type: "rating",
      options: ["1", "2", "3", "4", "5"],
      isActive: true,
      required: true,
      order: 1,
      createdAt: "2024-01-15"
    },
    {
      id: 2,
      questionText: {
        en: "How would you rate the classroom facilities?",
        ar: "كيف تقيم مرافق الفصل الدراسي؟"
      },
      category: "facilities",
      type: "rating",
      options: ["1", "2", "3", "4", "5"],
      isActive: true,
      required: true,
      order: 2,
      createdAt: "2024-01-15"
    },
    {
      id: 3,
      questionText: {
        en: "What improvements would you suggest for the curriculum?",
        ar: "ما التحسينات التي تقترحها للمناهج الدراسية؟"
      },
      category: "curriculum",
      type: "text",
      options: [],
      isActive: true,
      required: false,
      order: 3,
      createdAt: "2024-01-16"
    },
    {
      id: 4,
      questionText: {
        en: "How effective is the communication from administration?",
        ar: "ما مدى فعالية التواصل من الإدارة؟"
      },
      category: "administration",
      type: "multiple_choice",
      options: ["Very Effective", "Effective", "Neutral", "Ineffective", "Very Ineffective"],
      isActive: true,
      required: true,
      order: 4,
      createdAt: "2024-01-17"
    },
    {
      id: 5,
      questionText: {
        en: "Rate the availability of learning resources",
        ar: "قيم توفر موارد التعلم"
      },
      category: "resources",
      type: "rating",
      options: ["1", "2", "3", "4", "5"],
      isActive: false,
      required: true,
      order: 5,
      createdAt: "2024-01-18"
    },
    {
      id: 6,
      questionText: {
        en: "How comfortable is the learning environment?",
        ar: "ما مدى راحة بيئة التعلم؟"
      },
      category: "environment",
      type: "rating",
      options: ["1", "2", "3", "4", "5"],
      isActive: true,
      required: true,
      order: 6,
      createdAt: "2024-01-19"
    },
    {
      id: 7,
      questionText: {
        en: "Select areas where you need more support",
        ar: "حدد المجالات التي تحتاج فيها إلى مزيد من الدعم"
      },
      category: "support",
      type: "checkbox",
      options: ["Academic", "Technical", "Emotional", "Career Guidance", "Financial", "Other"],
      isActive: true,
      required: false,
      order: 7,
      createdAt: "2024-01-20"
    },
    {
      id: 8,
      questionText: {
        en: "How likely are you to recommend this institution to others?",
        ar: "ما مدى احتمالية توصيتك لهذه المؤسسة للآخرين؟"
      },
      category: "overall",
      type: "rating",
      options: ["1", "2", "3", "4", "5"],
      isActive: true,
      required: true,
      order: 8,
      createdAt: "2024-01-21"
    },
    {
      id: 9,
      questionText: {
        en: "How helpful are the teaching assistants?",
        ar: "ما مدى مساعدة مساعدي التدريس؟"
      },
      category: "teaching",
      type: "rating",
      options: ["1", "2", "3", "4", "5"],
      isActive: true,
      required: true,
      order: 9,
      createdAt: "2024-01-22"
    },
    {
      id: 10,
      questionText: {
        en: "Rate the cleanliness of the campus",
        ar: "قيم نظافة الحرم الجامعي"
      },
      category: "facilities",
      type: "rating",
      options: ["1", "2", "3", "4", "5"],
      isActive: true,
      required: true,
      order: 10,
      createdAt: "2024-01-23"
    }
  ]
};
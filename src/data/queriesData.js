// queriesData.js
import { 
  MessageCircle, 
  AlertCircle, 
  CheckCircle, 
  TrendingUp,
  HelpCircle,
  Info,
  AlertTriangle
} from 'lucide-react';

export const QUERIES_DATA = {
  stats: [
    {
      title: "dashboard.totalQueries",
      value: "1,234",
      change: "+12%",
      icon: MessageCircle,
      color: "blue" 
    },
    {
      title: "dashboard.pendingQueries",
      value: "89",
      change: "+5%",
      icon: AlertCircle,
      color: "green" 
    },
    {
      title: "dashboard.resolvedQueries",
      value: "1,145",
      change: "+8%",
      icon: CheckCircle,
      color: "purple" 
    },
    {
      title: "dashboard.responseRate",
      value: "92.7%",
      change: "+2.3%",
      icon: TrendingUp,
      color: "teal" 
    }
  ],
  queries: [
    {
      id: 1,
      name: "Ahmed Mohamed",
      course: "Computer Science - Year 3",
      avatar: "",
      message: "queries.messages.algorithmHelp",
      date: "2024-01-15",
      status: "pending",
      email: "ahmed.m@student.edu",
      type: "academic"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      course: "Physics - Year 2",
      avatar: "",
      message: "queries.messages.portalAccess",
      date: "2024-01-14",
      status: "in-progress",
      email: "sarah.j@student.edu",
      type: "technical"
    },
    {
      id: 3,
      name: "Michael Chen",
      course: "Engineering - Year 4",
      avatar: "",
      message: "queries.messages.extensionRequest",
      date: "2024-01-14",
      status: "pending",
      email: "michael.c@student.edu",
      type: "academic"
    },
    {
      id: 4,
      name: "Emma Wilson",
      course: "Chemistry - Year 1",
      avatar: "",
      message: "queries.messages.labEmergency",
      date: "2024-01-13",
      status: "resolved",
      email: "emma.w@student.edu",
      type: "emergency"
    },
    {
      id: 5,
      name: "David Brown",
      course: "Mathematics - Year 3",
      avatar: "",
      message: "queries.messages.fieldTripInquiry",
      date: "2024-01-13",
      status: "pending",
      email: "david.b@student.edu",
      type: "administrative"
    },
    {
      id: 6,
      name: "Lisa Garcia",
      course: "Biology - Year 2",
      avatar: "",
      message: "queries.messages.gradingClarification",
      date: "2024-01-12",
      status: "resolved",
      email: "lisa.g@student.edu",
      type: "academic"
    },
    {
      id: 7,
      name: "Omar Hassan",
      course: "Computer Engineering - Year 2",
      avatar: "",
      message: "queries.messages.portalAccess",
      date: "2024-01-12",
      status: "pending",
      email: "omar.h@student.edu",
      type: "technical"
    },
    {
      id: 8,
      name: "Fatima Ali",
      course: "Medicine - Year 1",
      avatar: "",
      message: "queries.messages.extensionRequest",
      date: "2024-01-11",
      status: "in-progress",
      email: "fatima.a@student.edu",
      type: "academic"
    }
  ]
};

export const QUERY_STATUS = {
  pending: { 
    label: "Pending", 
    color: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-800" 
  },
  "in-progress": { 
    label: "In Progress", 
    color: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800" 
  },
  resolved: { 
    label: "Resolved", 
    color: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800" 
  }
};

export const QUERY_TYPES = {
  academic: {
    label: "Academic",
    icon: MessageCircle,
    color: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300"
  },
  technical: {
    label: "Technical",
    icon: HelpCircle,
    color: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300"
  },
  administrative: {
    label: "Administrative",
    icon: Info,
    color: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300"
  },
  emergency: {
    label: "Emergency",
    icon: AlertTriangle,
    color: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-300"
  },
  general: {
    label: "General",
    icon: HelpCircle,
    color: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/40 dark:text-gray-300"
  }
};

export const QUERY_MESSAGES = {
  algorithmHelp: "I'm having trouble understanding the Dijkstra algorithm in our Data Structures course. Could you please provide some additional resources or schedule an extra session?",
  portalAccess: "I'm unable to access the student portal with my credentials. I've tried resetting my password but still can't log in. Can you help me resolve this issue?",
  extensionRequest: "Due to medical reasons, I need an extension for the upcoming assignment deadline. I have the necessary documentation from my doctor. Please let me know the procedure.",
  labEmergency: "There's an emergency in the chemistry lab - a chemical spill has occurred. Immediate assistance is required for cleanup and safety measures.",
  fieldTripInquiry: "I'd like to get more information about the upcoming field trip to the science museum. What are the dates, costs, and registration deadline?",
  gradingClarification: "I believe there might be an error in my last exam grading. Could you please review question 3b as I think I deserve more points based on the rubric?"
};
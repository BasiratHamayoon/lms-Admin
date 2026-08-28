// src/data/NotificationData.js
import { 
  Bell, 
  Users, 
  Calendar, 
  MessageCircle,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  FileText,
  Award,
  DollarSign,
  CheckSquare
} from 'lucide-react';

export const NOTIFICATIONS_DATA = {
  stats: [
    {
      title: "notifications.totalNotifications",
      value: "1,247",
      change: "+12%",
      icon: Bell,
      color: "blue"
    },
    {
      title: "notifications.activeNotifications",
      value: "892",
      change: "+8%",
      icon: MessageCircle,
      color: "green"
    },
    {
      title: "notifications.unreadNotifications",
      value: "154",
      change: "-5%",
      icon: AlertTriangle,
      color: "purple"
    },
    {
      title: "notifications.responseRate",
      value: "94.5%",
      change: "+2.3%",
      icon: TrendingUp,
      color: "teal"
    }
  ],
  notifications: [
    {
      id: 1,
      title: "Final Exams Schedule",
      message: "The final exams schedule for all grades has been published. Please check the timetable section.",
      type: "announcement",
      priority: "high",
      targetAudience: "all",
      validFrom: "2024-01-15T08:00:00",
      validUntil: "2024-02-15T23:59:59",
      status: "published",
      sentBy: "School Administration",
      sentByAvatar: "SA",
      readCount: 1245,
      totalRecipients: 1250,
      createdAt: "2024-01-10T10:30:00",
      updatedAt: "2024-01-10T10:30:00"
    },
    {
      id: 2,
      title: "Mathematics Assignment Due",
      message: "Mathematics assignment 3 is due on Friday. Please submit before 5 PM.",
      type: "assignment",
      priority: "medium",
      targetAudience: "students",
      targetClasses: ["Class A", "Class B"],
      validFrom: "2024-01-12T09:00:00",
      validUntil: "2024-01-19T17:00:00",
      status: "published",
      sentBy: "Mr. Johnson",
      sentByAvatar: "MJ",
      readCount: 95,
      totalRecipients: 98,
      createdAt: "2024-01-11T14:20:00",
      updatedAt: "2024-01-11T14:20:00"
    },
    {
      id: 3,
      title: "Staff Meeting Reminder",
      message: "Monthly staff meeting tomorrow at 3 PM in the conference room.",
      type: "event",
      priority: "medium",
      targetAudience: "staff",
      validFrom: "2024-01-14T15:00:00",
      validUntil: "2024-01-15T18:00:00",
      status: "published",
      sentBy: "Principal Smith",
      sentByAvatar: "PS",
      readCount: 42,
      totalRecipients: 45,
      createdAt: "2024-01-13T11:15:00",
      updatedAt: "2024-01-13T11:15:00"
    },
    {
      id: 4,
      title: "Quarterly Grades Published",
      message: "Quarterly grades are now available for parents. Please check the parent portal.",
      type: "grade",
      priority: "high",
      targetAudience: "parents",
      validFrom: "2024-01-16T10:00:00",
      validUntil: "2024-01-30T23:59:59",
      status: "draft",
      sentBy: "Academic Department",
      sentByAvatar: "AD",
      readCount: 0,
      totalRecipients: 250,
      createdAt: "2024-01-15T16:45:00",
      updatedAt: "2024-01-15T16:45:00"
    },
    {
      id: 5,
      title: "Tuition Fee Due Date",
      message: "Reminder: January tuition fees are due by January 25th.",
      type: "fee",
      priority: "urgent",
      targetAudience: "parents",
      validFrom: "2024-01-20T09:00:00",
      validUntil: "2024-01-25T17:00:00",
      status: "published",
      sentBy: "Finance Department",
      sentByAvatar: "FD",
      readCount: 185,
      totalRecipients: 250,
      createdAt: "2024-01-19T10:30:00",
      updatedAt: "2024-01-19T10:30:00"
    },
    {
      id: 6,
      title: "Science Quiz Next Week",
      message: "Science quiz for grades 5-6 will be conducted next Monday.",
      type: "quiz",
      priority: "medium",
      targetAudience: "students",
      targetClasses: ["5th Grade", "6th Grade"],
      validFrom: "2024-01-22T08:00:00",
      validUntil: "2024-01-29T17:00:00",
      status: "published",
      sentBy: "Science Department",
      sentByAvatar: "SD",
      readCount: 120,
      totalRecipients: 125,
      createdAt: "2024-01-21T14:00:00",
      updatedAt: "2024-01-21T14:00:00"
    },
    {
      id: 7,
      title: "Attendance Policy Update",
      message: "Updated attendance policy effective from next semester. Please review.",
      type: "attendance",
      priority: "low",
      targetAudience: "all",
      validFrom: "2024-01-25T00:00:00",
      validUntil: null,
      status: "archived",
      sentBy: "Admin Office",
      sentByAvatar: "AO",
      readCount: 1100,
      totalRecipients: 1250,
      createdAt: "2024-01-24T11:20:00",
      updatedAt: "2024-01-24T11:20:00"
    },
    {
      id: 8,
      title: "Sports Day Announcement",
      message: "Annual sports day will be held on February 15th. Participation forms available.",
      type: "event",
      priority: "medium",
      targetAudience: "students",
      validFrom: "2024-01-28T09:00:00",
      validUntil: "2024-02-14T17:00:00",
      status: "draft",
      sentBy: "Sports Department",
      sentByAvatar: "SP",
      readCount: 0,
      totalRecipients: 1247,
      createdAt: "2024-01-27T15:30:00",
      updatedAt: "2024-01-27T15:30:00"
    }
  ]
};

export const NOTIFICATION_TYPES = [
  "announcement",
  "event",
  "assignment",
  "quiz",
  "grade",
  "fee",
  "attendance",
  "other"
];

export const NOTIFICATION_PRIORITIES = [
  "low",
  "medium",
  "high",
  "urgent"
];

export const NOTIFICATION_STATUSES = [
  "draft",
  "published",
  "archived"
];

export const TARGET_AUDIENCES = [
  "all",
  "students",
  "teachers",
  "staff",
  "parents",
  "admin",
  "specific"
];
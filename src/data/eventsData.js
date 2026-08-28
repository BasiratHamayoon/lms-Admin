// src/data/eventsData.js
import { 
  Calendar, 
  Users, 
  Bell, 
  CheckCircle, 
  Clock,
  BookOpen,
  Trophy,
  School,
  Briefcase,
  AlertCircle
} from 'lucide-react';

export const EVENTS_DATA = {
  stats: [
    {
      title: "events.totalEvents",
      value: "48",
      change: "+12%",
      icon: Calendar,
      color: "blue"
    },
    {
      title: "events.upcomingEvents",
      value: "15",
      change: "+5%",
      icon: Clock,
      color: "green"
    },
    {
      title: "events.todayEvents",
      value: "3",
      change: "0%",
      icon: Bell,
      color: "purple"
    },
    {
      title: "events.completedEvents",
      value: "30",
      change: "+8%",
      icon: CheckCircle,
      color: "teal"
    }
  ],
  
  events: [
    {
      id: 1,
      title: "Annual Sports Day",
      description: "School-wide sports competition with various athletic events and activities for all grades",
      startDate: "2024-03-15T09:00:00",
      endDate: "2024-03-15T16:00:00",
      allDay: true,
      location: "School Sports Ground",
      type: "academic",
      visibility: "all",
      color: "#10b981",
      reminder: true,
      status: "scheduled",
      participants: ["All Students", "Teachers", "Parents"],
      createdBy: "Sports Department"
    },
    {
      id: 2,
      title: "Parent-Teacher Meeting",
      description: "Quarterly meeting between parents and teachers to discuss student progress",
      startDate: "2024-03-20T14:00:00",
      endDate: "2024-03-20T18:00:00",
      allDay: false,
      location: "School Auditorium",
      type: "administrative",
      visibility: "all",
      color: "#8b5cf6",
      reminder: true,
      status: "scheduled",
      participants: ["Parents", "Teachers"],
      createdBy: "Administration"
    },
    {
      id: 3,
      title: "Mid-Term Examinations",
      description: "Mid-term exams for all classes from Grade 1 to Grade 6",
      startDate: "2024-03-25T09:00:00",
      endDate: "2024-03-29T16:00:00",
      allDay: true,
      location: "Classrooms",
      type: "exam",
      visibility: "students",
      color: "#ef4444",
      reminder: true,
      status: "scheduled",
      participants: ["All Students"],
      createdBy: "Examination Department"
    },
    {
      id: 4,
      title: "Science Fair",
      description: "Annual science exhibition showcasing student projects and experiments",
      startDate: "2024-04-05T10:00:00",
      endDate: "2024-04-05T15:00:00",
      allDay: false,
      location: "Science Lab & Courtyard",
      type: "academic",
      visibility: "all",
      color: "#3b82f6",
      reminder: true,
      status: "scheduled",
      participants: ["Science Students", "Teachers", "Parents"],
      createdBy: "Science Department"
    },
    {
      id: 5,
      title: "Eid Holiday",
      description: "School closed for Eid al-Fitr celebrations",
      startDate: "2024-04-10T00:00:00",
      endDate: "2024-04-12T23:59:59",
      allDay: true,
      location: "School Closed",
      type: "holiday",
      visibility: "all",
      color: "#f59e0b",
      reminder: false,
      status: "scheduled",
      participants: ["All"],
      createdBy: "Administration"
    },
    {
      id: 6,
      title: "Teachers Workshop",
      description: "Professional development workshop for teaching staff on modern teaching methodologies",
      startDate: "2024-04-15T09:00:00",
      endDate: "2024-04-15T16:00:00",
      allDay: false,
      location: "Conference Room",
      type: "administrative",
      visibility: "teachers",
      color: "#8b5cf6",
      reminder: true,
      status: "completed",
      participants: ["Teaching Staff"],
      createdBy: "HR Department"
    },
    {
      id: 7,
      title: "Annual Day Celebration",
      description: "Cultural program and award ceremony for academic excellence",
      startDate: "2024-04-25T17:00:00",
      endDate: "2024-04-25T21:00:00",
      allDay: false,
      location: "School Auditorium",
      type: "academic",
      visibility: "all",
      color: "#ec4899",
      reminder: true,
      status: "scheduled",
      participants: ["Students", "Teachers", "Parents", "Alumni"],
      createdBy: "Cultural Committee"
    },
    {
      id: 8,
      title: "Field Trip - Museum Visit",
      description: "Educational field trip to the National Museum for Grade 5 students",
      startDate: "2024-05-02T08:00:00",
      endDate: "2024-05-02T14:00:00",
      allDay: false,
      location: "National Museum",
      type: "academic",
      visibility: "students",
      color: "#10b981",
      reminder: true,
      status: "postponed",
      participants: ["Grade 5 Students", "Teachers"],
      createdBy: "Social Studies Department"
    }
  ]
};

export const EVENT_STATUSES = [
  "scheduled",
  "cancelled", 
  "completed",
  "postponed"
];

export const EVENT_TYPES = [
  "academic",
  "administrative",
  "holiday",
  "exam",
  "other"
];

export const VISIBILITY_OPTIONS = [
  "all",
  "teachers",
  "students",
  "admins"
];
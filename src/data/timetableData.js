import { Calendar, Clock, Users, Building } from 'lucide-react';

export const TIMETABLE_DATA = {
  stats: [
    {
      title: "timetable.totalClasses",
      value: "48",
      change: "+12%",
      icon: Calendar,
      color: "purple"
    },
    {
      title: "timetable.upcomingClasses",
      value: "14",
      change: "+5%",
      icon: Clock,
      color: "blue"
    },
    {
      title: "timetable.teachersEngaged",
      value: "23",
      change: "+8%",
      icon: Users,
      color: "green"
    },
    {
      title: "timetable.roomsOccupied",
      value: "18",
      change: "+3%",
      icon: Building,
      color: "teal"
    }
  ],

  days: [
    {
      id: 1,
      name: "Monday",
      date: "2024-01-15",
      classes: [
        {
          id: "M1",
          time: "08:00 - 09:30",
          subject: "Mathematics",
          teacher: "Ahmed Hassan",
          teacherAvatar: "AH",
          grade: "5th Grade",
          room: "Room 101"
        },
        {
          id: "M2",
          time: "09:45 - 11:15",
          subject: "Science",
          teacher: "Sarah Johnson",
          teacherAvatar: "SJ",
          grade: "5th Grade",
          room: "Lab 201"
        },
        {
          id: "M3",
          time: "11:30 - 13:00",
          subject: "English Literature",
          teacher: "Maria Garcia",
          teacherAvatar: "MG",
          grade: "5th Grade",
          room: "Room 103"
        },
        {
          id: "M4",
          time: "14:00 - 15:30",
          subject: "Physical Education",
          teacher: "James Wilson",
          teacherAvatar: "JW",
          grade: "5th Grade",
          room: "Gym"
        }
      ]
    },
    {
      id: 2,
      name: "Tuesday",
      date: "2024-01-16",
      classes: [
        {
          id: "T1",
          time: "08:00 - 09:30",
          subject: "Computer Science",
          teacher: "Lisa Chen",
          teacherAvatar: "LC",
          grade: "5th Grade",
          room: "Lab 301"
        },
        {
          id: "T2",
          time: "09:45 - 11:15",
          subject: "Social Studies",
          teacher: "Michael Brown",
          teacherAvatar: "MB",
          grade: "5th Grade",
          room: "Room 104"
        },
        {
          id: "T3",
          time: "11:30 - 13:00",
          subject: "Mathematics",
          teacher: "Ahmed Hassan",
          teacherAvatar: "AH",
          grade: "5th Grade",
          room: "Room 101"
        }
      ]
    },
    {
      id: 3,
      name: "Wednesday",
      date: "2024-01-17",
      classes: [
        {
          id: "W1",
          time: "08:00 - 09:30",
          subject: "Art & Design",
          teacher: "Emily Davis",
          teacherAvatar: "ED",
          grade: "5th Grade",
          room: "Art Room"
        },
        {
          id: "W2",
          time: "09:45 - 11:15",
          subject: "Science",
          teacher: "Sarah Johnson",
          teacherAvatar: "SJ",
          grade: "5th Grade",
          room: "Lab 201"
        },
        {
          id: "W3",
          time: "11:30 - 13:00",
          subject: "English Grammar",
          teacher: "Maria Garcia",
          teacherAvatar: "MG",
          grade: "5th Grade",
          room: "Room 103"
        }
      ]
    },
    {
      id: 4,
      name: "Thursday",
      date: "2024-01-18",
      classes: [
        {
          id: "TH1",
          time: "08:00 - 09:30",
          subject: "Music",
          teacher: "Robert Taylor",
          teacherAvatar: "RT",
          grade: "5th Grade",
          room: "Music Room"
        },
        {
          id: "TH2",
          time: "09:45 - 11:15",
          subject: "Mathematics",
          teacher: "Ahmed Hassan",
          teacherAvatar: "AH",
          grade: "5th Grade",
          room: "Room 101"
        },
        {
          id: "TH3",
          time: "11:30 - 13:00",
          subject: "History",
          teacher: "Michael Brown",
          teacherAvatar: "MB",
          grade: "5th Grade",
          room: "Room 104"
        }
      ]
    },
    {
      id: 5,
      name: "Friday",
      date: "2024-01-19",
      classes: [
        {
          id: "F1",
          time: "08:00 - 09:30",
          subject: "Physical Education",
          teacher: "James Wilson",
          teacherAvatar: "JW",
          grade: "5th Grade",
          room: "Gym"
        },
        {
          id: "F2",
          time: "09:45 - 11:15",
          subject: "Science Project",
          teacher: "Sarah Johnson",
          teacherAvatar: "SJ",
          grade: "5th Grade",
          room: "Lab 201"
        }
      ]
    }
  ]
};
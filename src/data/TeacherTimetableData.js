import { Calendar, Clock, BookOpen, MapPin, Users } from 'lucide-react';

export const TEACHER_TIMETABLE_DATA = {
  stats: [
    {
      title: "teacherTimetable.totalClasses",
      value: "28",
      change: "+5%",
      icon: Calendar,
      color: "indigo"
    },
    {
      title: "teacherTimetable.todayClasses",
      value: "4",
      change: "+2%",
      icon: Clock,
      color: "blue"
    },
    {
      title: "teacherTimetable.subjects",
      value: "8",
      change: "+3%",
      icon: BookOpen,
      color: "green"
    },
    {
      title: "teacherTimetable.roomsAssigned",
      value: "6",
      change: "+1%",
      icon: MapPin,
      color: "teal"
    }
  ],

  weeklySchedule: [
    {
      id: 1,
      day: "Monday",
      date: "2024-01-15",
      classes: [
        {
          id: "M1",
          time: "08:00 - 09:30",
          subject: "Mathematics",
          subjectCode: "MATH101",
          grade: "5th Grade",
          section: "A",
          room: "Room 101",
          type: "lecture",
          status: "upcoming"
        },
        {
          id: "M2",
          time: "09:45 - 11:15",
          subject: "Advanced Mathematics",
          subjectCode: "MATH201",
          grade: "7th Grade",
          section: "B",
          room: "Lab 201",
          type: "lab",
          status: "upcoming"
        },
        {
          id: "M3",
          time: "11:30 - 13:00",
          subject: "Mathematics",
          subjectCode: "MATH101",
          grade: "5th Grade",
          section: "C",
          room: "Room 103",
          type: "lecture",
          status: "upcoming"
        }
      ]
    },
    {
      id: 2,
      day: "Tuesday",
      date: "2024-01-16",
      classes: [
        {
          id: "T1",
          time: "08:00 - 09:30",
          subject: "Computer Science",
          subjectCode: "CS101",
          grade: "6th Grade",
          section: "A",
          room: "Lab 301",
          type: "practical",
          status: "upcoming"
        },
        {
          id: "T2",
          time: "09:45 - 11:15",
          subject: "Mathematics",
          subjectCode: "MATH101",
          grade: "5th Grade",
          section: "D",
          room: "Room 101",
          type: "lecture",
          status: "upcoming"
        }
      ]
    },
    {
      id: 3,
      day: "Wednesday",
      date: "2024-01-17",
      classes: [
        {
          id: "W1",
          time: "08:00 - 09:30",
          subject: "Mathematics",
          subjectCode: "MATH101",
          grade: "5th Grade",
          section: "A",
          room: "Room 101",
          type: "lecture",
          status: "upcoming"
        },
        {
          id: "W2",
          time: "09:45 - 11:15",
          subject: "Advanced Mathematics",
          subjectCode: "MATH201",
          grade: "7th Grade",
          section: "B",
          room: "Lab 201",
          type: "lab",
          status: "upcoming"
        },
        {
          id: "W3",
          time: "11:30 - 13:00",
          subject: "Computer Science",
          subjectCode: "CS101",
          grade: "6th Grade",
          section: "A",
          room: "Lab 301",
          type: "practical",
          status: "upcoming"
        }
      ]
    },
    {
      id: 4,
      day: "Thursday",
      date: "2024-01-18",
      classes: [
        {
          id: "TH1",
          time: "08:00 - 09:30",
          subject: "Mathematics",
          subjectCode: "MATH101",
          grade: "5th Grade",
          section: "C",
          room: "Room 101",
          type: "lecture",
          status: "upcoming"
        },
        {
          id: "TH2",
          time: "09:45 - 11:15",
          subject: "Advanced Mathematics",
          subjectCode: "MATH201",
          grade: "7th Grade",
          section: "B",
          room: "Lab 201",
          type: "lab",
          status: "upcoming"
        }
      ]
    },
    {
      id: 5,
      day: "Friday",
      date: "2024-01-19",
      classes: [
        {
          id: "F1",
          time: "08:00 - 09:30",
          subject: "Computer Science",
          subjectCode: "CS101",
          grade: "6th Grade",
          section: "A",
          room: "Lab 301",
          type: "practical",
          status: "upcoming"
        },
        {
          id: "F2",
          time: "09:45 - 11:15",
          subject: "Mathematics",
          subjectCode: "MATH101",
          grade: "5th Grade",
          section: "B",
          room: "Room 101",
          type: "lecture",
          status: "upcoming"
        }
      ]
    }
  ],

  todaySchedule: [
    {
      id: "T1",
      time: "08:00 - 09:30",
      subject: "Mathematics",
      subjectCode: "MATH101",
      grade: "5th Grade",
      section: "A",
      room: "Room 101",
      type: "lecture",
      status: "completed"
    },
    {
      id: "T2",
      time: "09:45 - 11:15",
      subject: "Advanced Mathematics",
      subjectCode: "MATH201",
      grade: "7th Grade",
      section: "B",
      room: "Lab 201",
      type: "lab",
      status: "ongoing"
    },
    {
      id: "T3",
      time: "11:30 - 13:00",
      subject: "Computer Science",
      subjectCode: "CS101",
      grade: "6th Grade",
      section: "A",
      room: "Lab 301",
      type: "practical",
      status: "upcoming"
    },
    {
      id: "T4",
      time: "14:00 - 15:30",
      subject: "Mathematics",
      subjectCode: "MATH101",
      grade: "5th Grade",
      section: "C",
      room: "Room 103",
      type: "lecture",
      status: "upcoming"
    }
  ],

  subjects: [
    { id: 1, name: "Mathematics", code: "MATH101", totalClasses: 12 },
    { id: 2, name: "Advanced Mathematics", code: "MATH201", totalClasses: 8 },
    { id: 3, name: "Computer Science", code: "CS101", totalClasses: 8 }
  ]
};
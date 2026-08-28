import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Building,
  BookOpen,
  Settings,
  MessageCircle,
  Calendar,
  CalendarDays,
  School,
  Bell,
  FileText,
  Clock,
  CreditCard,
  TrendingUp,
  DollarSign,
  Receipt,
  FileBarChart,
  BookOpenCheck,
  Award,
  ClipboardCheck,
  ChevronDown,
  ChevronRight,
  Briefcase,
  Wallet,
  BookOpenText
} from 'lucide-react';

export const sidebarData = {
  sections: [
    // Dashboard
    {
      id: 'dashboard',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard
        }
      ]
    },
    
    // HR Section
    {
      id: 'hr',
      title: 'hrGroup',
      icon: Briefcase, // Added Lucide icon
      items: [
        {
          title: 'Staff',
          url: '/staff',
          icon: Users
        },
        {
          title: 'Students',
          url: '/students', 
          icon: GraduationCap
        },
        {
          title: 'Classes',
          url: '/classes',
          icon: School
        },
        {
          title: 'Timetable', 
          url: '/timetable',
          icon: Calendar
        },
        {
          title: 'Courses',
          url: '/courses',
          icon: BookOpen
        },
        {
          title: 'Departments',
          url: '/departments',
          icon: Building
        },
        {
          title: 'Performance',
          url: '/performance',
          icon: TrendingUp
        },
        {
          title: 'Survey', 
          url: '/surveys',
          icon: ClipboardCheck
        },
        {
          title: 'Attendance', 
          url: '/attendance',
          icon: Clock
        },
        {
          title: 'Contracts',
          url: '/contracts',
          icon: FileText 
        },
        {
          title: 'Events', 
          url: '/events',
          icon: CalendarDays
        }
      ]
    },
    
    // Account Section
    {
      id: 'account',
      title: 'accountGroup',
      icon: Wallet, // Added Lucide icon
      items: [
        {
          title: 'salary', 
          url: '/salary',
          icon: CreditCard
        },
        {
          title: 'Expenses', 
          url: '/expenses',
          icon: DollarSign
        },
        {
          title: 'Fee', 
          url: '/fee',
          icon: Receipt
        },
        {
          title: 'Reports',
          url: '/reports',
          icon: FileBarChart
        }
      ]
    },
    
    // Teacher Section
    {
      id: 'teacher',
      title: 'teacherGroup',
      icon: BookOpenText, // Added Lucide icon
      items: [
        { 
          title: 'Assignments',
          url: '/assignment',
          icon: BookOpenCheck 
        },
        { 
          title: 'Quizzes',
          url: '/quizzes',
          icon: BookOpen 
        },
        {
          title: 'Grades',
          url: '/grades',
          icon: Award
        },
        // { 
        //   title: 'Timetable',
        //   url: '/teacher-timetable',
        //   icon: Calendar 
        // },
      ]
    },
    
    // Other Items
    {
      id: 'other',
      items: [
        {
          title: 'Leave', 
          url: '/leave',
          icon: FileText
        },
        {
          title: 'Queries',
          url: '/queries',
          icon: MessageCircle
        },
        {
          title: 'Notifications', 
          url: '/notifications',
          icon: Bell
        },
        {
          title: 'Settings',
          url: '/settings',
          icon: Settings
        }
      ]
    }
  ]
};

// Get all nav items for backward compatibility
export const getAllNavItems = () => {
  const allItems = [];
  sidebarData.sections.forEach(section => {
    allItems.push(...section.items);
  });
  return allItems;
};
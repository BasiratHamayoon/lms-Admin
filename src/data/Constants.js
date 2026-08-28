export const MULTILINGUAL_CONSTANTS = {
  LANGUAGES: {
    ENGLISH: 'en',
    ARABIC: 'ar'
  },
  INPUT_MODES: {
    SINGLE: 'single',
    DUAL: 'dual'
  },
  COLORS: {
    GREEN_GRADIENT: 'from-green-500 to-green-600',
    GREEN_LIGHT: 'from-green-50 to-emerald-50',
    GREEN_DARK: 'from-green-900/20 to-emerald-900/20',
    GREEN_BORDER: 'border-green-200 dark:border-green-800'
  },
  ANIMATION: {
    FADE_IN: 'animate-fadeIn',
    DURATION: 300,
    EASE: 'ease-out'
  },
  STYLES: {
    LANGUAGE_BADGE: 'px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    LANGUAGE_CARD: 'p-4 rounded-lg border transition-all duration-200',
    LANGUAGE_BUTTON: 'py-3 px-4 rounded-lg border transition-all duration-200 flex items-center justify-center gap-2',
    ACTIVE_LANGUAGE: 'bg-gradient-to-r from-green-500 to-green-600 text-white border-green-600 shadow-md',
    INACTIVE_LANGUAGE: 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
  }
};
const CONSTANTS = {
  ACCESS_TOKEN: 'acc_tk',
  REFRESH_TOKEN: 'ref_tk',
  ADMIN_DATA: 'admin_data',  
  LOCATION: 'route_history',
  SIDEBAR_STATE: 'sidebar_state',
  SIDEBAR_STATE_AGE: 60 * 60 * 24 * 7, 
  SIDEBAR_WIDTH: {
    EXPANDED: '16rem',     
    COLLAPSED: '5rem',     
    MOBILE: '18rem'       
  },
  SIDEBAR_ANIMATION: {
    DURATION: 300,         
  },
  MULTILINGUAL: MULTILINGUAL_CONSTANTS,
  SIDEBAR_BREAKPOINT: 'md',
  SIDEBAR_KEYBOARD_SHORTCUT: 'b',
  HEADER_HEIGHT: '4rem',    
  CONTENT_PADDING: {
    DESKTOP: '1.5rem',    
    MOBILE: '1rem'     
  },
  LOGIN: {
    INPUT_ICON_SIZE: 18,
    PROFILE_ICON_SIZE: 24,
    ANIMATION_DURATION: 800
  },
  MODAL_TYPES: {
    STAFF: 'staff',
    STUDENT: 'student',
    DEPARTMENT: 'department',
    COURSE: 'course',
    TIMETABLE: 'timetable',
    EVENT: 'event',
    CLASS: 'class',
    NOTIFICATION: 'notification',
    LEAVE: 'leave',
    LEAVE_QUOTA: 'leaveQuota',
    ATTENDANCE: 'attendance', 
    ATTENDANCE_BULK: 'attendanceBulk',
    PERFORMANCE: 'performance',
    PERFORMANCE_KPI: 'performanceKpi'

  }
};

export const SIDEBAR_STATES = {
  EXPANDED: 'expanded',
  COLLAPSED: 'collapsed',
  MOBILE: 'mobile',
  HIDDEN: 'hidden'
};

export const SIDEBAR_VARIANTS = {
  FLOATING: 'floating',
  INSET: 'inset',
  BORDERED: 'bordered'
};

export const SIDEBAR_COLLAPSIBLE = {
  ICON: 'icon',
  OFF: 'off'
};

export const ICON_CONFIG = {
  SIZE: {
    EXPANDED: 'w-5 h-5',
    COLLAPSED: 'w-5 h-5'
  },
  CONTAINER_SIZE: {
    EXPANDED: 'w-10 h-10',
    COLLAPSED: 'w-10 h-10'
  }
};
export const SIDEBAR_COLORS = {
  Dashboard: {
    normal: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
    active: 'bg-blue-500 text-white dark:bg-blue-600'
  },
  Staff: {
    normal: 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400',
    active: 'bg-green-500 text-white dark:bg-green-600'
  },
  Students: {
    normal: 'bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400',
    active: 'bg-purple-500 text-white dark:bg-purple-600'
  },
  Classes: {
    normal: 'bg-teal-500/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400',
    active: 'bg-teal-500 text-white dark:bg-teal-600'
  },
  Departments: {
    normal: 'bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400',
    active: 'bg-orange-500 text-white dark:bg-orange-600'
  },
  Courses: {
    normal: 'bg-pink-500/10 text-pink-600 dark:bg-pink-500/20 dark:text-pink-400',
    active: 'bg-pink-500 text-white dark:bg-pink-600'
  },
  Timetable: {
    normal: 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400',
    active: 'bg-indigo-500 text-white dark:bg-indigo-600'
  },
  Events: {
    normal: 'bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400',
    active: 'bg-cyan-500 text-white dark:bg-cyan-600'
  },
  Notifications: {
    normal: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
    active: 'bg-emerald-500 text-white dark:bg-emerald-600'
  },
  Queries: {
    normal: 'bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400',
    active: 'bg-red-500 text-white dark:bg-red-600'
  },
  Settings: {
    normal: 'bg-gray-500/10 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400',
    active: 'bg-gray-500 text-white dark:bg-gray-600'
  },
  Leave: {
      normal: 'bg-pink-500/10 text-pink-600 dark:bg-pink-500/20 dark:text-pink-400',
      active: 'bg-pink-500 text-white dark:bg-pink-600'
    },
    Attendance: {
    normal: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400',
    active: 'bg-amber-500 text-white dark:bg-amber-600'
  },
  Salary: {
    normal: 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400',
    active: 'bg-indigo-500 text-white dark:bg-indigo-600'
  },
  Performance: {
    normal: 'bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400',
    active: 'bg-purple-500 text-white dark:bg-purple-600'
  },
  Contracts: {
    normal: 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400',
    active: 'bg-green-500 text-white dark:bg-green-600'
  },
  Expenses: { 
    normal: 'bg-pink-500/10 text-pink-600 dark:bg-pink-500/20 dark:text-pink-400',
    active: 'bg-pink-500 text-white dark:bg-pink-600'
  },
  Reports: { 
    normal: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400',
    active: 'bg-amber-500 text-white dark:bg-amber-600'
  },
   Fee: {
    normal: 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400',
    active: 'bg-green-500 text-white dark:bg-green-600'
  },
  Quizzes: { 
    normal: 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400',
    active: 'bg-indigo-500 text-white dark:bg-indigo-600'
  },
  Assignments: {
    normal: 'bg-pink-500/10 text-pink-600 dark:bg-pink-500/20 dark:text-pink-400',
    active: 'bg-pink-500 text-white dark:bg-pink-600'
  },
  Grades: {
    normal: 'bg-teal-500/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400',
    active: 'bg-teal-500 text-white dark:bg-teal-600'
  },
  Survey: {
    normal: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
    active: 'bg-blue-500 text-white dark:bg-blue-600'
  }
};
export const LOGO_CONFIG = {
  SIZE: {
    EXPANDED: 'w-10 h-10',
    COLLAPSED: 'w-10 h-10' 
  },
  CONTAINER: {
    EXPANDED: 'w-10 h-10',
    COLLAPSED: 'w-12 h-12' 
  },
  TEXT: {
    EXPANDED: {
      primary: 'Admin LMS',
      secondary: 'Admin Learning System'
    },
    COLLAPSED: {
      primary: 'H'
    }
  }
};
export const ANIMATION_STYLES = {
  fadeIn: `
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .animate-fadeIn {
      animation: fadeIn 0.3s ease-out;
    }
  `
};
 export const DASHBOARD_CONSTANTS = {
  
      RECENT_ACTIVITIES: {
        ANIMATION: {
          DURATION: 0.5,
          STAGGER: 0.1
        },
        
        COLORS: {
          blue: 'from-blue-500 to-blue-600',
          green: 'from-green-500 to-green-600',
          purple: 'from-purple-500 to-purple-600',
          orange: 'from-orange-500 to-orange-600',
          teal: 'from-teal-500 to-teal-600'
        },
        ICON_BG: {
          blue: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
          green: 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400',
          purple: 'bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400',
          orange: 'bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400',
          teal: 'bg-teal-500/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400'
        }
      },
      QUICK_ACTIONS: {
        ANIMATION: {
          DURATION: 0.4,
          STAGGER: 0.08
        },
        COLORS: {
          blue: 'from-blue-500 to-blue-600',
          green: 'from-green-500 to-green-600',
          purple: 'from-purple-500 to-purple-600',
          orange: 'from-orange-500 to-orange-600'
        },
        ICON_BG: {
          blue: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
          green: 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400',
          purple: 'bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400',
          orange: 'bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400'
        }
      }
    };

export const USER_STATUS = {
  active: 'ACTIVE',
  pending: 'PENDING',
  blocked: 'BLOCKED'
};

export const USER_STATUS_COLOR = new Map([
  ['ACTIVE', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['PENDING', 'bg-yellow-200/40 text-yellow-700 dark:text-yellow-100 border-yellow-300'],
  ['BLOCKED', 'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10']
]);
export const LOGIN_ANIMATIONS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  },
  leftSide: {
    hidden: { opacity: 0, x: -60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: 0.3
      }
    }
  },
  rightSide: {
    hidden: { opacity: 0, x: 60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: 0.5
      }
    }
  },
  formContainer: {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.7
      }
    }
  },
  formItems: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.8
      }
    }
  },
  item: {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  },
  error: {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  },
  button: {
    hover: { scale: 1.02 },
    tap: { scale: 0.98 }
  },
  icon: {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  },
  image: {
    hover: { scale: 1.02 },
    transition: { duration: 0.3 }
  }
};

export const ANIMATION_CONFIG = {
  ease: {
    smooth: [0.25, 0.46, 0.45, 0.94],
    bounce: [0.68, -0.55, 0.265, 1.55],
    sharp: [0.4, 0, 0.6, 1]
  },
  duration: {
    fast: 0.3,
    normal: 0.5,
    slow: 0.8,
    verySlow: 1.2
  },
  stagger: {
    fast: 0.1,
    normal: 0.15,
    slow: 0.2
  }
};

export const CHART_CONSTANTS = {
  DEPARTMENT: {
    DISTRIBUTION: {
      type: 'bar',
      xAxisKey: 'department',
      bars: [
        { 
          dataKey: 'staff',
          name: 'Staff Count',
          color: '#3b82f6' 
        },
      ],
      chartConfig: {
        staff: {
          label: "Staff Count",
          color: "#3b82f6",
        }
      }
    },
    STATS: {
      type: 'bar',
      xAxisKey: 'name',
      bars: [
        { 
          dataKey: 'teacherCount',
          name: 'Teachers Count',
          color: '#3b82f6' 
        },
        { 
          dataKey: 'studentCount',
          name: 'Students Count', 
          color: '#3b82f6' 
        }
      ],
      chartConfig: {
        teachers: {
          label: "Teachers Count",
          color: "#3b82f6",
        },
        students: {
          label: "Students Count",
          color: "#3b82f6",
        }
      }
    }
  },
   SALARY: {
    DISTRIBUTION: {
      type: 'bar',
      xAxisKey: 'month',
      bars: [
        { 
          dataKey: 'paid', 
          name: 'salary.status.paid', 
          color: '#3b82f6' 
        },
        { 
          dataKey: 'unpaid', 
          name: 'salary.status.unpaid', 
          color: '#3b82f6' 
        },
        { 
          dataKey: 'partial', 
          name: 'salary.status.partial', 
          color: '#3b82f6' 
        }
      ],
      chartConfig: {
        paid: { label: "Paid", color: "#3b82f6" },
        unpaid: { label: "Unpaid", color: "#3b82f6" },
        partial: { label: "Partial", color: "#3b82f6" }
      }
    },
    BY_STATUS: {
      type: 'pie',
      colors: [
        "#10b981", 
        "#ef4444",
        "#f59e0b", 
        "#3b82f6", 
        "#8b5cf6",  
      ],
      chartConfig: {
        paid: { label: "Paid", color: "#3b82f6" },
        unpaid: { label: "Unpaid", color: "#3b82f6" },
        partial: { label: "Partial", color: "#3b82f6" },
        processing: { label: "Processing", color: "#3b82f6" },
        overdue: { label: "Overdue", color: "#3b82f6" }
      }
    }
  },
  ATTENDANCE: {
    DAILY: {
      type: 'bar',
      xAxisKey: 'date',
      bars: [
        { 
          dataKey: 'present',
          name: 'attendance.status.present',
          color: '#10b981' 
        },
        { 
          dataKey: 'absent',
          name: 'attendance.status.absent',
          color: '#ef4444' 
        },
        { 
          dataKey: 'late',
          name: 'attendance.status.late',
          color: '#f59e0b' 
        }
      ],
      chartConfig: {
        present: { label: "Present", color: "#10b981" },
        absent: { label: "Absent", color: "#ef4444" },
        late: { label: "Late", color: "#f59e0b" }
      }
    },
    STATUS_PIE: {
      type: 'pie',
      colors: [
        "#10b981", // Present
        "#ef4444", // Absent
        "#f59e0b", // Late
        "#3b82f6", // Excused
        "#8b5cf6", // Half Day
        "#6b7280"  // Leave
      ],
      chartConfig: {
        present: { label: "Present", color: "#10b981" },
        absent: { label: "Absent", color: "#ef4444" },
        late: { label: "Late", color: "#f59e0b" },
        excused: { label: "Excused", color: "#3b82f6" },
        halfDay: { label: "Half Day", color: "#8b5cf6" },
        leave: { label: "Leave", color: "#6b7280" }
      }
    },
    DEPARTMENT: {
      type: 'bar',
      xAxisKey: 'department',
      bars: [
        { 
          dataKey: 'attendanceRate',
          name: 'attendance.attendanceRate',
          color: '#3b82f6' 
        }
      ],
      chartConfig: {
        attendanceRate: { label: "Attendance Rate", color: "#3b82f6" }
      }
    }
  },
  STUDENT: {
    BY_CLASS: {
      type: 'bar',
      xAxisKey: 'class',
      bars: [
        { 
          dataKey: 'students',
          name: 'Students Count',
          color: '#3b82f6'
        }
      ],
      chartConfig: {
        students: {
          label: "Students Count",
          color: "#3b82f6",
        }
      }
    },
    BY_GRADE: {
      type: 'pie',
      colors: [
        "#60f63bff", 
        "#8b5cf6", 
        "#f59e0b", 
        "#ec4899", 
        "#10b981", 
        "#f97316"  
      ],
      chartConfig: {
        students: {
          label: "Students Count",
          color: "#3bf63bff",
        }
      }
    }
  },
  COURSE: {
    BY_CATEGORY: {
      type: 'bar',
      xAxisKey: 'category',
      bars: [
        { 
          dataKey: 'courses',
          name: 'Courses Count',
          color: '#3b82f6'
        }
      ],
      chartConfig: {
        courses: {
          label: "Courses Count",
          color: "#3b82f6",
        }
      }
    },
    BY_GRADE: {
      type: 'pie',
      colors: [
        "#60f63bff", 
        "#8b5cf6", 
        "#f59e0b", 
        "#ec4899", 
        "#10b981", 
        "#f97316"  
      ],
      chartConfig: {
        courses: {
          label: "Courses Count",
          color: "#3bf63bff",
        }
      }
    }
  },
  ROLE: {
    PIE: {
      type: 'pie',
      colors: [
        "#3b82f6", 
        "#8b5cf6", 
        "#f59e0b", 
        "#ec4899", 
        "#10b981"  
      ],
      chartConfig: {
        label: "Roles Distribution",
        color: "#3bf66aff",
      }
    }
  },
  STATUS: {
    PIE: {
      type: 'pie',
      colors: [
        "#10b981", 
        "#f59e0b", 
        "#8b5cf6", 
        "#ec4899"  
      ],
      chartConfig: {
        label: "Status Distribution",
        color: "#2532e0ff",
      }
    }
  },
  reviewTypeDistribution: [
      { name: 'Quarterly', value: 85, color: '#3b82f6' },
      { name: 'Half-Yearly', value: 35, color: '#8b5cf6' },
      { name: 'Annual', value: 28, color: '#10b981' },
      { name: 'Probation', value: 12, color: '#f59e0b' },
      { name: 'Special', value: 6, color: '#ec4899' }
    ],
    CONTRACT: {
    TYPE_DISTRIBUTION: {
      type: 'pie',
      colors: [
        "#3b82f6", // Contract
        "#8b5cf6", // Agreement
        "#10b981", // NOC
        "#f59e0b"  // Warning
      ],
      chartConfig: {
        contract: { label: "Contract", color: "#3b82f6" },
        agreement: { label: "Agreement", color: "#8b5cf6" },
        noc: { label: "NOC", color: "#10b981" },
        warning: { label: "Warning", color: "#f59e0b" }
      }
    },
    STATUS_DISTRIBUTION: {
      type: 'pie',
      colors: [
        "#10b981", // Active
        "#f59e0b", // Expiring
        "#ef4444"  // Expired
      ],
      chartConfig: {
        active: { label: "Active", color: "#10b981" },
        expiring: { label: "Expiring", color: "#f59e0b" },
        expired: { label: "Expired", color: "#ef4444" }
      }
    },
    DEPARTMENT_DISTRIBUTION: {
      type: 'bar',
      xAxisKey: 'name',
      bars: [
        { 
          dataKey: 'value',
          name: 'Contracts',
          color: '#3b82f6' 
        }
      ],
      chartConfig: {
        contracts: {
          label: "Contracts Count",
          color: "#3b82f6",
        }
      }
    }
  },
  EXPENSE: {
    CATEGORY: {
      type: 'pie',
      colors: [
        "#3b82f6", // Blue
        "#8b5cf6", // Purple
        "#f59e0b", // Amber
        "#ec4899", // Pink
        "#10b981", // Emerald
        "#f97316", // Orange
        "#6366f1", // Indigo
        "#14b8a6", // Teal
        "#ef4444"  // Red
      ],
      chartConfig: {
        stationery: { label: 'expense.categories.stationery', color: "#3b82f6" },
        utilities: { label: 'expense.categories.utilities', color: "#8b5cf6" },
        equipment: { label: 'expense.categories.equipment', color: "#f59e0b" },
        maintenance: { label: 'expense.categories.maintenance', color: "#ec4899" },
        transportation: { label: 'expense.categories.transportation', color: "#10b981" },
        events: { label: 'expense.categories.events', color: "#f97316" },
        salaries: { label: 'expense.categories.salaries', color: "#6366f1" },
        food: { label: 'expense.categories.food', color: "#14b8a6" },
        other: { label: 'expense.categories.other', color: "#ef4444" }
      }
    },
    STATUS: {
      type: 'bar',
      xAxisKey: 'name',
      bars: [
        { 
          dataKey: 'value', 
          name: 'expense.status', 
          color: '#3b82f6' // Blue color for status bars
        }
      ],
      chartConfig: {
        pending: { label: 'expense.status.pending', color: "#3b82f6" },
        approved: { label: 'expense.status.approved', color: "#3b82f6" },
        rejected: { label: 'expense.status.rejected', color: "#3b82f6" },
        recorded: { label: 'expense.status.recorded', color: "#3b82f6" }
      }
    }
  },
  REPORTS: {
    MONTHLY_COMPARISON: {
      type: 'bar',
      xAxisKey: 'month',
      bars: [
        { 
          dataKey: 'fee', 
          name: 'reports.feeAmount', 
          color: '#10b981' 
        },
        { 
          dataKey: 'expense', 
          name: 'reports.expenseAmount', 
          color: '#ef4444' 
        },
        { 
          dataKey: 'profit', 
          name: 'reports.profitLoss', 
          color: '#3b82f6' 
        }
      ],
      chartConfig: {
        fee: { label: "reports.feeAmount", color: "#10b981" },
        expense: { label: "reports.expenseAmount", color: "#ef4444" },
        profit: { label: "reports.profitLoss", color: "#3b82f6" }
      }
    },
    FEE_VS_EXPENSE: {
      type: 'pie',
      colors: [
        "#10b981", // Green for fees
        "#ef4444"  // Red for expenses
      ],
      chartConfig: {
        fee: { label: "reports.feeCollection", color: "#10b981" },
        expense: { label: "reports.expenses", color: "#ef4444" }
      }
    }
  },
 FEE: {
    COLLECTION_CHART: {
      type: 'bar',
      xAxisKey: 'month',
      bars: [
        { 
          dataKey: 'totalCollected', 
          name: 'fee.collection.totalCollected', 
          color: '#10b981' 
        },
        { 
          dataKey: 'transactions', 
          name: 'fee.collection.transactions', 
          color: '#3b82f6' 
        }
      ],
      chartConfig: {
        totalCollected: { label: "Total Collected", color: "#10b981" },
        transactions: { label: "Transactions", color: "#3b82f6" }
      }
    },
    STATUS_DISTRIBUTION: {
      type: 'pie',
      colors: [
        "#10b981", // Paid - Green
        "#f59e0b", // Partial - Amber
        "#ef4444", // Pending - Red
        "#8b5cf6", // Overdue - Purple
        "#6366f1"  // Waived - Indigo
      ],
      chartConfig: {
        paid: { label: "Paid", color: "#10b981" },
        partial: { label: "Partial", color: "#f59e0b" },
        pending: { label: "Pending", color: "#ef4444" },
        overdue: { label: "Overdue", color: "#8b5cf6" },
        waived: { label: "Waived", color: "#6366f1" }
      }
    }
  }
};

export const INPUT_STYLES = {
  base: "w-full py-3 border-0 border-b bg-transparent outline-none text-sm transition-colors duration-200 placeholder-gray-400 dark:placeholder-gray-500",
  light: "border-gray-300 text-gray-900 focus:border-blue-500",
  dark: "dark:border-gray-600 dark:text-gray-100 dark:focus:border-blue-400",
  focus: "focus:ring-0 focus:outline-none",
  rtl: (isRTL) => isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4',
  icon: {
    base: "absolute inset-y-0 flex items-center pointer-events-none text-gray-400 dark:text-gray-500 z-10",
    position: (isRTL) => isRTL ? 'right-0 pr-4' : 'left-0 pl-4'
  }
};


export const STAFF_ROLES = ['teacher', 'hr', 'accountant'];
export const ALL_USER_ROLES = ['student', 'teacher', 'hr', 'admin', 'accountant'];
export const STAFF_STATUSES = ['active', 'inactive', 'on-leave'];


export const MONTH_TRANSLATIONS = {
  en: {
    'January': 'January', 'February': 'February', 'March': 'March',
    'April': 'April', 'May': 'May', 'June': 'June',
    'July': 'July', 'August': 'August', 'September': 'September',
    'October': 'October', 'November': 'November', 'December': 'December'
  },
  ar: {
    'January': 'يناير', 'February': 'فبراير', 'March': 'مارس',
    'April': 'أبريل', 'May': 'مايو', 'June': 'يونيو',
    'July': 'يوليو', 'August': 'أغسطس', 'September': 'سبتمبر',
    'October': 'أكتوبر', 'November': 'نوفمبر', 'December': 'ديسمبر'
  }
};


export const DEPARTMENTS = ['Mathematics', 'Science', 'Languages', 'Social Studies'];
export const BUTTON_STYLES = {
  base: "w-full py-3 px-4 rounded font-medium text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1",
  primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600 dark:focus:ring-blue-400",
  disabled: "bg-blue-400 text-white cursor-not-allowed dark:bg-blue-600"
};

export const CARD_STYLES = {
  base: "border-0 shadow-none bg-transparent",
  content: "p-0 space-y-6"
};

export const TEXT_STYLES = {
  welcome: {
    title: "text-2xl font-light text-gray-800 dark:text-gray-100 mb-2 tracking-wide",
    description: "text-gray-500 dark:text-gray-400 text-sm"
  },
  login: {
    title: "text-lg font-medium text-gray-900 dark:text-gray-100 mb-1",
    subtitle: "text-gray-500 dark:text-gray-400 text-xs"
  },
  label: "text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wide",
  error: "text-red-500 dark:text-red-400 text-xs mt-2",
  secure: "text-xs text-gray-400 dark:text-gray-500"
};

export const LAYOUT_STYLES = {
  container: "min-h-screen flex bg-white dark:bg-gray-900 transition-colors duration-200",
  leftSide: "hidden lg:flex flex-1 bg-gray-50 dark:bg-gray-800 items-center justify-center p-8 transition-colors duration-200",
  rightSide: "flex-1 flex items-center justify-center p-8 bg-white dark:bg-gray-900 transition-colors duration-200",
  formMaxWidth: "w-full max-w-md"
};

export const ICON_SIZES = {
  input: 18,
  profile: 24,
  user: 24
};
export const TABLE_STYLES = {
  CARD: {
    base: "border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white via-white to-gray-50/80 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900/80 backdrop-blur-sm",
    header: "pb-4 border-b border-gray-100 dark:border-gray-700",
    title: "flex items-center gap-3"  // REMOVED: text-xl font-bold text-gray-900 dark:text-white
  },
  HEADER: {
    base: "bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm",
    row: "hover:bg-transparent border-b border-gray-200 dark:border-gray-700",
    cell: "font-semibold text-gray-900 dark:text-white py-4 text-xs"
  },
  BODY: {
    row: "border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50/80 dark:hover:bg-gray-700/50 transition-all duration-300 group cursor-pointer backdrop-blur-sm"
  },
  EMPTY_STATE: {
    container: "py-12 text-center",
    icon: "w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4",
    title: "text-gray-500 dark:text-gray-400 font-medium text-lg mb-2",
    description: "text-sm text-gray-400 dark:text-gray-500"
  }
};
export const LEAVE_CONSTANTS = {
  CHART_CONFIG: {
    leaveDistribution: {
      type: 'bar',
      xAxisKey: 'month',
      bars: [
        { 
          dataKey: 'approved',
          name: 'leave.status.approved', 
        },
        { 
          dataKey: 'pending',
          name: 'leave.status.pending',
          color: '#f59e0b' 
        },
        { 
          dataKey: 'rejected',
          name: 'leave.status.rejected',
          color: '#ef4444' 
        }
      ],
      chartConfig: {
        approved: { label: "Approved", color: "#10b981" },
        pending: { label: "Pending", color: "#f59e0b" },
        rejected: { label: "Rejected", color: "#ef4444" }
      }
    },
    typeDistribution: {
      type: 'pie',
      colors: [
        "#8b5cf6", // Sick
        "#3b82f6", // Casual
        "#10b981", // Annual
        "#6b7280", // Unpaid
        "#f59e0b"  // Other
      ],
      chartConfig: {
        sick: { label: "Sick Leave", color: "#8b5cf6" },
        casual: { label: "Casual Leave", color: "#3b82f6" },
        annual: { label: "Annual Leave", color: "#10b981" },
        unpaid: { label: "Unpaid Leave", color: "#6b7280" },
        other: { label: "Other Leave", color: "#f59e0b" }
      }
    }
  }
}
export const PERFORMANCE_CONSTANTS = {
  CHART_CONFIG: {
    monthlyTrend: {
      type: 'line',
      xAxisKey: 'month',
      lines: [
        { 
          dataKey: 'avgRating',
          name: 'performance.avgRating',
          color: '#8b5cf6',
          strokeWidth: 3
        },
        { 
          dataKey: 'reviews',
          name: 'performance.reviews',
          color: '#3b82f6',
          strokeWidth: 2
        }
      ],
      chartConfig: {
        avgRating: { label: "Average Rating", color: "#8b5cf6" },
        reviews: { label: "Number of Reviews", color: "#3b82f6" }
      }
    },
    ratingDistribution: {
      type: 'bar',
      xAxisKey: 'rating',
      bars: [
        { 
          dataKey: 'count',
          name: 'performance.count',
          color: '#10b981'
        }
      ],
      chartConfig: {
        count: { label: "Count", color: "#10b981" }
      }
    },
    departmentPerformance: {
      type: 'bar',
      xAxisKey: 'department',
      bars: [
        { 
          dataKey: 'avgRating',
          name: 'performance.avgRating',
          color: '#3b82f6'
        }
      ],
      chartConfig: {
        avgRating: { label: "Average Rating", color: "#3b82f6" }
      }
    },
    reviewTypeDistribution: {
      type: 'pie',
      colors: [
        "#3b82f6", // Quarterly
        "#8b5cf6", // Half-Yearly
        "#10b981", // Annual
        "#f59e0b", // Probation
        "#ec4899"  // Special
      ],
      chartConfig: {
        quarterly: { label: "Quarterly", color: "#3b82f6" },
        halfYearly: { label: "Half-Yearly", color: "#8b5cf6" },
        annual: { label: "Annual", color: "#10b981" },
        probation: { label: "Probation", color: "#f59e0b" },
        special: { label: "Special", color: "#ec4899" }
      }
    }
  },
  
  RATING_COLORS: {
    1: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-300',
    2: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/40 dark:text-orange-300',
    3: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300',
    4: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300',
    5: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300'
  },
  
  STATUS_COLORS: {
    draft: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/40 dark:text-gray-300',
    submitted: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300',
    acknowledged: 'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/40 dark:text-teal-300',
    disputed: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-300',
    finalized: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300'
  },
  
  REVIEW_TYPE_COLORS: {
    quarterly: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300',
    'half-yearly': 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300',
    annual: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300',
    probation: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300',
    special: 'bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/40 dark:text-pink-300'
  }
};
export const SETTINGS_CONSTANTS = {
  TABS: {
    PROFILE: 'profile',
    SECURITY: 'security',
    NOTIFICATIONS: 'notifications',
    LOGOUT: 'logout'
  },
  ANIMATION: {
    DURATION: 0.3,
    STAGGER: 0.1
  },
};
export const MODAL_STYLES = {
  MULTILINGUAL: {
    container: "p-5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-green-100 dark:border-gray-700 shadow-sm",
    header: "flex items-center gap-3",
    iconContainer: "p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg",
    title: "font-semibold text-gray-900 dark:text-white",
    description: "text-sm text-gray-600 dark:text-gray-400",
    modeToggle: "flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700",
    languageCard: (isActive) => 
      `p-4 rounded-lg border transition-all duration-200 ${
        isActive 
          ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800'
          : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
      }`,
    instructions: "mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg",
    instructionText: "text-sm text-blue-700 dark:text-blue-300"
  }
};

export const SIDEBAR_CONSTANTS = {
  WIDTH: CONSTANTS.SIDEBAR_WIDTH,
  ANIMATION: CONSTANTS.SIDEBAR_ANIMATION,
  BREAKPOINT: CONSTANTS.SIDEBAR_BREAKPOINT,
  KEYBOARD_SHORTCUT: CONSTANTS.SIDEBAR_KEYBOARD_SHORTCUT,
  STATES: SIDEBAR_STATES,
  VARIANTS: SIDEBAR_VARIANTS,
  COLLAPSIBLE: SIDEBAR_COLLAPSIBLE,
  COLORS: SIDEBAR_COLORS,
  ICON: ICON_CONFIG,
  LOGO: LOGO_CONFIG
};

export const LOGIN_CONSTANTS = {
  ANIMATIONS: LOGIN_ANIMATIONS,
  ANIMATION_CONFIG: ANIMATION_CONFIG,
  INPUT_STYLES: INPUT_STYLES,
  BUTTON_STYLES: BUTTON_STYLES,
  CARD_STYLES: CARD_STYLES,
  TEXT_STYLES: TEXT_STYLES,
  LAYOUT_STYLES: LAYOUT_STYLES,
  ICON_SIZES: ICON_SIZES
};

export default CONSTANTS;
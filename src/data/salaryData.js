import { 
  DollarSign, 
  CreditCard, 
  AlertCircle, 
  TrendingUp,
} from 'lucide-react';

export const SALARY_DATA = {
  stats: [
    {
      title: "salary.totalSalaries",
      value: "₪ 245,800",
      change: "+12%",
      icon: DollarSign,
      color: "blue" 
    },
    {
      title: "salary.paid",
      value: "₪ 198,500",
      change: "+8%",
      icon: CreditCard,
      color: "green" 
    },
    {
      title: "salary.unpaid",
      value: "₪ 47,300",
      change: "-5%",
      icon: AlertCircle,
      color: "purple" 
    },
    {
      title: "salary.overdue",
      value: "₪ 12,000",
      change: "-2%",
      icon: TrendingUp,
      color: "teal" 
    }
  ],
  salaries: [
    {
      id: 1,
      teacher: {
        id: 101,
        teacherId: "TCH-001",
        name: "Dr. Sarah Wilson",
        role: "Professor"
      },
      month: 1,
      year: 2024,
      amount: 15000,
      baseAmount: 13500,
      bonus: 1000,
      deductions: 500,
      paymentStatus: "paid",
      paymentDate: "2024-01-30",
      dueDate: "2024-01-31",
      hoursWorked: 160,
      hourlyRate: 85,
      attendanceRecord: {
        workingDays: 22,
        presentDays: 20,
        absentDays: 2,
        holidays: 0
      }
    },
    {
      id: 2,
      teacher: {
        id: 102,
        teacherId: "TCH-002",
        name: "Prof. David Brown",
        role: "Associate Professor"
      },
      month: 1,
      year: 2024,
      amount: 12000,
      baseAmount: 11000,
      bonus: 800,
      deductions: 200,
      paymentStatus: "unpaid",
      paymentDate: null,
      dueDate: "2024-01-31",
      hoursWorked: 150,
      hourlyRate: 72,
      attendanceRecord: {
        workingDays: 22,
        presentDays: 21,
        absentDays: 1,
        holidays: 0
      }
    },
    {
      id: 3,
      teacher: {
        id: 103,
        teacherId: "TCH-003",
        name: "Dr. Maria Garcia",
        role: "Assistant Professor"
      },
      month: 1,
      year: 2024,
      amount: 9500,
      baseAmount: 9000,
      bonus: 500,
      deductions: 0,
      paymentStatus: "partial",
      paymentDate: "2024-01-25",
      dueDate: "2024-01-31",
      hoursWorked: 140,
      hourlyRate: 65,
      attendanceRecord: {
        workingDays: 22,
        presentDays: 22,
        absentDays: 0,
        holidays: 0
      }
    },
    {
      id: 4,
      teacher: {
        id: 104,
        teacherId: "TCH-004",
        name: "Prof. James Anderson",
        role: "Professor"
      },
      month: 12,
      year: 2023,
      amount: 16000,
      baseAmount: 14500,
      bonus: 1200,
      deductions: 300,
      paymentStatus: "paid",
      paymentDate: "2023-12-28",
      dueDate: "2023-12-31",
      hoursWorked: 170,
      hourlyRate: 88,
      attendanceRecord: {
        workingDays: 21,
        presentDays: 19,
        absentDays: 2,
        holidays: 0
      }
    },
    {
      id: 5,
      teacher: {
        id: 105,
        teacherId: "TCH-005",
        name: "Dr. Lisa Chen",
        role: "Lecturer"
      },
      month: 12,
      year: 2023,
      amount: 8500,
      baseAmount: 8000,
      bonus: 300,
      deductions: 200,
      paymentStatus: "overdue",
      paymentDate: null,
      dueDate: "2023-12-31",
      hoursWorked: 130,
      hourlyRate: 62,
      attendanceRecord: {
        workingDays: 21,
        presentDays: 20,
        absentDays: 1,
        holidays: 0
      }
    },
    {
      id: 6,
      teacher: {
        id: 106,
        teacherId: "TCH-006",
        name: "Prof. Robert Taylor",
        role: "Administrative Staff"
      },
      month: 12,
      year: 2023,
      amount: 11000,
      baseAmount: 10500,
      bonus: 500,
      deductions: 0,
      paymentStatus: "processing",
      paymentDate: null,
      dueDate: "2023-12-31",
      hoursWorked: 145,
      hourlyRate: 70,
      attendanceRecord: {
        workingDays: 21,
        presentDays: 21,
        absentDays: 0,
        holidays: 0
      }
    },
    {
      id: 7,
      teacher: {
        id: 107,
        teacherId: "TCH-007",
        name: "Dr. Emily Davis",
        role: "Support Staff"
      },
      month: 11,
      year: 2023,
      amount: 7800,
      baseAmount: 7500,
      bonus: 300,
      deductions: 0,
      paymentStatus: "paid",
      paymentDate: "2023-11-29",
      dueDate: "2023-11-30",
      hoursWorked: 125,
      hourlyRate: 60,
      attendanceRecord: {
        workingDays: 22,
        presentDays: 22,
        absentDays: 0,
        holidays: 0
      }
    },
    {
      id: 8,
      teacher: {
        id: 108,
        teacherId: "TCH-008",
        name: "Prof. Michael Johnson",
        role: "Professor"
      },
      month: 11,
      year: 2023,
      amount: 15500,
      baseAmount: 14000,
      bonus: 1200,
      deductions: 300,
      paymentStatus: "paid",
      paymentDate: "2023-11-27",
      dueDate: "2023-11-30",
      hoursWorked: 165,
      hourlyRate: 86,
      attendanceRecord: {
        workingDays: 22,
        presentDays: 20,
        absentDays: 2,
        holidays: 0
      }
    }
  ],
  paymentHistory: [
    {
      id: 1,
      salaryId: 1,
      staffId: 101,
      staffName: "Dr. Sarah Wilson",
      amount: 15000,
      paymentDate: "2024-01-30",
      paymentMethod: "bank-transfer",
      paymentType: "regular",
      description: "Salary payment for January 2024",
      transactionId: "TRX-20240130-001",
      status: "completed",
      receiptUrl: "/receipts/salary-001.pdf",
      fileSize: 2048,
      generateInvoice: true,
      sendProofToStaff: true,
      createdAt: "2024-01-30",
      department: "Professor"
    },
    {
      id: 2,
      salaryId: 3,
      staffId: 103,
      staffName: "Dr. Maria Garcia",
      amount: 5000,
      paymentDate: "2024-01-25",
      paymentMethod: "online",
      paymentType: "partial",
      description: "Partial salary payment for January 2024",
      transactionId: "TRX-20240125-001",
      status: "completed",
      receiptUrl: "/receipts/salary-002.pdf",
      fileSize: 2048,
      generateInvoice: true,
      sendProofToStaff: true,
      createdAt: "2024-01-25",
      department: "Assistant Professor"
    },
    {
      id: 3,
      salaryId: 4,
      staffId: 104,
      staffName: "Prof. James Anderson",
      amount: 16000,
      paymentDate: "2023-12-28",
      paymentMethod: "bank-transfer",
      paymentType: "regular",
      description: "Salary payment for December 2023",
      transactionId: "TRX-20231228-001",
      status: "completed",
      receiptUrl: "/receipts/salary-003.pdf",
      fileSize: 2048,
      generateInvoice: true,
      sendProofToStaff: true,
      createdAt: "2023-12-28",
      department: "Professor"
    },
    {
      id: 4,
      salaryId: 7,
      staffId: 107,
      staffName: "Dr. Emily Davis",
      amount: 7800,
      paymentDate: "2023-11-29",
      paymentMethod: "cash",
      paymentType: "regular",
      description: "Salary payment for November 2023",
      transactionId: "TRX-20231129-001",
      status: "completed",
      receiptUrl: null,
      fileSize: 0,
      generateInvoice: false,
      sendProofToStaff: false,
      createdAt: "2023-11-29",
      department: "Support Staff"
    },
    {
      id: 5,
      salaryId: 8,
      staffId: 108,
      staffName: "Prof. Michael Johnson",
      amount: 15500,
      paymentDate: "2023-11-27",
      paymentMethod: "check",
      paymentType: "regular",
      description: "Salary payment for November 2023",
      transactionId: "TRX-20231127-001",
      status: "completed",
      receiptUrl: "/receipts/salary-005.pdf",
      fileSize: 2048,
      generateInvoice: true,
      sendProofToStaff: true,
      createdAt: "2023-11-27",
      department: "Professor"
    },
    {
      id: 6,
      salaryId: null,
      staffId: 109,
      staffName: "Mr. John Smith",
      amount: 5000,
      paymentDate: "2024-02-15",
      paymentMethod: "online",
      paymentType: "bonus",
      description: "Performance bonus Q4 2023",
      transactionId: "TRX-20240215-001",
      status: "completed",
      receiptUrl: "/receipts/bonus-001.pdf",
      fileSize: 2048,
      generateInvoice: true,
      sendProofToStaff: true,
      createdAt: "2024-02-15",
      department: "Marketing"
    },
    {
      id: 7,
      salaryId: null,
      staffId: 110,
      staffName: "Ms. Anna Lee",
      amount: 3000,
      paymentDate: "2024-02-10",
      paymentMethod: "bank-transfer",
      paymentType: "advance",
      description: "Salary advance for February 2024",
      transactionId: "TRX-20240210-001",
      status: "pending",
      receiptUrl: null,
      fileSize: 0,
      generateInvoice: false,
      sendProofToStaff: false,
      createdAt: "2024-02-10",
      department: "HR"
    },
    {
      id: 8,
      salaryId: null,
      staffId: 111,
      staffName: "Mr. Alex Johnson",
      amount: 4500,
      paymentDate: "2024-02-05",
      paymentMethod: "online",
      paymentType: "deduction",
      description: "Insurance premium deduction",
      transactionId: "TRX-20240205-001",
      status: "completed",
      receiptUrl: "/receipts/deduction-001.pdf",
      fileSize: 2048,
      generateInvoice: true,
      sendProofToStaff: false,
      createdAt: "2024-02-05",
      department: "Finance"
    }
  ]
};
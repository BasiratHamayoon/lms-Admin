import { 
  DollarSign, 
  CreditCard, 
  TrendingUp,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';

export const FEE_DATA = {
  stats: [
    {
      title: "fee.totalCollection",
      value: "₪ 450,800",
      change: "+15%",
      icon: DollarSign,
      color: "teal" 
    },
    {
      title: "fee.paidFees",
      value: "₪ 380,500",
      change: "+12%",
      icon: CheckCircle,
      color: "green" 
    },
    {
      title: "fee.pendingFees",
      value: "₪ 70,300",
      change: "-8%",
      icon: AlertCircle,
      color: "orange" 
    },
    {
      title: "fee.overdueFees",
      value: "₪ 25,000",
      change: "-3%",
      icon: AlertTriangle,
      color: "red" 
    }
  ],
  
  feeStructures: [
    {
      id: 1,
      name: {
        en: "Standard Tuition Fee 2024",
        ar: "الرسوم الدراسية القياسية 2024"
      },
      academicYear: "2024-2025",
      class: {
        id: 1,
        name: "Grade 10 A"
      },
      totalAmount: 15000,
      componentCount: 5,
      isDefault: true,
      status: "active",
      createdAt: "2024-01-15",
      components: [
        {
          id: 1,
          name: {
            en: "Tuition Fee",
            ar: "رسوم التعليم"
          },
          amount: 10000,
          frequency: "yearly",
          optional: false,
          dueDate: "2024-08-01"
        },
        {
          id: 2,
          name: {
            en: "Lab Fee",
            ar: "رسوم المختبر"
          },
          amount: 2000,
          frequency: "yearly",
          optional: false,
          dueDate: "2024-08-01"
        },
        {
          id: 3,
          name: {
            en: "Library Fee",
            ar: "رسوم المكتبة"
          },
          amount: 1000,
          frequency: "yearly",
          optional: false,
          dueDate: "2024-08-01"
        },
        {
          id: 4,
          name: {
            en: "Sports Fee",
            ar: "رسوم الرياضة"
          },
          amount: 1500,
          frequency: "yearly",
          optional: false,
          dueDate: "2024-08-01"
        },
        {
          id: 5,
          name: {
            en: "Examination Fee",
            ar: "رسوم الامتحان"
          },
          amount: 500,
          frequency: "yearly",
          optional: false,
          dueDate: "2024-12-01"
        }
      ]
    },
    {
      id: 2,
      name: {
        en: "Transportation Package",
        ar: "باقة النقل"
      },
      academicYear: "2024-2025",
      class: {
        id: null,
        name: "All Classes"
      },
      totalAmount: 6000,
      componentCount: 2,
      isDefault: false,
      status: "active",
      createdAt: "2024-01-20",
      components: [
        {
          id: 6,
          name: {
            en: "Bus Fee",
            ar: "رسوم الباص"
          },
          amount: 5000,
          frequency: "yearly",
          optional: true,
          dueDate: "2024-08-01"
        },
        {
          id: 7,
          name: {
            en: "Maintenance Fee",
            ar: "رسوم الصيانة"
          },
          amount: 1000,
          frequency: "yearly",
          optional: true,
          dueDate: "2024-08-01"
        }
      ]
    },
    {
      id: 3,
      name: {
        en: "Science Stream Grade 11",
        ar: "تخصص العلوم الصف 11"
      },
      academicYear: "2024-2025",
      class: {
        id: 3,
        name: "Grade 11 Science"
      },
      totalAmount: 18000,
      componentCount: 6,
      isDefault: true,
      status: "active",
      createdAt: "2024-01-25",
      components: [
        {
          id: 8,
          name: {
            en: "Tuition Fee",
            ar: "رسوم التعليم"
          },
          amount: 12000,
          frequency: "yearly",
          optional: false,
          dueDate: "2024-08-01"
        },
        {
          id: 9,
          name: {
            en: "Lab Fee",
            ar: "رسوم المختبر"
          },
          amount: 3000,
          frequency: "yearly",
          optional: false,
          dueDate: "2024-08-01"
        },
        {
          id: 10,
          name: {
            en: "Special Equipment",
            ar: "معدات خاصة"
          },
          amount: 2000,
          frequency: "one-time",
          optional: true,
          dueDate: "2024-08-15"
        },
        {
          id: 11,
          name: {
            en: "Field Trip",
            ar: "رحلة ميدانية"
          },
          amount: 1000,
          frequency: "yearly",
          optional: true,
          dueDate: "2024-10-01"
        }
      ]
    }
  ],
  
  // Add this new student data for selection
  students: [
    {
      id: 101,
      studentId: "STU-001",
      name: "Ahmed Hassan",
      email: "ahmed.hassan@example.com",
      class: {
        id: 1,
        name: "Grade 10 A"
      },
      phone: "+1234567890"
    },
    {
      id: 102,
      studentId: "STU-002",
      name: "Fatima Ali",
      email: "fatima.ali@example.com",
      class: {
        id: 1,
        name: "Grade 10 A"
      },
      phone: "+1234567891"
    },
    {
      id: 103,
      studentId: "STU-003",
      name: "Mohammed Khalid",
      email: "mohammed.khalid@example.com",
      class: {
        id: 3,
        name: "Grade 11 Science"
      },
      phone: "+1234567892"
    },
    {
      id: 104,
      studentId: "STU-004",
      name: "Sara Mohammed",
      email: "sara.mohammed@example.com",
      class: {
        id: 3,
        name: "Grade 11 Science"
      },
      phone: "+1234567893"
    },
    {
      id: 105,
      studentId: "STU-005",
      name: "Yousef Ahmed",
      email: "yousef.ahmed@example.com",
      class: {
        id: 2,
        name: "Grade 10 B"
      },
      phone: "+1234567894"
    },
    {
      id: 106,
      studentId: "STU-006",
      name: "Layla Ibrahim",
      email: "layla.ibrahim@example.com",
      class: {
        id: 2,
        name: "Grade 10 B"
      },
      phone: "+1234567895"
    }
  ],
  
  studentFees: [
    {
      id: 1,
      student: {
        id: 101,
        studentId: "STU-001",
        name: "Ahmed Hassan",
        email: "ahmed.hassan@example.com"
      },
      class: {
        id: 1,
        name: "Grade 10 A"
      },
      academicYear: "2024-2025",
      feeStructureId: 1,
      totalAmount: 15000,
      paidAmount: 15000,
      pendingAmount: 0,
      lastPaymentDate: "2024-08-15",
      components: [
        {
          id: 1,
          name: "Tuition Fee",
          amount: 10000,
          paidAmount: 10000,
          status: "paid",
          dueDate: "2024-08-01",
          paidDate: "2024-08-10"
        },
        {
          id: 2,
          name: "Lab Fee",
          amount: 2000,
          paidAmount: 2000,
          status: "paid",
          dueDate: "2024-08-01",
          paidDate: "2024-08-10"
        },
        {
          id: 3,
          name: "Library Fee",
          amount: 1000,
          paidAmount: 1000,
          status: "paid",
          dueDate: "2024-08-01",
          paidDate: "2024-08-10"
        },
        {
          id: 4,
          name: "Sports Fee",
          amount: 1500,
          paidAmount: 1500,
          status: "paid",
          dueDate: "2024-08-01",
          paidDate: "2024-08-10"
        },
        {
          id: 5,
          name: "Examination Fee",
          amount: 500,
          paidAmount: 500,
          status: "paid",
          dueDate: "2024-12-01",
          paidDate: "2024-08-15"
        }
      ],
      discounts: []
    },
    {
      id: 2,
      student: {
        id: 102,
        studentId: "STU-002",
        name: "Fatima Ali",
        email: "fatima.ali@example.com"
      },
      class: {
        id: 1,
        name: "Grade 10 A"
      },
      academicYear: "2024-2025",
      feeStructureId: 1,
      totalAmount: 15000,
      paidAmount: 10000,
      pendingAmount: 5000,
      lastPaymentDate: "2024-08-12",
      components: [
        {
          id: 1,
          name: "Tuition Fee",
          amount: 10000,
          paidAmount: 10000,
          status: "paid",
          dueDate: "2024-08-01",
          paidDate: "2024-08-12"
        },
        {
          id: 2,
          name: "Lab Fee",
          amount: 2000,
          paidAmount: 0,
          status: "pending",
          dueDate: "2024-08-01"
        },
        {
          id: 3,
          name: "Library Fee",
          amount: 1000,
          paidAmount: 0,
          status: "pending",
          dueDate: "2024-08-01"
        },
        {
          id: 4,
          name: "Sports Fee",
          amount: 1500,
          paidAmount: 0,
          status: "pending",
          dueDate: "2024-08-01"
        },
        {
          id: 5,
          name: "Examination Fee",
          amount: 500,
          paidAmount: 0,
          status: "pending",
          dueDate: "2024-12-01"
        }
      ],
      discounts: [
        {
          id: 1,
          name: "Sibling Discount",
          amount: 1000,
          percentage: null,
          reason: "Sibling studying in same school"
        }
      ]
    },
    {
      id: 3,
      student: {
        id: 103,
        studentId: "STU-003",
        name: "Mohammed Khalid",
        email: "mohammed.khalid@example.com"
      },
      class: {
        id: 3,
        name: "Grade 11 Science"
      },
      academicYear: "2024-2025",
      feeStructureId: 3,
      totalAmount: 18000,
      paidAmount: 12000,
      pendingAmount: 6000,
      lastPaymentDate: "2024-08-20",
      components: [
        {
          id: 8,
          name: "Tuition Fee",
          amount: 12000,
          paidAmount: 12000,
          status: "paid",
          dueDate: "2024-08-01",
          paidDate: "2024-08-20"
        },
        {
          id: 9,
          name: "Lab Fee",
          amount: 3000,
          paidAmount: 0,
          status: "overdue",
          dueDate: "2024-08-01"
        },
        {
          id: 10,
          name: "Special Equipment",
          amount: 2000,
          paidAmount: 0,
          status: "pending",
          dueDate: "2024-08-15"
        },
        {
          id: 11,
          name: "Field Trip",
          amount: 1000,
          paidAmount: 0,
          status: "pending",
          dueDate: "2024-10-01"
        }
      ],
      discounts: []
    },
    {
      id: 4,
      student: {
        id: 104,
        studentId: "STU-004",
        name: "Sara Mohammed",
        email: "sara.mohammed@example.com"
      },
      class: {
        id: 3,
        name: "Grade 11 Science"
      },
      academicYear: "2024-2025",
      feeStructureId: 3,
      totalAmount: 18000,
      paidAmount: 6000,
      pendingAmount: 12000,
      lastPaymentDate: "2024-08-05",
      components: [
        {
          id: 8,
          name: "Tuition Fee",
          amount: 12000,
          paidAmount: 6000,
          status: "partial",
          dueDate: "2024-08-01",
          paidDate: "2024-08-05"
        },
        {
          id: 9,
          name: "Lab Fee",
          amount: 3000,
          paidAmount: 0,
          status: "pending",
          dueDate: "2024-08-01"
        },
        {
          id: 10,
          name: "Special Equipment",
          amount: 2000,
          paidAmount: 0,
          status: "pending",
          dueDate: "2024-08-15"
        },
        {
          id: 11,
          name: "Field Trip",
          amount: 1000,
          paidAmount: 0,
          status: "pending",
          dueDate: "2024-10-01"
        }
      ],
      discounts: [
        {
          id: 2,
          name: "Merit Scholarship",
          amount: 2000,
          percentage: null,
          reason: "Top performer in entrance exam"
        }
      ]
    }
  ],
  
  feeTransactions: [
    {
      id: 1,
      transactionId: "TRX-20240810-001",
      studentId: 101,
      feeId: 1,
      componentId: "1",
      amount: 10000,
      paymentDate: "2024-08-10",
      paymentMethod: "bank-transfer",
      paymentDetails: {
        bankName: "National Bank",
        accountNumber: "****1234"
      },
      receiptNumber: "RCPT-20240810-001",
      academicYear: "2024-2025",
      status: "completed",
      transactionType: "payment",
      notes: {
        en: "Tuition fee payment for August 2024",
        ar: "دفع رسوم التعليم لشهر أغسطس 2024"
      },
      receivedBy: {
        id: 1,
        name: "Admin User"
      },
      invoiceId: "INV-20240810-001"
    },
    {
      id: 2,
      transactionId: "TRX-20240810-002",
      studentId: 101,
      feeId: 1,
      componentId: "2",
      amount: 2000,
      paymentDate: "2024-08-10",
      paymentMethod: "bank-transfer",
      paymentDetails: {
        bankName: "National Bank",
        accountNumber: "****1234"
      },
      receiptNumber: "RCPT-20240810-002",
      academicYear: "2024-2025",
      status: "completed",
      transactionType: "payment",
      notes: {
        en: "Lab fee payment",
        ar: "دفع رسوم المختبر"
      },
      receivedBy: {
        id: 1,
        name: "Admin User"
      },
      invoiceId: "INV-20240810-002"
    },
    {
      id: 3,
      transactionId: "TRX-20240812-001",
      studentId: 102,
      feeId: 2,
      componentId: "1",
      amount: 10000,
      paymentDate: "2024-08-12",
      paymentMethod: "cash",
      paymentDetails: {},
      receiptNumber: "RCPT-20240812-001",
      academicYear: "2024-2025",
      status: "completed",
      transactionType: "payment",
      notes: {
        en: "Full tuition fee payment",
        ar: "دفع كامل رسوم التعليم"
      },
      receivedBy: {
        id: 2,
        name: "Cashier"
      },
      invoiceId: "INV-20240812-001"
    },
    {
      id: 4,
      transactionId: "TRX-20240820-001",
      studentId: 103,
      feeId: 3,
      componentId: "8",
      amount: 12000,
      paymentDate: "2024-08-20",
      paymentMethod: "online",
      paymentDetails: {
        paymentGateway: "Stripe",
        cardLast4: "4242"
      },
      receiptNumber: "RCPT-20240820-001",
      academicYear: "2024-2025",
      status: "completed",
      transactionType: "payment",
      notes: {
        en: "Online payment for tuition fee",
        ar: "دفع إلكتروني لرسوم التعليم"
      },
      receivedBy: {
        id: 1,
        name: "Admin User"
      },
      invoiceId: "INV-20240820-001"
    },
    {
      id: 5,
      transactionId: "TRX-20240805-001",
      studentId: 104,
      feeId: 4,
      componentId: "8",
      amount: 6000,
      paymentDate: "2024-08-05",
      paymentMethod: "cheque",
      paymentDetails: {
        chequeNumber: "CHQ-789012"
      },
      receiptNumber: "RCPT-20240805-001",
      academicYear: "2024-2025",
      status: "completed",
      transactionType: "payment",
      notes: {
        en: "Partial tuition fee payment by cheque",
        ar: "دفع جزئي لرسوم التعليم بشيك"
      },
      receivedBy: {
        id: 2,
        name: "Cashier"
      },
      invoiceId: "INV-20240805-001"
    }
  ]
};
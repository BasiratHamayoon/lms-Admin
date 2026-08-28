import { 
  DollarSign, 
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

export const EXPENSE_DATA = {
  stats: [
    {
      title: "expense.totalExpense",
      value: "245.6k",
      change: "+12.5%",
      icon: DollarSign,
      color: "blue" 
    },
    {
      title: "expense.approvedExpense",
      value: "765.8k",
      change: "+8.2%",
      icon: CheckCircle,
      color: "green" 
    },
    {
      title: "expense.pendingExpense",
      value: "999.9k",
      change: "+15.3%",
      icon: Clock,
      color: "purple" 
    },
    {
      title: "expense.rejectedExpense",
      value: "8765.2k",
      change: "-3.1%",
      icon: AlertCircle,
      color: "teal" 
    }
  ],
  expenses: [
    {
      id: 1,
      expenseId: "EXP-2023-001",
      title: {
        en: "Office Stationery",
        ar: "لوازم المكتب"
      },
      amount: 12500,
      date: "2023-10-15",
      category: "stationery",
      subcategory: {
        en: "Paper & Supplies",
        ar: "أوراق ومستلزمات"
      },
      paymentMethod: "bank-transfer",
      paymentDetails: {
        bankName: "Zenith Bank",
        transactionId: "TX00123456"
      },
      description: {
        en: "Purchase of office stationery for Q4 2023",
        ar: "شراء لوازم المكتب للربع الرابع 2023"
      },
      department: {
        id: 1,
        name: {
          en: "Administration",
          ar: "الإدارة"
        }
      },
      submittedBy: {
        id: 1,
        name: "John Smith"
      },
      approvedBy: {
        id: 2,
        name: "Admin User"
      },
      status: "approved",
      receipt: {
        hasReceipt: true,
        file: {
          name: "stationery-invoice.pdf",
          size: 2450000
        }
      },
      tags: ["office", "stationery", "q4"]
    },
    {
      id: 2,
      expenseId: "EXP-2023-002",
      title: {
        en: "Electricity Bill",
        ar: "فاتورة الكهرباء"
      },
      amount: 45000,
      date: "2023-10-20",
      category: "utilities",
      subcategory: {
        en: "Electricity",
        ar: "كهرباء"
      },
      paymentMethod: "online",
      paymentDetails: {
        transactionId: "TX00123457"
      },
      description: {
        en: "Monthly electricity bill payment",
        ar: "دفع فاتورة الكهرباء الشهرية"
      },
      department: {
        id: 2,
        name: {
          en: "Maintenance",
          ar: "الصيانة"
        }
      },
      submittedBy: {
        id: 3,
        name: "Mike Johnson"
      },
      approvedBy: {
        id: 2,
        name: "Admin User"
      },
      status: "approved",
      receipt: {
        hasReceipt: true,
        file: {
          name: "electricity-bill.pdf",
          size: 1500000
        }
      },
      tags: ["utilities", "monthly"]
    },
    {
      id: 3,
      expenseId: "EXP-2023-003",
      title: {
        en: "Printer Repair",
        ar: "إصلاح الطابعة"
      },
      amount: 7500,
      date: "2023-10-25",
      category: "maintenance",
      subcategory: {
        en: "Equipment Repair",
        ar: "إصلاح المعدات"
      },
      paymentMethod: "cash",
      paymentDetails: {
        payeeName: "Tech Repairs Ltd"
      },
      description: {
        en: "Repair of office printer",
        ar: "إصلاح طابعة المكتب"
      },
      department: {
        id: 3,
        name: {
          en: "IT Department",
          ar: "قسم تكنولوجيا المعلومات"
        }
      },
      submittedBy: {
        id: 4,
        name: "Sarah Wilson"
      },
      approvedBy: null,
      status: "pending",
      receipt: {
        hasReceipt: false
      },
      tags: ["repair", "it", "equipment"]
    },
    {
      id: 4,
      expenseId: "EXP-2023-004",
      title: {
        en: "Transportation Allowance",
        ar: "بدل المواصلات"
      },
      amount: 12000,
      date: "2023-10-28",
      category: "transportation",
      subcategory: {
        en: "Staff Allowance",
        ar: "بدل الموظفين"
      },
      paymentMethod: "bank-transfer",
      paymentDetails: {
        bankName: "GTBank",
        accountNumber: "0123456789"
      },
      description: {
        en: "October transportation allowance for staff",
        ar: "بدل المواصلات لشهر أكتوبر للموظفين"
      },
      department: {
        id: 1,
        name: {
          en: "Administration",
          ar: "الإدارة"
        }
      },
      submittedBy: {
        id: 1,
        name: "John Smith"
      },
      approvedBy: {
        id: 2,
        name: "Admin User"
      },
      status: "recorded",
      receipt: {
        hasReceipt: true,
        file: {
          name: "transport-allowance.pdf",
          size: 980000
        }
      },
      tags: ["allowance", "transport", "monthly"]
    },
    {
      id: 5,
      expenseId: "EXP-2023-005",
      title: {
        en: "Staff Training Materials",
        ar: "مواد تدريب الموظفين"
      },
      amount: 28000,
      date: "2023-11-02",
      category: "equipment",
      subcategory: {
        en: "Training Materials",
        ar: "مواد التدريب"
      },
      paymentMethod: "credit-card",
      paymentDetails: {
        transactionId: "TX00123458"
      },
      description: {
        en: "Purchase of training materials for staff development",
        ar: "شراء مواد التدريب لتطوير الموظفين"
      },
      department: {
        id: 4,
        name: {
          en: "Human Resources",
          ar: "الموارد البشرية"
        }
      },
      submittedBy: {
        id: 5,
        name: "Lisa Chen"
      },
      approvedBy: null,
      status: "pending",
      receipt: {
        hasReceipt: true,
        file: {
          name: "training-materials.pdf",
          size: 3200000
        }
      },
      tags: ["training", "development", "hr"]
    },
    {
      id: 6,
      expenseId: "EXP-2023-006",
      title: {
        en: "Office Refreshments",
        ar: "المشروبات المكتبية"
      },
      amount: 8500,
      date: "2023-11-05",
      category: "food",
      subcategory: {
        en: "Office Supplies",
        ar: "مستلزمات المكتب"
      },
      paymentMethod: "cash",
      paymentDetails: {
        payeeName: "Refreshments Supplier"
      },
      description: {
        en: "Monthly office refreshments",
        ar: "المشروبات المكتبية الشهرية"
      },
      department: {
        id: 1,
        name: {
          en: "Administration",
          ar: "الإدارة"
        }
      },
      submittedBy: {
        id: 1,
        name: "John Smith"
      },
      approvedBy: {
        id: 2,
        name: "Admin User"
      },
      status: "approved",
      receipt: {
        hasReceipt: true,
        file: {
          name: "refreshments-receipt.jpg",
          size: 560000
        }
      },
      tags: ["food", "office", "monthly"]
    },
    {
      id: 7,
      expenseId: "EXP-2023-007",
      title: {
        en: "Software License Renewal",
        ar: "تجديد ترخيص البرمجيات"
      },
      amount: 65000,
      date: "2023-11-08",
      category: "equipment",
      subcategory: {
        en: "Software",
        ar: "برمجيات"
      },
      paymentMethod: "online",
      paymentDetails: {
        transactionId: "TX00123459"
      },
      description: {
        en: "Annual software license renewal",
        ar: "تجديد ترخيص البرمجيات السنوي"
      },
      department: {
        id: 3,
        name: {
          en: "IT Department",
          ar: "قسم تكنولوجيا المعلومات"
        }
      },
      submittedBy: {
        id: 4,
        name: "Sarah Wilson"
      },
      approvedBy: {
        id: 2,
        name: "Admin User"
      },
      status: "recorded",
      receipt: {
        hasReceipt: true,
        file: {
          name: "software-license.pdf",
          size: 4100000
        }
      },
      tags: ["software", "license", "annual"]
    },
    {
      id: 8,
      expenseId: "EXP-2023-008",
      title: {
        en: "Team Building Event",
        ar: "فعالية بناء الفريق"
      },
      amount: 35000,
      date: "2023-11-12",
      category: "events",
      subcategory: {
        en: "Team Activity",
        ar: "نشاط الفريق"
      },
      paymentMethod: "cheque",
      paymentDetails: {
        chequeNumber: "CHQ789012"
      },
      description: {
        en: "Team building event for department",
        ar: "فعالية بناء فريق للقسم"
      },
      department: {
        id: 4,
        name: {
          en: "Human Resources",
          ar: "الموارد البشرية"
        }
      },
      submittedBy: {
        id: 5,
        name: "Lisa Chen"
      },
      approvedBy: null,
      status: "rejected",
      receipt: {
        hasReceipt: false
      },
      tags: ["event", "team-building", "hr"]
    }
  ]
};

export const EXPENSE_CATEGORIES = [
  "stationery",
  "utilities", 
  "equipment",
  "maintenance",
  "transportation",
  "events",
  "salaries",
  "food",
  "other"
];

export const EXPENSE_STATUS = [
  "pending",
  "approved",
  "rejected",
  "recorded"
];

export const PAYMENT_METHODS = [
  "cash",
  "credit-card",
  "bank-transfer",
  "cheque",
  "online",
  "other"
];

export const DEPARTMENTS = [
  { id: 1, name: { en: "Administration", ar: "الإدارة" } },
  { id: 2, name: { en: "Maintenance", ar: "الصيانة" } },
  { id: 3, name: { en: "IT Department", ar: "قسم تكنولوجيا المعلومات" } },
  { id: 4, name: { en: "Human Resources", ar: "الموارد البشرية" } },
  { id: 5, name: { en: "Finance", ar: "المالية" } },
  { id: 6, name: { en: "Marketing", ar: "التسويق" } }
];
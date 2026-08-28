import { 
  DollarSign,
  CreditCard,
  BarChart,
  TrendingUp,
} from 'lucide-react';

export const REPORTS_DATA = {
  stats: [
    {
      title: "reports.totalFeeCollection",
      value: "8438900", // No currency symbol
      change: "+12.5%",
      icon: DollarSign,
      color: "blue" 
    },
    {
      title: "reports.totalExpenses",
      value: "6543200", // No currency symbol
      change: "+8.2%",
      icon: CreditCard,
      color: "green" 
    },
    {
      title: "reports.netBalance",
      value: "5567900", // No currency symbol
      change: "+15.3%",
      icon: BarChart,
      color: "purple" 
    },
    {
      title: "reports.collectionRate",
      value: "94.5%",
      change: "+3.1%",
      icon: TrendingUp,
      color: "teal" 
    }
  ],
      reports: [
    {
      id: 1,
      title: "Financial Summary Report Q4 2023",
      description: "Complete financial summary for the fourth quarter of 2023",
      reportType: "financial",
      period: "quarterly",
      generatedAt: "2023-12-31",
      generatedBy: "Accountant Admin",
      totalFee: 980000,
      totalExpense: 500000,
      netBalance: 480000,
      collectionRate: 94.5,
      status: "completed",
      keyFindings: [
        "Highest collection rate achieved in December",
        "Transportation expenses increased by 12%",
        "Net profit increased by 8.3% compared to Q3"
      ]
    },
    {
      id: 2,
      title: "Performance Analysis Report",
      description: "Analysis of fee collection performance and trends",
      reportType: "performance",
      period: "monthly",
      generatedAt: "2024-01-15",
      generatedBy: "Performance Analyst",
      totalFee: 890000,
      totalExpense: 440000,
      netBalance: 450000,
      collectionRate: 92.8,
      status: "completed",
      keyFindings: [
        "Collection rate improved by 2.3%",
        "Online payments increased by 15%",
        "Three students with pending fees identified"
      ]
    },
    {
      id: 3,
      title: "Annual Comparative Report 2023",
      description: "Year-over-year comparison of financial performance",
      reportType: "comparative",
      period: "yearly",
      generatedAt: "2024-01-05",
      generatedBy: "Financial Analyst",
      totalFee: 9800000,
      totalExpense: 5000000,
      netBalance: 4800000,
      collectionRate: 95.2,
      status: "completed",
      keyFindings: [
        "Overall growth of 18% compared to 2022",
        "Expense management improved by 8%",
        "New payment methods contributed to 12% growth"
      ]
    },
    {
      id: 4,
      title: "Trend Analysis Report",
      description: "Analysis of financial trends and projections",
      reportType: "trend",
      period: "monthly",
      generatedAt: "2024-01-20",
      generatedBy: "Data Analyst",
      totalFee: 920000,
      totalExpense: 460000,
      netBalance: 460000,
      collectionRate: 93.7,
      status: "processing",
      keyFindings: [
        "Positive growth trend identified",
        "Expense trends stable with 2% monthly variation",
        "Projected growth of 12% for next quarter"
      ]
    }
  ],
  
  reportHistory: [
    {
      id: 1,
      action: "generated",
      description: "Generated financial report for Q4 2023",
      performedBy: "Accountant Admin",
      userRole: "Administrator",
      reportId: 1,
      reportTitle: "Financial Summary Report Q4 2023",
      reportType: "financial",
      timestamp: "2023-12-31T14:30:00",
      duration: 45,
      status: "completed"
    },
    {
      id: 2,
      action: "downloaded",
      description: "Downloaded performance analysis report",
      performedBy: "Financial Manager",
      userRole: "Manager",
      reportId: 2,
      reportTitle: "Performance Analysis Report",
      reportType: "performance",
      timestamp: "2024-01-15T10:15:00",
      duration: 12,
      status: "completed"
    },
    {
      id: 3,
      action: "printed",
      description: "Printed annual comparative report",
      performedBy: "Accountant",
      userRole: "Staff",
      reportId: 3,
      reportTitle: "Annual Comparative Report 2023",
      reportType: "comparative",
      timestamp: "2024-01-05T16:45:00",
      duration: 28,
      status: "completed"
    },
    {
      id: 4,
      action: "shared",
      description: "Shared financial summary with management",
      performedBy: "System Admin",
      userRole: "Administrator",
      reportId: 1,
      reportTitle: "Financial Summary Report Q4 2023",
      reportType: "financial",
      timestamp: "2024-01-02T09:20:00",
      duration: 8,
      status: "completed"
    },
    {
      id: 5,
      action: "viewed",
      description: "Viewed trend analysis report",
      performedBy: "Data Analyst",
      userRole: "Analyst",
      reportId: 4,
      reportTitle: "Trend Analysis Report",
      reportType: "trend",
      timestamp: "2024-01-20T11:30:00",
      duration: 15,
      status: "completed"
    },
    {
      id: 6,
      action: "exported",
      description: "Exported report data for external analysis",
      performedBy: "External Auditor",
      userRole: "Auditor",
      reportId: 3,
      reportTitle: "Annual Comparative Report 2023",
      reportType: "comparative",
      timestamp: "2024-01-10T14:00:00",
      duration: 65,
      status: "failed"
    }
  ],
};

export const REPORT_PERIODS = [
  "today",
  "yesterday",
  "thisWeek",
  "lastWeek",
  "thisMonth",
  "lastMonth",
  "thisQuarter",
  "lastQuarter",
  "thisYear",
  "lastYear",
  "custom"
];

export const REPORT_TYPES = [
  "financial",
  "performance",
  "analytical",
  "summary",
  "comparative",
  "trend"
];
// src/data/contractData.js
import { 
  FileText, 
  AlertCircle, 
  CheckCircle,
  TrendingUp
} from 'lucide-react';

export const CONTRACT_DATA = {
  stats: [
    {
      title: "contract.totalContracts",
      value: "48",
      change: "+12%",
      icon: FileText,
      color: "blue" 
    },
    {
      title: "contract.activeContracts",
      value: "32",
      change: "+5%",
      icon: CheckCircle,
      color: "green" 
    },
    {
      title: "contract.expiringSoon",
      value: "9",
      change: "+3",
      icon: AlertCircle,
      color: "purple" 
    },
    {
      title: "contract.renewalRate",
      value: "87%",
      change: "+2.5%",
      icon: TrendingUp,
      color: "teal" 
    }
  ],
  contracts: [
    {
      id: 1,
      teacherId: "EMP001",
      teacherName: "Dr. Sarah Wilson",
      teacherEmail: "sarah.wilson@university.edu",
      department: "Computer Science",
      type: "Contract",
      uploadDate: "2024-01-15",
      expiryDate: "2025-01-14",
      status: "active",
      documentUrl: "/contracts/sarah-wilson-contract.pdf",
      salary: "$85,000",
      duration: "1 Year",
      signed: true,
      reviewed: true
    },
    {
      id: 2,
      teacherId: "EMP002",
      teacherName: "Prof. David Brown",
      teacherEmail: "david.brown@university.edu",
      department: "Mathematics",
      type: "Agreement",
      uploadDate: "2024-02-10",
      expiryDate: "2024-08-09",
      status: "expiring",
      documentUrl: "/contracts/david-brown-agreement.pdf",
      salary: "$78,000",
      duration: "6 Months",
      signed: true,
      reviewed: true
    },
    {
      id: 3,
      teacherId: "EMP003",
      teacherName: "Dr. Maria Garcia",
      teacherEmail: "maria.garcia@university.edu",
      department: "Physics",
      type: "Contract",
      uploadDate: "2023-11-20",
      expiryDate: "2024-11-19",
      status: "active",
      documentUrl: "/contracts/maria-garcia-contract.pdf",
      salary: "$82,000",
      duration: "1 Year",
      signed: true,
      reviewed: false
    },
    {
      id: 4,
      teacherId: "EMP004",
      teacherName: "Prof. James Anderson",
      teacherEmail: "james.anderson@university.edu",
      department: "Chemistry",
      type: "Warning",
      uploadDate: "2024-03-05",
      expiryDate: "2024-06-04",
      status: "expired",
      documentUrl: "/contracts/james-anderson-warning.pdf",
      salary: "$75,000",
      duration: "3 Months",
      signed: true,
      reviewed: true
    },
    {
      id: 5,
      teacherId: "EMP005",
      teacherName: "Dr. Lisa Chen",
      teacherEmail: "lisa.chen@university.edu",
      department: "Biology",
      type: "NOC",
      uploadDate: "2024-04-18",
      expiryDate: "2025-04-17",
      status: "active",
      documentUrl: "/contracts/lisa-chen-noc.pdf",
      salary: "$80,000",
      duration: "1 Year",
      signed: false,
      reviewed: true
    },
    {
      id: 6,
      teacherId: "EMP006",
      teacherName: "Prof. Robert Taylor",
      teacherEmail: "robert.taylor@university.edu",
      department: "Business Administration",
      type: "Contract",
      uploadDate: "2023-09-30",
      expiryDate: "2024-09-29",
      status: "expiring",
      documentUrl: "/contracts/robert-taylor-contract.pdf",
      salary: "$90,000",
      duration: "1 Year",
      signed: true,
      reviewed: true
    },
    {
      id: 7,
      teacherId: "EMP007",
      teacherName: "Dr. Emily Davis",
      teacherEmail: "emily.davis@university.edu",
      department: "Engineering",
      type: "Agreement",
      uploadDate: "2024-05-22",
      expiryDate: "2024-11-21",
      status: "active",
      documentUrl: "/contracts/emily-davis-agreement.pdf",
      salary: "$88,000",
      duration: "6 Months",
      signed: false,
      reviewed: false
    },
    {
      id: 8,
      teacherId: "EMP008",
      teacherName: "Prof. Michael Johnson",
      teacherEmail: "michael.johnson@university.edu",
      department: "Computer Science",
      type: "Contract",
      uploadDate: "2023-12-15",
      expiryDate: "2024-12-14",
      status: "active",
      documentUrl: "/contracts/michael-johnson-contract.pdf",
      salary: "$95,000",
      duration: "1 Year",
      signed: true,
      reviewed: true
    }
  ]
};

// Chart data for contract analytics
export const CONTRACT_CHART_DATA = {
  typeDistribution: [
    { name: "Contract", value: 28, color: '#3b82f6' },
    { name: "Agreement", value: 12, color: '#8b5cf6' },
    { name: "NOC", value: 5, color: '#10b981' },
    { name: "Warning", value: 3, color: '#f59e0b' }
  ],
  statusDistribution: [
    { name: "Active", value: 32, color: '#10b981' },
    { name: "Expiring", value: 9, color: '#f59e0b' },
    { name: "Expired", value: 7, color: '#ef4444' }
  ],
  departmentDistribution: [
    { department: "Computer Science", contracts: 8 },
    { department: "Mathematics", contracts: 6 },
    { department: "Physics", contracts: 5 },
    { department: "Chemistry", contracts: 4 },
    { department: "Biology", contracts: 5 },
    { department: "Business", contracts: 4 },
    { department: "Engineering", contracts: 5 },
    { department: "Arts", contracts: 4 }
  ]
};
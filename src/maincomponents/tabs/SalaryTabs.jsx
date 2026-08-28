

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useTranslation } from "react-i18next";
import { DollarSign, History } from "lucide-react";
import SalaryTable from "../tables/SalaryTable";
import PaymentHistoryTable from "../tables/PaymentHistoryTable";
import { ANIMATION_CONFIG } from "../../data/Constants";

const SalaryTabs = ({
  activeTab,
  onTabChange,
  salaries = [],
  paymentHistory = [],
  loading = false,

  
  salaryPagination,
  historyPagination,
  salaryPageSize,
  historyPageSize,
  onSalaryPageChange,
  onHistoryPageChange,
  onSalaryPageSizeChange,
  onHistoryPageSizeChange,

  onViewSalary,
  onEditSalary,
  onDeleteSalary,
  onProcessPayment,
  onViewPayment,
  onEditPayment,
  onDeletePayment,

  isRTL = false,
  currentLanguage = "en",

  
  salarySearch,
  onSalarySearchChange,
  historySearch,
  onHistorySearchChange,
  salaryFilters,
  onSalaryFilterChange,
  historyFilters,
  onHistoryFilterChange,
}) => {
  const { t } = useTranslation();

  const tableData = useMemo(() => {
    if (activeTab === "salaries") {
      return salaries.map((salary) => ({
        ...salary,
        staffName:
          salary.staffName ||
          salary.teacher?.name ||
          salary.user?.name ||
          t("common.unknownStaff"),
        staffRole:
          salary.staffRole ||
          salary.teacher?.role ||
          salary.user?.role ||
          "",
        amount: salary.amount || salary.baseAmount || 0,
        month: salary.month,
        year: salary.year,
        status: salary.paymentStatus || salary.status,
        paymentDate: salary.paymentDate,
        dueDate: salary.dueDate,
        bonus: salary.bonus || 0,
        deductions: salary.deductions || 0,
      }));
    }
    return paymentHistory;
  }, [salaries, paymentHistory, activeTab, t]);

  return (
    <Tabs
      value={activeTab}
      onValueChange={onTabChange}
      className="space-y-6"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: ANIMATION_CONFIG?.duration?.normal || 0.3,
          ease: ANIMATION_CONFIG?.ease?.smooth || "easeOut",
        }}
      >
        <TabsList
          className={`grid grid-cols-2 w-full ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <TabsTrigger
            value="salaries"
            className={`flex items-center gap-2 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <DollarSign className="w-4 h-4" />
            {t("sidebar.salary")}
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className={`flex items-center gap-2 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <History className="w-4 h-4" />
            {t("salary.paymentHistory")}
          </TabsTrigger>
        </TabsList>
      </motion.div>

      {/* Salaries tab */}
      <TabsContent value="salaries" className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.4,
            duration: ANIMATION_CONFIG?.duration?.normal || 0.3,
            ease: ANIMATION_CONFIG?.ease?.smooth || "easeOut",
          }}
          className="col-span-full"
        >
          <SalaryTable
            data={tableData}
            loading={loading}
            onView={onViewSalary}
            onEdit={onEditSalary}
            onDelete={onDeleteSalary}
            onProcessPayment={onProcessPayment}
            showPagination={true}
            isRTL={isRTL}
            currentLanguage={currentLanguage}
            searchTerm={salarySearch}
            onSearchChange={onSalarySearchChange}
            filters={salaryFilters}
            onFilterChange={onSalaryFilterChange}
            currentPage={salaryPagination?.page || 1}
            totalPages={salaryPagination?.pages || 1}
            totalItems={salaryPagination?.total || 0}
            pageSize={salaryPageSize}
            onPageChange={onSalaryPageChange}
            onPageSizeChange={onSalaryPageSizeChange}
          />
        </motion.div>
      </TabsContent>

      {/* History tab */}
      <TabsContent value="history" className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.4,
            duration: ANIMATION_CONFIG?.duration?.normal || 0.3,
            ease: ANIMATION_CONFIG?.ease?.smooth || "easeOut",
          }}
          className="col-span-full"
        >
          <PaymentHistoryTable
            data={paymentHistory}
            loading={loading}
            onView={onViewPayment}
            onEdit={onEditPayment}
            onDelete={onDeletePayment}
            showPagination={true}
            isRTL={isRTL}
            currentLanguage={currentLanguage}
            searchTerm={historySearch}
            onSearchChange={onHistorySearchChange}
            filters={historyFilters}
            onFilterChange={onHistoryFilterChange}
            currentPage={historyPagination?.page || 1}
            totalPages={historyPagination?.pages || 1}
            totalItems={historyPagination?.total || 0}
            pageSize={historyPageSize}
            onPageChange={onHistoryPageChange}
            onPageSizeChange={onHistoryPageSizeChange}
          />
        </motion.div>
      </TabsContent>
    </Tabs>
  );
};

export default SalaryTabs;
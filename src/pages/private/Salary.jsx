import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Button } from "@maincomponents/components/ui/button";
import { Plus, DollarSign } from "lucide-react";
import PageHeader from "@maincomponents/headerbar/PageHeader";
import SalaryTabs from "@maincomponents/tabs/SalaryTabs";
import BaseCreateModal from "@maincomponents/modal/addEditModals/BaseCreateModal";
import SalaryModalFields from "@maincomponents/modal/addEditModals/SalaryModalFields";
import PaymentHistoryFields from "@maincomponents/modal/addEditModals/PaymentHistoryFields";
import ViewSalaryModal from "@maincomponents/modal/viewModals/ViewSalaryModal";
import ViewPaymentHistoryModal from "@maincomponents/modal/viewModals/ViewPaymentHistoryModal";
import {
  fetchSalaryList,
  fetchPaymentHistory,
  fetchSalarySummary,
  fetchStaffList,
  generateSalaries,
  updateSalary,
  deleteSalary,
  paySalary,
  deletePayment,
  fetchSalaryDetails,
  fetchPaymentDetails,
  clearDetails,
  resetError,
} from "@redux/slice/salarySlice";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
    return () => { clearTimeout(handler); };
  }, [value, delay]);
  return debouncedValue;
};

const Salary = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const isRTL = i18n.language === "ar";
  const lang = i18n.language;

  const {
    salaries, paymentHistory, summary, staffList, salaryDetails, selectedPaymentDetails,
    pagination, historyPagination, loading, staffLoading, detailsLoading, actionLoading, error,
  } = useSelector((state) => state.salary);

  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "salaries");
  const [selectedForPayment, setSelectedForPayment] = useState(null);
  const [isSalaryModalOpen, setIsSalaryModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isViewSalaryModalOpen, setIsViewSalaryModalOpen] = useState(false);
  const [isViewPaymentModalOpen, setIsViewPaymentModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [salaryFormData, setSalaryFormData] = useState({});
  const [paymentFormData, setPaymentFormData] = useState({});
  const [salarySearch, setSalarySearch] = useState("");
  const [historySearch, setHistorySearch] = useState("");
  const [salaryFilters, setSalaryFilters] = useState({});
  const [historyFilters, setHistoryFilters] = useState({});
  const [salaryPageSize, setSalaryPageSize] = useState(10);
  const [historyPageSize, setHistoryPageSize] = useState(10);

  const debouncedSalarySearch = useDebounce(salarySearch, 500);
  const debouncedHistorySearch = useDebounce(historySearch, 500);

  const loadData = useCallback((tab, page, pageSize, filters, search) => {
    if (tab === "salaries") {
      dispatch(fetchSalaryList({ page, limit: pageSize, lang, paymentStatus: filters.status, month: filters.month, year: filters.year, search }));
    } else {
      dispatch(fetchPaymentHistory({ page, limit: pageSize, lang, status: filters.status, paymentMethod: filters.paymentMethod, month: filters.month, search }));
    }
  }, [dispatch, lang]);

  useEffect(() => {
    dispatch(fetchStaffList({ limit: 1000, lang }));
    dispatch(fetchSalarySummary({ lang }));
  }, [dispatch, lang]);

  useEffect(() => {
    loadData(activeTab, 1, activeTab === "salaries" ? salaryPageSize : historyPageSize, activeTab === "salaries" ? salaryFilters : historyFilters, activeTab === "salaries" ? debouncedSalarySearch : debouncedHistorySearch);
  }, [activeTab, salaryPageSize, historyPageSize, salaryFilters, historyFilters, debouncedSalarySearch, debouncedHistorySearch, loadData]);

  useEffect(() => { if (error) { toast.error(error); dispatch(resetError()); } }, [error, dispatch]);

  const handleViewSalary = async (salaryRow) => {
    setIsViewSalaryModalOpen(true);
    dispatch(fetchSalaryDetails(salaryRow.id));
  };

  const handleViewPayment = async (paymentRow) => {
    setIsViewPaymentModalOpen(true);
    dispatch(fetchPaymentDetails(paymentRow.id));
  };

  const handleAddSalary = () => {
    setModalMode("add");
    setSalaryFormData({
      teacherId: "", month: new Date().getMonth() + 1, year: new Date().getFullYear(), baseAmount: "", bonus: "", deductions: "",
      paymentStatus: "unpaid", dueDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 5).toISOString().split("T")[0], remarks: "",
    });
    setIsSalaryModalOpen(true);
  };

  const handleEditSalary = async (salary) => {
    setModalMode("edit");
    try {
      const details = salary.id ? await dispatch(fetchSalaryDetails(salary.id)).unwrap() : salary;
      setSalaryFormData({
        teacherId: details.teacher?.id?.toString() || "", month: details.month, year: details.year,
        baseAmount: details.baseAmount, bonus: details.bonus, deductions: details.deductions,
        paymentStatus: details.paymentStatus, dueDate: details.dueDate ? new Date(details.dueDate).toISOString().split("T")[0] : "", remarks: details.remarks || "",
      });
      setIsViewSalaryModalOpen(false);
      setIsSalaryModalOpen(true);
    } catch {
      toast.error(t("common.errorLoadingDetails"));
    }
  };

  const handleSalaryFormSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...salaryFormData, baseAmount: Number(salaryFormData.baseAmount), bonus: Number(salaryFormData.bonus), deductions: Number(salaryFormData.deductions) };
    let promise;
    if (modalMode === "add") {
      if (!payload.teacherId) return toast.error(t("salary.errors.selectStaff"));
      promise = dispatch(generateSalaries(payload));
    } else {
      promise = dispatch(updateSalary({ id: salaryFormData.id, data: payload }));
    }
    promise.unwrap().then(() => {
      setIsSalaryModalOpen(false);
      loadData(activeTab, 1, salaryPageSize, salaryFilters, salarySearch);
    });
  };

  const handleProcessPayment = (salary) => {
    setSelectedForPayment(salary);
    setPaymentFormData({
      amount: salary.amount, paymentMethod: "bank-transfer", paymentDate: new Date().toISOString().split("T")[0],
      paymentType: "regular", transactionId: `TRX-${Date.now()}`, description: "",
    });
    setIsViewSalaryModalOpen(false);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...paymentFormData, salaryId: selectedForPayment?.id, amount: parseFloat(paymentFormData.amount) };
    dispatch(paySalary(payload)).unwrap().then(() => {
      setIsPaymentModalOpen(false);
      loadData("salaries", 1, salaryPageSize, salaryFilters, salarySearch);
      loadData("history", 1, historyPageSize, historyFilters, historySearch);
    });
  };

  const handleDeleteSalary = async (salaryId) => {
    if (window.confirm(t("common.confirmDelete"))) {
      dispatch(deleteSalary(salaryId)).unwrap().then(() => {
        setIsViewSalaryModalOpen(false);
        loadData("salaries", 1, salaryPageSize, salaryFilters, salarySearch);
      });
    }
  };

  const handleDeletePayment = async (paymentId) => {
    if (window.confirm(t("common.confirmDelete"))) {
      dispatch(deletePayment(paymentId)).unwrap().then(() => {
        setIsViewPaymentModalOpen(false);
        loadData("history", 1, historyPageSize, historyFilters, historySearch);
      });
    }
  };

  return (
    <div className="space-y-6 py-6 px-2" dir={isRTL ? "rtl" : "ltr"}>
      <PageHeader
        title={t("sidebar.salary")} description={t("salary.pageDescription")} isRTL={isRTL}
        action={
          <Button onClick={handleAddSalary} className="bg-gradient-to-r from-indigo-500 to-indigo-600 shadow-lg">
            <Plus className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`} /> {t("salary.addSalary")}
          </Button>
        }
      />
      <SalaryTabs
        activeTab={activeTab} onTabChange={setActiveTab} salaries={salaries} paymentHistory={paymentHistory}
        loading={loading} onViewSalary={handleViewSalary} onEditSalary={handleEditSalary} onDeleteSalary={handleDeleteSalary}
        onProcessPayment={handleProcessPayment} onViewPayment={handleViewPayment} onDeletePayment={handleDeletePayment}
        isRTL={isRTL} currentLanguage={lang} salarySearch={salarySearch} onSalarySearchChange={setSalarySearch}
        historySearch={historySearch} onHistorySearchChange={setHistorySearch} salaryFilters={salaryFilters}
        onSalaryFilterChange={setSalaryFilters} historyFilters={historyFilters} onHistoryFilterChange={setHistoryFilters}
        salaryPagination={pagination} historyPagination={historyPagination} salaryPageSize={salaryPageSize}
        historyPageSize={historyPageSize} onSalaryPageChange={(p) => loadData("salaries", p, salaryPageSize, salaryFilters, debouncedSalarySearch)}
        onHistoryPageChange={(p) => loadData("history", p, historyPageSize, historyFilters, debouncedHistorySearch)}
        onSalaryPageSizeChange={setSalaryPageSize} onHistoryPageSizeChange={setHistoryPageSize}
      />
      <BaseCreateModal isOpen={isSalaryModalOpen} onClose={() => setIsSalaryModalOpen(false)} title={modalMode === "add" ? t("salary.addSalary") : t("salary.editSalary")} onSubmit={handleSalaryFormSubmit} isSubmitting={actionLoading} type="salary" icon={DollarSign} isRTL={isRTL}>
        <SalaryModalFields formData={salaryFormData} handleChange={setSalaryFormData} isRTL={isRTL} additionalData={{ staffList, isLoadingStaff: staffLoading }} currentLanguage={lang} />
      </BaseCreateModal>
      <BaseCreateModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} title={t("salary.processPayment")} onSubmit={handlePaymentSubmit} isSubmitting={actionLoading} type="payment" icon={DollarSign} gradient="from-green-500 to-green-600" isRTL={isRTL}>
        <PaymentHistoryFields formData={paymentFormData} handleChange={setPaymentFormData} isRTL={isRTL} salaryData={selectedForPayment} />
      </BaseCreateModal>
      <ViewSalaryModal isOpen={isViewSalaryModalOpen} onClose={() => { setIsViewSalaryModalOpen(false); dispatch(clearDetails()); }} data={salaryDetails} isLoading={detailsLoading} isRTL={isRTL} currentLanguage={lang} onEdit={handleEditSalary} onProcessPayment={handleProcessPayment} onDelete={handleDeleteSalary} />
      <ViewPaymentHistoryModal isOpen={isViewPaymentModalOpen} onClose={() => { setIsViewPaymentModalOpen(false); dispatch(clearDetails()); }} data={selectedPaymentDetails} isLoading={detailsLoading} isRTL={isRTL} currentLanguage={lang} />
    </div>
  );
};

export default Salary;
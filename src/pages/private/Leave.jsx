import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Button } from '../../maincomponents/components/ui/button';
import PageHeader from '@maincomponents/headerbar/PageHeader';
import LeaveTabs from '@maincomponents/tabs/LeaveTabs';
import ViewLeaveModal from '@maincomponents/modal/viewModals/ViewLeaveModal';
import { 
  fetchAllLeaves, 
  processLeave, 
  deleteLeave, 
  fetchAllQuotas, 
  updateUserQuota, 
  bulkUpdateQuota, 
  fetchLeaveStats, 
  fetchLeaveDetails, // This now correctly exists and is imported
  clearMessages,
  resetFilters
} from '@redux/slice/leave';

const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const Leave = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'leaves';
  const isRTL = i18n.language === 'ar';
  const lang = i18n.language;

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  // --- All other state remains the same ---
  const [leaveSearchTerm, setLeaveSearchTerm] = useState('');
  const [leaveFilters, setLeaveFilters] = useState({ status: 'all', leaveType: 'all', userRole: 'all' });
  const [quotaSearchTerm, setQuotaSearchTerm] = useState('');
  const [quotaFilters, setQuotaFilters] = useState({ userRole: 'all', academicYear: 'all' });

  const { 
    leaves, 
    quotas, 
    leaveDetails,
    stats, 
    loading, 
    actionLoading, // This will now be used for details loading as well
    error, 
    successMessage, 
    pagination,
    quotaPagination
  } = useSelector((state) => state.leave);
  
  // --- All other hooks and handlers remain the same ---
  const debouncedFetchLeaves = useRef(
    debounce((searchValue, filters, page, limit, language) => {
      dispatch(fetchAllLeaves({ 
        page, limit, search: searchValue, status: filters.status,
        leaveType: filters.leaveType, userRole: filters.userRole, lang: language 
      }));
    }, 500)
  ).current;

  const debouncedFetchQuotas = useRef(
    debounce((searchValue, filters, page, limit, language) => {
      dispatch(fetchAllQuotas({ 
        page, limit, search: searchValue, userRole: filters.userRole,
        academicYear: filters.academicYear, lang: language 
      }));
    }, 500)
  ).current;

  useEffect(() => {
    dispatch(fetchAllLeaves({ 
      page: pagination.page || 1, limit: pagination.limit || 10,
      search: leaveSearchTerm, status: leaveFilters.status,
      leaveType: leaveFilters.leaveType, userRole: leaveFilters.userRole,
      lang: lang 
    }));
    dispatch(fetchLeaveStats({ lang }));
    dispatch(fetchAllQuotas({ 
      page: quotaPagination.page || 1, limit: quotaPagination.limit || 10,
      search: quotaSearchTerm, userRole: quotaFilters.userRole,
      academicYear: quotaFilters.academicYear, lang: lang 
    }));
  }, [dispatch, lang]); 

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearMessages());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearMessages());
    }
  }, [error, successMessage, dispatch]);
  
  const handleLeaveSearchChange = useCallback((value) => {
    setLeaveSearchTerm(value);
    debouncedFetchLeaves(value, leaveFilters, 1, pagination.limit, lang);
  }, [debouncedFetchLeaves, leaveFilters, pagination.limit, lang]);

  const handleLeaveFilterChange = useCallback((filterKey, value) => {
    const newFilters = { ...leaveFilters, [filterKey]: value };
    setLeaveFilters(newFilters);
    dispatch(fetchAllLeaves({ 
      page: 1, limit: pagination.limit, search: leaveSearchTerm,
      status: newFilters.status, leaveType: newFilters.leaveType,
      userRole: newFilters.userRole, lang: lang 
    }));
  }, [dispatch, leaveFilters, leaveSearchTerm, pagination.limit, lang]);

  const handleLeavePageChange = useCallback((newPage) => {
    dispatch(fetchAllLeaves({ 
      page: newPage, limit: pagination.limit, search: leaveSearchTerm,
      status: leaveFilters.status, leaveType: leaveFilters.leaveType,
      userRole: leaveFilters.userRole, lang: lang 
    }));
  }, [dispatch, pagination.limit, leaveSearchTerm, leaveFilters, lang]);

  const handleLeavePageSizeChange = useCallback((newSize) => {
    dispatch(fetchAllLeaves({ 
      page: 1, limit: parseInt(newSize), search: leaveSearchTerm,
      status: leaveFilters.status, leaveType: leaveFilters.leaveType,
      userRole: leaveFilters.userRole, lang: lang 
    }));
  }, [dispatch, leaveSearchTerm, leaveFilters, lang]);

  const handleResetLeaveFilters = useCallback(() => {
    setLeaveSearchTerm('');
    setLeaveFilters({ status: 'all', leaveType: 'all', userRole: 'all' });
    dispatch(resetFilters());
    dispatch(fetchAllLeaves({ page: 1, limit: 10, lang: lang }));
  }, [dispatch, lang]);

  const handleQuotaSearchChange = useCallback((value) => {
    setQuotaSearchTerm(value);
    debouncedFetchQuotas(value, quotaFilters, 1, quotaPagination.limit, lang);
  }, [debouncedFetchQuotas, quotaFilters, quotaPagination.limit, lang]);

  const handleQuotaFilterChange = useCallback((filterKey, value) => {
    const newFilters = { ...quotaFilters, [filterKey]: value };
    setQuotaFilters(newFilters);
    dispatch(fetchAllQuotas({ 
      page: 1, limit: quotaPagination.limit, search: quotaSearchTerm,
      userRole: newFilters.userRole, academicYear: newFilters.academicYear,
      lang: lang 
    }));
  }, [dispatch, quotaFilters, quotaSearchTerm, quotaPagination.limit, lang]);

  const handleQuotaPageChange = useCallback((newPage) => {
    dispatch(fetchAllQuotas({ 
      page: newPage, limit: quotaPagination.limit, search: quotaSearchTerm,
      userRole: quotaFilters.userRole, academicYear: quotaFilters.academicYear,
      lang: lang 
    }));
  }, [dispatch, quotaPagination.limit, quotaSearchTerm, quotaFilters, lang]);

  const handleQuotaPageSizeChange = useCallback((newSize) => {
    dispatch(fetchAllQuotas({ 
      page: 1, limit: parseInt(newSize), search: quotaSearchTerm,
      userRole: quotaFilters.userRole, academicYear: quotaFilters.academicYear,
      lang: lang 
    }));
  }, [dispatch, quotaSearchTerm, quotaFilters, lang]);

  const handleResetQuotaFilters = useCallback(() => {
    setQuotaSearchTerm('');
    setQuotaFilters({ userRole: 'all', academicYear: 'all' });
    dispatch(fetchAllQuotas({ page: 1, limit: 10, lang: lang }));
  }, [dispatch, lang]);

  const handleTabChange = (tab) => setSearchParams({ tab });

  const formattedLeaves = useMemo(() => {
    if (!leaves || !Array.isArray(leaves)) return [];
    return leaves.map(leave => {
      const getBilingualValue = (obj) => {
        if (!obj) return '';
        if (typeof obj === 'string') return obj;
        return obj[lang] || obj.en || obj.ar || '';
      };
      return {
        ...leave, id: leave._id,
        userName: leave.user?.name ? 
          (typeof leave.user.name === 'object' ? getBilingualValue(leave.user.name) : leave.user.name) : 
          'Unknown User',
        reasonDisplay: getBilingualValue(leave.reason),
        rejectReasonDisplay: getBilingualValue(leave.rejectReason),
        leaveTypeDisplay: getBilingualValue(leave.leaveType)
      };
    });
  }, [leaves, lang]); 

  // CORRECTED: This handler is now simpler
  const handleViewLeave = async (leave) => {
    if (!leave?._id) return;
    setIsViewModalOpen(true);
    try {
      // Dispatch the thunk and let the slice manage the loading state
      await dispatch(fetchLeaveDetails(leave._id)).unwrap();
    } catch (error) {
      // unwrap() will throw an error on rejection, so we can catch it here.
      toast.error(t('leave.fetchFailed'));
      setIsViewModalOpen(false); // Close modal on failure
    }
  };

  const handleDeleteLeave = async (id) => {
    await dispatch(deleteLeave({ id }));
    setIsViewModalOpen(false);
    dispatch(fetchAllLeaves({ 
      page: pagination.page, limit: pagination.limit,
      search: leaveSearchTerm, ...leaveFilters, lang: lang
    }));
  };

  const handleApproveLeave = async (leave) => {
    await dispatch(processLeave({ id: leave.id || leave._id, status: 'approved' }));
    setIsViewModalOpen(false);
  };

  const handleRejectLeave = async (leave) => {
    const reason = window.prompt(t('leave.form.rejectReason'));
    if (reason) {
      await dispatch(processLeave({ id: leave.id || leave._id, status: 'rejected', rejectReason: reason }));
      setIsViewModalOpen(false);
    }
  };

  const handleCancelLeave = async (leave) => {
    if (window.confirm(isRTL ? 'هل أنت متأكد من إلغاء الإجازة؟' : 'Are you sure you want to cancel this leave?')) {
      toast.info("Cancellation logic depends on backend implementation");
    }
  };

  const handleUpdateQuota = async (updatedQuotaData) => {
    const payload = {
      userId: updatedQuotaData.userId,
      academicYear: updatedQuotaData.academicYear,
      quotas: { 
        sick: updatedQuotaData.quotas.sick.total, 
        casual: updatedQuotaData.quotas.casual.total, 
        annual: updatedQuotaData.quotas.annual.total 
      },
      notes: "Updated by Admin via UI"
    };
    await dispatch(updateUserQuota(payload));
    dispatch(fetchAllQuotas({ 
      page: quotaPagination.page, limit: quotaPagination.limit,
      search: quotaSearchTerm, ...quotaFilters, lang: lang
    }));
  };

  const handleBulkUpdateQuota = async (bulkData) => {
    await dispatch(bulkUpdateQuota(bulkData));
    dispatch(fetchAllQuotas({ 
      page: 1, limit: quotaPagination.limit,
      search: quotaSearchTerm, ...quotaFilters, lang: lang
    }));
  };

  return (
    <div className="space-y-6 py-6 px-2" dir={isRTL ? 'rtl' : 'ltr'}>
      <PageHeader
        title={t('sidebar.leave')}
        description={t('leave.pageDescription')}
        isRTL={isRTL}
      />
      <LeaveTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        leaves={formattedLeaves} 
        leaveQuotas={quotas}
        onViewLeave={handleViewLeave}
        onDeleteLeave={handleDeleteLeave}
        onApproveLeave={handleApproveLeave}
        onRejectLeave={handleRejectLeave}
        onCancelLeave={handleCancelLeave}
        onUpdateQuota={handleUpdateQuota}
        onBulkUpdateQuota={handleBulkUpdateQuota}
        isRTL={isRTL}
        currentLanguage={lang}
        loading={loading}
        leavePagination={pagination}
        onLeavePageChange={handleLeavePageChange}
        onLeavePageSizeChange={handleLeavePageSizeChange}
        leaveSearchTerm={leaveSearchTerm}
        onLeaveSearchChange={handleLeaveSearchChange}
        leaveFilters={leaveFilters}
        onLeaveFilterChange={handleLeaveFilterChange}
        onResetLeaveFilters={handleResetLeaveFilters}
        quotaPagination={quotaPagination}
        onQuotaPageChange={handleQuotaPageChange}
        onQuotaPageSizeChange={handleQuotaPageSizeChange}
        quotaSearchTerm={quotaSearchTerm}
        onQuotaSearchChange={handleQuotaSearchChange}
        quotaFilters={quotaFilters}
        onQuotaFilterChange={handleQuotaFilterChange}
        onResetQuotaFilters={handleResetQuotaFilters}
      />
      <ViewLeaveModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        data={leaveDetails}
        loading={actionLoading} // CORRECTED: Use actionLoading from Redux
        isRTL={isRTL}
        currentLanguage={lang}
        onDelete={handleDeleteLeave}
        onApprove={handleApproveLeave}
        onReject={handleRejectLeave}
        onCancel={handleCancelLeave}
        showActionButtons={true}
      />
    </div>
  );
};

export default Leave;
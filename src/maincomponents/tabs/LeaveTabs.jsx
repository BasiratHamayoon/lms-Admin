// src/maincomponents/tabs/LeaveTabs.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@maincomponents/components/ui/tabs';
import { FileText, Users } from 'lucide-react';
import LeaveTable from '@maincomponents/tables/LeaveTable';
import QuotaManager from '@maincomponents/leave/QuotaManager';
import { ANIMATION_CONFIG } from '../../data/Constants';

const LeaveTabs = ({ 
  activeTab, 
  onTabChange, 
  leaves = [], 
  leaveQuotas = [],
  onViewLeave,
  onEditLeave,
  onDeleteLeave,
  onApproveLeave,
  onRejectLeave,
  onCancelLeave,
  onUpdateQuota,
  onBulkUpdateQuota,
  onEmailLeave,
  isRTL,
  currentLanguage,
  loading = false,
  // ✅ Leave specific props
  leavePagination,
  onLeavePageChange,
  onLeavePageSizeChange,
  leaveSearchTerm = '',
  onLeaveSearchChange,
  leaveFilters = {},
  onLeaveFilterChange,
  onResetLeaveFilters,
  // ✅ Quota specific props
  quotaPagination,
  onQuotaPageChange,
  onQuotaPageSizeChange,
  quotaSearchTerm = '',
  onQuotaSearchChange,
  quotaFilters = {},
  onQuotaFilterChange,
  onResetQuotaFilters
}) => {
  const { t } = useTranslation();

  return (
    <Tabs 
      value={activeTab} 
      onValueChange={onTabChange} 
      className="space-y-6"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          delay: 0.3,
          duration: ANIMATION_CONFIG.duration.normal,
          ease: ANIMATION_CONFIG.ease.smooth 
        }}
      >
        <TabsList className={`grid grid-cols-2 w-full ${isRTL ? 'flex-row-reverse' : ''}`}>
          <TabsTrigger value="leaves" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <FileText className="w-4 h-4" />
            {t('leave.leaveMembers')}
          </TabsTrigger>
          <TabsTrigger value="quota" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Users className="w-4 h-4" />
            {t('leave.manageQuotas')}
          </TabsTrigger>
        </TabsList>
      </motion.div>

      <TabsContent value="leaves" className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: ANIMATION_CONFIG.duration.normal }}
          className="col-span-full"
        >
          <LeaveTable
            data={leaves}
            onView={onViewLeave}
            onEdit={onEditLeave}
            onDelete={onDeleteLeave}
            onApprove={onApproveLeave}
            onReject={onRejectLeave}
            onCancel={onCancelLeave}
            onEmail={onEmailLeave}
            isRTL={isRTL}
            currentLanguage={currentLanguage}
            loading={loading}
            currentPage={leavePagination?.page || 1}
            pageSize={leavePagination?.limit || 10}
            totalRecords={leavePagination?.total || 0}
            totalPages={leavePagination?.pages || 0}
            onPageChange={onLeavePageChange}
            onPageSizeChange={onLeavePageSizeChange}
            searchTerm={leaveSearchTerm}
            onSearchChange={onLeaveSearchChange}
            filters={leaveFilters}
            onFilterChange={onLeaveFilterChange}
            onResetFilters={onResetLeaveFilters}
            serverSide={true}
          />
        </motion.div>
      </TabsContent>

      <TabsContent value="quota" className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: ANIMATION_CONFIG.duration.normal }}
          className="col-span-full"
        >
          <QuotaManager
            data={leaveQuotas}
            onUpdate={onUpdateQuota}
            onBulkUpdate={onBulkUpdateQuota}
            isRTL={isRTL}
            currentLanguage={currentLanguage}
            loading={loading}
            // ✅ Server-side props
            pagination={quotaPagination}
            onPageChange={onQuotaPageChange}
            onPageSizeChange={onQuotaPageSizeChange}
            searchTerm={quotaSearchTerm}
            onSearchChange={onQuotaSearchChange}
            filters={quotaFilters}
            onFilterChange={onQuotaFilterChange}
            onResetFilters={onResetQuotaFilters}
            serverSide={true}
          />
        </motion.div>
      </TabsContent>
    </Tabs>
  );
};

export default LeaveTabs;
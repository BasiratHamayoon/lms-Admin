import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useTranslation } from 'react-i18next';
import { FileText, Users, History } from 'lucide-react';
import FeeTable from '../tables/FeeTable';
import FeeHistoryTable from '../tables/FeeHistoryTable';
import { ANIMATION_CONFIG } from '../../data/Constants';

const FeeTabs = ({
  activeTab,
  classOptions = [],
  onTabChange,
  feeStructures = [],
  studentFees = [],
  paymentHistory = [],
  onViewFeeStructure,
  onEditFeeStructure,
  onDeleteFeeStructure,
  onViewStudentFee,
  onEditStudentFee,
  onDeleteStudentFee,
  onRecordPayment,
  onAddDiscount,
  onViewPayment,
  onEditPayment,
  onDeletePayment,
  structureQueryParams,
  setStructureQueryParams,
  studentFeeQueryParams,
  setStudentFeeQueryParams,
  historyQueryParams,
  setHistoryQueryParams,
  feeStructuresPagination,
  studentFeesPagination,
  showPagination = true,
  isRTL = false,
  currentLanguage = 'en',
  loading = false // ✅ ADD THIS - Receive loading prop
}) => {
  const { t } = useTranslation();

  const classLookup = useMemo(() => {
    const lookup = {};
    classOptions.forEach(opt => {
      lookup[opt.value] = opt.label;
    });
    return lookup;
  }, [classOptions]);

  const handleStructureSearchChange = (value) => {
    setStructureQueryParams(prev => ({ ...prev, search: value, page: 1 }));
  };
  const handleStructureFilterChange = (filterKey, value) => {
    setStructureQueryParams(prev => ({ ...prev, [filterKey]: value, page: 1 }));
  };
  const handleStructurePageChange = (page) => {
    setStructureQueryParams(prev => ({ ...prev, page }));
  };
  const handleStructurePageSizeChange = (limit) => {
    setStructureQueryParams(prev => ({ ...prev, limit, page: 1 }));
  };

  const handleStudentFeeSearchChange = (value) => {
    setStudentFeeQueryParams(prev => ({ ...prev, search: value, page: 1 }));
  };
  const handleStudentFeeFilterChange = (filterKey, value) => {
    setStudentFeeQueryParams(prev => ({ ...prev, [filterKey]: value, page: 1 }));
  };
  const handleStudentFeePageChange = (page) => {
    setStudentFeeQueryParams(prev => ({ ...prev, page }));
  };
  const handleStudentFeePageSizeChange = (limit) => {
    setStudentFeeQueryParams(prev => ({ ...prev, limit, page: 1 }));
  };

  const handleHistorySearchChange = (value) => {
    setHistoryQueryParams(prev => ({ ...prev, search: value, page: 1 }));
  };
  const handleHistoryFilterChange = (filterKey, value) => {
    setHistoryQueryParams(prev => ({ ...prev, [filterKey]: value, page: 1 }));
  };
  const handleHistoryPageChange = (page) => {
    setHistoryQueryParams(prev => ({ ...prev, page }));
  };
  const handleHistoryPageSizeChange = (limit) => {
    setHistoryQueryParams(prev => ({ ...prev, limit, page: 1 }));
  };

  const structureDynamicFilters = useMemo(() => {
    const uniqueYears = [...new Set(feeStructures.map(item => item.academicYear).filter(Boolean))];
    const uniqueClasses = [...new Set(feeStructures.map(item => item.class?.id).filter(Boolean))];
    const classOptions = uniqueClasses.map(classId => {
      const structure = feeStructures.find(item => item.class?.id === classId);
      return {
        value: classId,
        label: structure?.class?.name || `Class ${classId}`
      };
    });

    return {
      academicYear: ['all', ...uniqueYears.sort((a, b) => b.localeCompare(a))],
      classId: ['all', ...classOptions.map(c => c.value)],
      status: ['all', 'active', 'draft', 'archived']
    };
  }, [feeStructures]);

  const studentFeeDynamicFilters = useMemo(() => {
    const uniqueYears = [...new Set(studentFees.map(item => item.academicYear).filter(Boolean))];
    const uniqueClasses = [...new Set(studentFees.map(item => item.class?.id).filter(Boolean))];
    const classOptions = uniqueClasses.map(classId => {
      const fee = studentFees.find(item => item.class?.id === classId);
      return {
        value: classId,
        label: fee?.class?.name || `Class ${classId}`
      };
    });

    const uniqueFeeStructures = [...new Set(studentFees.map(item => item.feeStructureId?.id).filter(Boolean))];
    const feeStructureOptions = uniqueFeeStructures.map(structureId => {
      const structure = feeStructures.find(fs => fs.id === structureId);
      return {
        value: structureId,
        label: structure
          ? (typeof structure.name === 'object'
            ? (structure.name[currentLanguage === 'ar' ? 'ar' : 'en'] || structure.name.en)
            : structure.name)
          : `Structure ${structureId}`
      };
    });

    return {
      academicYear: ['all', ...uniqueYears.sort((a, b) => b.localeCompare(a))],
      classId: ['all', ...classOptions.map(c => c.value)],
      feeStructureId: ['all', ...feeStructureOptions.map(fs => fs.value)],
      status: ['all', 'pending', 'paid', 'partial', 'overdue', 'waived']
    };
  }, [studentFees, feeStructures, currentLanguage]);

  const historyDynamicFilters = useMemo(() => {
    const uniqueYears = [...new Set(paymentHistory.map(item => item.academicYear).filter(Boolean))];
    const uniqueMethods = [...new Set(paymentHistory.map(item => item.paymentMethod).filter(Boolean))];

    return {
      academicYear: ['all', ...uniqueYears.sort((a, b) => b.localeCompare(a))],
      paymentMethod: ['all', ...uniqueMethods],
      amountRange: ['all', '0-1000', '1001-5000', '5001-10000', '10000+'],
      status: ['all', 'completed', 'pending', 'failed', 'refunded']
    };
  }, [paymentHistory]);

  const getStructureOptionLabel = (filterKey, option) => {
    if (option === 'all') return t('common.all');

    if (filterKey === 'status') {
      const statusMap = {
        active: t('fee.status.active'),
        draft: t('fee.status.draft'),
        archived: t('fee.status.archived')
      };
      return statusMap[option] || option;
    }

    if (filterKey === 'classId') {
      const structure = feeStructures.find(item => item.class?.id === option);
      return structure?.class?.name || `Class ${option}`;
    }

    return option;
  };

  const getStudentFeeOptionLabel = (filterKey, option) => {
    if (option === 'all') return t('common.all');

    if (filterKey === 'status') {
      const statusMap = {
        pending: t('fee.status.pending'),
        paid: t('fee.status.paid'),
        partial: t('fee.status.partial'),
        overdue: t('fee.status.overdue'),
        waived: t('fee.status.waived')
      };
      return statusMap[option] || option;
    }

    if (filterKey === 'classId') {
      const fee = studentFees.find(item => item.class?.id === option);
      return fee?.class?.name || `Class ${option}`;
    }

    if (filterKey === 'feeStructureId') {
      const structure = feeStructures.find(fs => fs.id === option);
      return structure
        ? (typeof structure.name === 'object'
          ? (structure.name[currentLanguage === 'ar' ? 'ar' : 'en'] || structure.name.en)
          : structure.name)
        : `Structure ${option}`;
    }

    return option;
  };

  const getHistoryOptionLabel = (filterKey, option) => {
    if (option === 'all') return t('common.all');

    if (filterKey === 'status') {
      const statusMap = {
        completed: t('fee.paymentConfirmed'),
        pending: t('leave.status.pending'),
        failed: t('fee.paymentFailed'),
        refunded: t('fee.paymentRefunded')
      };
      return statusMap[option] || option;
    }

    if (filterKey === 'paymentMethod') {
      const methodMap = {
        cash: t('fee.paymentMethods.cash'),
        'bank-transfer': t('fee.paymentMethods.bank-transfer'),
        cheque: t('fee.paymentMethods.cheque'),
        online: t('fee.paymentMethods.online'),
        'credit-card': t('fee.paymentMethods.credit-card')
      };
      return methodMap[option] || option;
    }

    if (filterKey === 'amountRange') {
      const rangeMap = {
        '0-1000': t('fee.amountRange.0-1000'),
        '1001-5000': t('fee.amountRange.1001-5000'),
        '5001-10000': t('fee.amountRange.5001-10000'),
        '10000+': t('fee.amountRange.10000+')
      };
      return rangeMap[option] || option;
    }

    return option;
  };

  return (
    <Tabs 
      value={activeTab} 
      onValueChange={onTabChange} 
      className="space-y-6 w-full"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          delay: 0.3,
          duration: ANIMATION_CONFIG?.duration?.normal || 0.3,
          ease: ANIMATION_CONFIG?.ease?.smooth || 'easeOut'
        }}
      >
        <TabsList className={`grid w-full grid-cols-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <TabsTrigger 
            value="structures" 
            className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse order-3' : 'order-1'}`}
          >
            <FileText className="w-4 h-4" />
            {t('fee.feeStructures')}
          </TabsTrigger>
          <TabsTrigger 
            value="students" 
            className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse order-2' : 'order-2'}`}
          >
            <Users className="w-4 h-4" />
            {t('fee.studentFees')}
          </TabsTrigger>
          <TabsTrigger 
            value="history" 
            className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse order-1' : 'order-3'}`}
          >
            <History className="w-4 h-4" />
            {t('fee.paymentHistory')}
          </TabsTrigger>
        </TabsList>
      </motion.div>

      <TabsContent value="structures" className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: 0.4,
            duration: ANIMATION_CONFIG?.duration?.normal || 0.3,
            ease: ANIMATION_CONFIG?.ease?.smooth || 'easeOut'
          }}
          className="col-span-full"
        >
          <FeeTable
            data={feeStructures}
            onView={onViewFeeStructure}
            onEdit={onEditFeeStructure}
            onDelete={onDeleteFeeStructure}
            showPagination={showPagination}
            isRTL={isRTL}
            currentLanguage={currentLanguage}
            searchTerm={structureQueryParams.search}
            onSearchChange={handleStructureSearchChange}
            filters={structureQueryParams}
            onFilterChange={handleStructureFilterChange}
            currentPage={feeStructuresPagination.currentPage}
            totalPages={feeStructuresPagination.totalPages}
            totalItems={feeStructuresPagination.totalStructures}
            pageSize={structureQueryParams.limit}
            onPageChange={handleStructurePageChange}
            onPageSizeChange={handleStructurePageSizeChange}
            dynamicFilters={structureDynamicFilters}
            type="structure"
            getOptionLabel={getStructureOptionLabel}
            loading={loading} // ✅ ADD THIS - Pass loading prop
            serverSidePagination={true}
          />
        </motion.div>
      </TabsContent>

      <TabsContent value="students" className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: 0.4,
            duration: ANIMATION_CONFIG?.duration?.normal || 0.3,
            ease: ANIMATION_CONFIG?.ease?.smooth || 'easeOut'
          }}
          className="col-span-full"
        >
          <FeeTable
            data={studentFees}
            onView={onViewStudentFee}
            onEdit={onEditStudentFee}
            onDelete={onDeleteStudentFee}
            onRecordPayment={onRecordPayment}
            onAddDiscount={onAddDiscount}
            showPagination={showPagination}
            isRTL={isRTL}
            currentLanguage={currentLanguage}
            searchTerm={studentFeeQueryParams.search}
            onSearchChange={handleStudentFeeSearchChange}
            filters={studentFeeQueryParams}
            onFilterChange={handleStudentFeeFilterChange}
            currentPage={studentFeesPagination.currentPage}
            totalPages={studentFeesPagination.totalPages}
            totalItems={studentFeesPagination.totalStudentFees}
            pageSize={studentFeeQueryParams.limit}
            onPageChange={handleStudentFeePageChange}
            onPageSizeChange={handleStudentFeePageSizeChange}
            dynamicFilters={studentFeeDynamicFilters}
            type="student"
            getOptionLabel={getStudentFeeOptionLabel}
            loading={loading} // ✅ ADD THIS - Pass loading prop
            serverSidePagination={true}
          />
        </motion.div>
      </TabsContent>

      <TabsContent value="history" className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: 0.4,
            duration: ANIMATION_CONFIG?.duration?.normal || 0.3,
            ease: ANIMATION_CONFIG?.ease?.smooth || 'easeOut'
          }}
          className="col-span-full"
        >
          <FeeHistoryTable
            data={paymentHistory}
            onView={onViewPayment}
            onEdit={onEditPayment}
            onDelete={onDeletePayment}
            showPagination={false}
            isRTL={isRTL}
            currentLanguage={currentLanguage}
            searchTerm={historyQueryParams.search}
            onSearchChange={handleHistorySearchChange}
            filters={historyQueryParams}
            onFilterChange={handleHistoryFilterChange}
            dynamicFilters={historyDynamicFilters}
            getOptionLabel={getHistoryOptionLabel}
            loading={loading} // ✅ ADD THIS - Pass loading prop
            serverSidePagination={true}
          />
        </motion.div>
      </TabsContent>
    </Tabs>
  );
};

export default FeeTabs;
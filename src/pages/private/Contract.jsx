import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Button } from '../../maincomponents/components/ui/button';
import { Plus, FileText, CheckCircle, XCircle } from 'lucide-react';
import StatsCard from '@maincomponents/cards/StatsCard';
import ContractTable from '@maincomponents/tables/ContractTable';
import PageHeader from '@maincomponents/headerbar/PageHeader';
import { UnifiedChart } from '@maincomponents/charts/UnifiedChart';
import ViewContractModal from '@maincomponents/modal/viewModals/ViewContractModal';
import ContractModalFields from '@maincomponents/modal/addEditModals/ContractModalFields';
import BaseCreateModal from '@maincomponents/modal/addEditModals/BaseCreateModal';
import {
  fetchContracts,
  fetchContractById,
  createContract,
  updateContract,
  deleteContract,
  fetchContractStats,
  fetchContractTypeChart,
  fetchContractExpiryChart,
} from '../../redux/actions/contract';
import {
  clearErrors,
  clearSuccess,
  clearSelectedContract,
} from '../../redux/slice/contractSlice'; 
import { fetchTeacherOptions } from '../../redux/actions/class';

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
    return () => { clearTimeout(handler); };
  }, [value, delay]);
  return debouncedValue;
};

const Contract = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const isRTL = i18n.language === 'ar';
  const currentLanguage = i18n.language;
  const initialFetchDone = useRef(false);

  const {
    list, pagination, stats, charts, selectedContract, loading, statsLoading, chartsLoading,
    createLoading, updateLoading, error, createSuccess, updateSuccess, deleteSuccess,
  } = useSelector((state) => state.contracts);

  const teacherOptions = useSelector((state) => state.classes.teacherOptions);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ status: 'all', type: 'all' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activeChart, setActiveChart] = useState('overview');
  const [formData, setFormData] = useState({});

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const filterOptions = useMemo(() => [
    { key: 'status', label: t('contract.filters.status'), type: 'select', options: [{ value: 'all', label: t('common.all') }, { value: 'active', label: t('contract.filters.active') }, { value: 'expired', label: t('contract.filters.expired') }] },
    { key: 'type', label: t('contract.filters.type'), type: 'select', options: [{ value: 'all', label: t('common.all') }, { value: 'Contract', label: t('contract.type.contract') }, { value: 'Agreement', label: t('contract.type.agreement') }, { value: 'NOC', label: t('contract.type.noc') }, { value: 'Warning', label: t('contract.type.warning') }] }
  ], [t]);
  
  const loadData = useCallback((isInitial = false) => {
    const params = {
      page: currentPage, limit: pageSize,
      search: debouncedSearchTerm || undefined,
      type: filters.type !== 'all' ? filters.type : undefined,
      status: filters.status !== 'all' ? filters.status : undefined,
    };
    dispatch(fetchContracts(params));
    
    if (isInitial) {
      dispatch(fetchContractStats());
      dispatch(fetchContractTypeChart(currentLanguage));
      dispatch(fetchContractExpiryChart(currentLanguage));
      dispatch(fetchTeacherOptions());
    }
  }, [dispatch, currentPage, pageSize, debouncedSearchTerm, filters, currentLanguage]);

  useEffect(() => {
    if (!initialFetchDone.current) {
      loadData(true);
      initialFetchDone.current = true;
    } else {
      loadData(false);
    }
  }, [currentPage, pageSize, debouncedSearchTerm, filters, currentLanguage, loadData]);

  useEffect(() => { if (error) { toast.error(error); dispatch(clearErrors()); } }, [error, dispatch]);
  useEffect(() => {
    if (createSuccess) {
      toast.success(t('contract.messages.addSuccess')); setIsModalOpen(false); setFormData({});
      dispatch(clearSuccess()); loadData(true);
    }
  }, [createSuccess, t, dispatch, loadData]);
  useEffect(() => {
    if (updateSuccess) {
      toast.success(t('contract.messages.updateSuccess')); setIsModalOpen(false); setFormData({});
      dispatch(clearSuccess()); loadData(true);
    }
  }, [updateSuccess, t, dispatch, loadData]);
  useEffect(() => {
    if (deleteSuccess) {
      toast.success(t('contract.messages.deleteSuccess')); dispatch(clearSuccess());
      if (list.length === 1 && currentPage > 1) {
        setCurrentPage(p => p - 1);
      } else {
        loadData(true);
      }
    }
  }, [deleteSuccess, t, dispatch, list.length, currentPage, loadData]);

  const handleSearchChange = (val) => { setSearchTerm(val); setCurrentPage(1); };
  const handleFilterChange = (key, value) => { setFilters(p => ({ ...p, [key]: value })); setCurrentPage(1); };
  const handlePageChange = (page) => { setCurrentPage(page); };
  const handlePageSizeChange = (size) => { setPageSize(size); setCurrentPage(1); };
  const handleInputChange = (field, value) => setFormData(p => ({ ...p, [field]: value }));

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const submissionData = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== undefined) {
        submissionData.append(key, formData[key]);
      }
    });

    if (modalMode === 'add') {
      dispatch(createContract(submissionData));
    } else if (modalMode === 'edit' && selectedContract) {
      dispatch(updateContract({ id: selectedContract.id, formData: submissionData }));
    }
  };

  const handleAddContract = () => {
    setModalMode('add');
    setFormData({
      teacherId: '', type: 'Contract', uploadDate: new Date().toISOString().split('T')[0],
      expiryDate: '', file: null
    });
    dispatch(clearSelectedContract());
    setIsModalOpen(true);
  };

  const handleEditContract = (contract) => {
    dispatch(fetchContractById(contract.id)).unwrap().then((data) => {
        setModalMode('edit');
        setFormData({
          teacherId: data.teacher?.id || '',
          type: data.type || 'Contract',
          uploadDate: data.uploadDate ? data.uploadDate.split('T')[0] : '',
          expiryDate: data.expiryDate ? data.expiryDate.split('T')[0] : '',
        });
        setIsViewModalOpen(false);
        setIsModalOpen(true);
    });
  };

  const handleViewContract = async (contract) => {
    setIsViewModalOpen(true);
    setIsDetailsLoading(true);
    try {
      await dispatch(fetchContractById(contract.id)).unwrap();
    } catch (err) {
      toast.error(t('contract.messages.fetchError'));
      setIsViewModalOpen(false);
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const handleDeleteContract = (contractId) => {
    dispatch(deleteContract(contractId));
    setIsViewModalOpen(false);
  };

  const handleDownloadContract = (contract) => {
    if (contract.file && contract.file.path) {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const fileUrl = `${baseUrl}/${contract.file.path.replace(/\\/g, '/')}`;
      window.open(fileUrl, '_blank');
    } else {
      toast.error(t('contract.messages.noDocument'));
    }
  };

  const statsData = [
    { key: 'total', title: 'contract.stats.total', value: stats.totalContracts || 0, icon: FileText, color: "green" },
    { key: 'active', title: 'contract.stats.active', value: stats.activeContracts || 0, icon: CheckCircle, color: "purple" },
    { key: 'expired', title: 'contract.stats.expired', value: stats.expiredContracts || 0, icon: XCircle, color: "teal" }
  ];

  const chartTitles = {
    departments: t('contract.charts.contractTypes'),
    status: t('contract.charts.statusDistribution'),
    overview: t('contract.charts.overview')
  };

  const renderCharts = () => {
    const typeChartConfig = { 
        colors: ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b"]
    };
    const expiryChartConfig = { 
        xAxisKey: 'name', 
        areas: [{ dataKey: 'value', name: t('contract.charts.statusDistribution'), color: '#3b82f6' }] 
    };

    switch (activeChart) {
      case 'departments':
        return (
          <UnifiedChart 
            data={charts.typeChart} 
            type="donut" 
            config={typeChartConfig} 
            title={chartTitles.departments} 
            isRTL={isRTL} 
            currentLanguage={currentLanguage} 
            loading={chartsLoading} 
            showLegend={true} 
          />
        );
      case 'status':
        return (
          <UnifiedChart 
            data={charts.expiryChart} 
            type="curve" 
            config={expiryChartConfig} 
            title={chartTitles.status} 
            isRTL={isRTL} 
            currentLanguage={currentLanguage} 
            loading={chartsLoading} 
          />
        );
      default: // 'overview'
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <UnifiedChart 
              data={charts.expiryChart} 
              type="curve" 
              config={expiryChartConfig} 
              title={chartTitles.status} 
              isRTL={isRTL} 
              currentLanguage={currentLanguage} 
              loading={chartsLoading} 
            />
            <UnifiedChart 
              data={charts.typeChart} 
              type="donut" 
              config={typeChartConfig} 
              title={chartTitles.departments} 
              isRTL={isRTL} 
              currentLanguage={currentLanguage} 
              loading={chartsLoading} 
              showLegend={true} 
            />
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 py-6 px-2" dir={isRTL ? 'rtl' : 'ltr'}>
      <PageHeader title={t('contract.contractMembers')} description={t('contract.pageDescription')} action={<Button onClick={handleAddContract} className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg"><Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />{t('contract.addContract')}</Button>} isRTL={isRTL} />

      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}>
        {statsData.map((stat, index) => <StatsCard key={stat.key} title={t(stat.title)} value={stat.value} icon={stat.icon} color={stat.color} isRTL={isRTL} loading={statsLoading} delay={index * 0.1} />)}
      </motion.div>

      <div className={`flex flex-wrap gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Button variant={activeChart === 'overview' ? 'default' : 'outline'} onClick={() => setActiveChart('overview')} className={activeChart === 'overview' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' : ''}>{t('contract.buttons.overview')}</Button>
        <Button variant={activeChart === 'departments' ? 'default' : 'outline'} onClick={() => setActiveChart('departments')} className={activeChart === 'departments' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' : ''}>{t('contract.buttons.byType')}</Button>
        <Button variant={activeChart === 'status' ? 'default' : 'outline'} onClick={() => setActiveChart('status')} className={activeChart === 'status' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' : ''}>{t('contract.buttons.contractStatus')}</Button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>{renderCharts()}</motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <ContractTable data={list} onView={handleViewContract} onEdit={handleEditContract} onDelete={handleDeleteContract} onDownload={handleDownloadContract} isRTL={isRTL} currentLanguage={currentLanguage} loading={loading} searchTerm={searchTerm} onSearchChange={handleSearchChange} filters={filters} onFilterChange={handleFilterChange} filterOptions={filterOptions} currentPage={currentPage} onPageChange={handlePageChange} pageSize={pageSize} onPageSizeChange={handlePageSizeChange} totalItems={pagination.total} totalPages={pagination.totalPages} />
      </motion.div>
      
      <BaseCreateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'add' ? t('contract.addContract') : t('contract.editContract')} onSubmit={handleFormSubmit} isSubmitting={createLoading || updateLoading} isRTL={isRTL}>
        <ContractModalFields formData={formData} handleChange={handleInputChange} isRTL={isRTL} additionalData={{ teachers: teacherOptions }} />
      </BaseCreateModal>

      <ViewContractModal isOpen={isViewModalOpen} onClose={() => { setIsViewModalOpen(false); dispatch(clearSelectedContract()); }} data={selectedContract} loading={isDetailsLoading} isRTL={isRTL} onEdit={handleEditContract} onDelete={() => handleDeleteContract(selectedContract.id)} onDownload={handleDownloadContract} />
    </div>
  );
};

export default Contract;
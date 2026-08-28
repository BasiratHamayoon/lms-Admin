import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { ANIMATION_CONFIG } from '@data/Constants';
import { toast } from 'sonner';
import { Button } from '@maincomponents/components/ui/button';
import { Label } from '@maincomponents/components/ui/label';
import { Input } from '@maincomponents/components/ui/input';
import { Textarea } from '@maincomponents/components/ui/textarea';
import { Plus, CreditCard, DollarSign, BookOpen, TrendingUp, Users, UserPlus } from 'lucide-react';
import StatsCard from '@maincomponents/cards/StatsCard';
import PageHeader from '@maincomponents/headerbar/PageHeader';
import ViewFeeModal from '@maincomponents/modal/viewModals/ViewFeeModal';
import FeeModalFields from '@maincomponents/modal/addEditModals/FeeModalFields';
import StudentFeeModalFields from '@maincomponents/modal/addEditModals/StudentFeeModalFields';
import BaseCreateModal from '@maincomponents/modal/addEditModals/BaseCreateModal';
import PaymentModalFields from '@maincomponents/modal/addEditModals/PaymentModalFields';
import FeeTabs from '@maincomponents/tabs/FeeTabs';
import ViewFeeHistoryModal from '@maincomponents/modal/viewModals/ViewFeeHistoryModal';
import ViewFeeStructureModal from '@maincomponents/modal/viewModals/ViewFeeStructureModal';

import { useDispatch, useSelector } from 'react-redux';
import {
  getFeeStructuresList,
  getFeeStructureDetails,
  createFeeStructure,
  updateFeeStructure,
  deleteFeeStructure,
  getStudentFeesList,
  assignFeeStructure,
  getStudentFeeDetails,
  recordFeePayment,
  addFeeDiscount,
  getFeeStats,
  resetFeeState,
  getStudentOptions,
} from '@redux/slice/feeSlice';

import { selectClassOptions } from '@redux/slice/classSlice';
import { fetchClassOptions } from '@redux/actions/class';

const Fees = () => {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  const {
    feeStructures,
    feeStructuresPagination,
    studentFees,
    studentFeesPagination,
    currentStudentFee,
    feeStats,
    loading,
    error,
    studentOptions,
    studentOptionsLoading,
  } = useSelector((state) => state.fees);

  const listLoading = typeof loading === 'object' ? loading.list || false : !!loading;
  const statsLoading = typeof loading === 'object' ? loading.stats || false : !!loading;

  const classOptions = useSelector(selectClassOptions);

  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'structures');
  
  const [selectedFeeData, setSelectedFeeData] = useState(null);
  const [selectedPaymentData, setSelectedPaymentData] = useState(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [isFeeStructureModalOpen, setIsFeeStructureModalOpen] = useState(false);
  const [isStudentFeeAssignModalOpen, setIsStudentFeeAssignModalOpen] = useState(false);
  const [isPaymentRecordModalOpen, setIsPaymentRecordModalOpen] = useState(false);
  const [isViewFeeModalOpen, setIsViewFeeModalOpen] = useState(false);
  const [isViewFeeStructureModalOpen, setIsViewFeeStructureModalOpen] = useState(false);
  const [isViewPaymentModalOpen, setIsViewPaymentModalOpen] = useState(false);
  const [isAddDiscountModalOpen, setIsAddDiscountModalOpen] = useState(false);

  const [modalMode, setModalMode] = useState('add');

  const [structureQueryParams, setStructureQueryParams] = useState({
    page: 1, limit: 10, search: '', academicYear: '', classId: '', sortBy: 'name', sortOrder: 'asc'
  });
  const [studentFeeQueryParams, setStudentFeeQueryParams] = useState({
    page: 1, limit: 10, search: '', academicYear: '', classId: '', status: ''
  });
  const [historyQueryParams, setHistoryQueryParams] = useState({
    page: 1, limit: 10, search: '', academicYear: '', status: '', paymentMethod: ''
  });

  const [studentSearchQuery, setStudentSearchQuery] = useState('');

  const [feeStructureFormData, setFeeStructureFormData] = useState({
    name: { en: '', ar: '' },
    academicYear: '2024-2025',
    classId: '',
    components: [{ name: { en: '', ar: '' }, amount: '', frequency: 'yearly', dueDate: '' }],
    description: { en: '', ar: '' },
    isDefault: false
  });

  const [studentFeeAssignFormData, setStudentFeeAssignFormData] = useState({
    studentId: '',
    academicYear: '2024-2025',
    feeStructureId: '',
  });

  const [paymentRecordFormData, setPaymentRecordFormData] = useState({
    studentId: '',
    feeId: '',
    componentId: '',
    amount: '',
    paymentMethod: '',
    paymentDate: new Date().toISOString().split('T')[0],
    notes: { en: '', ar: '' },
    generateInvoice: true,
  });

  const [discountFormData, setDiscountFormData] = useState({
    name: { en: '', ar: '' },
    amount: '',
    percentage: '',
    reason: { en: '', ar: '' }
  });

  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    dispatch(getFeeStructuresList(structureQueryParams));
  }, [dispatch, structureQueryParams]);

  useEffect(() => {
    dispatch(getStudentFeesList(studentFeeQueryParams));
  }, [dispatch, studentFeeQueryParams]);

  useEffect(() => {
    dispatch(getFeeStats({ academicYear: studentFeeQueryParams.academicYear }));
    dispatch(fetchClassOptions({ academicYear: studentFeeQueryParams.academicYear, active: true }));

    return () => {
      dispatch(resetFeeState());
    };
  }, [dispatch, studentFeeQueryParams.academicYear]);

  useEffect(() => {
    if (isStudentFeeAssignModalOpen) {
      dispatch(getStudentOptions({ search: studentSearchQuery, limit: 20 }));
    }
  }, [dispatch, isStudentFeeAssignModalOpen, studentSearchQuery]);

  useEffect(() => {
    setSearchParams((prev) => {
      prev.set('tab', activeTab);
      return prev;
    });
  }, [activeTab, setSearchParams]);

  const handleFormChange = useCallback((setter) => (field, value, lang = null) => {
    setter(prev => {
      if (typeof prev[field] === 'object' && prev[field] !== null && !Array.isArray(prev[field])) {
        const currentFieldData = prev[field] || {};
        return {
          ...prev,
          [field]: { ...currentFieldData, [lang || i18n.language]: value }
        };
      }
      return { ...prev, [field]: value };
    });
  }, [i18n.language]);

  const handleFeeComponentChange = useCallback((index, componentField, value, lang = null) => {
    setFeeStructureFormData(prev => {
      const newComponents = [...(prev.components || [])];
      if (!newComponents[index]) return prev;

      if (componentField === 'name' && typeof newComponents[index][componentField] === 'object') {
        newComponents[index][componentField] = { ...newComponents[index][componentField], [lang || i18n.language]: value };
      } else {
        newComponents[index][componentField] = value;
      }
      return { ...prev, components: newComponents };
    });
  }, [i18n.language]);

  const handleAddRemoveFeeComponent = useCallback((type, index = null) => {
    setFeeStructureFormData(prev => {
      const newComponents = [...(prev.components || [])];
      if (type === 'add') {
        return {
          ...prev,
          components: [...newComponents, { name: { en: '', ar: '' }, amount: '', frequency: 'yearly', dueDate: '', optional: false }]
        };
      } else if (type === 'remove' && index !== null) {
        newComponents.splice(index, 1);
        return { ...prev, components: newComponents };
      }
      return prev;
    });
  }, []);

  const handleStudentSearch = useCallback((searchValue) => {
    setStudentSearchQuery(searchValue);
  }, []);

  const handleTabChange = (tab) => setActiveTab(tab);

  const openFeeStructureModal = async (mode, data = null) => {
    setModalMode(mode);

    if (mode === 'edit' && data) {
      let fullData = data;

      if (!data.components || data.components.length === 0) {
        try {
          const resultAction = await dispatch(getFeeStructureDetails(data.id || data._id));
          if (resultAction.meta.requestStatus === 'fulfilled') {
            fullData = resultAction.payload.data;
          } else {
            toast.error(resultAction.payload || t('fee.structureDetailsError'));
            return;
          }
        } catch (error) {
          toast.error(t('fee.structureDetailsError'));
          return;
        }
      }

      setSelectedFeeData(fullData);

      const name = typeof fullData.name === 'string'
        ? { en: fullData.name, ar: '' }
        : fullData.name || { en: '', ar: '' };
      const description = typeof fullData.description === 'string'
        ? { en: fullData.description, ar: '' }
        : fullData.description || { en: '', ar: '' };

      setFeeStructureFormData({
        name: name,
        academicYear: fullData.academicYear || '',
        classId: fullData.class?._id || fullData.classId || '',
        components: (fullData.components || []).map(comp => ({
          ...comp,
          name: typeof comp.name === 'string'
            ? { en: comp.name, ar: '' }
            : comp.name || { en: '', ar: '' },
          amount: comp.amount?.toString() || '',
          frequency: comp.frequency || 'yearly',
          dueDate: comp.dueDate
            ? new Date(comp.dueDate).toISOString().split('T')[0]
            : '',
          optional: comp.optional || false
        })),
        description: description,
        isDefault: fullData.isDefault || false
      });
    } else {
      setSelectedFeeData(null);
      setFeeStructureFormData({
        name: { en: '', ar: '' },
        academicYear: '2024-2025',
        classId: '',
        components: [{
          name: { en: '', ar: '' },
          amount: '',
          frequency: 'yearly',
          dueDate: '',
          optional: false
        }],
        description: { en: '', ar: '' },
        isDefault: false
      });
    }

    setIsFeeStructureModalOpen(true);
  };

  const openStudentFeeAssignModal = (mode, data = null) => {
    setModalMode(mode);
    setStudentSearchQuery(''); 

    if (mode === 'edit' && data) {
      setSelectedFeeData(data);
      setStudentFeeAssignFormData({
        studentId: data.student?._id || data.student?.id || '',
        academicYear: data.academicYear || '2024-2025',
        feeStructureId: data.feeStructure?.id || data.feeStructureId?._id || '',
      });
    } else {
      setSelectedFeeData(null);
      setStudentFeeAssignFormData({
        studentId: '',
        academicYear: '2024-2025',
        feeStructureId: '',
      });
    }
    setIsStudentFeeAssignModalOpen(true);
  };

  const openPaymentRecordModal = (mode, studentFeeContext = null, paymentContext = null) => {
    setModalMode(mode);

    if (mode === 'add' && studentFeeContext) {
      setSelectedFeeData(studentFeeContext);
      setPaymentRecordFormData({
        studentId: studentFeeContext.student?._id || '',
        feeId: studentFeeContext.id,
        componentId: '',
        amount: studentFeeContext.pendingAmount?.toString() || '',
        paymentMethod: '',
        paymentDate: new Date().toISOString().split('T')[0],
        notes: { en: `Payment for ${studentFeeContext.student?.name?.en || studentFeeContext.student?.name} - ${studentFeeContext.academicYear}`, ar: '' },
        generateInvoice: true,
      });
    } else if (mode === 'edit' && paymentContext) {
      setSelectedPaymentData(paymentContext);
      setPaymentRecordFormData({
        studentId: paymentContext.studentId,
        feeId: paymentContext.feeId,
        componentId: paymentContext.componentId || '',
        amount: paymentContext.amount?.toString() || '',
        paymentMethod: paymentContext.paymentMethod || '',
        paymentDate: paymentContext.paymentDate ? new Date(paymentContext.paymentDate).toISOString().split('T')[0] : '',
        notes: typeof paymentContext.notes === 'string' ? { en: paymentContext.notes, ar: '' } : paymentContext.notes || { en: '', ar: '' },
        generateInvoice: paymentContext.invoiceId ? true : false,
      });
    } else {
      setSelectedFeeData(null);
      setSelectedPaymentData(null);
      setPaymentRecordFormData({
        studentId: '',
        feeId: '',
        componentId: '',
        amount: '',
        paymentMethod: '',
        paymentDate: new Date().toISOString().split('T')[0],
        notes: { en: '', ar: '' },
        generateInvoice: true,
      });
    }
    setIsPaymentRecordModalOpen(true);
  };

  const openAddDiscountModal = (studentFeeData) => {
    setSelectedFeeData(studentFeeData);
    setDiscountFormData({
      name: { en: '', ar: '' },
      amount: '',
      percentage: '',
      reason: { en: '', ar: '' }
    });
    setIsAddDiscountModalOpen(true);
  };

  const handleViewFeeStructure = async (id) => {
    setIsViewFeeStructureModalOpen(true);
    setIsDetailsLoading(true);
    try {
        const resultAction = await dispatch(getFeeStructureDetails(id));
        if (resultAction.meta.requestStatus === 'fulfilled') {
            setSelectedFeeData(resultAction.payload.data);
        } else {
            toast.error(resultAction.payload || t('fee.structureDetailsError'));
            setIsViewFeeStructureModalOpen(false);
        }
    } finally {
        setIsDetailsLoading(false);
    }
  };
  
  const handleViewStudentFee = async (id) => {
    setIsViewFeeModalOpen(true);
    setIsDetailsLoading(true);
    try {
        const resultAction = await dispatch(getStudentFeeDetails(id));
        if (resultAction.meta.requestStatus === 'fulfilled') {
            setSelectedFeeData(resultAction.payload.data);
        } else {
            toast.error(resultAction.payload || t('fee.studentFeeDetailsError'));
            setIsViewFeeModalOpen(false);
        }
    } finally {
        setIsDetailsLoading(false);
    }
  };

  const handleViewPayment = (data) => {
    setSelectedPaymentData(data);
    setIsViewPaymentModalOpen(true);
  };

  const handleFeeStructureSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const payload = {
      ...feeStructureFormData,
      name: (feeStructureFormData.name.en || feeStructureFormData.name.ar) ? feeStructureFormData.name : feeStructureFormData.name.en,
      description: (feeStructureFormData.description.en || feeStructureFormData.description.ar) ? feeStructureFormData.description : feeStructureFormData.description.en,
      components: feeStructureFormData.components.map(comp => ({
        ...comp,
        name: (comp.name.en || comp.name.ar) ? comp.name : comp.name.en,
        amount: parseFloat(comp.amount),
      }))
    };

    let resultAction;
    if (modalMode === 'add') {
      resultAction = await dispatch(createFeeStructure(payload));
    } else if (modalMode === 'edit' && selectedFeeData) {
      resultAction = await dispatch(updateFeeStructure({ id: selectedFeeData.id, feeStructureData: payload }));
    }

    if (resultAction.meta.requestStatus === 'fulfilled') {
      toast.success(t('fee.structure.success'));
      setIsFeeStructureModalOpen(false);
      dispatch(getFeeStructuresList(structureQueryParams));
    } else {
      toast.error(resultAction.payload || t('fee.structure.error'));
    }
  };

  const handleStudentFeeAssignSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!studentFeeAssignFormData.studentId) {
      toast.error(t('fee.validation.studentRequired'));
      return;
    }
    if (!studentFeeAssignFormData.feeStructureId) {
      toast.error(t('fee.validation.feeStructureRequired'));
      return;
    }
    if (!studentFeeAssignFormData.academicYear) {
      toast.error(t('fee.validation.academicYearRequired'));
      return;
    }

    const payload = {
      studentId: studentFeeAssignFormData.studentId,
      feeStructureId: studentFeeAssignFormData.feeStructureId,
      academicYear: studentFeeAssignFormData.academicYear,
    };

    let resultAction;
    if (modalMode === 'add') {
      resultAction = await dispatch(assignFeeStructure(payload));
    } else if (modalMode === 'edit' && selectedFeeData) {
      toast.error(t('fee.studentFee.editNotFullySupported'));
      return;
    }

    if (resultAction.meta.requestStatus === 'fulfilled') {
      toast.success(t('fee.studentFee.success'));
      setIsStudentFeeAssignModalOpen(false);
      dispatch(getStudentFeesList(studentFeeQueryParams));
      dispatch(getFeeStats({ academicYear: studentFeeQueryParams.academicYear }));
    } else {
      toast.error(resultAction.payload || t('fee.studentFee.error'));
    }
  };

  const handlePaymentRecordSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const studentIdToUse = selectedFeeData?.student?._id || paymentRecordFormData.studentId;
    const feeIdToUse = selectedFeeData?.id || paymentRecordFormData.feeId;

    if (!studentIdToUse || !feeIdToUse) {
      toast.error(t('fee.payment.missingStudentFeeContext'));
      return;
    }

    const payload = {
      studentId: studentIdToUse,
      feeId: feeIdToUse,
      amount: parseFloat(paymentRecordFormData.amount),
      paymentMethod: paymentRecordFormData.paymentMethod,
      paymentDate: paymentRecordFormData.paymentDate,
      notes: (paymentRecordFormData.notes.en || paymentRecordFormData.notes.ar) ? paymentRecordFormData.notes : paymentRecordFormData.notes.en,
      componentId: paymentRecordFormData.componentId || undefined,
      generateInvoice: paymentRecordFormData.generateInvoice,
    };

    let resultAction;
    if (modalMode === 'add') {
      resultAction = await dispatch(recordFeePayment(payload));
    } else {
      toast.error(t('fee.payment.editNotSupported'));
      return;
    }

    if (resultAction.meta.requestStatus === 'fulfilled') {
      toast.success(t('fee.payment.success'));
      setIsPaymentRecordModalOpen(false);
      dispatch(getStudentFeesList(studentFeeQueryParams));
      if (selectedFeeData?.id) {
        dispatch(getStudentFeeDetails(selectedFeeData.id));
      }
      dispatch(getFeeStats({ academicYear: studentFeeQueryParams.academicYear }));
    } else {
      toast.error(resultAction.payload || t('fee.payment.error'));
    }
  };

  const handleAddDiscountSubmit = async (e) => {
    e.preventDefault();
    if (loading || !selectedFeeData) return;

    const payload = {
      name: (discountFormData.name.en || discountFormData.name.ar) ? discountFormData.name : discountFormData.name.en,
      amount: parseFloat(discountFormData.amount),
      percentage: discountFormData.percentage ? parseFloat(discountFormData.percentage) : undefined,
      reason: (discountFormData.reason.en || discountFormData.reason.ar) ? discountFormData.reason : discountFormData.reason.en,
    };

    const resultAction = await dispatch(addFeeDiscount({ id: selectedFeeData.id, discountData: payload }));

    if (resultAction.meta.requestStatus === 'fulfilled') {
      toast.success(t('fee.discount.addSuccess'));
      setIsAddDiscountModalOpen(false);
      dispatch(getStudentFeeDetails(selectedFeeData.id));
      dispatch(getStudentFeesList(studentFeeQueryParams));
      dispatch(getFeeStats({ academicYear: studentFeeQueryParams.academicYear }));
    } else {
      toast.error(resultAction.payload || t('fee.discount.addError'));
    }
  };

  const handleDeleteFeeStructure = async (id) => {
    if (!window.confirm(t('fee.deleteFeeStructureConfirm'))) return;
    const resultAction = await dispatch(deleteFeeStructure(id));
    if (resultAction.meta.requestStatus === 'fulfilled') {
      toast.success(t('fee.deleteFeeStructureSuccess'));
      dispatch(getFeeStructuresList(structureQueryParams));
    } else {
      toast.error(resultAction.payload || t('fee.deleteFeeStructureError'));
    }
  };

  const handleDeleteStudentFee = async (id) => {
    if (!window.confirm(t('fee.deleteStudentFeeConfirm'))) return;
    toast.error(t('fee.deleteStudentFeeNotImplemented'));
  };

  const handleDeletePayment = async (id) => {
    if (!window.confirm(t('fee.deletePaymentConfirm'))) return;
    toast.error(t('fee.deletePaymentNotImplemented'));
  };

  const getHeaderActionButton = () => {
    const buttonStyle = `bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-lg`;

    if (activeTab === 'structures') {
      return (
        <Button onClick={() => openFeeStructureModal('add')} className={buttonStyle}>
          <Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t('fee.addFeeStructure')}
        </Button>
      );
    } else if (activeTab === 'students') {
      return (
        <Button onClick={() => openStudentFeeAssignModal('add')} className={buttonStyle}>
          <UserPlus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t('fee.addStudentFee')}
        </Button>
      );
    } else if (activeTab === 'history') {
      return (
        <Button onClick={() => openPaymentRecordModal('add', null, null)} className={buttonStyle}>
          <Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t('fee.addPayment')}
        </Button>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 py-6 px-2" dir={isRTL ? 'rtl' : 'ltr'}>
      <PageHeader
        title={t('sidebar.fee')}
        description={t('fee.pageDescription')}
        action={getHeaderActionButton()}
        isRTL={isRTL}
      />

      {error && <p className="text-red-500">Error: {error}</p>}

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: ANIMATION_CONFIG.stagger.fast }
          }
        }}
      >
        <StatsCard
          title={t('fee.totalCollection')}
          value={`${feeStats?.totalPaid?.toLocaleString() || '0'}`}
          change=""
          icon={DollarSign}
          color="blue"
          delay={0}
          isRTL={isRTL}
          loading={statsLoading}
        />
        <StatsCard
          title={t('fee.totalAssigned')}
          value={`${feeStats?.totalAssigned?.toLocaleString() || '0'}`}
          change=""
          icon={BookOpen}
          color="green"
          delay={0.1}
          isRTL={isRTL}
          loading={statsLoading}
        />
        <StatsCard
          title={t('fee.pendingFees')}
          value={feeStats?.totalPending?.toLocaleString() || '0'}
          change=""
          icon={Users}
          color="teal"
          delay={0.3}
          isRTL={isRTL}
          loading={statsLoading}
        />
        <StatsCard
          title={t('fee.collectionRate')}
          value={`${feeStats?.collectionPercentage || '0'}%`}
          change=""
          icon={TrendingUp}
          color="purple"
          delay={0.2}
          isRTL={isRTL}
          loading={statsLoading}
        />
      </motion.div>

      <FeeTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        classOptions={classOptions}
        feeStructures={feeStructures}
        studentFees={studentFees}
        paymentHistory={currentStudentFee?.transactions || []}
        onViewFeeStructure={handleViewFeeStructure}
        onEditFeeStructure={(fs) => openFeeStructureModal('edit', fs)}
        onDeleteFeeStructure={handleDeleteFeeStructure}
        onViewStudentFee={handleViewStudentFee}
        onEditStudentFee={(sf) => openStudentFeeAssignModal('edit', sf)}
        onDeleteStudentFee={handleDeleteStudentFee}
        onRecordPayment={(sf) => openPaymentRecordModal('add', sf, null)}
        onAddDiscount={openAddDiscountModal}
        onViewPayment={handleViewPayment}
        onEditPayment={(payment) => openPaymentRecordModal('edit', null, payment)}
        onDeletePayment={handleDeletePayment}
        isRTL={isRTL}
        currentLanguage={i18n.language}
        structureQueryParams={structureQueryParams}
        setStructureQueryParams={setStructureQueryParams}
        studentFeeQueryParams={studentFeeQueryParams}
        setStudentFeeQueryParams={setStudentFeeQueryParams}
        historyQueryParams={historyQueryParams}
        setHistoryQueryParams={setHistoryQueryParams}
        feeStructuresPagination={feeStructuresPagination}
        studentFeesPagination={studentFeesPagination}
        loading={listLoading}
      />

      <BaseCreateModal
        isOpen={isFeeStructureModalOpen}
        onClose={() => setIsFeeStructureModalOpen(false)}
        title={modalMode === 'add' ? t('fee.addFeeStructure') : t('fee.editFeeStructure')}
        description={modalMode === 'add' ? t('fee.addFeeStructureDesc') : t('fee.editFeeStructureDesc')}
        onSubmit={handleFeeStructureSubmit}
        submitLabel={modalMode === 'add' ? t('fee.addFeeStructure') : t('common.save')}
        isSubmitting={loading}
        type="fee-structure"
        icon={BookOpen}
        gradient="from-teal-500 to-teal-600"
        isRTL={isRTL}
      >
        <FeeModalFields
          formData={feeStructureFormData}
          handleChange={handleFormChange(setFeeStructureFormData)}
          handleComponentChange={handleFeeComponentChange}
          handleAddComponent={() => handleAddRemoveFeeComponent('add')}
          handleRemoveComponent={(idx) => handleAddRemoveFeeComponent('remove', idx)}
          isRTL={isRTL}
          mode={modalMode}
          classOptions={classOptions}
        />
      </BaseCreateModal>

      <BaseCreateModal
        isOpen={isStudentFeeAssignModalOpen}
        onClose={() => setIsStudentFeeAssignModalOpen(false)}
        title={modalMode === 'add' ? t('fee.addStudentFee') : t('fee.editStudentFee')}
        description={modalMode === 'add' ? t('fee.addStudentFeeDesc') : t('fee.editStudentFeeDesc')}
        onSubmit={handleStudentFeeAssignSubmit}
        submitLabel={modalMode === 'add' ? t('fee.assignFeeToStudent') : t('fee.updateStudentFee')}
        isSubmitting={loading}
        type="student-fee"
        icon={UserPlus}
        gradient="from-teal-500 to-teal-600"
        isRTL={isRTL}
      >
        <StudentFeeModalFields
          formData={studentFeeAssignFormData}
          handleChange={handleFormChange(setStudentFeeAssignFormData)}
          isRTL={isRTL}
          feeStructures={feeStructures}
          studentOptions={studentOptions}
          studentOptionsLoading={studentOptionsLoading}
          onStudentSearch={handleStudentSearch}
          mode={modalMode}
        />
      </BaseCreateModal>

      <BaseCreateModal
        isOpen={isPaymentRecordModalOpen}
        onClose={() => setIsPaymentRecordModalOpen(false)}
        title={modalMode === 'add' ? t('fee.recordPayment') : t('fee.editPayment')}
        description={modalMode === 'add' ? t('fee.recordPaymentDesc') : t('fee.editPaymentDesc')}
        onSubmit={handlePaymentRecordSubmit}
        submitLabel={modalMode === 'add' ? t('fee.recordPayment') : t('common.save')}
        isSubmitting={loading}
        type="payment"
        icon={CreditCard}
        gradient="from-teal-500 to-teal-600"
        isRTL={isRTL}
      >
        <PaymentModalFields
          formData={paymentRecordFormData}
          handleChange={handleFormChange(setPaymentRecordFormData)}
          isRTL={isRTL}
          studentData={selectedFeeData?.student ? {
            name: selectedFeeData.student?.name,
            _id: selectedFeeData.student?._id,
            studentId: selectedFeeData.student?.id || selectedFeeData.student?.studentId,
            class: selectedFeeData.class?.name,
            pendingAmount: selectedFeeData.pendingAmount
          } : null}
          componentOptions={selectedFeeData?.components || []}
          mode={modalMode}
        />
      </BaseCreateModal>

      <BaseCreateModal
        isOpen={isAddDiscountModalOpen}
        onClose={() => setIsAddDiscountModalOpen(false)}
        title={t('fee.addDiscount')}
        description={t('fee.addDiscountDesc')}
        onSubmit={handleAddDiscountSubmit}
        submitLabel={t('fee.addDiscount')}
        isSubmitting={loading}
        type="add-discount"
        icon={UserPlus}
        gradient="from-purple-500 to-purple-600"
        isRTL={isRTL}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{t('fee.discountName')}</Label>
            <Input
              value={discountFormData.name.en}
              onChange={(e) => setDiscountFormData(prev => ({ ...prev, name: { ...prev.name, en: e.target.value } }))}
              placeholder={t('fee.discountNamePlaceholder')}
            />
          </div>
          <div className="space-y-2">
            <Label>{t('fee.discountAmount')}</Label>
            <Input
              type="number"
              value={discountFormData.amount}
              onChange={(e) => setDiscountFormData(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <Label>{t('fee.discountReason')}</Label>
            <Textarea
              value={discountFormData.reason.en}
              onChange={(e) => setDiscountFormData(prev => ({ ...prev, reason: { ...prev.reason, en: e.target.value } }))}
              placeholder={t('fee.discountReasonPlaceholder')}
            />
          </div>
        </div>
      </BaseCreateModal>

      {isViewFeeStructureModalOpen && (
        <ViewFeeStructureModal
          isOpen={isViewFeeStructureModalOpen}
          onClose={() => setIsViewFeeStructureModalOpen(false)}
          data={selectedFeeData}
          loading={isDetailsLoading}
          isRTL={isRTL}
          currentLanguage={i18n.language}
          onEdit={(fs) => { setIsViewFeeStructureModalOpen(false); openFeeStructureModal('edit', fs); }}
          onDelete={(id) => { setIsViewFeeStructureModalOpen(false); handleDeleteFeeStructure(id); }}
        />
      )}

      {isViewFeeModalOpen && (
        <ViewFeeModal
          isOpen={isViewFeeModalOpen}
          onClose={() => setIsViewFeeModalOpen(false)}
          data={selectedFeeData}
          loading={isDetailsLoading}
          isRTL={isRTL}
          currentLanguage={i18n.language}
          onEdit={(sf) => { setIsViewFeeModalOpen(false); openStudentFeeAssignModal('edit', sf); }}
          onRecordPayment={(sf) => { setIsViewFeeModalOpen(false); openPaymentRecordModal('add', sf, null); }}
          onAddDiscount={(sf) => { setIsViewFeeModalOpen(false); openAddDiscountModal(sf); }}
          onDelete={(id) => { setIsViewFeeModalOpen(false); handleDeleteStudentFee(id); }}
        />
      )}

      {isViewPaymentModalOpen && (
        <ViewFeeHistoryModal
          isOpen={isViewPaymentModalOpen}
          onClose={() => setIsViewPaymentModalOpen(false)}
          data={selectedPaymentData}
          loading={isDetailsLoading}
          isRTL={isRTL}
          currentLanguage={i18n.language}
          onEdit={(payment) => { setIsViewPaymentModalOpen(false); openPaymentRecordModal('edit', null, payment); }}
          onDelete={(id) => { setIsViewPaymentModalOpen(false); handleDeletePayment(id); }}
        />
      )}
    </div>
  );
};

export default Fees;
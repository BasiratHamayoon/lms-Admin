import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Button } from '../../maincomponents/components/ui/button';
import { Plus, HelpCircle } from 'lucide-react';
import SurveyTable from '@maincomponents/tables/SurveyTable';
import PageHeader from '@maincomponents/headerbar/PageHeader';
import ViewSurveyModal from '@maincomponents/modal/viewModals/ViewSurveyModal';
import SurveyModalFields from '@maincomponents/modal/addEditModals/SurveyModalFields';
import BaseCreateModal from '@maincomponents/modal/addEditModals/BaseCreateModal';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchQuestions,
  createQuestion,
  updateQuestion,
  deactivateQuestion,
  bulkUploadQuestions
} from '../../redux/actions/survey';

import {
  clearError,
  setFilters,
  setPagination,
  setSearchTerm,
} from '@redux/slice/surveySlice';

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

const Survey = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const currentLanguage = i18n.language;

  const dispatch = useDispatch();
  const {
    questions,
    pagination,
    filters,
    searchTerm,
    loading,
    error,
    availableCategories
  } = useSelector((state) => state.survey);

  // Use a ref to prevent re-fetching on initial mount in the update effect
  const isInitialMount = useRef(true);

  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isViewModalLoading, setIsViewModalLoading] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [creationMethod, setCreationMethod] = useState('manual');
  const [excelFileToUpload, setExcelFileToUpload] = useState(null);
  const [excelUploadError, setExcelUploadError] = useState('');
  const [excelUploadSuccess, setExcelUploadSuccess] = useState(false);

  const [formData, setFormData] = useState({
    question: { en: '', ar: '' },
    category: availableCategories[0] || 'other',
    weight: 1,
    active: true,
  });

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // --- EFFECT 1: Fetch data ONLY on initial component mount ---
  useEffect(() => {
    dispatch(fetchQuestions());
  }, [dispatch]);

  // --- EFFECT 2: Re-fetch data ONLY when dependencies change, skipping the initial mount ---
  useEffect(() => {
    // If it's the initial render, do nothing.
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // On subsequent renders, this will run if dependencies change.
    dispatch(fetchQuestions({ search: debouncedSearchTerm }));
  }, [
    dispatch,
    pagination.page,
    pagination.limit,
    filters.active,
    filters.category,
    debouncedSearchTerm
  ]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const resetForm = useCallback(() => {
    setFormData({
      question: { en: '', ar: '' },
      category: availableCategories[0] || 'other',
      weight: 1,
      active: true,
    });
    setSelectedQuestion(null);
    setCreationMethod('manual');
    setExcelFileToUpload(null);
    setIsSubmitting(false);
    setExcelUploadError('');
    setExcelUploadSuccess(false);
  }, [availableCategories]);

  // All other handlers remain the same
    const handleInputChange = useCallback((field, value) => { setFormData(prev => ({ ...prev, [field]: value })); }, []);
    const handleFormSubmit = async (e) => { e.preventDefault(); setIsSubmitting(true); let success = false; try { if (modalMode === 'add' && creationMethod === 'excel') { if (!excelFileToUpload) { toast.error(t('survey.excel.noFileSelected')); setIsSubmitting(false); return; } await dispatch(bulkUploadQuestions(excelFileToUpload)).unwrap(); setExcelUploadSuccess(true); toast.success(t('survey.excel.uploadSuccessToast')); success = true; } else { const payload = { question: { en: formData.question?.en?.trim() || '', ar: formData.question?.ar?.trim() || '' }, category: formData.category || 'other', weight: Number(formData.weight) || 1, active: formData.active, }; if (!payload.question.en && !payload.question.ar) { toast.error(t('survey.validation.questionRequired')); setIsSubmitting(false); return; } if (modalMode === 'add') { await dispatch(createQuestion(payload)).unwrap(); toast.success(t('survey.createSuccess')); } else if (modalMode === 'edit' && selectedQuestion?._id) { await dispatch(updateQuestion({ id: selectedQuestion._id, questionData: payload })).unwrap(); toast.success(t('survey.updateSuccess')); } success = true; } if (success) { setIsModalOpen(false); resetForm(); dispatch(fetchQuestions()); } } catch (err) { const errorMessage = err?.message || err || 'An error occurred'; toast.error(errorMessage); if (modalMode === 'add' && creationMethod === 'excel') { setExcelUploadError(errorMessage); } } finally { setIsSubmitting(false); } };
    const handleAddQuestion = useCallback(() => { setModalMode('add'); resetForm(); setIsModalOpen(true); }, [resetForm]);
    const handleEditQuestion = useCallback((question) => { if (!question?._id) return; setModalMode('edit'); setSelectedQuestion(question); setFormData({ question: { en: question.question?.en || '', ar: question.question?.ar || '' }, category: question.category || availableCategories[0] || 'other', weight: question.weight !== undefined ? question.weight : 1, active: question.active !== undefined ? question.active : true, }); setIsModalOpen(true); setCreationMethod('manual'); }, [availableCategories]);
    const handleViewQuestion = useCallback((question) => { if (!question?._id) return; setIsViewModalLoading(true); setIsViewModalOpen(true); setSelectedQuestion(question); setTimeout(() => setIsViewModalLoading(false), 300); }, []);
    const handleDeleteQuestion = useCallback(async (questionId) => { if (!questionId) return; try { await dispatch(deactivateQuestion(questionId)).unwrap(); toast.success(t('survey.deactivateSuccess')); dispatch(fetchQuestions()); } catch (err) { const errorMessage = err?.message || err || t('survey.deactivateFailed'); toast.error(errorMessage); } }, [dispatch, t]);
    const handlePageChange = useCallback((page) => dispatch(setPagination({ page })), [dispatch]);
    const handlePageSizeChange = useCallback((limit) => dispatch(setPagination({ limit, page: 1 })), [dispatch]);
    const handleFilterChange = useCallback((filterKey, value) => dispatch(setFilters({ [filterKey]: value })), [dispatch]);
    const handleSearchChange = useCallback((value) => dispatch(setSearchTerm(value)), [dispatch]);
    const handleExcelFileSelected = useCallback((file, validationError) => { setExcelFileToUpload(file); setExcelUploadError(validationError || ''); setExcelUploadSuccess(false); }, []);
    const handleCloseModal = useCallback(() => { setIsModalOpen(false); resetForm(); }, [resetForm]);
    const handleCloseViewModal = useCallback(() => { setIsViewModalOpen(false); setSelectedQuestion(null); }, []);
    const isSubmitButtonDisabled = isSubmitting || (modalMode === 'add' && creationMethod === 'excel' && (!excelFileToUpload || !!excelUploadError)) || (modalMode === 'add' && creationMethod === 'manual' && (!formData.question?.en && !formData.question?.ar));

  return (
    <div className="space-y-6 py-6 px-2" dir={isRTL ? 'rtl' : 'ltr'}>
      <PageHeader
        title={t('sidebar.survey')}
        description={t('survey.pageDescription')}
        action={
          <Button onClick={handleAddQuestion} className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg">
            <Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t('survey.addQuestion')}
          </Button>
        }
        isRTL={isRTL}
      />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="col-span-full">
        <SurveyTable
          data={questions}
          onView={handleViewQuestion}
          onEdit={handleEditQuestion}
          onDelete={handleDeleteQuestion}
          isRTL={isRTL}
          currentLanguage={currentLanguage}
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          filters={filters}
          onFilterChange={handleFilterChange}
          loading={loading}
          showPagination={true}
          serverSidePagination={true}
          pageSize={pagination.limit}
          currentPage={pagination.page}
          totalItems={pagination.total}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          dynamicFilters={{ status: ['active', 'inactive'], category: availableCategories }}
        />
      </motion.div>
      <BaseCreateModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={modalMode === 'add' ? t('survey.addQuestion') : t('survey.editQuestion')}
        description={modalMode === 'add' ? t('survey.modal.addDesc') : t('survey.modal.editDesc')}
        onSubmit={handleFormSubmit}
        submitLabel={modalMode === 'add' && creationMethod === 'excel' ? t('survey.excel.uploadAndAdd') : (modalMode === 'add' ? t('survey.addQuestion') : t('common.save'))}
        isSubmitting={isSubmitting}
        disableSubmitButton={isSubmitButtonDisabled}
        type="survey"
        icon={HelpCircle}
        gradient="from-blue-500 to-blue-600"
        isRTL={isRTL}
      >
        <SurveyModalFields
          formData={formData}
          handleChange={handleInputChange}
          isRTL={isRTL}
          modalMode={modalMode}
          enableMultiLanguage={true}
          currentLanguage={currentLanguage}
          availableCategories={availableCategories}
          onExcelFileSelected={handleExcelFileSelected}
          excelFile={excelFileToUpload}
          isExcelUploading={isSubmitting && creationMethod === 'excel'}
          excelUploadError={excelUploadError}
          excelUploadSuccess={excelUploadSuccess}
          clearExcelUpload={() => { setExcelFileToUpload(null); setExcelUploadError(''); setExcelUploadSuccess(false); }}
          creationMethod={creationMethod}
          setCreationMethod={setCreationMethod}
        />
      </BaseCreateModal>
      <ViewSurveyModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        data={selectedQuestion}
        loading={isViewModalLoading}
        isRTL={isRTL}
        currentLanguage={currentLanguage}
        onEdit={(question) => { setIsViewModalOpen(false); handleEditQuestion(question); }}
        onDelete={(questionId) => { setIsViewModalOpen(false); handleDeleteQuestion(questionId); }}
      />
    </div>
  );
};

export default Survey;
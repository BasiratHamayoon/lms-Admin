import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';

import { Button } from '@maincomponents/components/ui/button';
import { Plus, BookOpen, Clock, CheckCircle, BarChart3, Download } from 'lucide-react';
import StatsCard from '@maincomponents/cards/StatsCard';
import PageHeader from '@maincomponents/headerbar/PageHeader';
import BaseCreateModal from '@maincomponents/modal/addEditModals/BaseCreateModal';
import { ANIMATION_CONFIG } from '@data/Constants';

import {
  fetchQuizDashboardCards,
  fetchQuizFilterOptions,
  fetchQuizzes,
  createQuiz,
  fetchAllSubmissions,
  updateQuiz,
  deleteQuiz,
  fetchQuizDetails,
  publishQuiz,
  closeQuiz,
  gradeQuizSubmission,
  downloadQuizTemplate,
  setSelectedQuiz,
  setSelectedSubmission,
  setFilters,
  clearFilters,
  setPage,
  setPageSize,
  selectQuizzes,
  selectQuizDetails,
  selectSubmissions,
  selectDashboardStats,
  selectFilterOptions,
  selectLoading,
  selectQuizStats,
  selectQuizFilters,
  selectMeta,
  clearQuizDetails
} from '@redux/slice/quizSlice';

import {
  fetchClassOptions,
  fetchCourseOptions,
  selectClassOptions,
  selectCourseOptions,
  selectOptionsLoading
} from '@redux/slice/gradeSlice';

import QuizTabs from '@maincomponents/tabs/QuizTabs';
import QuizModalFields from '@maincomponents/modal/addEditModals/QuizModalFields';
import ViewQuizModal from '@maincomponents/modal/viewModals/ViewQuizModal';
import GradeModalFields from '@maincomponents/modal/addEditModals/GradeModalFields';

const Quiz = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const dispatch = useDispatch();
  
  const quizzes = useSelector(selectQuizzes);
  const quizDetails = useSelector(selectQuizDetails);
  const submissions = useSelector(selectSubmissions);
  const filterOptions = useSelector(selectFilterOptions);
  const loading = useSelector(selectLoading);
  const stats = useSelector(selectQuizStats);
  const filters = useSelector(selectQuizFilters);
  const meta = useSelector(selectMeta);

  const classOptions = useSelector(selectClassOptions);
  const courseOptions = useSelector(selectCourseOptions);
  const optionsLoading = useSelector(selectOptionsLoading);
  
  const [activeTab, setActiveTab] = useState('quizzes');
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [quizForm, setQuizForm] = useState({});
  const [gradeForm, setGradeForm] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    dispatch(fetchQuizDashboardCards());
    dispatch(fetchQuizFilterOptions());
    dispatch(fetchClassOptions());
    dispatch(fetchCourseOptions());
  }, [dispatch]);
  
  useEffect(() => {
    dispatch(fetchQuizzes({ ...filters, page: meta.page, limit: meta.limit }));
  }, [dispatch, filters, meta.page, meta.limit]);

  const metaData = useMemo(() => ({
    classes: classOptions || [],
    courses: courseOptions || [],
    sections: filterOptions.sections || [],
    statuses: filterOptions.statuses || []
  }), [classOptions, courseOptions, filterOptions]);

  const createFormData = useCallback((formValues, file = null) => {
    const formData = new FormData();
    const title = { en: String(formValues.title?.en || '').trim(), ar: String(formValues.title?.ar || '').trim() };
    if (!title.en && !title.ar) return null;
    formData.append('title', JSON.stringify(title));
    const description = { en: String(formValues.description?.en || '').trim(), ar: String(formValues.description?.ar || '').trim() };
    formData.append('description', JSON.stringify(description));
    const classId = typeof formValues.classId === 'object' ? (formValues.classId._id || formValues.classId.id || formValues.classId.value) : formValues.classId;
    formData.append('classId', classId);
    const dueDate = new Date(formValues.dueDate);
    if (isNaN(dueDate) || dueDate <= new Date()) return null;
    formData.append('dueDate', dueDate.toISOString());
    formData.append('status', formValues.status || 'draft');
    if (file) {
      formData.append('file', file);
    } else {
      const validQuestions = formValues.questions.filter(q => q.questionText?.trim());
      if (validQuestions.length === 0) return null;
      formData.append('questions', JSON.stringify(validQuestions));
    }
    return formData;
  }, []);
  
  const handleAddQuiz = useCallback(() => {
    setModalMode('add');
    dispatch(setSelectedQuiz(null));
    setQuizForm({
      title: { en: '', ar: '' },
      description: { en: '', ar: '' },
      classId: '',
      totalMarks: 100,
      dueDate: '',
      questions: [],
      status: 'draft'
    });
    setSelectedFile(null);
    setIsQuizModalOpen(true);
  }, [dispatch]);

  const handleEditQuiz = useCallback((item) => {
    setModalMode('edit');
    dispatch(setSelectedQuiz(item));
    const classId = item.classId?._id || item.classId?.id || item.classId || '';
    setQuizForm({
      _id: item._id || item.id,
      title: item.title || { en: '', ar: '' },
      description: item.description || { en: '', ar: '' },
      classId: classId,
      totalMarks: item.totalMarks || 100,
      dueDate: item.dueDate ? new Date(item.dueDate).toISOString().slice(0, 16) : '',
      questions: item.questions || [],
      status: item.status || 'draft'
    });
    setSelectedFile(null);
    setIsQuizModalOpen(true);
  }, [dispatch]);

  const handleViewQuiz = useCallback(async (item) => {
    if (!item?.id && !item?._id) return;
    
    setIsViewModalOpen(true);
    try {
      await dispatch(fetchQuizDetails(item.id || item._id)).unwrap();
    } catch (error) {
      toast.error(t('quizzes.fetchFailed'));
      setIsViewModalOpen(false);
    }
  }, [dispatch, t]);

  const handleDeleteQuiz = useCallback(async (id) => {
    try {
      await dispatch(deleteQuiz(id)).unwrap();
      toast.success(t('common.deletedSuccessfully'));
    } catch (error) {
      toast.error(error || t('common.deleteFailed'));
    }
  }, [dispatch, t]);

  const handlePublishQuiz = useCallback(async (id) => {
    try {
      await dispatch(publishQuiz(id)).unwrap();
      toast.success(t('quizzes.publishedSuccessfully'));
    } catch (error) {
      toast.error(error || t('quizzes.publishFailed'));
    }
  }, [dispatch, t]);

  const handleCloseQuiz = useCallback(async (id) => {
    try {
      await dispatch(closeQuiz(id)).unwrap();
      toast.success(t('quizzes.closedSuccessfully'));
    } catch (error) {
      toast.error(error || t('quizzes.closeFailed'));
    }
  }, [dispatch, t]);

  const handleQuizSubmit = useCallback(async (e) => {
    e.preventDefault();
    const titleEn = quizForm.title?.en?.trim();
    const titleAr = quizForm.title?.ar?.trim();
    if (!titleEn && !titleAr) {
      toast.error(t('common.titleRequired'));
      return;
    }
    if (!quizForm.classId) {
      toast.error(t('common.classRequired'));
      return;
    }
    if (!quizForm.dueDate) {
      toast.error(t('quizzes.dueDateRequired'));
      return;
    }
    const dueDate = new Date(quizForm.dueDate);
    if (isNaN(dueDate.getTime()) || dueDate <= new Date()) {
      toast.error(t('quizzes.dueDateMustBeFuture'));
      return;
    }
    if (!selectedFile && (!quizForm.questions || quizForm.questions.length === 0)) {
      toast.error(t('quizzes.questionsRequired'));
      return;
    }
    const formData = createFormData(quizForm, selectedFile);
    if (!formData) return;
    try {
      if (modalMode === 'add') {
        await dispatch(createQuiz(formData)).unwrap();
        toast.success(t('common.addedSuccessfully'));
      } else {
        const quizId = quizDetails?._id || quizDetails?.id || quizForm._id;
        await dispatch(updateQuiz({ id: quizId, formData })).unwrap();
        toast.success(t('common.updatedSuccessfully'));
      }
      setIsQuizModalOpen(false);
      setSelectedFile(null);
    } catch (error) {
      console.error('Quiz submit error:', error);
      toast.error(error?.message || t('common.operationFailed'));
    }
  }, [quizForm, modalMode, quizDetails, selectedFile, createFormData, dispatch, t]);

  const handleGradeSubmission = useCallback((submission) => {
    dispatch(setSelectedSubmission(submission));
    setGradeForm({
      marks: submission.totalMarks || '',
      feedback: submission.feedback || { en: '', ar: '' },
      status: 'graded',
      submissionId: submission._id || submission.id
    });
    setIsGradeModalOpen(true);
  }, [dispatch]);

  const handleGradeSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (gradeForm.marks === '' || gradeForm.marks === null || gradeForm.marks === undefined) {
      toast.error(t('common.marksRequired'));
      return;
    }
    try {
      await dispatch(gradeQuizSubmission({
        quizId: quizDetails?.id || quizDetails?._id,
        submissionId: gradeForm.submissionId,
        gradeData: { marks: Number(gradeForm.marks), feedback: gradeForm.feedback, status: gradeForm.status || 'graded' }
      })).unwrap();
      toast.success(t('quizzes.gradedSuccessfully'));
      setIsGradeModalOpen(false);
    } catch (error) {
      toast.error(error || t('quizzes.gradeFailed'));
    }
  }, [gradeForm, quizDetails, dispatch, t]);

  const handleFileSelect = useCallback((file) => {
    setSelectedFile(file);
  }, []);

  const handleDownloadTemplate = useCallback(async () => {
    try {
      const blob = await dispatch(downloadQuizTemplate()).unwrap();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'quiz-template.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success(t('quizzes.templateDownloaded'));
    } catch (error) {
      toast.error(error || t('quizzes.downloadFailed'));
    }
  }, [dispatch, t]);

  const handleFilterChange = useCallback((newFilters) => {
    dispatch(setFilters(newFilters));
  }, [dispatch]);

  const handleClearFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  const handlePageChange = useCallback((page) => {
    dispatch(setPage(page));
  }, [dispatch]);

  const handlePageSizeChange = useCallback((size) => {
    dispatch(setPageSize(size));
  }, [dispatch]);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    if (tab === 'submissions') {
      dispatch(fetchAllSubmissions({ page: 1, limit: 10 }));
    }
  }, [dispatch]);

  useEffect(() => {
    if (activeTab === 'submissions') {
      dispatch(fetchAllSubmissions({ page: 1, limit: 10 }));
    }
  }, [dispatch, activeTab]);

  const handleCloseViewModal = useCallback(() => {
    setIsViewModalOpen(false);
    dispatch(clearQuizDetails());
  }, [dispatch]);
  
  const statsCards = useMemo(() => [
    { key: 'total', title: 'common.total', value: stats.total, icon: BookOpen, color: 'blue' },
    { key: 'active', title: 'status.active', value: stats.active, icon: CheckCircle, color: 'green' },
    { key: 'pendingGrading', title: 'status.pendingGrading', value: stats.pendingGrading, icon: Clock, color: 'purple' },
    { key: 'averageScore', title: 'quizzes.averageScore', value: `${stats.averageScore}%`, icon: BarChart3, color: 'teal' }
  ], [stats]);

  const isLoading = loading.quizzes || optionsLoading;

  return (
    <div className="space-y-6 py-6 px-2" dir={isRTL ? 'rtl' : 'ltr'}>
      <PageHeader
        title={t('sidebar.quizzes')}
        description={t('quizzes.pageDescription')}
        action={
          <div className="flex gap-2">
            <Button
              onClick={handleDownloadTemplate}
              variant="outline"
              disabled={loading.template}
              className="border-green-500 text-green-600 hover:bg-green-50"
            >
              <Download className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('quizzes.downloadTemplate')}
            </Button>
            <Button
              onClick={handleAddQuiz}
              disabled={loading.create || optionsLoading}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg"
            >
              <Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('quizzes.create')}
            </Button>
          </div>
        }
        isRTL={isRTL}
      />

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: ANIMATION_CONFIG.stagger.fast } } }}
      >
        {statsCards.map((stat, index) => (
          <StatsCard
            key={stat.key}
            title={t(stat.title)}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            delay={index * ANIMATION_CONFIG.stagger.fast}
            isRTL={isRTL}
            loading={loading.dashboard}
          />
        ))}
      </motion.div>

      <QuizTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        quizzes={quizzes}
        submissions={submissions}
        onViewQuiz={handleViewQuiz}
        onEditQuiz={handleEditQuiz}
        onDeleteQuiz={handleDeleteQuiz}
        onPublishQuiz={handlePublishQuiz}
        onCloseQuiz={handleCloseQuiz}
        onGradeSubmission={handleGradeSubmission}
        isRTL={isRTL}
        currentLanguage={i18n.language}
        metaData={metaData}
        loading={loading}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        pagination={meta}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      <BaseCreateModal
        isOpen={isQuizModalOpen}
        onClose={() => {
          setIsQuizModalOpen(false);
          setSelectedFile(null);
        }}
        title={modalMode === 'add' ? t('quizzes.create') : t('quizzes.edit')}
        description={t('quizzes.formDescription')}
        onSubmit={handleQuizSubmit}
        type="quiz"
        isRTL={isRTL}
        isSubmitting={loading.create || loading.update}
      >
        <QuizModalFields
          formData={quizForm}
          handleChange={(field, val) => setQuizForm(prev => ({ ...prev, [field]: val }))}
          metaData={metaData}
          isRTL={isRTL}
          currentLanguage={i18n.language}
          selectedFile={selectedFile}
          onFileSelect={handleFileSelect}
          onDownloadTemplate={handleDownloadTemplate}
          optionsLoading={optionsLoading}
        />
      </BaseCreateModal>

      <ViewQuizModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        data={quizDetails}
        isRTL={isRTL}
        currentLanguage={i18n.language}
        onEdit={(item) => {
          setIsViewModalOpen(false);
          setTimeout(() => handleEditQuiz(item), 100);
        }}
        onPublish={handlePublishQuiz}
        onCloseQuiz={handleCloseQuiz}
        onGradeSubmission={handleGradeSubmission}
        loading={loading.details}
      />

      <BaseCreateModal
        isOpen={isGradeModalOpen}
        onClose={() => setIsGradeModalOpen(false)}
        title={t('quizzes.gradeSubmission')}
        onSubmit={handleGradeSubmit}
        submitLabel={t('common.save')}
        type="grade"
        isRTL={isRTL}
        isSubmitting={loading.grade}
      >
        <GradeModalFields
          formData={gradeForm}
          handleChange={(field, val) => setGradeForm(prev => ({ ...prev, [field]: val }))}
          isRTL={isRTL}
          maxMarks={quizDetails?.totalMarks || 100}
          submission={gradeForm}
        />
      </BaseCreateModal>
    </div>
  );
};

export default Quiz;
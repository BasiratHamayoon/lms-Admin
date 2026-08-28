import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { useDebouncedCallback } from 'use-debounce';

import { Button } from '@maincomponents/components/ui/button';
import { Plus, BookOpen, Users, Clock, CheckCircle } from 'lucide-react';
import StatsCard from '@maincomponents/cards/StatsCard';
import PageHeader from '@maincomponents/headerbar/PageHeader';
import BaseCreateModal from '@maincomponents/modal/addEditModals/BaseCreateModal';
import AssignmentTabs from '@maincomponents/tabs/AssignmentTabs';
import AssignmentModalFields from '@maincomponents/modal/addEditModals/AssignmentModalFields';
import ViewAssignmentModal from '@maincomponents/modal/viewModals/ViewAssignmentModal';
import GradeModalFields from '@maincomponents/modal/addEditModals/GradeModalFields';
import AssignStudentsModal from '@maincomponents/modal/addEditModals/AssignStudentsModal';
import { ANIMATION_CONFIG } from '@data/Constants';

import {
  fetchTeacherAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  publishAssignment,
  assignToStudents,
  fetchAssignmentSubmissions,
  gradeSubmission,
  fetchClassStudents,
  setSelectedAssignment,
  setSelectedSubmission,
  setFilters,
  clearClassStudents,
  selectAssignments,
  selectSubmissions,
  selectClassStudents,
  selectSelectedAssignment,
  selectSelectedSubmission,
  selectLoading,
  selectAssignmentStats,
  selectMeta,
  selectFilters
} from '@redux/slice/assignmentSlice';

import { 
  fetchClassOptions, 
  fetchCourseOptions 
} from '@redux/actions/class';
import { 
  selectClassOptions, 
  selectCourseOptions 
} from '@redux/slice/classSlice';

const Assignment = () => {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const isRTL = i18n.language === 'ar';
  const dispatch = useDispatch();

  // Redux selectors
  const assignments = useSelector(selectAssignments);
  const submissions = useSelector(selectSubmissions);
  const classStudents = useSelector(selectClassStudents);
  const selectedAssignment = useSelector(selectSelectedAssignment);
  const selectedSubmission = useSelector(selectSelectedSubmission);
  const loading = useSelector(selectLoading);
  const stats = useSelector(selectAssignmentStats);
  const meta = useSelector(selectMeta);
  const filters = useSelector(selectFilters);

  const classOptions = useSelector(selectClassOptions);
  const courseOptions = useSelector(selectCourseOptions);

  // Local state
  const [activeTab, setActiveTab] = useState('assignments');
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [isAssignStudentsModalOpen, setIsAssignStudentsModalOpen] = useState(false);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [assignmentForm, setAssignmentForm] = useState({});
  const [gradeForm, setGradeForm] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);

  const fetchAssignments = useCallback((customParams = {}) => {
    const params = {
      page: meta.page,
      limit: meta.limit,
      ...filters,
      ...customParams
    };
    dispatch(fetchTeacherAssignments(params));
  }, [dispatch, meta.page, meta.limit, filters]);
  
  const debouncedFetch = useDebouncedCallback((newFilters) => {
      fetchAssignments({ ...newFilters, page: 1 });
  }, 500);

  useEffect(() => {
    fetchAssignments({ page: 1 });
    dispatch(fetchClassOptions());
    dispatch(fetchCourseOptions());
  }, [dispatch]);

  const metaData = useMemo(() => ({
    classes: classOptions || [],
    courses: courseOptions || []
  }), [classOptions, courseOptions]);

  const handleFilterChange = useCallback((newFilters) => {
    dispatch(setFilters(newFilters));
    debouncedFetch(newFilters);
  }, [dispatch, debouncedFetch]);

  const handleSearchChange = useCallback((searchTerm) => {
    dispatch(setFilters({ ...filters, search: searchTerm }));
    debouncedFetch({ ...filters, search: searchTerm });
  }, [dispatch, filters, debouncedFetch]);

  const handlePageChange = useCallback((page) => {
    fetchAssignments({ page });
  }, [fetchAssignments]);

  const handlePageSizeChange = useCallback((limit) => {
    fetchAssignments({ page: 1, limit });
  }, [fetchAssignments]);

  useEffect(() => {
    if (activeTab === 'submissions' && assignments.length > 0) {
      const publishedAssignments = assignments.filter(a => a.status === 'published');
      publishedAssignments.forEach(assignment => {
        dispatch(fetchAssignmentSubmissions(assignment._id));
      });
    }
  }, [activeTab, assignments, dispatch]);

  const createFormData = useCallback((formValues, files = []) => {
    const formData = new FormData();
    
    if (formValues.title) {
      formData.append('title', JSON.stringify(formValues.title));
    }
    if (formValues.description) {
      formData.append('description', JSON.stringify(formValues.description));
    }
    
    if (formValues.classId) formData.append('classId', formValues.classId);
    if (formValues.courseId) formData.append('courseId', formValues.courseId);
    if (formValues.dueDate) formData.append('dueDate', formValues.dueDate);
    if (formValues.totalMarks) formData.append('totalMarks', formValues.totalMarks);
    if (formValues.visibleToStudents !== undefined) {
      formData.append('visibleToStudents', formValues.visibleToStudents);
    }
    
    files.forEach(file => {
      formData.append('files', file);
    });
    
    return formData;
  }, []);

  const handleAddAssignment = useCallback(() => {
    setModalMode('add');
    dispatch(setSelectedAssignment(null));
    setAssignmentForm({
      title: { en: '', ar: '' },
      description: { en: '', ar: '' },
      classId: '',
      courseId: '',
      totalMarks: 100,
      visibleToStudents: true,
      dueDate: ''
    });
    setSelectedFiles([]);
    setIsAssignmentModalOpen(true);
  }, [dispatch]);

  const handleEditAssignment = useCallback((item) => {
    setModalMode('edit');
    dispatch(setSelectedAssignment(item));
    setAssignmentForm({
      title: item.title || { en: '', ar: '' },
      description: item.description || { en: '', ar: '' },
      classId: item.classId?._id || item.classId || '',
      courseId: item.courseId?._id || item.courseId || '',
      totalMarks: item.totalMarks || 100,
      visibleToStudents: item.visibleToStudents !== false,
      dueDate: item.dueDate ? new Date(item.dueDate).toISOString().slice(0, 16) : ''
    });
    setSelectedFiles([]);
    setIsAssignmentModalOpen(true);
  }, [dispatch]);

  const handleViewAssignment = useCallback(async (item) => {
      setIsViewModalOpen(true);
      setIsDetailsLoading(true);
      try {
          // Assuming setSelectedAssignment is synchronous and data is sufficient from the list
          // If a detailed fetch is needed, dispatch an async thunk here.
          dispatch(setSelectedAssignment(item));
      } finally {
          // Simulate fetch time for visual consistency if needed, otherwise set to false directly.
          setTimeout(() => setIsDetailsLoading(false), 200); 
      }
  }, [dispatch]);

  const handleDeleteAssignment = useCallback(async (id) => {
    try {
      await dispatch(deleteAssignment(id)).unwrap();
      toast.success(t('common.deletedSuccessfully'));
      fetchAssignments();
    } catch (error) {
      toast.error(error || t('common.deleteFailed'));
    }
  }, [dispatch, t, fetchAssignments]);

  const handlePublishAssignment = useCallback(async (id) => {
    try {
      await dispatch(publishAssignment(id)).unwrap();
      toast.success(t('assignments.publishedSuccessfully'));
      fetchAssignments();
    } catch (error) {
      toast.error(error || t('assignments.publishFailed'));
    }
  }, [dispatch, t, fetchAssignments]);

  const handleOpenAssignStudents = useCallback(async (item) => {
    dispatch(setSelectedAssignment(item));
    
    const classId = item.classId?._id || item.classId;
    if (classId) {
      await dispatch(fetchClassStudents(classId));
    }
    
    setSelectedStudentIds(item.assignedTo?.map(s => s._id || s) || []);
    setIsAssignStudentsModalOpen(true);
  }, [dispatch]);

  const handleAssignStudentsSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!selectedAssignment) {
      toast.error(t('common.invalidSelection'));
      return;
    }

    try {
      await dispatch(assignToStudents({
        id: selectedAssignment._id,
        data: {
          studentIds: selectedStudentIds,
          assignAll: selectedStudentIds.length === classStudents.length
        }
      })).unwrap();
      
      toast.success(t('assignments.studentsAssigned'));
      setIsAssignStudentsModalOpen(false);
      dispatch(clearClassStudents());
      fetchAssignments();
    } catch (error) {
      toast.error(error || t('assignments.assignFailed'));
    }
  }, [selectedAssignment, selectedStudentIds, classStudents.length, dispatch, t, fetchAssignments]);

  const handleAssignmentSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!assignmentForm.title?.en?.trim() && !assignmentForm.title?.ar?.trim()) {
      toast.error(t('common.titleRequired'));
      return;
    }
    
    if (!assignmentForm.classId) {
      toast.error(t('common.classRequired'));
      return;
    }

    const formData = createFormData(assignmentForm, selectedFiles);

    try {
      if (modalMode === 'add') {
        await dispatch(createAssignment(formData)).unwrap();
        toast.success(t('common.addedSuccessfully'));
      } else {
        await dispatch(updateAssignment({ 
          id: selectedAssignment._id, 
          formData 
        })).unwrap();
        toast.success(t('common.updatedSuccessfully'));
      }
      setIsAssignmentModalOpen(false);
      fetchAssignments();
    } catch (error) {
      toast.error(error || t('common.operationFailed'));
    }
  }, [assignmentForm, modalMode, selectedAssignment, selectedFiles, createFormData, dispatch, t, fetchAssignments]);

  const handleGradeSubmission = useCallback((submission) => {
    dispatch(setSelectedSubmission(submission));
    
    const assignment = assignments.find(a => a._id === submission.assignmentId);
    if (assignment) {
      dispatch(setSelectedAssignment(assignment));
    }
    
    setGradeForm({
      marks: submission.marks || '',
      feedback: submission.feedback || { en: '', ar: '' },
      status: submission.status || 'graded'
    });
    setIsGradeModalOpen(true);
  }, [dispatch, assignments]);

  const handleViewSubmission = useCallback((submission) => {
    dispatch(setSelectedSubmission(submission));
    
    const assignment = assignments.find(a => a._id === submission.assignmentId);
    if (assignment) {
      dispatch(setSelectedAssignment(assignment));
    }
    
    console.log('View Submission:', submission);
  }, [dispatch, assignments]);

  const handleGradeSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!selectedSubmission || !selectedAssignment) {
      toast.error(t('common.invalidSelection'));
      return;
    }

    try {
      await dispatch(gradeSubmission({
        assignmentId: selectedAssignment._id,
        submissionId: selectedSubmission._id,
        gradeData: {
          marks: gradeForm.marks,
          feedback: gradeForm.feedback,
          status: gradeForm.status || 'graded'
        }
      })).unwrap();
      toast.success(t('assignments.gradedSuccessfully'));
      setIsGradeModalOpen(false);
    } catch (error) {
      toast.error(error || t('assignments.gradeFailed'));
    }
  }, [gradeForm, selectedSubmission, selectedAssignment, dispatch, t]);

  const handleFileSelect = useCallback((files) => {
    setSelectedFiles(prev => [...prev, ...Array.from(files)]);
  }, []);

  const handleRemoveFile = useCallback((index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  const statsCards = useMemo(() => [
    { key: 'total', title: 'common.total', value: stats.total, icon: BookOpen, color: 'blue' },
    { key: 'active', title: 'status.active', value: stats.active, icon: CheckCircle, color: 'green' },
    { key: 'pendingGrading', title: 'status.pendingGrading', value: stats.pendingGrading, icon: Clock, color: 'purple' },
    { key: 'draft', title: 'status.draft', value: stats.draft, icon: Users, color: 'teal' }
  ], [stats]);

  return (
    <div className="space-y-6 py-6 px-2" dir={isRTL ? 'rtl' : 'ltr'}>
      <PageHeader
        title={t('sidebar.assignments')}
        description={t('assignments.pageDescription')}
        action={
          <Button
            onClick={handleAddAssignment}
            disabled={loading.create}
            className="bg-blue-600 hover:bg-blue-700 shadow-lg"
          >
            <Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t('assignments.create')}
          </Button>
        }
        isRTL={isRTL}
      />

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial="hidden" 
        animate="visible"
        variants={{ 
          visible: { 
            transition: { staggerChildren: ANIMATION_CONFIG.stagger.fast } 
          } 
        }}
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
            loading={loading.assignments}
          />
        ))}
      </motion.div>

      <AssignmentTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        assignments={assignments}
        submissions={submissions}
        onViewAssignment={handleViewAssignment}
        onEditAssignment={handleEditAssignment}
        onDeleteAssignment={handleDeleteAssignment}
        onPublishAssignment={handlePublishAssignment}
        onAssignStudents={handleOpenAssignStudents}
        onGradeSubmission={handleGradeSubmission}
        onViewSubmission={handleViewSubmission}
        isRTL={isRTL}
        currentLanguage={i18n.language}
        metaData={metaData}
        loading={loading}
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearchChange={handleSearchChange}
        pagination={meta}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      <BaseCreateModal
        isOpen={isAssignmentModalOpen}
        onClose={() => setIsAssignmentModalOpen(false)}
        title={modalMode === 'add' ? t('assignments.create') : t('assignments.edit')}
        description={t('assignments.formDescription')}
        onSubmit={handleAssignmentSubmit}
        type="assignment"
        isRTL={isRTL}
        isSubmitting={loading.create || loading.update}
      >
        <AssignmentModalFields
          formData={assignmentForm}
          handleChange={(field, val) => setAssignmentForm(prev => ({ ...prev, [field]: val }))}
          metaData={metaData}
          isRTL={isRTL}
          currentLanguage={i18n.language}
          selectedFiles={selectedFiles}
          onFileSelect={handleFileSelect}
          onRemoveFile={handleRemoveFile}
        />
      </BaseCreateModal>

      <ViewAssignmentModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          dispatch(setSelectedAssignment(null));
        }}
        data={selectedAssignment}
        loading={isDetailsLoading}
        isRTL={isRTL}
        currentLanguage={i18n.language}
        onEdit={(item) => {
          setIsViewModalOpen(false);
          setTimeout(() => handleEditAssignment(item), 100);
        }}
        onPublish={handlePublishAssignment}
      />

      <BaseCreateModal
        isOpen={isGradeModalOpen}
        onClose={() => setIsGradeModalOpen(false)}
        title={t('assignments.gradeSubmission')}
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
          maxMarks={selectedAssignment?.totalMarks || 100}
          submission={selectedSubmission}
        />
      </BaseCreateModal>

      <AssignStudentsModal
        isOpen={isAssignStudentsModalOpen}
        onClose={() => {
          setIsAssignStudentsModalOpen(false);
          dispatch(clearClassStudents());
          setSelectedStudentIds([]);
        }}
        onSubmit={handleAssignStudentsSubmit}
        students={classStudents}
        selectedStudentIds={selectedStudentIds}
        onSelectionChange={setSelectedStudentIds}
        assignment={selectedAssignment}
        isRTL={isRTL}
        currentLanguage={i18n.language}
        isSubmitting={loading.assign || loading.students}
      />
    </div>
  );
};

export default Assignment;
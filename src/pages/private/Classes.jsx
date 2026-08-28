import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Button } from '../../maincomponents/components/ui/button';
import { Plus, Building, CheckCircle, XCircle, Users } from 'lucide-react';
import StatsCard from '@maincomponents/cards/StatsCard';
import ClassesTable from '@maincomponents/tables/ClassesTable';
import PageHeader from '@maincomponents/headerbar/PageHeader';
import BaseCreateModal from '@maincomponents/modal/addEditModals/BaseCreateModal';
import ClassesModalFields from '@maincomponents/modal/addEditModals/ClassesModalFields';
import ViewClassesModal from '@maincomponents/modal/viewModals/ViewClassesModal';
import {
  fetchClasses,
  fetchClassById,
  createClass,
  updateClass,
  deleteClass,
  fetchClassStats,
  fetchCourseOptions,
  fetchTeacherOptions,
} from '@redux/actions/class';
import {
  clearError,
  clearSuccessMessage,
  clearSelectedClass,
  setPage,
  setLimit,
} from '@redux/slice/classSlice';

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
    return () => { clearTimeout(handler); };
  }, [value, delay]);
  return debouncedValue;
};

const Classes = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const isRTL = i18n.language === 'ar';
  const initialFetchDone = useRef(false);

  const {
    classes, pagination, selectedClass, stats,
    courseOptions, teacherOptions, isLoading, isCreating, isUpdating,
    isLoadingStats, error, successMessage,
  } = useSelector((state) => state.classes);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  const debouncedSearch = useDebounce(searchTerm, 500);

  const toDisplayName = useCallback((name) => {
    if (!name) return '';
    if (typeof name === 'string') return name;
    const lang = i18n.language;
    if (name[lang]) {
      if (typeof name[lang] === 'string') return name[lang];
      const { firstName, lastName } = name[lang];
      return `${firstName || ''} ${lastName || ''}`.trim();
    }
    if (name.en) {
      if (typeof name.en === 'string') return name.en;
      const { firstName, lastName } = name.en;
      return `${firstName || ''} ${lastName || ''}`.trim();
    }
    if (name.ar) {
      if (typeof name.ar === 'string') return name.ar;
      const { firstName, lastName } = name.ar;
      return `${firstName || ''} ${lastName || ''}`.trim();
    }
    return '';
  }, [i18n.language]);

  const loadData = useCallback((isInitial = false) => {
    dispatch(fetchClasses({
      page: pagination.page, limit: pagination.limit, search: debouncedSearch,
      courseId: filters.courseId, teacherId: filters.teacherId,
      academicYear: filters.academicYear, active: filters.active,
    }));
    if (isInitial) {
      dispatch(fetchClassStats());
      dispatch(fetchCourseOptions());
      dispatch(fetchTeacherOptions());
    }
  }, [dispatch, pagination.page, pagination.limit, debouncedSearch, filters]);

  useEffect(() => {
    if (!initialFetchDone.current) {
      loadData(true);
      initialFetchDone.current = true;
    } else {
      loadData(false);
    }
  }, [pagination.page, pagination.limit, debouncedSearch, filters, loadData]);

  useEffect(() => { if (successMessage) { toast.success(successMessage); dispatch(clearSuccessMessage()); } }, [successMessage, dispatch]);
  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()); } }, [error, dispatch]);

  const tableData = useMemo(() => classes.map((cls) => ({
    id: cls._id, name: toDisplayName(cls.name), section: toDisplayName(cls.section),
    course: (cls.courses || []).map((c) => toDisplayName(c.name)).join(', ') || (isRTL ? 'بدون مواد' : 'No courses'),
    teacher: (cls.teachers || []).map((t) => toDisplayName(t.name)).join(', ') || (isRTL ? 'بدون معلمين' : 'No teachers'),
    studentsCount: cls.studentsCount, academicYear: cls.academicYear, semester: cls.semester,
    days: Array.isArray(cls.days) ? cls.days : (cls.days || '').split(','), active: cls.active,
  })), [classes, isRTL, toDisplayName]);

  const statsCards = useMemo(() => [
    { title: t('classes.totalClasses'), value: stats.totalClasses || 0, icon: Building, color: 'blue' },
    { title: t('classes.activeClasses'), value: stats.activeClasses || 0, icon: CheckCircle, color: 'green' },
    { title: t('classes.inactiveClasses'), value: stats.inactiveClasses || 0, icon: XCircle, color: 'purple' },
    { title: t('classes.totalStudents'), value: stats.totalStudents || 0, icon: Users, color: 'teal' },
  ], [stats, t]);

  const handleInputChange = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const validateForm = () => { return true; };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error(isRTL ? 'يرجى تصحيح الأخطاء في النموذج' : 'Please fix the form errors');
      return;
    }
    try {
      if (modalMode === 'add') {
        await dispatch(createClass(formData)).unwrap();
      } else if (modalMode === 'edit' && selectedClass) {
        await dispatch(updateClass({ id: selectedClass._id || selectedClass.id, formData })).unwrap();
      }
      loadData(true);
      setIsModalOpen(false);
      setFormData({});
      dispatch(clearSelectedClass());
    } catch (err) { /* Error handled by slice */ }
  };

  const handleAddClass = () => {
    dispatch(clearSelectedClass());
    setModalMode('add');
    setFormData({
      name: { en: '', ar: '' }, section: { en: '', ar: '' }, courseId: '', teacherId: '',
      academicYear: '2024-2025', semester: 'Spring', days: [],
      startTime: '08:00', endTime: '09:30', status: 'active',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleEditClass = (row) => {
    const cls = classes.find((c) => c._id === row.id);
    if (!cls) return;
    setModalMode('edit');
    dispatch(fetchClassById(cls._id));
    setFormData({
      name: cls.name, section: cls.section, courseId: cls.courses?.[0]?._id || '',
      teacherId: cls.teachers?.[0]?._id || '', academicYear: cls.academicYear, semester: cls.semester,
      days: Array.isArray(cls.days) ? cls.days : (cls.days || '').split(','),
      startTime: cls.startTime ? new Date(cls.startTime).toISOString().slice(11, 16) : '08:00',
      endTime: cls.endTime ? new Date(cls.endTime).toISOString().slice(11, 16) : '09:30',
      status: cls.active ? 'active' : 'inactive',
    });
    setIsModalOpen(true);
  };

  const handleViewClass = async (row) => {
    setIsViewModalOpen(true);
    setIsDetailsLoading(true);
    try {
      await dispatch(fetchClassById(row.id)).unwrap();
    } catch (err) {
      setIsViewModalOpen(false);
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const handleDeleteClass = async (classId) => {
    try {
      await dispatch(deleteClass(classId)).unwrap();
      loadData(true);
    } catch (err) { /* Error handled by slice */ }
  };

  const handleFilterChange = (filterKey, value) => { dispatch(setPage(1)); setFilters((prev) => ({ ...prev, [filterKey]: value })); };
  const handleSearchChange = (value) => { dispatch(setPage(1)); setSearchTerm(value); };
  const handlePageChange = (newPage) => dispatch(setPage(newPage));
  const handlePageSizeChange = (newSize) => dispatch(setLimit(Number(newSize)));
  const handleCloseModal = () => { setIsModalOpen(false); setFormData({}); dispatch(clearSelectedClass()); };

  const viewData = useMemo(() => {
    if (!selectedClass) return null;
    return { ...selectedClass, course: selectedClass.courses?.[0], teacher: selectedClass.teachers?.[0], name: toDisplayName(selectedClass.name), section: toDisplayName(selectedClass.section) };
  }, [selectedClass, toDisplayName]);

  const totalPages = useMemo(() => pagination.pages || Math.ceil(pagination.total / pagination.limit) || 1, [pagination]);

  return (
    <div className="space-y-6 py-6 px-2" dir={isRTL ? 'rtl' : 'ltr'}>
      <PageHeader title={t('sidebar.classes')} description={t('classes.pageDescription')}
        action={
          <Button onClick={handleAddClass} disabled={isCreating} className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 shadow-lg">
            <Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />{t('classes.addClass')}
          </Button>
        } isRTL={isRTL}
      />

      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}>
        {statsCards.map((stat, index) => <StatsCard key={stat.title} {...stat} delay={index * 0.1} isRTL={isRTL} loading={isLoadingStats} />)}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="col-span-full">
        <ClassesTable data={tableData} onView={handleViewClass} onEdit={handleEditClass} onDelete={handleDeleteClass} isRTL={isRTL}
          currentLanguage={i18n.language} searchTerm={searchTerm} onSearchChange={handleSearchChange} filters={filters}
          onFilterChange={handleFilterChange} loading={isLoading} currentPage={pagination.page} pageSize={pagination.limit}
          totalItems={pagination.total} totalPages={totalPages} onPageChange={handlePageChange} onPageSizeChange={handlePageSizeChange} serverSidePagination />
      </motion.div>

      <BaseCreateModal isOpen={isModalOpen} onClose={handleCloseModal} title={modalMode === 'add' ? t('classes.addClass') : t('classes.editClass')}
        description={modalMode === 'add' ? t('classes.modal.addDesc') : t('classes.modal.editDesc')} onSubmit={handleFormSubmit}
        submitLabel={modalMode === 'add' ? t('classes.addClass') : t('common.save')} isSubmitting={isCreating || isUpdating}
        type="class" gradient="from-cyan-500 to-cyan-600" isRTL={isRTL}>
        <ClassesModalFields formData={formData} handleChange={handleInputChange} isRTL={isRTL}
          additionalData={{
            courses: (courseOptions || []).map((c) => ({ value: c._id, label: `${toDisplayName(c.name)} (${c.code || 'N/A'})` })),
            teachers: (teacherOptions || []).map((t) => ({ value: t._id, label: toDisplayName(t.name) })),
          }}/>
      </BaseCreateModal>

      <ViewClassesModal isOpen={isViewModalOpen} onClose={() => { setIsViewModalOpen(false); dispatch(clearSelectedClass()); }}
        data={selectedClass} isLoading={isDetailsLoading} isRTL={isRTL} currentLanguage={i18n.language}
        onEdit={handleEditClass} onDelete={handleDeleteClass} />
    </div>
  );
};

export default Classes;
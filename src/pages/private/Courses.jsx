import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Button } from '../../maincomponents/components/ui/button';
import { Plus, BookOpen, CheckCircle, XCircle, GraduationCap } from 'lucide-react';
import StatsCard from '@maincomponents/cards/StatsCard';
import CoursesTable from '@maincomponents/tables/CoursesTable';
import PageHeader from '@maincomponents/headerbar/PageHeader';
import BaseCreateModal from '@maincomponents/modal/addEditModals/BaseCreateModal';
import CoursesModalFields from '@maincomponents/modal/addEditModals/CoursesModalFields';
import ViewCoursesModal from '@maincomponents/modal/viewModals/ViewCoursesModal';

import {
  fetchCourses,
  fetchCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  fetchCourseStats,
} from '@redux/actions/course';

import { fetchTeacherOptions } from '@redux/actions/class';

import {
  clearErrors,
  clearSuccess,
  setSelectedCourse,
  clearSelectedCourse
} from '@redux/slice/couseSlice';

const DEFAULT_STATS = {
  totalCourses: 0,
  activeCourses: 0,
  inactiveCourses: 0,
  coursesWithTeachers: 0
};

const DEFAULT_PAGINATION = {
  total: 0,
  page: 1,
  limit: 10,
  pages: 0
};

const COURSE_CATEGORIES = [
  { value: 'primary', labelEn: 'Primary', labelAr: 'ابتدائي' },
  { value: 'secondary', labelEn: 'Secondary', labelAr: 'ثانوي' },
  { value: 'higher-secondary', labelEn: 'Higher Secondary', labelAr: 'ثانوية عليا' }
];

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
    return () => { clearTimeout(handler); };
  }, [value, delay]);
  return debouncedValue;
};

const Courses = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const isRTL = i18n.language === 'ar';
  const currentLanguage = i18n.language;
  const initialFetchDone = useRef(false);

  const {
    courses = [],
    pagination = DEFAULT_PAGINATION,
    stats = DEFAULT_STATS,
    loading = false,
    statsLoading = false,
    createLoading = false,
    updateLoading = false,
    error = null,
    createSuccess = false,
    updateSuccess = false,
    deleteSuccess = false,
    selectedCourse = null
  } = useSelector((state) => state.courses || {});

  const {
    teacherOptions = [],
    teacherOptionsLoading = false
  } = useSelector((state) => state.classes || {});

  const safeStats = useMemo(() => ({
    ...DEFAULT_STATS,
    ...(stats || {})
  }), [stats]);

  const safePagination = useMemo(() => ({
    ...DEFAULT_PAGINATION,
    ...(pagination || {})
  }), [pagination]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [formData, setFormData] = useState({});
  const debouncedSearch = useDebounce(searchTerm, 500);

  const loadData = useCallback((isInitial = false) => {
    const params = {
      page: currentPage,
      limit: pageSize,
      search: debouncedSearch,
      category: filters.category,
      active: filters.status
    };
    dispatch(fetchCourses(params));
    if (isInitial) {
      dispatch(fetchCourseStats());
      dispatch(fetchTeacherOptions());
    }
  }, [dispatch, currentPage, pageSize, debouncedSearch, filters]);

  useEffect(() => {
    if (!initialFetchDone.current) {
      loadData(true);
      initialFetchDone.current = true;
    } else {
      loadData(false);
    }
  }, [currentPage, pageSize, debouncedSearch, filters, loadData]);

  useEffect(() => {
    if (createSuccess || updateSuccess || deleteSuccess) {
      toast.success(t(
        createSuccess ? 'courses.messages.createSuccess' :
        updateSuccess ? 'courses.messages.updateSuccess' : 'courses.messages.deleteSuccess'
      ));
      if (isModalOpen) setIsModalOpen(false);
      resetForm();
      dispatch(clearSuccess());
      loadData(true);
    }
  }, [createSuccess, updateSuccess, deleteSuccess, t, dispatch, isModalOpen, loadData]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [error, dispatch]);

  const formattedTeachers = useMemo(() => {
    if (!teacherOptions) return [];
    return teacherOptions.map((teacher) => {
      const nameObj = teacher?.name || {};
      const enName = typeof nameObj.en === 'string' ? nameObj.en : `${nameObj.en?.firstName || ''} ${nameObj.en?.lastName || ''}`.trim();
      const arName = typeof nameObj.ar === 'string' ? nameObj.ar : `${nameObj.ar?.firstName || ''} ${nameObj.ar?.lastName || ''}`.trim();
      if (!enName && !arName) return null;
      return {
        _id: teacher?._id,
        id: teacher?.id,
        name: { en: enName || arName, ar: arName || enName },
        displayName: currentLanguage === 'ar' ? (arName || enName) : (enName || arName)
      };
    }).filter(Boolean);
  }, [teacherOptions, currentLanguage]);

  const resetForm = () => {
    setFormData({
      name: { en: '', ar: '' },
      code: '',
      description: { en: '', ar: '' },
      creditHours: 1,
      category: 'primary',
      teacherIds: [],
      active: true
    });
    dispatch(clearSelectedCourse());
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name?.en && !formData.name?.ar) {
      toast.error(t('courses.validations.nameRequired'));
      return;
    }
    if (!formData.code) {
      toast.error(t('courses.validations.codeRequired'));
      return;
    }
    const payload = { ...formData, creditHours: parseInt(formData.creditHours) || 1 };
    if (modalMode === 'add') {
      dispatch(createCourse(payload));
    } else if (selectedCourse?._id) {
      dispatch(updateCourse({ id: selectedCourse._id, data: payload }));
    }
  };

  const handleAddCourse = () => {
    setModalMode('add');
    resetForm();
    setIsModalOpen(true);
  };

  const handleEditCourse = async (course) => {
    if (!course?._id) return;
    try {
      const result = await dispatch(fetchCourseById(course._id)).unwrap();
      setModalMode('edit');
      setFormData(result);
      setIsModalOpen(true);
    } catch (err) { /* error is handled by slice */ }
  };

  const handleViewCourse = async (course) => {
    if (!course?._id) return;
    setIsViewModalOpen(true);
    setIsDetailsLoading(true);
    try {
      await dispatch(fetchCourseById(course._id)).unwrap();
    } catch (err) {
      setIsViewModalOpen(false);
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const handleDeleteClick = (course) => {
    dispatch(deleteCourse(course._id));
  };

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((size) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  const handleFilterChange = useCallback((filterKey, value) => {
    setFilters((prev) => ({ ...prev, [filterKey]: value }));
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  const statsCards = useMemo(() => [
    { title: 'courses.totalCourses', value: safeStats.totalCourses, icon: BookOpen, color: 'blue' },
    { title: 'courses.activeCourses', value: safeStats.activeCourses, icon: CheckCircle, color: 'green' },
    { title: 'courses.inactiveCourses', value: safeStats.inactiveCourses, icon: XCircle, color: 'purple' },
    { title: 'courses.coursesWithTeachers', value: safeStats.coursesWithTeachers, icon: GraduationCap, color: 'teal' }
  ], [safeStats]);

  return (
    <div className="space-y-6 py-6 px-2" dir={isRTL ? 'rtl' : 'ltr'}>
      <PageHeader
        title={t('sidebar.courses')}
        description={t('courses.pageDescription')}
        action={
          <Button
            onClick={handleAddCourse}
            className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 shadow-lg gap-2"
          >
            <Plus className="w-4 h-4" />
            {t('courses.addCourse')}
          </Button>
        }
        isRTL={isRTL}
      />
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
        }}
      >
        {statsCards.map((stat, index) => (
          <StatsCard
            key={stat.title}
            title={t(stat.title)}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            delay={index * 0.1}
            isRTL={isRTL}
            loading={statsLoading}
          />
        ))}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <CoursesTable
          data={courses}
          onView={handleViewCourse}
          onEdit={handleEditCourse}
          onDelete={handleDeleteClick}
          isRTL={isRTL}
          currentLanguage={currentLanguage}
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          filters={filters}
          onFilterChange={handleFilterChange}
          loading={loading}
          showPagination={true}
          pageSize={pageSize}
          currentPage={currentPage}
          totalItems={safePagination.total}
          totalPages={safePagination.pages}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </motion.div>
      <BaseCreateModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={modalMode === 'add' ? t('courses.addCourse') : t('courses.editCourse')}
        description={t(modalMode === 'add' ? 'courses.modal.addDesc' : 'courses.modal.editDesc')}
        onSubmit={handleFormSubmit}
        submitLabel={modalMode === 'add' ? t('courses.addCourse') : t('common.save')}
        isSubmitting={createLoading || updateLoading}
        type="course"
        icon={BookOpen}
        gradient="from-pink-500 to-pink-600"
        isRTL={isRTL}
      >
        <CoursesModalFields
          formData={formData}
          handleChange={handleInputChange}
          isRTL={isRTL}
          teachers={formattedTeachers}
          teachersLoading={teacherOptionsLoading}
          categories={COURSE_CATEGORIES}
          mode={modalMode}
          enableMultiLanguage={true}
          currentLanguage={currentLanguage}
        />
      </BaseCreateModal>
      <ViewCoursesModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          dispatch(clearSelectedCourse());
        }}
        data={selectedCourse}
        isRTL={isRTL}
        currentLanguage={currentLanguage}
        onEdit={(course) => {
          setIsViewModalOpen(false);
          handleEditCourse(course);
        }}
        onDelete={(course) => {
          setIsViewModalOpen(false);
          handleDeleteClick(course);
        }}
        loading={isDetailsLoading}
      />
    </div>
  );
};

export default Courses;
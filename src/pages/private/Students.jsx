import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Button } from '../../maincomponents/components/ui/button';
import { Plus, Users, BookOpen, UserX } from 'lucide-react';
import StatsCard from '@maincomponents/cards/StatsCard';
import StudentTable from '@maincomponents/tables/StudentTable';
import PageHeader from '@maincomponents/headerbar/PageHeader';
import { UnifiedChart } from '@maincomponents/charts/UnifiedChart';
import BaseCreateModal from '@maincomponents/modal/addEditModals/BaseCreateModal';
import StudentModalFields from '@maincomponents/modal/addEditModals/StudentModalFields';
import ViewStudentModal from '@maincomponents/modal/viewModals/ViewStudentModal';
import AssignClassModal from '@maincomponents/modal/addEditModals/AssignClassModal';
import {
  fetchStudents,
  fetchStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  fetchStudentStats,
  fetchStudentMonthChart,
  fetchStudentCourseChart,
  assignStudentToClass
} from '@redux/actions/student';
import {
  clearError,
  clearSuccessMessage,
  clearSelectedStudent,
  setPage,
  setLimit
} from '@redux/slice/studentSlice';
import { fetchClasses } from '@redux/actions/class';
import { fetchDepartmentOptions } from '@redux/actions/department';
import { fetchCourseOptions } from '@redux/actions/course';

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

const Students = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const isRTL = i18n.language === 'ar';
  const initialFetchDone = useRef(false);

  const {
    students, pagination, selectedStudent, stats, monthlyChartData, courseChartData,
    isLoading, isCreating, isUpdating, isAssigning, isLoadingStats, isLoadingCharts,
    error, successMessage,
  } = useSelector((state) => state.students);

  const { departmentsList } = useSelector((state) => state.departments || { departmentsList: [] });
  const { classes: allClasses } = useSelector((state) => state.classes || { classes: [] });
  const coursesState = useSelector((state) => state.courses);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [activeChart, setActiveChart] = useState('overview');
  const [filters, setFilters] = useState({});
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [studentToAssign, setStudentToAssign] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  const loadData = useCallback((isInitial = false) => {
    dispatch(fetchStudents({
      page: pagination.page, limit: pagination.limit, search: debouncedSearch,
      classId: filters.classId, status: filters.status,
    }));
    if (isInitial) {
      dispatch(fetchStudentStats());
      dispatch(fetchStudentMonthChart());
      dispatch(fetchStudentCourseChart());
      dispatch(fetchDepartmentOptions());
      dispatch(fetchClasses({ page: 1, limit: 100 }));
      dispatch(fetchCourseOptions());
    }
  }, [dispatch, pagination.page, pagination.limit, debouncedSearch, filters.classId, filters.status]);

  useEffect(() => {
    if (!initialFetchDone.current) {
      loadData(true);
      initialFetchDone.current = true;
    } else {
      loadData(false);
    }
  }, [pagination.page, pagination.limit, debouncedSearch, filters.classId, filters.status, loadData]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearSuccessMessage());
      // Re-fetch data if a CRUD operation was successful
      if (successMessage.includes('created') || successMessage.includes('updated') || successMessage.includes('deleted') || successMessage.includes('assigned')) {
        loadData(true);
      }
    }
  }, [successMessage, dispatch, loadData]);

  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()); } }, [error, dispatch]);

  const handleSearchChange = useCallback((val) => { setSearchTerm(val); dispatch(setPage(1)); }, [dispatch]);
  const handleFilterChange = useCallback((key, value) => { setFilters((prev) => ({ ...prev, [key]: value })); dispatch(setPage(1)); }, [dispatch]);
  const handlePageChange = useCallback((page) => { dispatch(setPage(page)); }, [dispatch]);
  const handlePageSizeChange = useCallback((newLimit) => { dispatch(setLimit(newLimit)); dispatch(setPage(1)); }, [dispatch]);

  const getStudentName = useCallback((student, lang = 'en') => {
    if (!student?.name) return 'Unknown';
    if (typeof student.name === 'string') return student.name;
    const nameLang = student.name[lang] || student.name.en || student.name.ar || {};
    return `${nameLang.firstName || ''} ${nameLang.lastName || ''}`.trim() || 'Unknown';
  }, []);

  const getLocalizedValue = useCallback((val) => {
    if (!val) return '';
    if (typeof val === 'string') return val;
    return val[i18n.language] || val.en || val.ar || '';
  }, [i18n.language]);

  const transformedStudents = useMemo(() => {
    return (students || []).map((student) => ({
      ...student,
      displayName: getStudentName(student, i18n.language),
      phone: student.phoneNumber,
      enrollmentDate: student.joiningDate || student.createdAt,
      studentId: student.id,
      currentClass: getLocalizedValue(student.enrollment?.class?.name) || (isRTL ? 'غير مسجل' : 'Unassigned'),
      className: getLocalizedValue(student.enrollment?.class?.name),
      section: student.enrollment?.section || ''
    }));
  }, [students, i18n.language, isRTL, getStudentName, getLocalizedValue]);

  const transformedMonthlyData = useMemo(() => {
    if (!monthlyChartData) return [];
    return monthlyChartData.map(item => ({ name: item._id, value: item.studentCount }));
  }, [monthlyChartData]);

  const transformedCourseData = useMemo(() => {
    if (!courseChartData) return [];
    return courseChartData.map(item => {
      const name = getLocalizedValue(item.name);
      const section = getLocalizedValue(item.section);
      return { name: section ? `${name} - ${section}` : name, value: item.studentCount };
    });
  }, [courseChartData, getLocalizedValue]);

  const statsCards = useMemo(() => [
    { title: t('students.stats.total'), value: stats?.totalStudents || 0, icon: Users, color: 'blue' },
    { title: t('students.stats.active'), value: stats?.activeEnrollments || 0, icon: BookOpen, color: 'green' },
    { title: t('students.stats.inactive'), value: stats?.inactiveEnrollments || 0, icon: UserX, color: 'purple' },
  ], [stats, t]);

  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors(prev => { const newErrors = { ...prev }; delete newErrors[field]; return newErrors; });
  }, [formErrors]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (modalMode === 'add') {
        dispatch(createStudent(formData));
    } else {
        dispatch(updateStudent({ id: selectedStudent._id, formData }));
    }
    setIsModalOpen(false);
  };
  const handleAddStudent = useCallback(() => { setFormData({}); setModalMode('add'); setIsModalOpen(true); }, []);
  const handleEditStudent = useCallback((student) => { setFormData(student); setSelectedStudent(student); setModalMode('edit'); setIsModalOpen(true); }, []);
  const handleDeleteStudent = useCallback(async (studentId) => { dispatch(deleteStudent(studentId)); }, [dispatch]);
  const handleOpenAssignModal = useCallback((student) => { setStudentToAssign(student); setIsAssignModalOpen(true); }, []);
  const handleAssignSubmit = useCallback(async (assignFormData) => { dispatch(assignStudentToClass({ id: studentToAssign._id, classData: assignFormData })); setIsAssignModalOpen(false); }, [dispatch, studentToAssign]);
  const handleCloseModal = useCallback(() => setIsModalOpen(false), []);
  const handleCloseAssignModal = useCallback(() => { setIsAssignModalOpen(false); setStudentToAssign(null); }, []);

  const handleViewStudent = useCallback(async (student) => {
    if (!student?.id) return;
    setIsViewModalOpen(true);
    setIsDetailsLoading(true);
    try {
      await dispatch(fetchStudentById(student.id)).unwrap();
    } catch (err) {
      toast.error(t('students.messages.fetchFailed'));
      setIsViewModalOpen(false);
    } finally {
      setIsDetailsLoading(false);
    }
  }, [dispatch, t]);

  const handleCloseViewModal = useCallback(() => {
    setIsViewModalOpen(false);
    dispatch(clearSelectedStudent());
  }, [dispatch]);

  const chartConfigs = {
    monthly: { xAxisKey: 'name', areas: [{ dataKey: 'value', name: t('students.charts.studentCount'), color: '#3b82f6' }] },
    course: { colors: ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899'] }
  };

  const chartTitles = {
      monthly: t('students.charts.monthlyTitle'),
      course: t('students.charts.courseTitle'),
  };

  const renderCharts = () => {
      switch (activeChart) {
          case 'monthly': return <UnifiedChart data={transformedMonthlyData} type="curve" config={chartConfigs.monthly} title={chartTitles.monthly} isRTL={isRTL} loading={isLoadingCharts} />;
          case 'course': return <UnifiedChart data={transformedCourseData} type="donut" config={chartConfigs.course} title={chartTitles.course} isRTL={isRTL} showLegend loading={isLoadingCharts} currentLanguage={i18n.language} />;
          default: return (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <UnifiedChart data={transformedMonthlyData} type="curve" config={chartConfigs.monthly} title={chartTitles.monthly} isRTL={isRTL} loading={isLoadingCharts} />
                  <UnifiedChart data={transformedCourseData} type="donut" config={chartConfigs.course} title={chartTitles.course} isRTL={isRTL} showLegend loading={isLoadingCharts} currentLanguage={i18n.language} />
              </div>
          );
      }
  };

  const chartTabs = [
      { key: 'overview', labelEn: 'Overview', labelAr: 'نظرة عامة' },
      { key: 'monthly', labelEn: 'Monthly', labelAr: 'شهري' },
      { key: 'course', labelEn: 'Classes', labelAr: 'الفصول' }
  ];

  return (
    <div className="space-y-6 py-6 px-2" dir={isRTL ? 'rtl' : 'ltr'}>
      <PageHeader
        title={t('sidebar.students')} description={t('students.pageDescription')}
        action={<Button onClick={handleAddStudent} disabled={isCreating} className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg"><Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} /> {t('students.addStudent')}</Button>}
        isRTL={isRTL}
      />
      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}>
        {statsCards.map((stat, index) => (<StatsCard key={index} {...stat} loading={isLoadingStats} isRTL={isRTL} delay={index * 0.1} />))}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={`flex flex-wrap gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
        {chartTabs.map(tab => <Button key={tab.key} variant={activeChart === tab.key ? 'default' : 'outline'} onClick={() => setActiveChart(tab.key)} className={`transition-all ${activeChart === tab.key ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' : 'bg-card'}`}>{isRTL ? tab.labelAr : tab.labelEn}</Button>)}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        {renderCharts()}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="col-span-full">
        <StudentTable
          data={transformedStudents} onView={handleViewStudent} onEdit={handleEditStudent} onDelete={handleDeleteStudent}
          onAssign={handleOpenAssignModal} isRTL={isRTL} loading={isLoading} currentLanguage={i18n.language}
          searchTerm={searchTerm} onSearchChange={handleSearchChange}
          filters={filters} onFilterChange={handleFilterChange}
          currentPage={pagination.page} pageSize={pagination.limit} totalItems={pagination.total}
          totalPages={pagination.pages} onPageChange={handlePageChange} onPageSizeChange={handlePageSizeChange}
          serverSidePagination
        />
      </motion.div>

      <BaseCreateModal
        isOpen={isModalOpen} onClose={handleCloseModal} title={modalMode === 'add' ? t('students.addStudent') : t('students.editStudent')}
        onSubmit={handleFormSubmit} isSubmitting={isCreating || isUpdating} type="student" icon={Users} gradient="from-blue-500 to-blue-600" isRTL={isRTL}
      >
        <StudentModalFields formData={formData} handleChange={handleInputChange} errors={formErrors} isRTL={isRTL} mode={modalMode} />
      </BaseCreateModal>

      <ViewStudentModal
        isOpen={isViewModalOpen} onClose={handleCloseViewModal} data={selectedStudent}
        isLoading={isDetailsLoading} isRTL={isRTL} currentLanguage={i18n.language}
        onEdit={handleEditStudent} onDelete={handleDeleteStudent}
      />
      
      <AssignClassModal
        isOpen={isAssignModalOpen} onClose={handleCloseAssignModal} student={studentToAssign}
        onSubmit={handleAssignSubmit} isSubmitting={isAssigning} isRTL={isRTL}
      />
    </div>
  );
};

export default Students;
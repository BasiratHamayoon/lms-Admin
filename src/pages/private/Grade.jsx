import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Button } from '@maincomponents/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@maincomponents/components/ui/select';
import { Plus, Award, BookOpen, Users, CheckCircle } from 'lucide-react';
import PageHeader from '@maincomponents/headerbar/PageHeader';
import BaseCreateModal from '@maincomponents/modal/addEditModals/BaseCreateModal';
import GradeTable from '@maincomponents/tables/GradeTable';
import ViewStudentGradeModal from '@maincomponents/modal/viewModals/ViewStudentGradeModal';
import StudentGradeModalFields from '@maincomponents/modal/addEditModals/StudentGradeModalFields';

import {
  fetchClassGrades,
  fetchClassSubjectGrades,
  createGrade,
  updateGrade,
  deleteGrade,
  publishGrade,
  archiveGrade,
  uploadGradesExcel,
  bulkPublishGrades,
  fetchClassOptions,
  fetchCourseOptions,
  fetchClassStudents,
  fetchGradeDetails, // This import is now valid
  resetSuccess,
  clearClassStudents,
  selectGrades,
  selectGradeStats,
  selectGradeLoading,
  selectGradePagination,
  selectClassOptions,
  selectCourseOptions,
  selectClassStudents,
  selectOptionsLoading,
  selectStudentsLoading,
} from '@redux/slice/gradeSlice';

const ensureString = (val) => { if (val === null || val === undefined) return ''; if (typeof val === 'string') return val; if (typeof val === 'number' || typeof val === 'boolean') return String(val); if (typeof val === 'object' && val.type && val.data) { console.warn('Encountered Buffer object:', val); return ''; } if (typeof val === 'object') { console.warn('Encountered unexpected object:', val); return ''; } return ''; };
const extractName = (nameObj, isRTL = false) => { try { if (!nameObj) return ''; if (typeof nameObj === 'string') return nameObj; if (nameObj.type && nameObj.data) return ''; if (nameObj.en || nameObj.ar) { const localizedName = isRTL ? (nameObj.ar || nameObj.en) : (nameObj.en || nameObj.ar); if (typeof localizedName === 'string') return localizedName; if (localizedName && typeof localizedName === 'object') { if (localizedName.type && localizedName.data) return ''; if (localizedName.firstName !== undefined || localizedName.lastName !== undefined) { const first = ensureString(localizedName.firstName); const last = ensureString(localizedName.lastName); return `${first} ${last}`.trim(); } } } if (nameObj.firstName !== undefined || nameObj.lastName !== undefined) { const first = ensureString(nameObj.firstName); const last = ensureString(nameObj.lastName); return `${first} ${last}`.trim(); } return ''; } catch (error) { console.error('Error in extractName:', error); return ''; } };

const Grade = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const isRTL = i18n.language === 'ar';

  const grades = useSelector(selectGrades);
  const backendStats = useSelector(selectGradeStats);
  const loading = useSelector(selectGradeLoading);
  const pagination = useSelector(selectGradePagination);
  const success = useSelector((state) => state.grades.success);
  const classOptions = useSelector(selectClassOptions);
  const courseOptions = useSelector(selectCourseOptions);
  const classStudents = useSelector(selectClassStudents);
  const optionsLoading = useSelector(selectOptionsLoading);
  const studentsLoading = useSelector(selectStudentsLoading);
  const selectedGradeDetails = useSelector((state) => state.grades.gradeDetails);
  const detailsLoading = useSelector((state) => state.grades.detailsLoading); // Get the new loading state

  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [isViewGradeModalOpen, setIsViewGradeModalOpen] = useState(false);
  // Removed local isDetailsLoading state
  const [modalMode, setModalMode] = useState('add');
  const [gradeFormData, setGradeFormData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedGradeIds, setSelectedGradeIds] = useState([]);
  
  const searchTimeoutRef = useRef(null);

  // --- All other functions (getSafeName, deepSanitize, useEffects etc.) remain unchanged ---

  const getSafeName = useCallback((item) => { try { if (!item) return ''; if (typeof item === 'string') return item; if (item.type && item.data) return 'Unknown'; const sources = [item.displayName, item.label, item.nameLabel, item.name]; for (const source of sources) { if (typeof source === 'string' && source.trim()) return source; if (source && typeof source === 'object') { const extracted = extractName(source, isRTL); if (extracted) return extracted; } } if (item.email) return ensureString(item.email); if (item.code) return ensureString(item.code); return 'Unknown'; } catch (error) { console.error('Error in getSafeName:', error); return 'Error'; } }, [isRTL]);
  const deepSanitizeGrade = useCallback((grade) => { if (!grade) return null; const sanitized = { ...grade }; if (sanitized.student && typeof sanitized.student === 'object') { const s = sanitized.student; sanitized.student = { _id: ensureString(s._id), id: ensureString(s.id), name: getSafeName(s), email: ensureString(s.email), avatar: ensureString(s.avatar) }; } else if (sanitized.student) { sanitized.student = { _id: '', id: '', name: ensureString(sanitized.student), email: '', avatar: '' }; } if (sanitized.course && typeof sanitized.course === 'object') { const c = sanitized.course; sanitized.course = { _id: ensureString(c._id), code: ensureString(c.code), name: getSafeName(c), description: ensureString(c.description) }; } else if (sanitized.course) { sanitized.course = { _id: '', code: '', name: ensureString(sanitized.course), description: '' }; } if (sanitized.class && typeof sanitized.class === 'object') { const cl = sanitized.class; sanitized.class = { _id: ensureString(cl._id), name: getSafeName(cl), section: ensureString(cl.section) }; } else if (sanitized.class) { sanitized.class = { _id: '', name: ensureString(sanitized.class), section: '' }; } sanitized.subject = ensureString(sanitized.subject); sanitized.subjectCode = ensureString(sanitized.subjectCode); sanitized.grade = ensureString(sanitized.grade); sanitized.status = ensureString(sanitized.status) || 'draft'; sanitized.term = ensureString(sanitized.term); sanitized.academicYear = ensureString(sanitized.academicYear); sanitized.teacherRemarks = ensureString(sanitized.teacherRemarks); sanitized.totalMarks = Number(sanitized.totalMarks) || 0; sanitized.obtainedMarks = Number(sanitized.obtainedMarks) || 0; sanitized.percentage = Number(sanitized.percentage) || 0; if (Array.isArray(sanitized.assessments)) { sanitized.assessments = sanitized.assessments.map(assess => ({ name: ensureString(assess.name), type: ensureString(assess.type), maxMarks: Number(assess.maxMarks) || 0, obtainedMarks: Number(assess.obtainedMarks) || 0, percentage: Number(assess.percentage) || 0, weight: Number(assess.weight) || 0, remarks: ensureString(assess.remarks), date: assess.date })); } else { sanitized.assessments = []; } return sanitized; }, [getSafeName]);
  const sanitizeGradesArray = useCallback((gradesArray) => { if (!Array.isArray(gradesArray)) return []; return gradesArray.map(deepSanitizeGrade).filter(Boolean); }, [deepSanitizeGrade]);
  const getAcademicYearOptions = () => { const currentYear = new Date().getFullYear(); const options = []; for (let i = -1; i <= 2; i++) { const year = currentYear + i; options.push({ value: `${year}-${year + 1}`, label: `${year}-${year + 1}` }); } return options; };
  useEffect(() => { if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current); searchTimeoutRef.current = setTimeout(() => { setDebouncedSearchTerm(searchTerm); setCurrentPage(1); }, 500); return () => { if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current); }; }, [searchTerm]);
  useEffect(() => { dispatch(fetchClassOptions()); dispatch(fetchCourseOptions()); }, [dispatch]);
  useEffect(() => { if (classOptions?.length > 0 && !selectedClassId) { const firstId = classOptions[0].value || classOptions[0]._id; setSelectedClassId(ensureString(firstId)); } }, [classOptions, selectedClassId]);
  useEffect(() => { if (selectedClassId) { const params = { page: currentPage, limit: pageSize }; if (debouncedSearchTerm) params.search = debouncedSearchTerm; if (selectedCourseId) params.courseId = selectedCourseId; if (filters.academicYear && filters.academicYear !== 'all') params.academicYear = filters.academicYear; if (filters.term && filters.term !== 'all') params.term = filters.term; if (filters.status && filters.status !== 'all') params.status = filters.status; if (filters.grade && filters.grade !== 'all') params.grade = filters.grade; if (selectedCourseId) { dispatch(fetchClassSubjectGrades({ classId: selectedClassId, courseId: selectedCourseId, params })); } else { dispatch(fetchClassGrades({ classId: selectedClassId, params })); } } }, [dispatch, selectedClassId, selectedCourseId, filters, debouncedSearchTerm, currentPage, pageSize]);
  useEffect(() => { if (selectedClassId) { dispatch(fetchClassStudents(selectedClassId)); } else { dispatch(clearClassStudents()); } }, [dispatch, selectedClassId]);
  useEffect(() => { if (success) { setIsGradeModalOpen(false); setGradeFormData({}); setSelectedGrade(null); dispatch(resetSuccess()); if (selectedClassId) { const params = { page: currentPage, limit: pageSize }; if (debouncedSearchTerm) params.search = debouncedSearchTerm; if (selectedCourseId) params.courseId = selectedCourseId; if (filters.academicYear && filters.academicYear !== 'all') params.academicYear = filters.academicYear; if (filters.term && filters.term !== 'all') params.term = filters.term; if (filters.status && filters.status !== 'all') params.status = filters.status; dispatch(fetchClassGrades({ classId: selectedClassId, params })); } } }, [success, dispatch, selectedClassId, selectedCourseId, filters, debouncedSearchTerm, currentPage, pageSize]);
  const stats = useMemo(() => { if (backendStats) return backendStats; const totalStudents = pagination.totalDocs || grades.length; const totalMarks = grades.reduce((sum, g) => sum + (Number(g.obtainedMarks) || 0), 0); const totalPossible = grades.reduce((sum, g) => sum + (Number(g.totalMarks) || 0), 0); const averageGrade = totalPossible > 0 ? ((totalMarks / totalPossible) * 100).toFixed(1) : 0; const passingGrades = grades.filter(g => (Number(g.percentage) || 0) >= 50).length; const passingRate = grades.length > 0 ? ((passingGrades / grades.length) * 100).toFixed(1) : 0; const publishedGrades = grades.filter(g => g.status === 'published').length; return { totalStudents, averageGrade: `${averageGrade}%`, passingRate, publishedGrades, classAverage: averageGrade, highestPercentage: Math.max(...grades.map(g => Number(g.percentage) || 0), 0), lowestPercentage: Math.min(...grades.filter(g => Number(g.percentage) > 0).map(g => Number(g.percentage)), 0) }; }, [grades, backendStats, pagination.totalDocs]);
  const displayGrades = useMemo(() => { return sanitizeGradesArray(grades); }, [grades, sanitizeGradesArray]);
  const handleClassChange = (classId) => { setSelectedClassId(ensureString(classId)); setCurrentPage(1); setSelectedGradeIds([]); setSearchTerm(''); setDebouncedSearchTerm(''); setFilters({}); };
  const handleModalClassChange = useCallback((classId) => { if (classId) { dispatch(fetchClassStudents(classId)); } else { dispatch(clearClassStudents()); } }, [dispatch]);
  const handleCourseChange = (courseId) => { setSelectedCourseId(courseId === 'all' ? '' : ensureString(courseId)); setCurrentPage(1); };
  const handleSearchChange = (value) => setSearchTerm(value);
  const handleAddGrade = () => { setSelectedGrade(null); setModalMode('add'); setGradeFormData({ studentId: '', courseId: '', classId: selectedClassId, academicYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`, term: 'first', assessments: [], teacherRemarks: '', status: 'draft' }); setIsGradeModalOpen(true); };
  const handleEditGrade = (grade) => { const sanitized = deepSanitizeGrade(grade); setSelectedGrade(sanitized); setModalMode('edit'); const assessments = (sanitized.assessments || grade.assessments || []).map(assess => ({ name: ensureString(assess.name), type: ensureString(assess.type) || 'exam', maxMarks: Number(assess.maxMarks) || 0, obtainedMarks: Number(assess.obtainedMarks) || 0, percentage: Number(assess.percentage) || 0, weight: Number(assess.weight) || 0, remarks: ensureString(assess.remarks), date: assess.date })); const totalMarks = assessments.reduce((acc, curr) => acc + Number(curr.maxMarks || 0), 0); const obtainedMarks = assessments.reduce((acc, curr) => acc + Number(curr.obtainedMarks || 0), 0); const percentage = totalMarks > 0 ? ((obtainedMarks / totalMarks) * 100) : 0; const getGrade = (p) => { if (p >= 90) return "A+"; if (p >= 80) return "A"; if (p >= 70) return "B"; if (p >= 60) return "C"; if (p >= 50) return "D"; return "F"; }; const formData = { _id: ensureString(sanitized._id || grade._id), studentId: ensureString(sanitized.student?._id || grade.student?._id || grade.studentId), courseId: ensureString(sanitized.course?._id || grade.course?._id || grade.courseId), classId: ensureString(sanitized.class?._id || grade.class?._id || grade.classId), academicYear: ensureString(sanitized.academicYear || grade.academicYear), term: ensureString(sanitized.term || grade.term), assessments: assessments, teacherRemarks: ensureString(sanitized.teacherRemarks || grade.teacherRemarks), status: ensureString(sanitized.status || grade.status) || 'draft', totalMarks: totalMarks, obtainedMarks: obtainedMarks, percentage: percentage.toFixed(2), grade: getGrade(percentage) }; setGradeFormData(formData); setIsGradeModalOpen(true); };

  // --- CORRECTED THIS FUNCTION ---
  const handleViewGrade = async (grade) => {
    const gradeId = grade._id || grade.id;
    if (!gradeId) return;

    setIsViewGradeModalOpen(true);
    try {
      // Let Redux manage the loading state
      await dispatch(fetchGradeDetails(gradeId)).unwrap();
    } catch (error) {
      toast.error(t('grade.fetchFailed'));
      setIsViewGradeModalOpen(false); // Close modal on failure
    }
  };
  
  const handleFormChange = (field, value) => setGradeFormData(prev => ({ ...prev, [field]: value }));
  const handleFormSubmit = (e) => { e.preventDefault(); const hasFile = gradeFormData.file && gradeFormData.file instanceof File; const isExcelUpload = modalMode === 'upload' || (modalMode === 'add' && hasFile); if (isExcelUpload) { if (!hasFile) return; const formData = new FormData(); formData.append('file', gradeFormData.file); formData.append('classId', gradeFormData.classId); formData.append('courseId', gradeFormData.courseId); formData.append('academicYear', gradeFormData.academicYear); formData.append('term', gradeFormData.term); if (gradeFormData.assessment) { Object.keys(gradeFormData.assessment).forEach(key => { const value = gradeFormData.assessment[key]; if (value !== undefined && value !== null && value !== '') formData.append(`assessment[${key}]`, value); }); } dispatch(uploadGradesExcel(formData)); } else if (modalMode === 'add') { if (!gradeFormData.assessments || gradeFormData.assessments.length === 0) { alert(t('grade.atLeastOneAssessment') || 'At least one assessment is required'); return; } const payload = { studentId: gradeFormData.studentId, courseId: gradeFormData.courseId, classId: gradeFormData.classId, academicYear: gradeFormData.academicYear, term: gradeFormData.term, assessments: gradeFormData.assessments, teacherRemarks: gradeFormData.teacherRemarks }; dispatch(createGrade(payload)); } else if (modalMode === 'edit') { if (!gradeFormData.assessments || gradeFormData.assessments.length === 0) { alert(t('grade.atLeastOneAssessment') || 'At least one assessment is required'); return; } const payload = { assessments: gradeFormData.assessments.map(assess => ({ name: ensureString(assess.name), type: ensureString(assess.type) || 'exam', maxMarks: Number(assess.maxMarks) || 0, obtainedMarks: Number(assess.obtainedMarks) || 0, percentage: Number(assess.percentage) || 0, weight: Number(assess.weight) || 0, remarks: ensureString(assess.remarks), date: assess.date || new Date() })), teacherRemarks: ensureString(gradeFormData.teacherRemarks), totalMarks: Number(gradeFormData.totalMarks) || 0, obtainedMarks: Number(gradeFormData.obtainedMarks) || 0, percentage: Number(gradeFormData.percentage) || 0, grade: ensureString(gradeFormData.grade), status: ensureString(gradeFormData.status) || 'draft' }; dispatch(updateGrade({ id: selectedGrade._id, data: payload })); } };
  const handleDeleteGrade = (gradeId) => dispatch(deleteGrade(gradeId));
  const handlePublishGrade = (grade) => dispatch(publishGrade(grade._id));
  const handleArchiveGrade = (grade) => dispatch(archiveGrade(grade._id));
  const handleBulkPublish = () => { if (selectedGradeIds.length === 0) return; dispatch(bulkPublishGrades(selectedGradeIds)); setSelectedGradeIds([]); };
  const handleFilterChange = (key, value) => { setFilters(prev => ({ ...prev, [key]: value })); setCurrentPage(1); };
  const handlePageChange = (page) => { setCurrentPage(page); setSelectedGradeIds([]); };
  const handlePageSizeChange = (size) => { setPageSize(size); setCurrentPage(1); };


  return (
    <div className="space-y-6 py-6 px-2" dir={isRTL ? 'rtl' : 'ltr'}>
      <PageHeader
        title={t('grade.grades')}
        description={t('grade.pageDescription')}
        action={
          <div className="flex flex-wrap gap-2">
            <Select value={selectedClassId} onValueChange={handleClassChange} disabled={optionsLoading} >
              <SelectTrigger className="w-[180px] bg-white"><SelectValue placeholder={t('grade.form.selectClass')} /></SelectTrigger>
              <SelectContent>
                {classOptions?.map(c => {
                  const id = ensureString(c.value || c._id);
                  const displayName = ensureString(c.label) || getSafeName(c);
                  return <SelectItem key={id} value={id}>{displayName}</SelectItem>;
                })}
              </SelectContent>
            </Select>
            <Select value={selectedCourseId || 'all'} onValueChange={handleCourseChange} disabled={optionsLoading}>
              <SelectTrigger className="w-[180px] bg-white"><SelectValue placeholder={t('grade.form.selectCourse')} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.allCourses')}</SelectItem>
                {courseOptions?.map(c => {
                  const id = ensureString(c._id);
                  const displayName = ensureString(c.nameLabel || c.code) || getSafeName(c);
                  return <SelectItem key={id} value={id}>{displayName}</SelectItem>;
                })}
              </SelectContent>
            </Select>
            <Button onClick={handleAddGrade} className="bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              {t('grade.addGrade')}
            </Button>
            {selectedGradeIds.length > 0 && (
              <Button onClick={handleBulkPublish} className="bg-green-500 hover:bg-green-600">
                <CheckCircle className="w-4 h-4 mr-2" />
                {t('grade.publishSelected')} ({selectedGradeIds.length})
              </Button>
            )}
          </div>
        }
        isRTL={isRTL}
      />

      <GradeTable
        data={displayGrades}
        onView={handleViewGrade}
        onEdit={handleEditGrade}
        onDelete={handleDeleteGrade}
        onPublish={handlePublishGrade}
        onArchive={handleArchiveGrade}
        isRTL={isRTL}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        filters={filters}
        onFilterChange={handleFilterChange}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        totalItems={pagination.totalDocs}
        totalPages={pagination.totalPages}
        loading={loading}
        selectedIds={selectedGradeIds}
        onSelectionChange={setSelectedGradeIds}
        serverSidePagination={true}
      />

      <BaseCreateModal
        isOpen={isGradeModalOpen}
        onClose={() => { setIsGradeModalOpen(false); setGradeFormData({}); setSelectedGrade(null); }}
        title={modalMode === 'upload' ? t('grade.uploadGrades') : modalMode === 'add' ? t('grade.addGrade') : t('grade.editGrade')}
        onSubmit={handleFormSubmit}
        isSubmitting={loading}
        type="grade"
        isRTL={isRTL}
      >
        <StudentGradeModalFields
          formData={gradeFormData}
          handleChange={handleFormChange}
          handleAssessmentChange={(field, value) => setGradeFormData(prev => ({ ...prev, assessment: { ...prev.assessment, [field]: value } }))}
          isRTL={isRTL}
          onClassChange={handleModalClassChange}
          mode={modalMode}
          additionalData={{
            studentList: classStudents, courseList: courseOptions, classList: classOptions,
            academicYearOptions: getAcademicYearOptions(), studentsLoading, optionsLoading
          }}
        />
      </BaseCreateModal>

      <ViewStudentGradeModal
        isOpen={isViewGradeModalOpen}
        onClose={() => setIsViewGradeModalOpen(false)}
        data={selectedGradeDetails}
        loading={detailsLoading} // Corrected to use Redux state
        isRTL={isRTL}
        onEdit={() => {
          setIsViewGradeModalOpen(false);
          if (selectedGradeDetails) handleEditGrade(selectedGradeDetails);
        }}
        onPublish={() => {
          if (selectedGradeDetails) {
            handlePublishGrade(selectedGradeDetails);
            setIsViewGradeModalOpen(false);
          }
        }}
        onArchive={() => {
          if (selectedGradeDetails) {
            handleArchiveGrade(selectedGradeDetails);
            setIsViewGradeModalOpen(false);
          }
        }}
      />
    </div>
  );
};

export default Grade;
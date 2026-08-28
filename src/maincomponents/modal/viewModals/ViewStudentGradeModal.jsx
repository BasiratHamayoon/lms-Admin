import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import BaseViewModal from './BaseViewModal'; 
import { Avatar, AvatarFallback } from '@maincomponents/components/ui/avatar';
import { Badge } from '@maincomponents/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@maincomponents/components/ui/card';
import { User, BookOpen, Calendar, Award, FileText, CheckCircle, Clock, TrendingUp, BarChart, GraduationCap, Building, Archive, AlertCircle } from 'lucide-react';
import ViewModalSkeleton from '../../Skeletons/ViewModalSkeleton';

const ViewStudentGradeModal = ({ 
  isOpen, 
  onClose, 
  data,
  loading,
  isRTL = false, 
  currentLanguage = 'en',
  onEdit,
  onPublish,
  onArchive,
  onDelete
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || currentLanguage || 'en';

  const getLocalizedName = useCallback((nameObj) => {
    if (!nameObj) return t('common.unknown');
    if (typeof nameObj === 'string') return nameObj;
    if (nameObj.en || nameObj.ar) {
      const localizedName = isRTL ? (nameObj.ar || nameObj.en) : (nameObj.en || nameObj.ar);
      if (typeof localizedName === 'string') return localizedName;
      if (localizedName && typeof localizedName === 'object') {
        const firstName = localizedName.firstName || '';
        const lastName = localizedName.lastName || '';
        return `${firstName} ${lastName}`.trim() || t('common.unknown');
      }
    }
    if (nameObj.firstName || nameObj.lastName) {
      return `${nameObj.firstName || ''} ${nameObj.lastName || ''}`.trim();
    }
    return t('common.unknown');
  }, [isRTL, t]);

  const getStudentName = useCallback((student) => {
    if (!student) return t('common.unknown');
    if (student.displayName) return student.displayName;
    if (student.name) return getLocalizedName(student.name);
    return student.email || t('common.unknown');
  }, [getLocalizedName, t]);

  const getCourseName = useCallback((item) => {
    if (!item) return t('common.unknown');
    if (item.subject && typeof item.subject === 'string') return item.subject;
    if (item.subject && typeof item.subject === 'object') return getLocalizedName(item.subject.name) || item.subject.code || t('common.unknown');
    if (item.course) {
      if (typeof item.course === 'string') return item.course;
      return getLocalizedName(item.course.name) || item.course.code || t('common.unknown');
    }
    if (item.courseId) {
      if (typeof item.courseId === 'string') return item.courseId;
      return getLocalizedName(item.courseId.name) || item.courseId.code || t('common.unknown');
    }
    return t('common.unknown');
  }, [getLocalizedName, t]);

  const getClassName = useCallback((item) => {
    if (!item) return '';
    if (item.class) {
      if (typeof item.class === 'string') return item.class;
      const name = getLocalizedName(item.class.name);
      const section = item.class.section ? ` - ${getLocalizedName(item.class.section)}` : '';
      return `${name}${section}`.trim();
    }
    if (item.classId) {
      if (typeof item.classId === 'string') return item.classId;
      const name = getLocalizedName(item.classId.name);
      const section = item.classId.section ? ` - ${item.classId.section}` : '';
      return `${name}${section}`.trim();
    }
    return '';
  }, [getLocalizedName]);

  const renderContent = () => {
    if (loading) {
      return <ViewModalSkeleton />;
    }

    if (!data) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{t('common.noData')}</h3>
          <p className="text-gray-500 dark:text-gray-400">{t('grade.noGradeData')}</p>
        </div>
      );
    }

    const student = data.student || data.studentId;
    const studentName = getStudentName(student);
    const studentCode = student?.id || student?.studentId || '';
    const studentEmail = student?.email || '';
    const className = getClassName(data);
    const courseName = getCourseName(data);
    const courseCode = data.subjectCode || data.course?.code || data.courseId?.code || '';

    const formatDate = (dateString) => {
      if (!dateString) return '-';
      return new Date(dateString).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      });
    };

    const getStatusConfig = (status) => {
      const map = {
        'draft': { label: 'grade.status.draft', color: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300', icon: Clock },
        'published': { label: 'grade.status.published', color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300', icon: CheckCircle },
        'archived': { label: 'grade.status.archived', color: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/40 dark:text-gray-300', icon: Archive }
      };
      return map[status] || map.draft;
    };

    const getGradeColor = (grade) => {
      const map = {
        'A+': 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white', 'A': 'bg-gradient-to-r from-green-500 to-green-600 text-white',
        'B': 'bg-gradient-to-r from-blue-500 to-blue-600 text-white', 'C': 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white',
        'D': 'bg-gradient-to-r from-orange-500 to-orange-600 text-white', 'F': 'bg-gradient-to-r from-red-500 to-red-600 text-white'
      };
      return map[grade] || 'bg-gray-100 text-gray-800';
    };

    const getPercentageColor = (percentage) => {
      if (percentage >= 90) return 'text-emerald-600 dark:text-emerald-400';
      if (percentage >= 80) return 'text-green-600 dark:text-green-400';
      if (percentage >= 70) return 'text-blue-600 dark:text-blue-400';
      if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400';
      if (percentage >= 50) return 'text-orange-600 dark:text-orange-400';
      return 'text-red-600 dark:text-red-400';
    };

    const getUserInitials = (name) => {
      if (!name || name === t('common.unknown')) return 'U';
      const parts = name.split(' ').filter(Boolean);
      return parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : name.substring(0, 2).toUpperCase();
    };

    const statusConfig = getStatusConfig(data.status);
    const StatusIcon = statusConfig.icon;
    const percentage = data.percentage ? Number(data.percentage) : 0;

    return (
      <>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <CardContent className="p-6">
            <div className={`flex items-start gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Avatar className="h-24 w-24 border-4 border-white dark:border-gray-700 shadow-lg">
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-2xl font-bold">
                  {getUserInitials(studentName)}
                </AvatarFallback>
              </Avatar>
              <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                <div className={`flex items-center gap-3 mb-2 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{studentName}</h2>
                  <Badge className={`text-sm px-3 py-1 font-semibold border flex items-center gap-1 ${statusConfig.color} ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <StatusIcon className="w-3 h-3" />
                    {t(statusConfig.label)}
                  </Badge>
                </div>
                <div className="text-gray-600 dark:text-gray-400 mb-4 space-y-1">
                  {studentCode && <p className="text-sm"><span className="font-medium">{t('grade.studentId')}:</span> {studentCode}</p>}
                  {studentEmail && <p className="text-sm"><span className="font-medium">{t('common.email')}:</span> {studentEmail}</p>}
                  {className && <p className="text-sm"><span className="font-medium">{t('grade.form.class')}:</span> {className}</p>}
                </div>
                <div className={`flex flex-wrap gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <BookOpen className="h-4 w-4 text-blue-500" /><span className="text-sm font-medium capitalize">{courseName}</span>
                    {courseCode && <span className="text-xs text-gray-400">({courseCode})</span>}
                  </div>
                  <div className={`flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Calendar className="h-4 w-4 text-green-500" /><span className="text-sm text-gray-600 dark:text-gray-300">{data.academicYear} • {t(`grade.terms.${data.term}`)}</span>
                  </div>
                  <div className={`flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Award className="h-4 w-4 text-purple-500" /><span className={`text-sm font-bold px-2 py-0.5 rounded ${getGradeColor(data.grade)}`}>{data.grade || '-'}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className={`text-lg font-semibold flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Award className="h-5 w-5 text-green-600" />{t('grade.gradeSummary')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" /><span className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('grade.form.marks')}</span>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{data.obtainedMarks ?? 0}<span className="text-lg text-gray-400"> / {data.totalMarks ?? 0}</span></p>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <BarChart className="h-5 w-5 text-purple-600" /><span className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('grade.form.percentage')}</span>
                </div>
                <p className={`text-3xl font-bold ${getPercentageColor(percentage)}`}>{percentage.toFixed(1)}%</p>
                <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500" style={{ width: `${Math.min(percentage, 100)}%` }} />
                </div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Award className="h-5 w-5 text-green-600" /><span className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('grade.form.grade')}</span>
                </div>
                <div className={`inline-flex px-6 py-2 rounded-xl text-2xl font-bold shadow-lg ${getGradeColor(data.grade)}`}>{data.grade || '-'}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {data.assessments && data.assessments.length > 0 && (
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className={`text-lg font-semibold flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <FileText className="h-5 w-5 text-purple-600" />{t('grade.assessments')} ({data.assessments.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.assessments.map((assess, i) => (
                  <div key={i} className="border border-gray-200 dark:border-gray-700 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:shadow-md transition-shadow">
                    <div className={`flex justify-between items-start mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={isRTL ? 'text-right' : 'text-left'}>
                        <span className="font-semibold text-gray-900 dark:text-white">{assess.name}</span>
                        <Badge variant="secondary" className="ml-2 text-xs capitalize">{assess.type}</Badge>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(assess.date)}</span>
                    </div>
                    <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">{assess.obtainedMarks}/{assess.maxMarks}</span>
                        <span className={`text-sm font-bold ${getPercentageColor((assess.obtainedMarks / assess.maxMarks) * 100)}`}>({((assess.obtainedMarks / assess.maxMarks) * 100).toFixed(1)}%)</span>
                      </div>
                      {assess.weight && <span className="text-xs text-gray-500">{t('grade.weight')}: {assess.weight}%</span>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </>
    );
  };
  
  const customButtons = [];
  if (!loading && data) {
    if (data.status === 'draft' && onPublish) {
      customButtons.push({
        label: t('grade.actions.publish'), variant: 'outline',
        className: 'border-green-200 text-green-600 hover:bg-green-50 dark:border-green-700 dark:hover:bg-green-900/20',
        onClick: () => onPublish(data)
      });
    }
    if (data.status === 'published' && onArchive) {
      customButtons.push({
        label: t('grade.actions.archive'), variant: 'outline',
        className: 'border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:hover:bg-blue-900/20',
        onClick: () => onArchive(data)
      });
    }
  }

  const description = loading ? t('common.loading') : (data?.student?.name ? getStudentName(data.student) : t('grade.viewGradeDescription'));

  return (
    <BaseViewModal
      isOpen={isOpen}
      onClose={onClose}
      data={data}
      type="grade"
      title={t('grade.gradeDetails')}
      description={description}
      gradient="from-blue-500 to-blue-600"
      isRTL={isRTL}
      currentLanguage={lang}
      onEdit={!loading && onEdit ? () => onEdit(data) : undefined}
      onDelete={!loading && onDelete ? () => onDelete(data._id) : undefined}
      showEditButton={!loading && !!onEdit}
      showDeleteButton={!loading && !!onDelete}
      customButtons={customButtons}
    >
      {renderContent()}
    </BaseViewModal>
  );
};

export default ViewStudentGradeModal;
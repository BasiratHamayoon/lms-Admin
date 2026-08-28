import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseViewModal from './BaseViewModal';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { 
  Clock, Calendar, BookOpen, MapPin, Users, 
  CheckCircle, XCircle, AlertCircle, Hash, Building, 
  GraduationCap, FileText
} from 'lucide-react';

const ViewTeacherTimetableClassModal = ({ 
  isOpen, 
  onClose, 
  data, 
  isRTL = false, 
  currentLanguage = 'en',
  loading = false
}) => {
  const { t } = useTranslation();

  if (!data && !loading) return null;

  const getStatusConfig = (status) => {
    const config = {
      completed: {
        icon: CheckCircle,
        class: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300',
        label: t('timetable.status.completed')
      },
      ongoing: {
        icon: AlertCircle,
        class: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300',
        label: t('timetable.status.ongoing')
      },
      upcoming: {
        icon: Clock,
        class: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300',
        label: t('timetable.status.upcoming')
      }
    };
    return config[status] || config.upcoming;
  };

  const getTypeConfig = (type) => {
    const config = {
      lecture: {
        class: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
        label: t('timetable.type.lecture')
      },
      lab: {
        class: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        label: t('timetable.type.lab')
      },
      practical: {
        class: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
        label: t('timetable.type.practical')
      }
    };
    return config[type] || config.lecture;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString(currentLanguage === 'ar' ? 'ar-SA' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      });
    } catch {
      return '-';
    }
  };

  const statusConfig = data?.status ? getStatusConfig(data.status) : getStatusConfig('upcoming');
  const typeConfig = data?.type ? getTypeConfig(data.type) : getTypeConfig('lecture');

  return (
    <BaseViewModal
      isOpen={isOpen}
      onClose={onClose}
      data={data}
      type="class"
      title={isRTL ? 'تفاصيل الحصة' : 'Class Details'}
      description={isRTL ? 'عرض معلومات الحصة الكاملة' : 'View complete class information'}
      gradient="from-indigo-500 to-indigo-600"
      isRTL={isRTL}
      currentLanguage={currentLanguage}
      showEditButton={false}
      showEmailButton={false}
      showDeleteButton={false}
      loading={loading}
    >
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <>
          {/* Header Card */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
            <CardContent className="p-6">
              <div className={`flex items-start gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-20 h-20 flex items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg flex-shrink-0">
                  <BookOpen className="w-10 h-10 text-white" />
                </div>
                
                <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                  <div className={`flex items-center gap-3 mb-2 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {data?.subject || t('teacherTimetable.unknownSubject')}
                    </h2>
                    <Badge 
                      className={`text-sm px-3 py-1 font-semibold border flex items-center gap-1 ${statusConfig.class} ${isRTL ? 'flex-row-reverse' : ''}`}
                    >
                      {statusConfig.icon && <statusConfig.icon className="w-3 h-3" />}
                      {statusConfig.label}
                    </Badge>
                  </div>
                  
                  <div className={`flex flex-wrap gap-4 text-gray-600 dark:text-gray-400 mt-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {data?.subjectCode && (
                      <span className={`flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Hash className="w-4 h-4 text-indigo-500" />
                        {isRTL ? 'الكود' : 'Code'}: {data.subjectCode}
                      </span>
                    )}
                    <span className={`flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Clock className="w-4 h-4 text-blue-500" />
                      {data?.time || '-'}
                    </span>
                    <span className={`flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Calendar className="w-4 h-4 text-green-500" />
                      {formatDate(data?.date)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Class Information */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className={`text-lg font-semibold flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <BookOpen className="h-5 w-5 text-indigo-600" />
                {isRTL ? 'معلومات الحصة' : 'Class Information'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Subject */}
                <div className={`p-4 bg-gray-50 dark:bg-gray-800 rounded-xl ${isRTL ? 'text-right' : 'text-left'}`}>
                  <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <BookOpen className="w-4 h-4 text-indigo-500" />
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {isRTL ? 'المادة' : 'Subject'}
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {data?.subject || '-'}
                  </p>
                </div>

                {/* Grade */}
                <div className={`p-4 bg-gray-50 dark:bg-gray-800 rounded-xl ${isRTL ? 'text-right' : 'text-left'}`}>
                  <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <GraduationCap className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {isRTL ? 'الصف' : 'Grade'}
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {data?.grade || '-'}
                  </p>
                </div>

                {/* Section */}
                <div className={`p-4 bg-gray-50 dark:bg-gray-800 rounded-xl ${isRTL ? 'text-right' : 'text-left'}`}>
                  <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Users className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {isRTL ? 'القسم' : 'Section'}
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {data?.section || '-'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Time & Location */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className={`text-lg font-semibold flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Clock className="h-5 w-5 text-orange-600" />
                {isRTL ? 'الوقت والموقع' : 'Time & Location'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Time */}
                <div className={`p-4 bg-gray-50 dark:bg-gray-800 rounded-xl ${isRTL ? 'text-right' : 'text-left'}`}>
                  <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {isRTL ? 'الوقت' : 'Time'}
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {data?.time || '-'}
                  </p>
                </div>

                {/* Room */}
                <div className={`p-4 bg-gray-50 dark:bg-gray-800 rounded-xl ${isRTL ? 'text-right' : 'text-left'}`}>
                  <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <MapPin className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {isRTL ? 'الغرفة' : 'Room'}
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {data?.room || '-'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status & Type */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className={`text-lg font-semibold flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <FileText className="h-5 w-5 text-purple-600" />
                {isRTL ? 'الحالة والنوع' : 'Status & Type'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Status */}
                <div className={`p-4 rounded-xl ${statusConfig.class} ${isRTL ? 'text-right' : 'text-left'}`}>
                  <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {statusConfig.icon && <statusConfig.icon className="w-4 h-4" />}
                    <span className="text-sm font-medium">
                      {isRTL ? 'الحالة' : 'Status'}
                    </span>
                  </div>
                  <p className="text-lg font-semibold">
                    {statusConfig.label}
                  </p>
                </div>

                {/* Type */}
                <div className={`p-4 rounded-xl ${typeConfig.class} ${isRTL ? 'text-right' : 'text-left'}`}>
                  <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <BookOpen className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {isRTL ? 'النوع' : 'Type'}
                    </span>
                  </div>
                  <p className="text-lg font-semibold">
                    {typeConfig.label}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Class ID */}
          <div className={`text-center py-2 ${isRTL ? 'text-right' : 'text-left'}`}>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {isRTL ? 'معرف الحصة' : 'Class ID'}: {data?.id || '-'}
            </p>
          </div>
        </>
      )}
    </BaseViewModal>
  );
};

export default ViewTeacherTimetableClassModal;
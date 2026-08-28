import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseViewModal from './BaseViewModal';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Users, Calendar, Clock, BookOpen, User, CheckCircle, XCircle, Clock3, Layers } from 'lucide-react';
import ViewModalSkeleton from '../../Skeletons/ViewModalSkeleton';

const ViewClassesModal = ({
  isOpen,
  onClose,
  data,
  isLoading,
  isRTL = false,
  currentLanguage = 'en',
  onEdit,
  onEmail,
  onDelete
}) => {
  const { t } = useTranslation();

  const renderContent = () => {
    if (isLoading) {
      return <ViewModalSkeleton />;
    }

    if (!data) {
      return (
        <div className="flex justify-center items-center p-8 h-64">
          <p className="text-gray-500">{t('classes.noData')}</p>
        </div>
      );
    }

    const getDisplayName = (nameData) => {
      if (!nameData) return '';
      if (typeof nameData === 'string') return nameData;
      const langData = nameData[currentLanguage] || nameData.en || nameData.ar;
      if (typeof langData === 'string') return langData;
      if (langData?.firstName) return `${langData.firstName} ${langData.lastName || ''}`.trim();
      return '';
    };

    const formatTime = (dateTimeString) => {
      if (!dateTimeString) return '-';
      return new Date(dateTimeString).toLocaleTimeString(currentLanguage === 'ar' ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' });
    };

    const getUserInitials = (nameData) => (getDisplayName(nameData) || 'C').slice(0, 2).toUpperCase();

    const getStatusConfig = (active) => {
      return active
        ? { label: 'classes.status.active', color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800', icon: CheckCircle }
        : { label: 'classes.status.inactive', color: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/40 dark:text-gray-300 dark:border-gray-800', icon: XCircle };
    };

    const statusConfig = getStatusConfig(data.active);
    const StatusIcon = statusConfig.icon;
    const getSemesterLabel = (semester) => t(`classes.form.${semester?.toLowerCase()}`, { defaultValue: semester });
    const getDayLabel = (day) => t(`timetable.days.${day?.toLowerCase()}`, { defaultValue: day });
    const courseName = getDisplayName(data.course?.name) || 'Unknown Course';
    const teacherName = getDisplayName(data.teacher?.name || data.teacher);

    return (
      <>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20">
          <CardContent className="p-6">
            <div className={`flex items-start gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Avatar className="h-24 w-24 border-4 border-white dark:border-gray-800 shadow-lg">
                <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white text-2xl">
                  {getUserInitials(data.name)}
                </AvatarFallback>
              </Avatar>
              <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
                <div className={`flex items-center gap-3 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{getDisplayName(data.name)}</h2>
                  <Badge className={`text-sm px-3 py-1 font-semibold border flex items-center gap-1 ${statusConfig.color}`}><StatusIcon className="w-3 h-3" />{t(statusConfig.label)}</Badge>
                </div>
                <p className={`text-gray-600 dark:text-gray-400 mb-4`}>{courseName} • {getDisplayName(data.section)} • {data.academicYear}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3"><CardTitle className={`text-lg font-semibold flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}><BookOpen className="h-5 w-5 text-cyan-600" />{t('classes.basicInfo')}</CardTitle></CardHeader>
          <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <InfoItem label={t('classes.form.name')} value={getDisplayName(data.name)} />
            <InfoItem label={t('classes.form.section')} value={getDisplayName(data.section)} />
            <InfoItem label={t('classes.form.course')} value={courseName} />
            <InfoItem label={t('classes.form.teacher')} value={teacherName} />
            <InfoItem label={t('classes.studentsCount')} value={`${data.studentsCount || 0} ${t('classes.students', { count: data.studentsCount })}`} />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3"><CardTitle className={`text-lg font-semibold flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}><Calendar className="h-5 w-5 text-green-600" />{t('classes.scheduleInfo')}</CardTitle></CardHeader>
          <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <InfoItem label={t('classes.form.academicYear')} value={data.academicYear} />
            <InfoItem label={t('classes.form.semester')} value={getSemesterLabel(data.semester)} />
            <InfoItem label={t('classes.form.startTime')} value={formatTime(data.startTime)} />
            <InfoItem label={t('classes.form.endTime')} value={formatTime(data.endTime)} />
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">{t('classes.form.days')}</p>
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(data.days) ? data.days : []).map((day, idx) => (<Badge key={idx} variant="secondary" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700">{getDayLabel(day)}</Badge>))}
              </div>
            </div>
          </CardContent>
        </Card>
      </>
    );
  };

  const InfoItem = ({ label, value }) => (
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className="font-semibold text-gray-800 dark:text-white">{value || '-'}</p>
    </div>
  );

  return (
    <BaseViewModal
      isOpen={isOpen}
      onClose={onClose}
      data={data}
      type="class"
      title={t('classes.modal.viewTitle')}
      description={t('classes.modal.viewDesc')}
      gradient="from-cyan-500 to-cyan-600"
      isRTL={isRTL}
      onEdit={onEdit && data ? () => onEdit({ id: data._id }) : undefined}
      onEmail={onEmail}
      onDelete={onDelete && data ? () => onDelete(data._id) : undefined}
      showEditButton={!!onEdit && !isLoading && !!data}
      showEmailButton={!!onEmail && !!data?.teacher?.email && !isLoading}
      showDeleteButton={!!onDelete && !isLoading && !!data}
    >
      {renderContent()}
    </BaseViewModal>
  );
};

export default ViewClassesModal;
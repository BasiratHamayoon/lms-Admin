import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseViewModal from './BaseViewModal';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import { BookOpen, Users, Clock, Award, Hash, Layers, CheckCircle, XCircle } from 'lucide-react';
import ViewModalSkeleton from '../../Skeletons/ViewModalSkeleton';

const ViewCoursesModal = ({
  isOpen,
  onClose,
  data,
  isRTL = false,
  currentLanguage = 'en',
  onEdit,
  onDelete,
  loading = false
}) => {
  const { t } = useTranslation();

  const getDisplayName = (name) => {
    if (!name) return '';
    if (typeof name === 'string') return name;
    return name[currentLanguage] || name.en || name.ar || '';
  };
  
  const getCourseInitials = (name) => {
    const displayStr = getDisplayName(name);
    if (!displayStr) return 'C';
    const words = displayStr.trim().split(' ');
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return displayStr.substring(0, 2).toUpperCase();
  };

  const getStatusConfig = (active) => active ? 
    { label: t('common.active'), color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle } :
    { label: t('common.inactive'), color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle };

  const getCategoryConfig = (category) => {
    const categories = {
      'primary': { label: t('courses.categories.primary'), color: 'bg-blue-100 text-blue-800' },
      'secondary': { label: t('courses.categories.secondary'), color: 'bg-purple-100 text-purple-800' },
      'higher-secondary': { label: t('courses.categories.higherSecondary'), color: 'bg-amber-100 text-amber-800' }
    };
    return categories[category] || { label: category, color: 'bg-gray-100 text-gray-800' };
  };

  const renderContent = () => {
    if (loading) {
      return <ViewModalSkeleton />;
    }
    if (!data) return null;

    const statusConfig = getStatusConfig(data.active);
    const StatusIcon = statusConfig.icon;
    const categoryConfig = getCategoryConfig(data.category);
    const displayName = getDisplayName(data.name);
    const displayDescription = getDisplayName(data.description);
    
    return (
      <>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20">
          <CardContent className="p-6">
            <div className={`flex items-start gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Avatar className="h-24 w-24 border-4 border-white shadow-lg"><AvatarFallback className="bg-gradient-to-r from-pink-500 to-pink-600 text-white text-2xl">{getCourseInitials(data.name)}</AvatarFallback></Avatar>
              <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
                <div className={`flex items-center gap-3 mb-2 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{displayName || t('courses.unnamed')}</h2>
                  <Badge className={`text-sm px-3 py-1 font-semibold border flex items-center gap-1 ${statusConfig.color}`}><StatusIcon className="w-3 h-3" />{statusConfig.label}</Badge>
                </div>
                <div className={`flex items-center gap-2 mb-4 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {data.code && <Badge variant="outline" className="font-mono">{data.code}</Badge>}
                  {data.category && <Badge className={`${categoryConfig.color} border`}>{categoryConfig.label}</Badge>}
                  {data.creditHours && <Badge variant="secondary" className="flex items-center gap-1"><Clock className="w-3 h-3" />{data.creditHours} {t('courses.hours')}</Badge>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3"><CardTitle className={`text-lg font-semibold flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}><BookOpen className="h-5 w-5 text-pink-600" />{t('courses.courseInformation')}</CardTitle></CardHeader>
          <CardContent className="pt-4 space-y-4">
            <InfoItem icon={Hash} label={t('courses.form.code')} value={data.code} mono />
            <Separator />
            <InfoItem icon={Layers} label={t('courses.form.category')} value={<Badge className={`${categoryConfig.color} border`}>{categoryConfig.label}</Badge>} />
            <Separator />
            <InfoItem icon={Clock} label={t('courses.form.creditHours')} value={`${data.creditHours || 0} ${t('courses.hours')}`} />
            {displayDescription && (<><Separator /><InfoItem icon={BookOpen} label={t('courses.form.description')} value={displayDescription} /></>)}
          </CardContent>
        </Card>

        {(data.teachers?.length > 0) && (
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3"><CardTitle className={`text-lg font-semibold flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}><Users className="h-5 w-5 text-blue-600" />{t('courses.assignedTeachers')}<Badge variant="secondary" className="ml-2">{data.teachers.length}</Badge></CardTitle></CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {data.teachers.map((teacher) => (
                    <div key={teacher._id} className={`flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Avatar className="h-10 w-10"><AvatarFallback className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm">{getCourseInitials(teacher.name)}</AvatarFallback></Avatar>
                      <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}><p className="font-medium text-gray-900 dark:text-white">{getDisplayName(teacher.name)}</p>{teacher.id && <p className="text-xs text-gray-500 dark:text-gray-400">{teacher.id}</p>}</div>
                    </div>
                  ))}
                </div>
            </CardContent>
          </Card>
        )}
      </>
    );
  };
  
  const InfoItem = ({ icon: Icon, label, value, mono = false }) => (
    <div className="flex items-start gap-4">
      <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800"><Icon className="h-4 w-4 text-gray-500" /></div>
      <div className="flex-1">
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</h4>
        <div className={`font-medium text-gray-900 dark:text-white ${mono ? 'font-mono' : ''}`}>{value}</div>
      </div>
    </div>
  );

  return (
    <BaseViewModal isOpen={isOpen} onClose={onClose} data={data} type="course"
      title={t('courses.modal.viewTitle')} description={t('courses.modal.viewDesc')} gradient="from-pink-500 to-pink-600"
      isRTL={isRTL} onEdit={onEdit} onDelete={onDelete} showEditButton showDeleteButton showEmailButton={false} loading={loading}>
      {renderContent()}
    </BaseViewModal>
  );
};

export default ViewCoursesModal;
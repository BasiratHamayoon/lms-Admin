import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseViewModal from './BaseViewModal';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import ViewModalSkeleton from '../../Skeletons/ViewModalSkeleton';
import { 
  Building, Users, UserCircle, BookOpen, CheckCircle, XCircle, GraduationCap,
  TrendingUp, Briefcase, Calendar, Mail
} from 'lucide-react';

const ViewDepartmentModal = ({ 
  isOpen, onClose, data, isRTL = false, currentLanguage = 'en',
  onEdit, onDelete, loading = false
}) => {
  const { t } = useTranslation();

  const getStatusConfig = (active) => active
    ? { label: t('common.active'), color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300', icon: CheckCircle }
    : { label: t('common.inactive'), color: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/40 dark:text-gray-300', icon: XCircle };

  const getTypeConfig = (type) => type === 'academic'
    ? { label: t('departments.types.academic'), color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300', icon: BookOpen }
    : { label: t('departments.types.administrative'), color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300', icon: Briefcase };
  
  const getDepartmentInitials = (name) => {
    const displayName = getDisplayName(name);
    if (!displayName) return 'D';
    const words = displayName.trim().split(' ');
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return displayName.substring(0, 2).toUpperCase();
  };

  const getDisplayName = (name) => {
    if (!name) return '';
    if (typeof name === 'string') return name;
    return name[currentLanguage] || name.en || name.ar || '';
  };
  
  const getHeadName = (head) => {
    if (!head) return t('departments.noHeadAssigned');
    const nameObj = head.name?.[currentLanguage] || head.name?.en || {};
    return [nameObj.firstName, nameObj.lastName].filter(Boolean).join(' ') || head.email || t('common.unnamed');
  };

  const calculateRatio = () => {
    if (!data?.teacherCount || data.teacherCount === 0) return 'N/A';
    return `${(data.studentCount / data.teacherCount).toFixed(1)}:1`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(currentLanguage === 'ar' ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const renderContent = () => {
    if (loading) {
      return <ViewModalSkeleton />; // <-- USE SKELETON
    }
    if (!data) return null;

    const statusConfig = getStatusConfig(data.active);
    const typeConfig = getTypeConfig(data.type);
    const StatusIcon = statusConfig.icon;
    const TypeIcon = typeConfig.icon;
    const departmentName = getDisplayName(data.name);
    const departmentDescription = getDisplayName(data.description);
    const headName = getHeadName(data.head);

    return (
      <div className="space-y-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
          <CardContent className="p-6">
            <div className={`flex items-start gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Avatar className="h-20 w-20 border-4 border-white dark:border-gray-800 shadow-lg">
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xl font-bold">{getDepartmentInitials(data.name)}</AvatarFallback>
              </Avatar>
              <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                <div className={`flex items-center gap-3 mb-2 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{departmentName || t('common.unnamed')}</h2>
                  <Badge className={`${statusConfig.color} border text-xs`}><StatusIcon className="w-3 h-3 me-1" />{statusConfig.label}</Badge>
                  <Badge className={`${typeConfig.color} text-xs`}><TypeIcon className="w-3 h-3 me-1" />{typeConfig.label}</Badge>
                </div>
                {departmentDescription && <p className="text-gray-600 dark:text-gray-400 mb-4">{departmentDescription}</p>}
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="text-center p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg"><Users className="w-5 h-5 mx-auto text-blue-500 mb-1" /><p className="text-lg font-bold text-gray-900 dark:text-white">{data.teacherCount || 0}</p><p className="text-xs text-gray-500">{t('departments.teachers')}</p></div>
                  <div className="text-center p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg"><GraduationCap className="w-5 h-5 mx-auto text-green-500 mb-1" /><p className="text-lg font-bold text-gray-900 dark:text-white">{data.studentCount || 0}</p><p className="text-xs text-gray-500">{t('departments.students')}</p></div>
                  <div className="text-center p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg"><Building className="w-5 h-5 mx-auto text-purple-500 mb-1" /><p className="text-lg font-bold text-gray-900 dark:text-white">{data.memberCount || 0}</p><p className="text-xs text-gray-500">{t('departments.totalMembers')}</p></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3"><CardTitle className={`text-lg font-semibold flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}><UserCircle className="h-5 w-5 text-purple-600" />{t('departments.head')}</CardTitle></CardHeader>
          <CardContent>
            {data.head ? (
              <div className={`flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Avatar className="h-12 w-12"><AvatarFallback className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">{headName?.charAt(0) || 'H'}</AvatarFallback></Avatar>
                <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
                  <p className="font-semibold text-gray-900 dark:text-white">{headName}</p>
                  {data.head.email && <div className={`flex items-center gap-2 text-sm text-gray-500 ${isRTL ? 'flex-row-reverse' : ''}`}><Mail className="w-4 h-4" /><span>{data.head.email}</span></div>}
                </div>
              </div>
            ) : (<div className="text-center py-6 text-gray-500 dark:text-gray-400"><UserCircle className="w-12 h-12 mx-auto mb-2 opacity-50" /><p>{t('departments.noHeadAssigned')}</p></div>)}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3"><CardTitle className={`text-lg font-semibold flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}><TrendingUp className="h-5 w-5 text-blue-600" />{t('departments.statistics')}</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 text-center bg-blue-50 dark:bg-blue-900/20 rounded-lg"><p className="text-2xl font-bold text-gray-900 dark:text-white">{data.teacherCount || 0}</p><p className="text-sm text-gray-500">{t('departments.teachers')}</p></div>
              <div className="p-3 text-center bg-green-50 dark:bg-green-900/20 rounded-lg"><p className="text-2xl font-bold text-gray-900 dark:text-white">{data.studentCount || 0}</p><p className="text-sm text-gray-500">{t('departments.students')}</p></div>
              <div className="p-3 text-center bg-purple-50 dark:bg-purple-900/20 rounded-lg"><p className="text-2xl font-bold text-gray-900 dark:text-white">{data.memberCount || 0}</p><p className="text-sm text-gray-500">{t('departments.totalMembers')}</p></div>
              <div className="p-3 text-center bg-amber-50 dark:bg-amber-900/20 rounded-lg"><p className="text-2xl font-bold text-gray-900 dark:text-white">{calculateRatio()}</p><p className="text-sm text-gray-500">{t('departments.ratio')}</p></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3"><CardTitle className={`text-lg font-semibold flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}><Calendar className="h-5 w-5 text-teal-600" />{t('departments.additionalInfo')}</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3 pt-2">
              <div className={`flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 ${isRTL ? 'flex-row-reverse' : ''}`}><span className="text-gray-500">{t('common.createdAt')}</span><span className="font-medium text-gray-900 dark:text-white">{formatDate(data.createdAt)}</span></div>
              <div className={`flex justify-between items-center py-2 ${isRTL ? 'flex-row-reverse' : ''}`}><span className="text-gray-500">{t('common.updatedAt')}</span><span className="font-medium text-gray-900 dark:text-white">{formatDate(data.updatedAt)}</span></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  return (
    <BaseViewModal
      isOpen={isOpen} onClose={onClose} data={data} title={t('departments.modal.viewTitle')} description={t('departments.modal.viewDesc')}
      gradient="from-purple-500 to-purple-600" isRTL={isRTL} onEdit={onEdit} onDelete={onDelete}
      showEditButton={!loading && !!data}
      showDeleteButton={!loading && !!data && data.memberCount === 0}
    >
      {renderContent()}
    </BaseViewModal>
  );
};

export default ViewDepartmentModal;
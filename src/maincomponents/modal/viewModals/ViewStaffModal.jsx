import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseViewModal from './BaseViewModal';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { User, Mail, Phone, Calendar, Briefcase, CheckCircle, XCircle, Clock } from 'lucide-react';
import ViewModalSkeleton from '../../Skeletons/ViewModalSkeleton';

const ViewStaffModal = ({
  isOpen, onClose, data, loading, isRTL = false,
  currentLanguage = 'en', onEdit, onEmail, onDelete
}) => {
  const { t } = useTranslation();

  const renderContent = () => {
    if (loading) {
      return <ViewModalSkeleton />; // Using the unified skeleton
    }

    if (!data) {
      return (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">{t('staff.messages.noData')}</p>
        </div>
      );
    }
    
    const getFullName = () => {
      const nameBlock = data.name?.[currentLanguage] || data.name?.en || data.name?.ar || {};
      return [nameBlock.firstName, nameBlock.lastName].filter(Boolean).join(' ') || data.email;
    };
    const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString(currentLanguage === 'ar' ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '-';
    const getUserInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';
    const getStatusConfig = (status) => ({
      'active': { label: 'staff.status.active', color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300', icon: CheckCircle },
      'inactive': { label: 'staff.status.inactive', color: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/40 dark:text-gray-300', icon: XCircle },
      'on-leave': { label: 'staff.status.on-leave', color: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300', icon: Clock }
    }[status] || { label: 'staff.status.active', color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300', icon: CheckCircle });
    const getRoleLabel = (role) => t(`staff.roles.${role}`, role);
    const getDepartmentName = () => data.department ? (data.department.name?.[currentLanguage] || data.department.name?.en || '-') : '-';

    const fullName = getFullName();
    const statusConfig = getStatusConfig(data.status || 'active');
    const StatusIcon = statusConfig.icon;

    return (
      <>
        <Card className="border-0 shadow-lg bg-secondary/50">
          <CardContent className="p-6">
            <div className={`flex items-start gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                <AvatarImage src={data.avatar} alt={fullName} />
                <AvatarFallback className="bg-gradient-to-r from-green-500 to-green-600 text-white text-2xl">{getUserInitials(fullName)}</AvatarFallback>
              </Avatar>
              <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
                <div className={`flex items-center gap-3 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <h2 className="text-2xl font-bold text-foreground">{fullName}</h2>
                  <Badge className={`text-sm px-3 py-1 font-semibold border flex items-center gap-1 ${statusConfig.color}`}><StatusIcon className="w-3 h-3" />{t(statusConfig.label)}</Badge>
                </div>
                <p className="text-muted-foreground mb-4">{getRoleLabel(data.role)} • {getDepartmentName()}</p>
                <div className={`flex flex-wrap gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {data.email && <div className={`flex items-center gap-2 text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}><Mail className="w-4 h-4" /><span className="text-sm">{data.email}</span></div>}
                  {data.phoneNumber && <div className={`flex items-center gap-2 text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}><Phone className="w-4 h-4" /><span className="text-sm">{data.phoneNumber}</span></div>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3"><CardTitle className={`text-lg font-semibold flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}><User className="h-5 w-5 text-blue-600" />{t('staff.personalInfo')}</CardTitle></CardHeader>
          <CardContent><div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><p className="text-sm text-muted-foreground mb-1">{t('staff.form.fullName')}</p><p className="font-medium text-foreground">{fullName}</p></div>
            <div><p className="text-sm text-muted-foreground mb-1">{t('staff.form.email')}</p><p className="font-medium text-foreground">{data.email || '-'}</p></div>
            <div><p className="text-sm text-muted-foreground mb-1">{t('staff.form.phone')}</p><p className="font-medium text-foreground">{data.phoneNumber || '-'}</p></div>
            <div><p className="text-sm text-muted-foreground mb-1">{t('staff.form.joinDate')}</p><p className="font-medium text-foreground">{formatDate(data.joiningDate)}</p></div>
          </div></CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3"><CardTitle className={`text-lg font-semibold flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}><Briefcase className="h-5 w-5 text-green-600" />{t('staff.professionalInfo')}</CardTitle></CardHeader>
          <CardContent><div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><p className="text-sm text-muted-foreground mb-1">{t('staff.form.role')}</p><Badge className="bg-blue-100 text-blue-800 border-blue-200">{getRoleLabel(data.role)}</Badge></div>
            <div><p className="text-sm text-muted-foreground mb-1">{t('staff.form.department')}</p><p className="font-medium text-foreground">{getDepartmentName()}</p></div>
            <div><p className="text-sm text-muted-foreground mb-1">{t('common.status')}</p><Badge className={`flex items-center gap-1 w-fit ${statusConfig.color}`}><StatusIcon className="w-3 h-3" />{t(statusConfig.label)}</Badge></div>
            <div><p className="text-sm text-muted-foreground mb-1">{t('staff.form.staffId')}</p><p className="font-mono font-medium text-foreground">{data.id || '-'}</p></div>
          </div></CardContent>
        </Card>
      </>
    );
  };
  
  return (
    <BaseViewModal
      isOpen={isOpen}
      onClose={onClose}
      data={data}
      title={t('staff.modal.viewTitle')}
      description={t('staff.modal.viewDesc')}
      gradient="from-green-500 to-green-600"
      isRTL={isRTL}
      onEdit={onEdit}
      onEmail={onEmail}
      onDelete={onDelete}
      showEditButton={!loading && !!data}
      showEmailButton={!loading && !!data?.email}
      showDeleteButton={!loading && !!data}
    >
      {renderContent()}
    </BaseViewModal>
  );
};
export default ViewStaffModal;
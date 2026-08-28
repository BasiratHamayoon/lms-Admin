import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseViewModal from './BaseViewModal';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import { 
  Calendar, 
  Clock, 
  FileText, 
  User, 
  Mail, 
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  CalendarDays,
  Clock3,
  BookOpen
} from 'lucide-react';
import ViewModalSkeleton from '@maincomponents/Skeletons/ViewModalSkeleton';

const ViewLeaveModal = ({ 
  isOpen, 
  onClose, 
  data,
  loading,
  isRTL = false, 
  currentLanguage = 'en',
  onEdit,
  onDelete,
  onApprove,
  onReject,
  onCancel,
  showActionButtons = true
}) => {
  const { t } = useTranslation();

  const renderContent = () => {
    if (loading) {
      return <ViewModalSkeleton />;
    }

    if (!data) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{t('common.noData')}</h3>
          <p className="text-gray-500 dark:text-gray-400">{t('leave.noLeaveData', 'The leave details could not be loaded.')}</p>
        </div>
      );
    }
    
    const getBilingualValue = (obj) => {
      if (!obj) return '';
      if (typeof obj === 'string') return obj;
      return obj[currentLanguage] || obj.en || obj.ar || '';
    };

    const getLeaveTypeKey = () => {
      if (data.leaveTypeDisplay) return data.leaveTypeDisplay;
      if (typeof data.leaveType === 'string') return data.leaveType;
      if (typeof data.leaveType === 'object') return data.leaveType?.en || 'other';
      return 'other';
    };

    const getReasonDisplay = () => data.reasonDisplay || getBilingualValue(data.reason);
    const getRejectReasonDisplay = () => data.rejectReasonDisplay || getBilingualValue(data.rejectReason);
    const getUserName = () => data.user?.name || data.userName || 'Unknown User';
    const getUserRole = () => data.user?.role || data.userRole || 'staff';
    const getUserEmail = () => data.user?.email || data.email || '';
    const getUserId = () => data.user?.id || data.userId || '';

    const formatDate = (dateString) => {
      if (!dateString) return '-';
      try {
        return new Date(dateString).toLocaleDateString(currentLanguage === 'ar' ? 'ar-SA' : 'en-US', {
          year: 'numeric', month: 'long', day: 'numeric'
        });
      } catch { return '-'; }
    };

    const getUserInitials = (name) => {
      if (!name) return 'U';
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const getStatusConfig = (status) => {
      const statusMap = {
        'pending': { label: 'leave.status.pending', color: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-800', icon: Clock },
        'approved': { label: 'leave.status.approved', color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800', icon: CheckCircle },
        'rejected': { label: 'leave.status.rejected', color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800', icon: XCircle },
        'cancelled': { label: 'leave.status.cancelled', color: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/40 dark:text-gray-300 dark:border-gray-800', icon: AlertCircle }
      };
      return statusMap[status] || statusMap['pending'];
    };

    const getLeaveTypeConfig = (type) => {
      const typeKey = typeof type === 'string' ? type : type?.en || 'other';
      const typeMap = {
        'sick': { label: 'leave.types.sick', color: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300', icon: AlertCircle },
        'casual': { label: 'leave.types.casual', color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300', icon: CalendarDays },
        'annual': { label: 'leave.types.annual', color: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300', icon: Calendar },
        'unpaid': { label: 'leave.types.unpaid', color: 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300', icon: FileText },
        'other': { label: 'leave.types.other', color: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300', icon: Clock3 }
      };
      return typeMap[typeKey] || typeMap['other'];
    };

    const getRoleLabel = (role) => t(`leave.roles.${role}`) || role;

    const userName = getUserName();
    const userRole = getUserRole();
    const userEmail = getUserEmail();
    const leaveTypeKey = getLeaveTypeKey();
    const reasonDisplay = getReasonDisplay();
    const rejectReasonDisplay = getRejectReasonDisplay();

    const statusConfig = getStatusConfig(data.status);
    const leaveTypeConfig = getLeaveTypeConfig(leaveTypeKey);
    const StatusIcon = statusConfig.icon;
    const LeaveTypeIcon = leaveTypeConfig.icon;
    
    return (
      <>
        {/* Header Card */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20">
          <CardContent className="p-6">
            <div className={`flex items-start gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Avatar className="h-20 w-20 border-4 border-white dark:border-gray-800 shadow-lg">
                <AvatarImage src={data.user?.avatar || data.avatar} alt={userName} />
                <AvatarFallback className="bg-gradient-to-r from-teal-500 to-teal-600 text-white text-xl">
                  {getUserInitials(userName)}
                </AvatarFallback>
              </Avatar>
              <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                <div className={`flex items-center gap-3 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{userName}</h2>
                  <Badge className={`text-sm px-3 py-1 font-semibold border flex items-center gap-1 ${statusConfig.color} ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <StatusIcon className="w-3 h-3" />
                    {t(statusConfig.label)}
                  </Badge>
                </div>
                <div className={`flex flex-wrap gap-4 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Badge className={`flex items-center gap-1 ${leaveTypeConfig.color}`}>
                    <LeaveTypeIcon className="w-3 h-3" />
                    {t(leaveTypeConfig.label)}
                  </Badge>
                  <Badge variant="outline" className="border-gray-300 dark:border-gray-700">{getRoleLabel(userRole)}</Badge>
                </div>
                <div className={`flex flex-wrap gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center gap-2 text-gray-600 dark:text-gray-400 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Calendar className="h-4 w-4" /><span className="text-sm">{formatDate(data.startDate)} - {formatDate(data.endDate)}</span>
                  </div>
                  <div className={`flex items-center gap-2 text-gray-600 dark:text-gray-400 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Clock className="h-4 w-4" /><span className="text-sm">{data.totalDays} {data.totalDays === 1 ? t('common.day') : t('common.days')}</span>
                  </div>
                  {userEmail && (
                    <div className={`flex items-center gap-2 text-gray-600 dark:text-gray-400 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Mail className="h-4 w-4" /><span className="text-sm">{userEmail}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leave Details Card */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3"><CardTitle className={`text-lg font-semibold flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}><FileText className="h-5 w-5 text-blue-600" />{t('leave.basicInfo')}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800"><User className="h-4 w-4 text-gray-500" /></div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{t('leave.form.user')}</h4>
                <p className="text-gray-900 dark:text-white font-medium">{userName}</p>
                <p className="text-sm text-gray-500">{getUserId()}</p>
              </div>
            </div>
            <Separator />
            <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800"><LeaveTypeIcon className="h-4 w-4 text-gray-500" /></div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{t('leave.form.leaveType')}</h4>
                <Badge className={`inline-flex items-center gap-1 px-2 py-1 ${leaveTypeConfig.color}`}><LeaveTypeIcon className="w-3 h-3" />{t(leaveTypeConfig.label)}</Badge>
              </div>
            </div>
            <Separator />
            <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800"><Calendar className="h-4 w-4 text-gray-500" /></div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{t('leave.form.dates')}</h4>
                <p className="text-gray-900 dark:text-white font-medium">{formatDate(data.startDate)} - {formatDate(data.endDate)}</p>
                <p className="text-sm text-gray-500">{data.totalDays} {data.totalDays === 1 ? t('common.day') : t('common.days')}</p>
              </div>
            </div>
            <Separator />
            <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800"><FileText className="h-4 w-4 text-gray-500" /></div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{t('leave.form.reason')}</h4>
                <p className="text-gray-900 dark:text-white font-medium whitespace-pre-line">{reasonDisplay || '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Card */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3"><CardTitle className={`text-lg font-semibold flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}><CheckCircle className="h-5 w-5 text-purple-600" />{t('leave.statusInfo')}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800"><StatusIcon className="h-4 w-4 text-gray-500" /></div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{t('common.status')}</h4>
                <Badge className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold border ${statusConfig.color}`}><StatusIcon className="w-3 h-3" />{t(statusConfig.label)}</Badge>
              </div>
            </div>
            {data.approver && (
              <><Separator /><div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800"><User className="h-4 w-4 text-gray-500" /></div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{t('leave.form.approvedBy')}</h4>
                  <p className="text-gray-900 dark:text-white font-medium">{data.approver.name || 'Admin'}</p>
                  {data.approvalDate && <p className="text-sm text-gray-500">{formatDate(data.approvalDate)}</p>}
                </div>
              </div></>
            )}
            {rejectReasonDisplay && data.status === 'rejected' && (
              <><Separator /><div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20"><AlertCircle className="h-4 w-4 text-red-500" /></div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-red-500 dark:text-red-400 mb-1">{t('leave.form.rejectReason')}</h4>
                  <p className="text-red-700 dark:text-red-300 font-medium">{rejectReasonDisplay}</p>
                </div>
              </div></>
            )}
          </CardContent>
        </Card>
      </>
    );
  };
  
  const customButtons = [];
  if (!loading && showActionButtons && data) {
    if (data.status === 'pending' && onApprove && onReject) {
      customButtons.push(
        { label: t('leave.actions.approveLeave'), onClick: () => onApprove(data), variant: "default", className: "bg-green-600 hover:bg-green-700 text-white" },
        { label: t('leave.actions.rejectLeave'), onClick: () => onReject(data), variant: "destructive", className: "bg-red-600 hover:bg-red-700 text-white" }
      );
    }
    if (data.status !== 'cancelled' && onCancel) {
      customButtons.push({
        label: t('leave.actions.cancelLeave'), onClick: () => onCancel(data), variant: "outline",
        className: "border-red-200 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/30"
      });
    }
  }

  return (
    <BaseViewModal
      isOpen={isOpen}
      onClose={onClose}
      data={data}
      type="leave"
      title={t('leave.leaveDetails')}
      description={isRTL ? 'عرض معلومات الإجازة الكاملة' : 'View complete leave information'}
      gradient="from-teal-500 to-teal-600"
      isRTL={isRTL}
      currentLanguage={currentLanguage}
      onEdit={onEdit}
      onDelete={onDelete}
      showEditButton={!loading && !!onEdit && data?.status === 'pending'}
      showEmailButton={false}
      showDeleteButton={!loading && !!onDelete}
      customButtons={customButtons}
      isLoading={loading} // Pass loading state to BaseViewModal
    >
      {renderContent()}
    </BaseViewModal>
  );
};

export default ViewLeaveModal;
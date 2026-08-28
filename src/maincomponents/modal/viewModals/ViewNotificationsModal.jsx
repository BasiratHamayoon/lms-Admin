import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseViewModal from './BaseViewModal';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import { 
  Bell,
  MessageCircle,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  Eye,
  EyeOff,
  Send,
  Calendar,
  FileText,
  Award,
  DollarSign,
  CheckSquare,
  BookOpen,
  AlertCircle,
  GraduationCap,
  Briefcase,
  Shield
} from 'lucide-react';
import ViewNotificationSkeleton from '@maincomponents/Skeletons/ViewModalSkeleton'; // Ensure path is correct

const ViewNotificationsModal = ({ 
  isOpen, 
  onClose, 
  data, 
  loading,
  isRTL = false, 
  currentLanguage = 'en',
  onEdit,
  onDelete,
  onSend,
  onMarkAsRead
}) => {
  const { t } = useTranslation();
  
  const customButtons = [];
  if (!loading && data) {
    if (data.status === 'draft' && onSend) {
      customButtons.push({
        label: isRTL ? 'إرسال الإشعار' : 'Send Notification',
        variant: 'outline',
        className: 'border-green-200 dark:border-green-700 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30',
        onClick: () => {
          onSend(data);
          onClose();
        }
      });
    }
    if (data.status === 'published' && onMarkAsRead) {
      customButtons.push({
        label: isRTL ? 'تعليم كمقروء' : 'Mark as Read',
        variant: 'outline',
        className: 'border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30',
        onClick: () => {
          onMarkAsRead(data);
          onClose();
        }
      });
    }
  }

  const renderDataContent = () => {
    // Helper to get bilingual value
    const getBilingualValue = (val) => {
      if (!val) return '';
      if (typeof val === 'string') return val;
      return val[currentLanguage] || val.en || val.ar || '';
    };

    const title = getBilingualValue(data.title);
    const message = getBilingualValue(data.message);

    const formatDate = (dateString) => {
      if (!dateString) return '-';
      try {
        return new Date(dateString).toLocaleDateString(currentLanguage === 'ar' ? 'ar-SA' : 'en-US', {
          year: 'numeric', month: 'long', day: 'numeric',
          hour: '2-digit', minute: '2-digit'
        });
      } catch { return dateString; }
    };
    
    // ... all other helper functions (getStatusConfig, getPriorityConfig, etc.)
    const getStatusConfig = (status) => {
        const statusMap = {
          'draft': { label: 'notifications.status.draft', color: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/40 dark:text-gray-300 dark:border-gray-800', icon: FileText },
          'published': { label: 'notifications.status.published', color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800', icon: Send },
          'archived': { label: 'notifications.status.archived', color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800', icon: CheckCircle }
        };
        return statusMap[status] || statusMap['draft'];
    };
    const getPriorityConfig = (priority) => {
        const priorityMap = {
            'low': { label: 'notifications.priority.low', color: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/40 dark:text-gray-300 dark:border-gray-800', icon: Bell },
            'medium': { label: 'notifications.priority.medium', color: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-800', icon: AlertTriangle },
            'high': { label: 'notifications.priority.high', color: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/40 dark:text-orange-300 dark:border-orange-800', icon: AlertTriangle },
            'urgent': { label: 'notifications.priority.urgent', color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800', icon: AlertCircle }
        };
        return priorityMap[priority] || priorityMap['medium'];
    };
    const getTypeConfig = (type) => {
        const typeMap = {
            'announcement': { label: 'notifications.types.announcement', color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800', icon: Bell },
            'event': { label: 'notifications.types.event', color: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-800', icon: Calendar },
            'assignment': { label: 'notifications.types.assignment', color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800', icon: FileText },
            'quiz': { label: 'notifications.types.quiz', color: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-800', icon: BookOpen },
            'grade': { label: 'notifications.types.grade', color: 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-300 dark:border-indigo-800', icon: Award },
            'fee': { label: 'notifications.types.fee', color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800', icon: DollarSign },
            'attendance': { label: 'notifications.types.attendance', color: 'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/40 dark:text-teal-300 dark:border-teal-800', icon: CheckSquare },
            'other': { label: 'notifications.types.other', color: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/40 dark:text-gray-300 dark:border-gray-800', icon: MessageCircle }
        };
        return typeMap[type] || typeMap['other'];
    };
    const getAudienceConfig = (audience) => {
        const audienceMap = {
            'all': { label: 'notifications.targetAudience.all', color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800', icon: Eye },
            'students': { label: 'notifications.targetAudience.students', color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800', icon: GraduationCap },
            'teachers': { label: 'notifications.targetAudience.teachers', color: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-800', icon: Users },
            'staff': { label: 'notifications.targetAudience.staff', color: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/40 dark:text-orange-300 dark:border-orange-800', icon: Briefcase },
            'parents': { label: 'notifications.targetAudience.parents', color: 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-300 dark:border-indigo-800', icon: Users },
            'admin': { label: 'notifications.targetAudience.admin', color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800', icon: Shield },
            'specific': { label: 'notifications.targetAudience.specific', color: 'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/40 dark:text-teal-300 dark:border-teal-800', icon: EyeOff }
        };
        return audienceMap[audience] || audienceMap['all'];
    };
    const getNotificationInitials = (text) => {
        if (!text) return 'N';
        return text.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };
    const getSenderInitials = (name) => {
        if (!name) return 'S';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };
    const calculateReadRate = () => {
        if (!data.readCount || !data.totalRecipients || data.totalRecipients === 0) return '0%';
        return ((data.readCount / data.totalRecipients) * 100).toFixed(1) + '%';
    };

    const statusConfig = getStatusConfig(data.status);
    const priorityConfig = getPriorityConfig(data.priority);
    const typeConfig = getTypeConfig(data.type);
    const audienceConfig = getAudienceConfig(data.targetAudience);
    const StatusIcon = statusConfig.icon;
    const PriorityIcon = priorityConfig.icon;
    const TypeIcon = typeConfig.icon;
    const AudienceIcon = audienceConfig.icon;

    const sections = [
        { title: 'notifications.basicInfo', icon: Bell, color: 'text-emerald-600', fields: [ { key: 'title', label: 'notifications.form.title', icon: Bell }, { key: 'type', label: 'notifications.form.type', icon: TypeIcon }, { key: 'priority', label: 'notifications.form.priority', icon: PriorityIcon }, { key: 'status', label: 'common.status', icon: StatusIcon }, ] },
        { title: 'notifications.targetInfo', icon: Users, color: 'text-blue-600', fields: [ { key: 'targetAudience', label: 'notifications.form.targetAudience', icon: AudienceIcon }, { key: 'targetClasses', label: 'notifications.targetClasses', icon: GraduationCap }, { key: 'readStats', label: 'notifications.readRate', icon: TrendingUp }, ] },
        { title: 'notifications.dateTimeInfo', icon: Calendar, color: 'text-purple-600', fields: [ { key: 'validFrom', label: 'notifications.form.validFrom', icon: Calendar }, { key: 'validUntil', label: 'notifications.form.validUntil', icon: Clock }, { key: 'sentBy', label: 'notifications.form.sentBy', icon: Users }, ] }
    ];

    return (
      <>
        {/* Header Card */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
          <CardContent className="p-6">
            <div className={`flex items-start gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Avatar className="h-24 w-24 border-4 border-white dark:border-gray-800 shadow-lg">
                <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-2xl">
                  {getNotificationInitials(title)}
                </AvatarFallback>
              </Avatar>
              
              <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                <div className={`flex items-center gap-3 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {title}
                  </h2>
                  <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Badge className={`text-sm px-3 py-1 font-semibold border flex items-center gap-1 ${priorityConfig.color} ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <PriorityIcon className="w-3 h-3" /> {t(priorityConfig.label)}
                    </Badge>
                    <Badge className={`text-sm px-3 py-1 font-semibold border flex items-center gap-1 ${typeConfig.color} ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <TypeIcon className="w-3 h-3" /> {t(typeConfig.label)}
                    </Badge>
                  </div>
                </div>
                
                <p className={`text-gray-600 dark:text-gray-400 mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {data.type ? t(`notifications.types.${data.type}`) : ''} • {formatDate(data.createdAt)}
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* ... Rest of the detailed grid ... */}
                   <div className="bg-white/60 dark:bg-gray-800/60 p-3 rounded-lg"><div className={`flex items-center gap-2 mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}><Users className="h-4 w-4 text-emerald-600" /><span className="text-sm font-medium text-gray-600 dark:text-gray-400">{isRTL ? 'المستهدفين' : 'Audience'}</span></div><Badge className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold border ${audienceConfig.color}`}><AudienceIcon className="w-3 h-3" />{t(audienceConfig.label)}</Badge></div>
                   <div className="bg-white/60 dark:bg-gray-800/60 p-3 rounded-lg"><div className={`flex items-center gap-2 mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}><TrendingUp className="h-4 w-4 text-blue-600" /><span className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('notifications.readRate')}</span></div><p className="text-lg font-bold text-gray-900 dark:text-white">{calculateReadRate()}</p></div>
                   <div className="bg-white/60 dark:bg-gray-800/60 p-3 rounded-lg"><div className={`flex items-center gap-2 mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}><Calendar className="h-4 w-4 text-purple-600" /><span className="text-sm font-medium text-gray-600 dark:text-gray-400">{isRTL ? 'من' : 'From'}</span></div><p className="text-lg font-bold text-gray-900 dark:text-white">{formatDate(data.validFrom).split(',')[0]}</p></div>
                   <div className="bg-white/60 dark:bg-gray-800/60 p-3 rounded-lg"><div className={`flex items-center gap-2 mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}><Clock className="h-4 w-4 text-orange-600" /><span className="text-sm font-medium text-gray-600 dark:text-gray-400">{isRTL ? 'حتى' : 'Until'}</span></div><p className="text-lg font-bold text-gray-900 dark:text-white">{data.validUntil ? formatDate(data.validUntil).split(',')[0] : t('notifications.noExpiry')}</p></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ... All other cards for Message, Info, and Statistics ... */}
        {message && (<Card className="border-0 shadow-lg"><CardHeader className="pb-3"><CardTitle className={`text-lg font-semibold flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}><MessageCircle className="h-5 w-5 text-indigo-600" />{t('notifications.form.message')}</CardTitle></CardHeader><CardContent><div className={`bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg ${isRTL ? 'text-right' : 'text-left'}`}><p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{message}</p></div></CardContent></Card>)}
        {sections.map((section, sectionIndex) => (
          <Card key={sectionIndex} className="border-0 shadow-lg">
              {/* ... The rest of your detailed card rendering logic ... */}
          </Card>
        ))}
        <Card className="border-0 shadow-lg">
            {/* ... Statistics card rendering logic ... */}
        </Card>
      </>
    );
  };
  
  return (
    <BaseViewModal
      isOpen={isOpen}
      onClose={onClose}
      data={data}
      type="notification"
      title={isRTL ? 'تفاصيل الإشعار' : 'Notification Details'}
      description={isRTL ? 'عرض معلومات الإشعار الكاملة' : 'View complete notification information'}
      gradient="from-emerald-500 to-emerald-600"
      isRTL={isRTL}
      currentLanguage={currentLanguage}
      onEdit={onEdit}
      onDelete={onDelete}
      showEditButton={!loading && !!onEdit && !!data}
      showEmailButton={false}
      showDeleteButton={false}
      customButtons={customButtons}
    >
      {loading ? (
        <ViewNotificationSkeleton />
      ) : data ? (
        renderDataContent()
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{t('common.noData')}</h3>
          <p className="text-gray-500 dark:text-gray-400">{t('notifications.noNotificationData', 'The notification details could not be loaded.')}</p>
        </div>
      )}
    </BaseViewModal>
  );
};

export default ViewNotificationsModal;
import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseViewModal from './BaseViewModal';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import { 
  MessageCircle, Mail, Calendar, User, BookOpen, AlertCircle, Clock,
  CheckCircle, HelpCircle, Info, AlertTriangle, GraduationCap, MessageSquare
} from 'lucide-react';
import ViewModalSkeleton from '@maincomponents/Skeletons/ViewModalSkeleton';

const ViewQueriesModal = ({ 
  isOpen, 
  onClose, 
  data, 
  loading,
  isRTL = false, 
  currentLanguage = 'en',
  onEdit,
  onReply,
  onDelete,
  onEmail
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
          <p className="text-gray-500 dark:text-gray-400">{t('queries.noQueryData', 'The query details could not be loaded.')}</p>
        </div>
      );
    }
    
    const formatDate = (dateString) => {
      if (!dateString) return '-';
      return new Date(dateString).toLocaleDateString(currentLanguage === 'ar' ? 'ar-SA' : 'en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
        weekday: 'long', hour: '2-digit', minute: '2-digit'
      });
    };

    const getStatusConfig = (status) => {
      const statusMap = {
        'pending': { label: 'queries.status.pending', color: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-800', icon: Clock },
        'in-progress': { label: 'queries.status.inProgress', color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800', icon: AlertCircle },
        'resolved': { label: 'queries.status.resolved', color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800', icon: CheckCircle }
      };
      return statusMap[status] || statusMap['pending'];
    };

    const getTypeConfig = (type) => {
      const typeMap = {
        'academic': { label: 'Academic', color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800', icon: BookOpen },
        'technical': { label: 'Technical', color: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-800', icon: HelpCircle },
        'administrative': { label: 'Administrative', color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800', icon: Info },
        'emergency': { label: 'Emergency', color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800', icon: AlertTriangle },
        'general': { label: 'General', color: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/40 dark:text-gray-300 dark:border-gray-800', icon: MessageCircle }
      };
      return typeMap[type] || typeMap['general'];
    };

    const statusConfig = getStatusConfig(data.status);
    const typeConfig = getTypeConfig(data.type);
    const StatusIcon = statusConfig.icon;
    const TypeIcon = typeConfig.icon;

    const getUserInitials = (name) => {
      if (!name) return 'S';
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const getMessageText = (messageKey) => {
      if (!messageKey) return '';
      if (!messageKey.startsWith('queries.messages.')) return messageKey;
      const key = messageKey.replace('queries.messages.', '');
      const messageMap = {
        'algorithmHelp': "I need help with the advanced project assignment. The timeline analysis is confusing me.",
        'portalAccess': "Cannot access the HR portal for submitting requests. Getting authentication error.",
        'extensionRequest': "Request for extension on project due to medical reasons.",
        'labEmergency': "URGENT: Equipment malfunction during work. Need immediate assistance.",
        'fieldTripInquiry': "General inquiry about the upcoming team building and required preparations.",
        'gradingClarification': "Clarification needed on the performance review criteria."
      };
      return messageMap[key] || messageKey;
    };
    
    return (
      <>
        {/* Header Card */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <CardContent className="p-6">
            <div className={`flex items-start gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Avatar className="h-24 w-24 border-4 border-white dark:border-gray-800 shadow-lg">
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-2xl">
                  {getUserInitials(data.name)}
                </AvatarFallback>
              </Avatar>
              <div className={`flex-1 ${isRTL ? 'text-left' : ''}`}>
                <div className={`flex items-center gap-3 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{data.name}</h2>
                  <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Badge className={`text-sm px-3 py-1 font-semibold border flex items-center gap-1 ${statusConfig.color} ${isRTL ? 'flex-row-reverse' : ''}`}><StatusIcon className="w-3 h-3" />{t(statusConfig.label)}</Badge>
                    <Badge className={`text-sm px-3 py-1 font-semibold border flex items-center gap-1 ${typeConfig.color} ${isRTL ? 'flex-row-reverse' : ''}`}><TypeIcon className="w-3 h-3" />{typeConfig.label}</Badge>
                  </div>
                </div>
                <p className={`text-gray-600 dark:text-gray-400 mb-4 ${isRTL ? 'text-left' : ''}`}>{data.course} • {data.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Message Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3"><CardTitle className={`text-lg font-semibold flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}><MessageSquare className="h-5 w-5 text-indigo-600" />{t('queries.originalMessage')}</CardTitle></CardHeader>
          <CardContent>
            <div className={`bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg`}>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{getMessageText(data.message)}</p>
            </div>
            <div className={`mt-4 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Calendar className="h-3 w-3" /><span>{formatDate(data.date)}</span>
            </div>
          </CardContent>
        </Card>
      </>
    );
  };
  
  const customButtons = [];
  if (!loading && data && onReply) {
    customButtons.push({
      label: isRTL ? 'رد' : 'Reply',
      variant: 'outline',
      className: 'border-green-200 dark:border-green-700 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30',
      onClick: () => {
        onReply(data);
        onClose();
      }
    });
  }

  return (
    <BaseViewModal
      isOpen={isOpen}
      onClose={onClose}
      data={data}
      type="query"
      title={isRTL ? 'تفاصيل الاستفسار' : 'Query Details'}
      description={isRTL ? 'عرض معلومات الاستفسار الكاملة' : 'View complete query information'}
      gradient="from-blue-500 to-blue-600"
      isRTL={isRTL}
      currentLanguage={currentLanguage}
      onEdit={onEdit}
      onEmail={onEmail}
      onDelete={onDelete}
      showEditButton={false}
      showEmailButton={!loading && !!data?.email}
      showDeleteButton={false}
      customButtons={customButtons}
      isLoading={loading}
    >
      {renderContent()}
    </BaseViewModal>
  );
};

export default ViewQueriesModal;
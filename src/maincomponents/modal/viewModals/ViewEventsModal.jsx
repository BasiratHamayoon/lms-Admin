import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseViewModal from './BaseViewModal';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import ViewModalSkeleton from '../../Skeletons/ViewModalSkeleton';
import { 
  Calendar, Clock, MapPin, CheckCircle, XCircle, PauseCircle, BookOpen 
} from 'lucide-react';

const ViewEventsModal = ({ 
  isOpen, 
  onClose, 
  data, 
  loading,
  isRTL = false, 
  currentLanguage = 'en',
  onEdit,
  onDelete
}) => {
  const { t } = useTranslation();

  const renderContent = () => {
    if (loading) {
      return <ViewModalSkeleton />;
    }
    
    if (!data) {
      return null;
    }

    const getLocalizedContent = (field) => {
      if (!field) return '';
      if (typeof field === 'string') return field;
      return field[currentLanguage] || field.en || '';
    };

    const title = getLocalizedContent(data.title);
    const description = getLocalizedContent(data.description);
    const location = getLocalizedContent(data.location);

    const formatDate = (dateString) => {
      if (!dateString) return '-';
      return new Date(dateString).toLocaleDateString(currentLanguage === 'ar' ? 'ar-SA' : 'en-US', {
        year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
      });
    };

    const formatTime = (dateString) => {
      if (!dateString) return '-';
      return new Date(dateString).toLocaleTimeString(currentLanguage === 'ar' ? 'ar-SA' : 'en-US', {
        hour: '2-digit', minute: '2-digit'
      });
    };

    const getStatusConfig = (status) => {
      const statusMap = {
        'scheduled': { label: 'events.status.scheduled', color: 'bg-blue-100 text-blue-800', icon: Calendar },
        'cancelled': { label: 'events.status.cancelled', color: 'bg-red-100 text-red-800', icon: XCircle },
        'completed': { label: 'events.status.completed', color: 'bg-green-100 text-green-800', icon: CheckCircle },
        'postponed': { label: 'events.status.postponed', color: 'bg-yellow-100 text-yellow-800', icon: PauseCircle }
      };
      return statusMap[status] || statusMap['scheduled'];
    };

    const statusConfig = getStatusConfig(data.status);
    const StatusIcon = statusConfig.icon;

    const getEventInitials = (titleStr) => {
      if (!titleStr) return 'EV';
      return titleStr.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
      <>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20">
          <CardContent className="p-6">
            <div className={`flex items-start gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                <AvatarFallback className="bg-gradient-to-r from-teal-500 to-teal-600 text-white text-2xl">
                  {getEventInitials(title)}
                </AvatarFallback>
              </Avatar>
              
              <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {title}
                </h2>
                <div className={`flex gap-2 mb-4 flex-wrap ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                  <Badge className={`px-3 py-1 ${statusConfig.color} flex items-center gap-1`}>
                    <StatusIcon className="w-3 h-3" />
                    {t(statusConfig.label)}
                  </Badge>
                  <Badge variant="outline">{t(`events.types.${data.type}`)}</Badge>
                </div>
                <p className={`text-gray-600 dark:text-gray-400 flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                  <Calendar className="w-4 h-4" /> 
                  {formatDate(data.startDate)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {description && (
          <Card className="border-0 shadow-lg mt-4">
            <CardHeader className="pb-3">
              <CardTitle className={`text-lg flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <BookOpen className="h-5 w-5 text-indigo-600" />
                {t('events.form.description')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-gray-700 dark:text-gray-300 ${isRTL ? 'text-right' : 'text-left'}`}>
                {description}
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className={`text-base flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Clock className="h-4 w-4 text-blue-600" />
                {t('events.dateTimeInfo')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-gray-500">{t('events.form.startDate')}:</span>
                <span>{formatDate(data.startDate)} {formatTime(data.startDate)}</span>
              </div>
              <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-gray-500">{t('events.form.endDate')}:</span>
                <span>{formatDate(data.endDate)} {formatTime(data.endDate)}</span>
              </div>
              <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-gray-500">{t('events.allDay')}:</span>
                <span>{data.allDay ? t('common.yes') : t('common.no')}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className={`text-base flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <MapPin className="h-4 w-4 text-red-600" />
                {t('events.locationInfo')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-gray-500">{t('events.form.location')}:</span>
                <span>{location || '-'}</span>
              </div>
              <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-gray-500">{t('events.form.visibility')}:</span>
                <span>{t(`events.visibility.${data.visibility}`)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  };
  
  return (
    <BaseViewModal
      isOpen={isOpen}
      onClose={onClose}
      data={data}
      type="event"
      title={t('events.modal.viewTitle')}
      description={t('events.modal.viewDesc')}
      gradient="from-teal-500 to-teal-600"
      isRTL={isRTL}
      onEdit={onEdit}
      onDelete={onDelete}
      showEditButton={true}
      showDeleteButton={true} 
    >
      {renderContent()}
    </BaseViewModal>
  );
};

export default ViewEventsModal;
import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseViewModal from './BaseViewModal';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import { 
  FileText,
  Calendar,
  Clock,
  User,
  Download,
  Printer,
  Share2,
  FileBarChart,
  CheckCircle,
  AlertCircle,
  Eye,
  Users,
  BarChart,
  History
} from 'lucide-react';

const ViewReportHistoryModal = ({ 
  isOpen, 
  onClose, 
  data, 
  isRTL = false, 
  currentLanguage = 'en',
  onDownload,
  onPrint,
  onShare,
  onViewReport
}) => {
  const { t } = useTranslation();

  if (!data) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString(currentLanguage === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionIcon = (action) => {
    const iconMap = {
      'generated': FileBarChart,
      'downloaded': Download,
      'printed': Printer,
      'shared': Share2,
      'viewed': Eye,
      'exported': Download
    };
    return iconMap[action] || History;
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'completed': 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300',
      'processing': 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300',
      'failed': 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-300',
      'cancelled': 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/40 dark:text-gray-300'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    return status === 'completed' ? CheckCircle : AlertCircle;
  };

  const ActionIcon = getActionIcon(data.action);
  const statusColor = getStatusColor(data.status);
  const StatusIcon = getStatusIcon(data.status);

  const sections = [
    {
      title: 'reports.historyInfo',
      icon: History,
      color: 'text-blue-600',
      fields: [
        { key: 'action', label: 'reports.action', icon: ActionIcon },
        { key: 'description', label: 'common.description', icon: FileText },
        { key: 'timestamp', label: 'reports.timestamp', icon: Calendar },
        { key: 'status', label: 'common.status', icon: StatusIcon },
      ]
    },
    {
      title: 'reports.userInfo',
      icon: User,
      color: 'text-green-600',
      fields: [
        { key: 'performedBy', label: 'reports.performedBy', icon: User },
        { key: 'userRole', label: 'reports.form.role', icon: Users },
        { key: 'duration', label: 'reports.duration', icon: Clock },
      ]
    },
    {
      title: 'reports.reportInfo',
      icon: FileBarChart,
      color: 'text-purple-600',
      fields: [
        { key: 'reportInfo', label: 'reports.reportInfo', icon: FileBarChart },
      ]
    }
  ];

  return (
    <BaseViewModal
      isOpen={isOpen}
      onClose={onClose}
      data={data}
      type="report-history"
      title={isRTL ? 'تفاصيل سجل التقرير' : 'Report History Details'}
      description={isRTL ? 'عرض معلومات سجل التقرير الكاملة' : 'View complete report history information'}
      gradient="from-blue-500 to-blue-600"
      isRTL={isRTL}
      currentLanguage={currentLanguage}
      showEditButton={false}
      showDeleteButton={false}
      customButtons={[
        {
          label: isRTL ? 'عرض التقرير' : 'View Report',
          variant: 'outline',
          className: 'border-amber-200 dark:border-amber-700 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30',
          onClick: () => onViewReport && onViewReport(data.reportId),
          icon: Eye
        },
        {
          label: isRTL ? 'تحميل' : 'Download',
          variant: 'outline',
          className: 'border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30',
          onClick: () => onDownload && onDownload(data),
          icon: Download
        },
        {
          label: isRTL ? 'مشاركة' : 'Share',
          variant: 'outline',
          className: 'border-purple-200 dark:border-purple-700 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30',
          onClick: () => onShare && onShare(data),
          icon: Share2
        }
      ]}
    >
      {/* Header Card */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <CardContent className="p-6">
          <div className={`flex flex-col gap-4 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className={`flex items-start justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="flex-1">
                <div className={`flex items-center gap-3 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {t(`reports.actions.${data.action}`)}
                  </h2>
                  <Badge 
                    className={`text-sm px-3 py-1 font-semibold border ${statusColor} flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    <StatusIcon className="w-3 h-3" />
                    {t(`reports.status.${data.status}`)}
                  </Badge>
                </div>
                
                <p className={`text-gray-600 dark:text-gray-400 mb-4 ${isRTL ? 'text-left' : ''}`}>
                  {data.description}
                </p>
                
                <div className={`flex flex-wrap gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {formatDate(data.timestamp)}
                    </span>
                  </div>
                  
                  {data.reportId && (
                    <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50 dark:border-blue-700 dark:text-blue-300">
                      ID: {data.reportId}
                    </Badge>
                  )}
                  
                  {data.duration && (
                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {data.duration}s
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                <ActionIcon className="w-12 h-12 text-blue-600" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Information Sections */}
      {sections.map((section, sectionIndex) => (
        <Card key={sectionIndex} className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className={`text-lg font-semibold flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <section.icon className={`h-5 w-5 ${section.color}`} />
              {t(section.title)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {section.fields.map((field, fieldIndex) => {
                if (fieldIndex > 0) <Separator className="my-4" />;
                
                return (
                  <div key={field.key} className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`p-2 rounded-lg bg-gray-50 dark:bg-gray-800 ${isRTL ? 'ml-2' : 'mr-2'}`}>
                      <field.icon className="h-4 w-4 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        {t(field.label)}
                      </h4>
                      
                      {field.key === 'action' ? (
                        <Badge 
                          className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold border bg-blue-100 text-blue-800 border-blue-200`}
                        >
                          <ActionIcon className="w-3 h-3" />
                          {t(`reports.actions.${data.action}`)}
                        </Badge>
                      ) : field.key === 'description' ? (
                        <p className="text-gray-900 dark:text-white font-medium">
                          {data.description}
                        </p>
                      ) : field.key === 'timestamp' ? (
                        <p className="text-gray-900 dark:text-white font-medium">
                          {formatDate(data.timestamp)}
                        </p>
                      ) : field.key === 'status' ? (
                        <Badge 
                          className={`inline-flex items-center gap-1 px-2 py-1 ${statusColor}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {t(`reports.status.${data.status}`)}
                        </Badge>
                      ) : field.key === 'performedBy' ? (
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold">
                            {data.performedBy?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="text-gray-900 dark:text-white font-medium">
                              {data.performedBy}
                            </p>
                          </div>
                        </div>
                      ) : field.key === 'userRole' ? (
                        <p className="text-gray-900 dark:text-white font-medium">
                          {data.userRole}
                        </p>
                      ) : field.key === 'duration' ? (
                        <p className="text-gray-900 dark:text-white font-medium">
                          {data.duration}s
                        </p>
                      ) : field.key === 'reportInfo' ? (
                        <div>
                          <p className="text-gray-900 dark:text-white font-medium">
                            {data.reportTitle}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {t(`reports.reportTypes.${data.reportType}`)}
                          </p>
                        </div>
                      ) : (
                        <p className="text-gray-900 dark:text-white font-medium">
                          {data[field.key]}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Error Details Section (if failed) */}
      {data.status === 'failed' && (
        <Card className="border-0 shadow-lg border-red-200 dark:border-red-700">
          <CardHeader className="pb-3">
            <CardTitle className={`text-lg font-semibold flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <AlertCircle className="h-5 w-5 text-red-600" />
              {isRTL ? 'تفاصيل الخطأ' : 'Error Details'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <p className="text-red-700 dark:text-red-300 font-medium">
                {isRTL ? 'فشل الإجراء' : 'Action failed'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </BaseViewModal>
  );
};

export default ViewReportHistoryModal;
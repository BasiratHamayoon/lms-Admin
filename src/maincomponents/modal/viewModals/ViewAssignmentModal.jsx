import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseViewModal from './BaseViewModal';
import { Card, CardContent } from '@maincomponents/components/ui/card';
import { Badge } from '@maincomponents/components/ui/badge';
import { Button } from '@maincomponents/components/ui/button';
import { 
  Calendar,
  Users,
  FileText,
  CheckCircle,
  AlertCircle,
  Download,
  Send,
  Edit 
} from 'lucide-react';
import ViewModalSkeleton from '../../Skeletons/ViewModalSkeleton';

const getLocalizedText = (value, lang = 'en') => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    if (value[lang]) return value[lang];
    if (value.en) return value.en;
    if (value.ar) return value.ar;
    const first = Object.values(value)[0];
    if (typeof first === 'string') return first;
  }
  return String(value);
};

const ViewAssignmentModal = ({ 
  isOpen, 
  onClose, 
  data, 
  loading,
  isRTL = false,
  currentLanguage = 'en',
  onEdit,
  onPublish
}) => {
  const { t, i18n } = useTranslation();
  const lang = currentLanguage || i18n.language || 'en';

  const tr = (key) => getLocalizedText(t(key, { returnObjects: true }), lang);

  const renderContent = () => {
    if (loading) {
      return <ViewModalSkeleton />;
    }
    
    if (!data) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {tr('common.noData')}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {tr('common.noAssignmentData')}
          </p>
        </div>
      );
    }
    
    const title = getLocalizedText(data?.title, lang) || tr('common.noTitle');
    const description = getLocalizedText(data?.description, lang) || tr('common.noDescription');
    const dueDate = data?.dueDate
      ? new Date(data.dueDate).toLocaleDateString(
          lang === 'ar' ? 'ar-SA' : 'en-US',
          { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
        )
      : tr('common.noDate');
    const className = getLocalizedText(data?.classId?.name, lang) || tr('common.unknown');
    const courseName = getLocalizedText(data?.courseId?.name, lang) || tr('common.unknown');
    const isPastDue = data?.dueDate && new Date(data.dueDate) < new Date();

    const getStatusColor = (status) => {
      switch (status) {
        case 'published': 
          return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300';
        case 'draft': 
          return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800/50 dark:text-gray-300';
        case 'archived': 
          return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300';
        default: 
          return 'bg-gray-100 text-gray-800';
      }
    };

    const renderActions = () => (
      <div className="flex gap-2 mt-4">
        {data?.status === 'draft' && onPublish && (
          <Button onClick={() => onPublish(data._id)} className="bg-green-500 hover:bg-green-600">
            <Send className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {tr('common.publish')}
          </Button>
        )}
        {onEdit && (
          <Button variant="outline" onClick={() => onEdit(data)}>
            <Edit className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {tr('common.edit')}
          </Button>
        )}
      </div>
    );

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800">
            <CardContent className="p-4 flex flex-col items-center">
              <span className="text-xs text-blue-600 dark:text-blue-400 mb-1">{tr('common.totalMarks')}</span>
              <span className="text-xl font-bold">{data.totalMarks || '0'}</span>
            </CardContent>
          </Card>
          <Card className="bg-green-50 border-green-100 dark:bg-green-900/20 dark:border-green-800">
            <CardContent className="p-4 flex flex-col items-center">
              <span className="text-xs text-green-600 dark:text-green-400 mb-1">{tr('assignments.submissions')}</span>
              <span className="text-xl font-bold">{data.submissions?.length || 0}/{data.assignedTo?.length || 0}</span>
            </CardContent>
          </Card>
          <Card className="bg-purple-50 border-purple-100 dark:bg-purple-900/20 dark:border-purple-800">
            <CardContent className="p-4 flex flex-col items-center">
              <span className="text-xs text-purple-600 dark:text-purple-400 mb-1">{tr('classes.class')}</span>
              <span className="text-sm font-bold text-center">{className}</span>
            </CardContent>
          </Card>
          <Card className={`${isPastDue ? 'bg-red-50 border-red-100 dark:bg-red-900/20' : 'bg-orange-50 border-orange-100 dark:bg-orange-900/20'}`}>
            <CardContent className="p-4 flex flex-col items-center">
              <span className={`text-xs mb-1 ${isPastDue ? 'text-red-600 dark:text-red-400' : 'text-orange-600 dark:text-orange-400'}`}>
                {tr('common.status')}
              </span>
              <Badge variant="outline" className={`mt-1 ${getStatusColor(data.status)}`}>
                {tr(`status.${data.status}`) || data.status}
              </Badge>
            </CardContent>
          </Card>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-500" />
            {tr('common.description')}
          </h4>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
            {description}
          </p>
        </div>

        {data.files && data.files.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-500" />
              {tr('common.attachments')} ({data.files.length})
            </h4>
            <div className="space-y-2">
              {data.files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{file.name}</span>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <a href={file.path} download target="_blank" rel="noopener noreferrer">
                      <Download className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Calendar className={`w-4 h-4 ${isPastDue ? 'text-red-500' : ''}`} />
            <span className={isPastDue ? 'text-red-500' : ''}>{tr('common.dueDate')}: {dueDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{tr('courses.course')}: {courseName}</span>
          </div>
          {data.visibleToStudents !== undefined && (
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>{tr('common.visibleToStudents')}: {data.visibleToStudents ? tr('common.yes') : tr('common.no')}</span>
            </div>
          )}
        </div>

        {renderActions()}
      </div>
    );
  };

  return (
    <BaseViewModal
      isOpen={isOpen}
      onClose={onClose}
      title={tr('assignments.assignmentDetails')}
      description={!loading && data ? getLocalizedText(data.title, lang) : tr('common.loading')}
      type="assignment"
      gradient="from-blue-500 to-blue-600"
      isRTL={isRTL}
    >
      {renderContent()}
    </BaseViewModal>
  );
};

export default ViewAssignmentModal;
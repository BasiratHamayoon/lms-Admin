import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseViewModal from '../../modal/viewModals/BaseViewModal';
import { Card, CardContent } from '@maincomponents/components/ui/card';
import { Badge } from '@maincomponents/components/ui/badge';
import { Calendar, Users, FileText, Clock, AlertCircle, BarChart3, Clock3 } from 'lucide-react';
import ViewModalSkeleton from '../../Skeletons/ViewModalSkeleton';

const ViewQuizModal = ({ 
  isOpen, 
  onClose, 
  data,
  loading,
  isRTL = false,
  currentLanguage = 'en',
  onEdit 
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
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {t('common.noData')}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {t('common.noQuizData')}
          </p>
        </div>
      );
    }
    
    const description = data?.description?.[currentLanguage] || data?.description?.en || t('common.noDescription');
    const dueDate = data?.dueDate ? new Date(data.dueDate).toLocaleDateString(
      currentLanguage === 'ar' ? 'ar-SA' : 'en-US', 
      { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    ) : t('common.noDate');

    const getStatusColor = (status) => {
      switch (status) {
        case 'published': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300';
        case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800/50 dark:text-gray-300';
        case 'closed': return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-green-50 border-green-100 dark:bg-green-900/20 dark:border-green-800">
            <CardContent className="p-4 flex flex-col items-center">
              <span className="text-xs text-green-600 dark:text-green-400 mb-1">{t('common.totalMarks')}</span>
              <span className="text-xl font-bold">{data.totalMarks || '0'}</span>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800">
            <CardContent className="p-4 flex flex-col items-center">
              <span className="text-xs text-blue-600 dark:text-blue-400 mb-1">{t('quizzes.questions')}</span>
              <span className="text-xl font-bold">{data.questionsCount || '0'}</span>
            </CardContent>
          </Card>
          <Card className="bg-purple-50 border-purple-100 dark:bg-purple-900/20 dark:border-purple-800">
            <CardContent className="p-4 flex flex-col items-center">
              <span className="text-xs text-purple-600 dark:text-purple-400 mb-1">{t('classes.class')}</span>
              <span className="text-sm font-bold text-center">{data.classId?.name?.[currentLanguage] || data.classId?.name?.en || t('common.unknown')}</span>
            </CardContent>
          </Card>
          <Card className="bg-orange-50 border-orange-100 dark:bg-orange-900/20 dark:border-orange-800">
            <CardContent className="p-4 flex flex-col items-center">
              <span className="text-xs text-orange-600 dark:text-orange-400 mb-1">{t('common.status')}</span>
              <Badge variant="outline" className={`mt-1 ${getStatusColor(data.status)}`}>
                {t(`status.${data.status}`) || data.status}
              </Badge>
            </CardContent>
          </Card>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-green-500" />
            {t('common.description')}
          </h4>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
            {description}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{t('common.dueDate')}: {dueDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{t('courses.course')}: {data.courseId?.name?.[currentLanguage] || data.courseId?.name?.en || t('common.unknown')}</span>
          </div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            <span>{t('quizzes.submissions')}: {data.submissionsCount || '0'}/{data.totalStudents || '0'}</span>
          </div>
          {data.createdAt && (
            <div className="flex items-center gap-2">
              <Clock3 className="w-4 h-4" />
              <span>{t('common.createdAt')}: {new Date(data.createdAt).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {data.questions && data.questions.length > 0 && (
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-green-500" />
              {t('quizzes.questions')} ({data.questions.length})
            </h4>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {data.questions.slice(0, 5).map((question, index) => (
                <div key={index} className="border rounded p-3">
                  <p className="font-medium text-sm mb-2">Q{index + 1}: {question.questionText}</p>
                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant="outline" className="text-xs">{question.questionType}</Badge>
                    <span className="text-gray-500">{question.marks} {t('quizzes.points')}</span>
                  </div>
                </div>
              ))}
              {data.questions.length > 5 && (
                <p className="text-sm text-gray-500 text-center">
                  + {data.questions.length - 5} more {t('quizzes.questions')}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  const title = !loading && data ? (data?.title?.[currentLanguage] || data?.title?.en || t('common.noTitle')) : t('common.loading');

  return (
    <BaseViewModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('quizzes.quizDetails')}
      description={title}
      type="quiz"
      gradient="from-green-500 to-green-600"
      isRTL={isRTL}
      showEditButton={!loading && !!data && !!onEdit}
      onEdit={!loading && data ? () => onEdit(data) : undefined}
    >
      {renderContent()}
    </BaseViewModal>
  );
};

export default ViewQuizModal;
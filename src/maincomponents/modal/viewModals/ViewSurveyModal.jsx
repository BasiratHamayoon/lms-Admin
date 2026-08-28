import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseViewModal from './BaseViewModal';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import ViewModalSkeleton from '../../Skeletons/ViewModalSkeleton';
import {
  HelpCircle, ListChecks, CheckCircle, XCircle, Hash
} from 'lucide-react';

const ViewSurveyModal = ({
  isOpen,
  onClose,
  data,
  loading = false,
  isRTL = false,
  currentLanguage = 'en',
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString(currentLanguage === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  const renderContent = () => {
    if (loading) {
      return <ViewModalSkeleton />;
    }

    if (!data) {
      return null;
    }

    const getQuestionText = () => data.question?.[currentLanguage] || data.question?.en || data.question?.ar || '-';
    const getCategoryLabel = (category) => t(`survey.categories.${category}`, { defaultValue: category });
    const getStatusConfig = (isActive) => isActive
      ? { label: 'survey.status.active', color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300', icon: CheckCircle }
      : { label: 'survey.status.inactive', color: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/40 dark:text-gray-300', icon: XCircle };

    const statusConfig = getStatusConfig(data.active);
    const StatusIcon = statusConfig.icon;

    return (
      <div className="space-y-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-50 dark:from-blue-900/20 dark:to-blue-900/20">
          <CardContent className="p-6">
            <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                <div className={`flex items-center gap-3 mb-2 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {getQuestionText()}
                  </h2>
                  <Badge className={`text-sm px-3 py-1 font-semibold border flex items-center gap-1 ${statusConfig.color}`}>
                    <StatusIcon className="w-3 h-3" />
                    {t(statusConfig.label)}
                  </Badge>
                </div>
                <div className={`flex flex-wrap gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center gap-2 text-gray-600 dark:text-gray-400 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <ListChecks className="h-4 w-4" />
                    <span className="text-sm">{getCategoryLabel(data.category)}</span>
                  </div>
                  <div className={`flex items-center gap-2 text-gray-600 dark:text-gray-400 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Hash className="h-4 w-4" />
                    <span className="text-sm">{t('survey.form.weight', { defaultValue: 'Weight' })}: {data.weight}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className={`text-lg font-semibold flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <HelpCircle className="h-5 w-5 text-blue-600" />
              {t('survey.questionInfo', { defaultValue: 'Question Information' })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('survey.form.questionText')}</p>
                <p className="font-medium text-gray-900 dark:text-white">{getQuestionText()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('survey.form.category')}</p>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">{getCategoryLabel(data.category)}</Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('survey.form.weight')}</p>
                <p className="font-medium text-gray-900 dark:text-white">{data.weight}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('survey.form.isActive')}</p>
                <Badge className={`flex items-center gap-1 w-fit ${statusConfig.color}`}>
                  <StatusIcon className="w-3 h-3" />
                  {t(statusConfig.label)}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('survey.form.createdAt')}</p>
                <p className="font-medium text-gray-900 dark:text-white">{formatDate(data.createdAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <BaseViewModal
      isOpen={isOpen}
      onClose={onClose}
      data={data}
      type="survey"
      title={t('survey.modal.viewTitle')}
      description={t('survey.modal.viewDesc')}
      gradient="from-blue-500 to-blue-600"
      isRTL={isRTL}
      onEdit={() => onEdit(data)}
      onDelete={() => onDelete(data._id)}
      showEditButton={true}
      showDeleteButton={true}
    >
      {renderContent()}
    </BaseViewModal>
  );
};

export default ViewSurveyModal;
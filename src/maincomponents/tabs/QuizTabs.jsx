import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@maincomponents/components/ui/tabs';
import { BookOpen, Users } from 'lucide-react';
import QuizTable from '@maincomponents/tables/QuizTable';
import QuizSubmissionTable from '@maincomponents/tables/QuizSubmissionTable';

const QuizTabs = ({
  activeTab,
  onTabChange,
  quizzes = [],
  submissions = [],
  onViewQuiz,
  onEditQuiz,
  onDeleteQuiz,
  onPublishQuiz,
  onCloseQuiz,
  onGradeSubmission,
  isRTL = false,
  currentLanguage = 'en',
  metaData = {},
  loading = {},
  filters = {},
  onFilterChange,
  onClearFilters,
  pagination = {},
  onPageChange,
  onPageSizeChange,
  submissionFilters = {},
  onSubmissionFilterChange,
  submissionPagination = {},
  onSubmissionPageChange,
  onSubmissionPageSizeChange
}) => {
  const { t } = useTranslation();

  // Define tabs in order - quizzes first, submissions second
  // In RTL mode, CSS dir="rtl" will automatically place the first item on the right
  // So quizzes will appear on the right (first in RTL reading order)
  // and submissions will appear on the left (second in RTL reading order)
  const tabs = [
    {
      value: 'quizzes',
      icon: BookOpen,
      label: t('sidebar.quizzes')
    },
    {
      value: 'submissions',
      icon: Users,
      label: t('quizzes.submissions')
    }
  ];

  // DO NOT reverse tabs for RTL - let CSS grid with dir="rtl" handle the visual order
  // This ensures quizzes appears first (on the right) in RTL mode
  const orderedTabs = tabs;

  return (
    <Tabs 
      value={activeTab} 
      onValueChange={onTabChange} 
      className="w-full"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <TabsList 
        className={`grid w-full grid-cols-2 mb-6 ${isRTL ? 'direction-rtl' : ''}`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {orderedTabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <TabsTrigger 
              key={tab.value}
              value={tab.value} 
              className={`flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <IconComponent className="w-4 h-4" />
              {tab.label}
            </TabsTrigger>
          );
        })}
      </TabsList>

      <TabsContent value="quizzes">
        <QuizTable
          data={quizzes}
          onView={onViewQuiz}
          onEdit={onEditQuiz}
          onDelete={onDeleteQuiz}
          onPublish={onPublishQuiz}
          onClose={onCloseQuiz}
          loading={loading.quizzes}
          isRTL={isRTL}
          currentLanguage={currentLanguage}
          metaData={metaData}
          filters={filters}
          onFilterChange={onFilterChange}
          onClearFilters={onClearFilters}
          pagination={pagination}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          showPagination={true}
        />
      </TabsContent>

      <TabsContent value="submissions">
        <QuizSubmissionTable
          data={submissions}
          onGrade={onGradeSubmission}
          loading={loading.submissions || loading.details}
          isRTL={isRTL}
          currentLanguage={currentLanguage}
          showPagination={true}
          filters={submissionFilters}
          onFilterChange={onSubmissionFilterChange}
          pagination={submissionPagination}
          onPageChange={onSubmissionPageChange}
          onPageSizeChange={onSubmissionPageSizeChange}
        />
      </TabsContent>
    </Tabs>
  );
};

export default memo(QuizTabs);
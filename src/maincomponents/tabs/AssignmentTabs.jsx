
import React from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@maincomponents/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import { FileText, CheckSquare } from 'lucide-react';
import SubmissionTable from '../tables/SubmissionTable';
import AssignmentTable from '../tables/AssignmentTable';
import { ANIMATION_CONFIG } from '../../data/Constants';

const AssignmentTabs = ({
  activeTab,
  onTabChange,
  assignments = [],
  submissions = [],
  onViewAssignment,
  onEditAssignment,
  onDeleteAssignment,
  onPublishAssignment,
  onAssignStudents,
  onGradeSubmission,
  onViewSubmission,
  isRTL = false,
  currentLanguage = 'en',
  metaData = {},
  loading = {},
  
  filters = {},
  onFilterChange,
  onSearchChange,
  pagination = {},
  onPageChange,
  onPageSizeChange
}) => {
  const { t } = useTranslation();

  return (
    <Tabs 
      value={activeTab} 
      onValueChange={onTabChange} 
      className="space-y-6 w-full"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          delay: 0.3,
          duration: ANIMATION_CONFIG?.duration?.normal || 0.3,
          ease: ANIMATION_CONFIG?.ease?.smooth || 'easeOut'
        }}
      >
        <TabsList className={`grid w-full grid-cols-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <TabsTrigger 
            value="assignments" 
            className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <FileText className="w-4 h-4" />
            {t('sidebar.assignments')}
          </TabsTrigger>
          <TabsTrigger 
            value="submissions" 
            className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <CheckSquare className="w-4 h-4" />
            {t('assignments.submissions')}
          </TabsTrigger>
        </TabsList>
      </motion.div>
      
      <TabsContent value="assignments" className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: 0.4,
            duration: ANIMATION_CONFIG?.duration?.normal || 0.3,
            ease: ANIMATION_CONFIG?.ease?.smooth || 'easeOut'
          }}
          className="col-span-full"
        >
          <AssignmentTable
            data={assignments}
            onView={onViewAssignment}
            onEdit={onEditAssignment}
            onDelete={onDeleteAssignment}
            onPublish={onPublishAssignment}
            onAssignStudents={onAssignStudents}
            isRTL={isRTL}
            currentLanguage={currentLanguage}
            metaData={metaData}
            loading={loading.assignments}
            
            filters={filters}
            onFilterChange={onFilterChange}
            onSearchChange={onSearchChange}
            pagination={pagination}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            useServerSide={true}  
          />
        </motion.div>
      </TabsContent>
      
      <TabsContent value="submissions" className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: 0.4,
            duration: ANIMATION_CONFIG?.duration?.normal || 0.3,
            ease: ANIMATION_CONFIG?.ease?.smooth || 'easeOut'
          }}
          className="col-span-full"
        >
          <SubmissionTable
            data={submissions}
            onGrade={onGradeSubmission}
            onView={onViewSubmission}
            isRTL={isRTL}
            currentLanguage={currentLanguage}
            loading={loading.submissions}
          />
        </motion.div>
      </TabsContent>
    </Tabs>
  );
};

export default AssignmentTabs;
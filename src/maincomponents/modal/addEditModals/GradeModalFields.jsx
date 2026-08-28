// src/components/modal/addEditModals/GradeModalFields.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@maincomponents/components/ui/input';
import { Label } from '@maincomponents/components/ui/label';
import { Textarea } from '@maincomponents/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@maincomponents/components/ui/select';
import { Card, CardContent } from '@maincomponents/components/ui/card';
import { Badge } from '@maincomponents/components/ui/badge';
import { User, FileText, Calendar, Download } from 'lucide-react';

const GradeModalFields = ({ 
  formData, 
  handleChange, 
  isRTL = false,
  maxMarks = 100,
  submission = null
}) => {
  const { t } = useTranslation();

  const renderSubmissionInfo = () => {
    if (!submission) return null;

    return (
      <Card className="mb-6 bg-gray-50 dark:bg-gray-800">
        <CardContent className="p-4">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-500" />
            {t('assignments.submissionDetails')}
          </h4>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">{t('common.student')}:</span>
              <p className="font-medium">
                {submission.student?.displayName || submission.student?.name?.en || t('common.unknown')}
              </p>
            </div>
            <div>
              <span className="text-gray-500">{t('common.email')}:</span>
              <p className="font-medium">{submission.student?.email || '-'}</p>
            </div>
            <div>
              <span className="text-gray-500">{t('common.submittedOn')}:</span>
              <p className="font-medium">
                {submission.submissionDate 
                  ? new Date(submission.submissionDate).toLocaleDateString()
                  : '-'
                }
              </p>
            </div>
            <div>
              <span className="text-gray-500">{t('common.status')}:</span>
              <Badge variant="outline" className="ml-2">
                {t(`status.${submission.status}`) || submission.status}
              </Badge>
            </div>
          </div>

          {/* Submission Files */}
          {submission.files && submission.files.length > 0 && (
            <div className="mt-4">
              <span className="text-gray-500 text-sm">{t('common.submittedFiles')}:</span>
              <div className="mt-2 space-y-1">
                {submission.files.map((file, index) => (
                  <a
                    key={index}
                    href={file.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 bg-white dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <FileText className="w-4 h-4 text-blue-500" />
                    <span className="text-sm flex-1">{file.name}</span>
                    <Download className="w-4 h-4 text-gray-400" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Student Comment */}
          {submission.comment && (
            <div className="mt-4">
              <span className="text-gray-500 text-sm">{t('common.studentComment')}:</span>
              <p className="mt-1 text-sm bg-white dark:bg-gray-700 p-2 rounded">
                {submission.comment}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {renderSubmissionInfo()}

      {/* Grading Section */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t('common.marks')}</Label>
          <div className="relative">
            <Input
              type="number"
              value={formData.marks}
              onChange={(e) => handleChange('marks', e.target.value)}
              max={maxMarks}
              min={0}
              className={isRTL ? 'text-left pr-16' : 'text-right pl-16'}
              placeholder="0"
            />
            <span className={`absolute top-1/2 -translate-y-1/2 text-gray-400 text-sm ${
              isRTL ? 'left-3' : 'right-3'
            }`}>
              / {maxMarks}
            </span>
          </div>
          {formData.marks && (
            <p className="text-xs text-gray-500">
              {t('common.percentage')}: {((formData.marks / maxMarks) * 100).toFixed(1)}%
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>{t('common.status')}</Label>
          <Select 
            value={formData.status || 'graded'} 
            onValueChange={(v) => handleChange('status', v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="graded">{t('status.graded')}</SelectItem>
              <SelectItem value="returned">{t('status.returned')}</SelectItem>
              <SelectItem value="resubmit">{t('status.resubmitRequired')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="space-y-4">
        <Label className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-500" />
          {t('common.feedback')}
        </Label>
        
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500">English</span>
            </div>
            <Textarea
              value={formData.feedback?.en || ''}
              onChange={(e) => handleChange('feedback', { 
                ...formData.feedback, 
                en: e.target.value 
              })}
              placeholder="Feedback (English)"
              className="min-h-[80px]"
              dir="ltr"
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500">العربية</span>
            </div>
            <Textarea
              value={formData.feedback?.ar || ''}
              onChange={(e) => handleChange('feedback', { 
                ...formData.feedback, 
                ar: e.target.value 
              })}
              placeholder="ملاحظات (عربي)"
              className="min-h-[80px] text-right"
              dir="rtl"
            />
          </div>
        </div>
      </div>

      {/* Quick Feedback Templates */}
      <div className="space-y-2">
        <Label className="text-xs text-gray-500">{t('common.quickFeedback')}</Label>
        <div className="flex flex-wrap gap-2">
          {['Excellent work!', 'Good effort', 'Needs improvement', 'Please revise'].map((template) => (
            <button
              key={template}
              type="button"
              onClick={() => handleChange('feedback', { 
                ...formData.feedback, 
                en: template 
              })}
              className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {template}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GradeModalFields;
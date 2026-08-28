import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Button } from '../../components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { Card, CardContent } from '../../components/ui/card';
import { Trash2, Plus, FileSpreadsheet, Upload, X, AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '../../components/ui/alert';

// ==================== UTILITY FUNCTIONS ====================

const ensureString = (val) => {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'number' || typeof val === 'boolean') return String(val);
  if (typeof val === 'object' && val.type && val.data) return '';
  if (typeof val === 'object' && typeof val.toString === 'function') {
    const str = val.toString();
    if (str !== '[object Object]') return str;
  }
  return '';
};

const extractName = (nameObj, isRTL = false) => {
  try {
    if (!nameObj) return '';
    if (typeof nameObj === 'string') return nameObj;
    if (nameObj.type && nameObj.data) return '';
    
    if (nameObj.en || nameObj.ar) {
      const localizedName = isRTL ? (nameObj.ar || nameObj.en) : (nameObj.en || nameObj.ar);
      if (typeof localizedName === 'string') return localizedName;
      if (localizedName && typeof localizedName === 'object') {
        if (localizedName.type && localizedName.data) return '';
        if (localizedName.firstName !== undefined || localizedName.lastName !== undefined) {
          const first = ensureString(localizedName.firstName);
          const last = ensureString(localizedName.lastName);
          return `${first} ${last}`.trim();
        }
      }
    }
    
    if (nameObj.firstName !== undefined || nameObj.lastName !== undefined) {
      const first = ensureString(nameObj.firstName);
      const last = ensureString(nameObj.lastName);
      return `${first} ${last}`.trim();
    }
    
    return '';
  } catch (error) {
    console.error('Error in extractName:', error);
    return '';
  }
};

const StudentGradeModalFields = ({ 
  formData = {}, 
  handleChange = () => {}, 
  additionalData = {},
  isRTL = false,
  onClassChange = null,
  mode = 'add' // 'add', 'edit', or 'upload'
}) => {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  
  const studentList = additionalData.studentList || [];
  const courseList = additionalData.courseList || [];
  const classList = additionalData.classList || [];
  const studentsLoading = additionalData.studentsLoading || false;
  const optionsLoading = additionalData.optionsLoading || false;

  // Determine if we're in edit mode
  const isEditMode = mode === 'edit';
  const isUploadMode = mode === 'upload';

  // ==================== HELPER FUNCTIONS ====================

  const getName = useCallback((item) => {
    try {
      if (!item) return '';
      if (typeof item === 'string') return item;
      if (item.type && item.data) return '';
      
      const sources = [item.displayName, item.label, item.nameLabel, item.name];
      
      for (const source of sources) {
        if (typeof source === 'string' && source.trim()) return source;
        if (source && typeof source === 'object') {
          const extracted = extractName(source, isRTL);
          if (extracted) return extracted;
        }
      }
      
      if (item.email) return ensureString(item.email);
      if (item.code) return ensureString(item.code);
      
      return '';
    } catch (e) {
      console.error('Error in getName:', e);
      return '';
    }
  }, [isRTL]);

  const getStudentDisplayInfo = useCallback((student) => {
    const name = getName(student) || 'Unknown Student';
    const studentId = ensureString(student?.id);
    const rollNumber = ensureString(student?.rollNumber);
    
    let display = name;
    if (studentId) display += ` (${studentId})`;
    else if (rollNumber) display += ` - Roll: ${rollNumber}`;
    
    return display;
  }, [getName]);

  // ==================== LOCAL STATE ====================

  const [newManualAssessment, setNewManualAssessment] = useState({
    name: '', type: 'exam', maxMarks: 100, obtainedMarks: 0, remarks: ''
  });

  // Tab mode - for edit mode, always use 'manual', for upload use 'excel'
  const [tabMode, setTabMode] = useState(() => {
    if (isUploadMode) return 'excel';
    if (isEditMode) return 'manual';
    return formData?.file ? 'excel' : 'manual';
  });

  // Update tab mode when mode changes
  useEffect(() => {
    if (isUploadMode) {
      setTabMode('excel');
    } else if (isEditMode) {
      setTabMode('manual');
    }
  }, [mode, isEditMode, isUploadMode]);

  // Fetch students when classId changes (for edit mode, we need to load students)
  useEffect(() => {
    if (isEditMode && formData.classId && onClassChange) {
      onClassChange(formData.classId);
    }
  }, [isEditMode, formData.classId, onClassChange]);

  // ==================== HANDLERS ====================

  const handleClassSelect = (classId) => {
    handleChange('classId', classId);
    
    // Only clear student if not in edit mode
    if (!isEditMode) {
      handleChange('studentId', '');
    }
    
    if (onClassChange) {
      onClassChange(classId);
    }
  };

  const addManualAssessment = () => {
    if (!newManualAssessment.name) return;
    
    const maxMarks = Number(newManualAssessment.maxMarks) || 100;
    const obtainedMarks = Number(newManualAssessment.obtainedMarks) || 0;
    const calculatedPercentage = maxMarks > 0 ? (obtainedMarks / maxMarks) * 100 : 0;
    
    const assessmentObj = {
      ...newManualAssessment,
      maxMarks,
      obtainedMarks,
      percentage: calculatedPercentage,
      date: new Date()
    };
    
    const currentAssessments = formData.assessments || [];
    const updatedAssessments = [...currentAssessments, assessmentObj];
    
    handleChange('assessments', updatedAssessments);
    calculateTotals(updatedAssessments);
    
    setNewManualAssessment({ name: '', type: 'exam', maxMarks: 100, obtainedMarks: 0, remarks: '' });
  };

  const removeManualAssessment = (index) => {
    const updated = [...(formData.assessments || [])];
    updated.splice(index, 1);
    handleChange('assessments', updated);
    calculateTotals(updated);
  };

  const updateAssessment = (index, field, value) => {
    const updated = [...(formData.assessments || [])];
    updated[index] = { ...updated[index], [field]: value };
    
    // Recalculate percentage for this assessment
    if (field === 'obtainedMarks' || field === 'maxMarks') {
      const maxMarks = Number(field === 'maxMarks' ? value : updated[index].maxMarks) || 100;
      const obtainedMarks = Number(field === 'obtainedMarks' ? value : updated[index].obtainedMarks) || 0;
      updated[index].percentage = maxMarks > 0 ? (obtainedMarks / maxMarks) * 100 : 0;
    }
    
    handleChange('assessments', updated);
    calculateTotals(updated);
  };

  const calculateTotals = (assessments) => {
    const total = assessments.reduce((acc, curr) => acc + Number(curr.maxMarks || 0), 0);
    const obtained = assessments.reduce((acc, curr) => acc + Number(curr.obtainedMarks || 0), 0);
    const pct = total > 0 ? (obtained / total) * 100 : 0;
    
    const getGrade = (p) => {
      if (p >= 90) return "A+";
      if (p >= 80) return "A";
      if (p >= 70) return "B";
      if (p >= 60) return "C";
      if (p >= 50) return "D";
      return "F";
    };

    handleChange('totalMarks', total);
    handleChange('obtainedMarks', obtained);
    handleChange('percentage', pct.toFixed(2));
    handleChange('grade', getGrade(pct));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) handleChange('file', file);
  };

  const removeFile = () => {
    handleChange('file', null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleExcelAssessmentChange = (field, value) => {
    const currentMeta = formData.assessment || { name: '', type: 'exam', maxMarks: 100 };
    handleChange('assessment', { ...currentMeta, [field]: value });
  };

  // ==================== RENDER ====================

  return (
    <div className="space-y-6">
      {/* Mode Indicator for Edit */}
      {isEditMode && (
        <Alert className="bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            {t('grade.editingGrade') || 'You are editing an existing grade record.'}
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={tabMode} onValueChange={setTabMode} className="w-full">
        {/* Hide tabs in edit mode - only show manual entry */}
        {!isEditMode && (
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="manual">{t('grade.manualEntry') || 'Single Entry'}</TabsTrigger>
            <TabsTrigger value="excel">{t('grade.excelUpload') || 'Bulk Upload (Excel)'}</TabsTrigger>
          </TabsList>
        )}

        {/* Common Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border">
          
          {/* Class Select */}
          <div>
            <Label>{t('grade.form.class')} <span className="text-red-500">*</span></Label>
            <Select 
              value={ensureString(formData.classId)} 
              onValueChange={handleClassSelect}
              disabled={optionsLoading || isEditMode} // Disable in edit mode
            >
              <SelectTrigger className={isEditMode ? 'bg-gray-100 dark:bg-gray-700' : ''}>
                <SelectValue placeholder={t('grade.form.selectClass')} />
              </SelectTrigger>
              <SelectContent>
                {classList.map((c) => {
                  const id = ensureString(c._id || c.value);
                  const displayName = ensureString(c.label) || getName(c) || 'Unknown Class';
                  return (
                    <SelectItem key={id} value={id}>
                      {displayName}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {isEditMode && (
              <p className="text-xs text-gray-500 mt-1">Class cannot be changed in edit mode</p>
            )}
          </div>

          {/* Course Select */}
          <div>
            <Label>{t('grade.form.course')} <span className="text-red-500">*</span></Label>
            <Select 
              value={ensureString(formData.courseId)} 
              onValueChange={(v) => handleChange('courseId', v)}
              disabled={optionsLoading || isEditMode} // Disable in edit mode
            >
              <SelectTrigger className={isEditMode ? 'bg-gray-100 dark:bg-gray-700' : ''}>
                <SelectValue placeholder={t('grade.form.selectCourse')} />
              </SelectTrigger>
              <SelectContent>
                {courseList.map((c) => {
                  const id = ensureString(c._id || c.value);
                  const displayName = ensureString(c.nameLabel || c.code) || getName(c) || 'Unknown Course';
                  return (
                    <SelectItem key={id} value={id}>
                      {displayName}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {isEditMode && (
              <p className="text-xs text-gray-500 mt-1">Course cannot be changed in edit mode</p>
            )}
          </div>

          {/* Academic Year */}
          <div>
            <Label>{t('grade.form.academicYear')} <span className="text-red-500">*</span></Label>
            <Input 
              value={ensureString(formData.academicYear)} 
              onChange={(e) => handleChange('academicYear', e.target.value)} 
              placeholder="e.g. 2023-2024"
              disabled={isEditMode}
              className={isEditMode ? 'bg-gray-100 dark:bg-gray-700' : ''}
            />
          </div>

          {/* Term Select */}
          <div>
            <Label>{t('grade.form.term')} <span className="text-red-500">*</span></Label>
            <Select 
              value={ensureString(formData.term) || 'first'} 
              onValueChange={(v) => handleChange('term', v)}
              disabled={isEditMode}
            >
              <SelectTrigger className={isEditMode ? 'bg-gray-100 dark:bg-gray-700' : ''}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="first">{t('grade.terms.first')}</SelectItem>
                <SelectItem value="second">{t('grade.terms.second')}</SelectItem>
                <SelectItem value="third">{t('grade.terms.third')}</SelectItem>
                <SelectItem value="final">{t('grade.terms.final')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ==================== MANUAL MODE ==================== */}
        <TabsContent value="manual" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Student Dropdown */}
            <div>
              <Label>
                {t('grade.form.student')} <span className="text-red-500">*</span>
                {formData.classId && !studentsLoading && !isEditMode && (
                  <span className="text-xs text-gray-500 ml-2">
                    ({studentList.length} available)
                  </span>
                )}
              </Label>
              <Select 
                value={ensureString(formData.studentId)} 
                onValueChange={(v) => handleChange('studentId', v)}
                disabled={studentsLoading || !formData.classId || isEditMode}
              >
                <SelectTrigger className={isEditMode ? 'bg-gray-100 dark:bg-gray-700' : ''}>
                  {studentsLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Loading students...</span>
                    </div>
                  ) : (
                    <SelectValue placeholder={t('grade.form.selectStudent')} />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {!formData.classId ? (
                    <div className="p-3 text-center text-sm text-amber-600">
                      ⚠️ Please select a class first
                    </div>
                  ) : studentList.length === 0 && !studentsLoading ? (
                    <div className="p-3 text-center text-sm text-gray-500">
                      No students enrolled in this class
                    </div>
                  ) : (
                    studentList.map((student) => {
                      const studentId = ensureString(student._id);
                      const displayInfo = getStudentDisplayInfo(student);
                      return (
                        <SelectItem key={studentId} value={studentId}>
                          {displayInfo}
                        </SelectItem>
                      );
                    })
                  )}
                </SelectContent>
              </Select>
              {isEditMode && (
                <p className="text-xs text-gray-500 mt-1">Student cannot be changed in edit mode</p>
              )}
              {!formData.classId && !isEditMode && (
                <p className="text-xs text-amber-600 mt-1">
                  Select a class first to load students
                </p>
              )}
            </div>

            {/* Status Select */}
            <div>
              <Label>{t('grade.form.status')}</Label>
              <Select 
                value={ensureString(formData.status) || 'draft'} 
                onValueChange={(v) => handleChange('status', v)}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">{t('grade.status.draft')}</SelectItem>
                  <SelectItem value="published">{t('grade.status.published')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Assessments Section */}
          <div className="border p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
            <h3 className="font-semibold mb-3 text-sm flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-500" /> 
              {t('grade.assessments') || 'Assessments'}
              <span className="text-red-500">*</span>
              {isEditMode && (
                <span className="text-xs font-normal text-gray-500 ml-2">
                  (You can modify existing assessments or add new ones)
                </span>
              )}
            </h3>
            
            {/* Existing Assessments (Editable in Edit Mode) */}
            {(formData.assessments || []).length > 0 && (
              <div className="space-y-3 mb-4">
                <Label className="text-xs text-gray-500">
                  {isEditMode ? 'Current Assessments (click to edit)' : 'Added Assessments'}
                </Label>
                {(formData.assessments || []).map((assess, idx) => (
                  <div 
                    key={idx} 
                    className={`p-3 rounded-lg border ${
                      isEditMode 
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' 
                        : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    {isEditMode ? (
                      // Editable view for edit mode
                      <div className="grid grid-cols-12 gap-2 items-end">
                        <div className="col-span-4">
                          <Label className="text-xs">Name</Label>
                          <Input 
                            value={ensureString(assess.name)}
                            onChange={(e) => updateAssessment(idx, 'name', e.target.value)}
                            className="h-9"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label className="text-xs">Type</Label>
                          <Select 
                            value={ensureString(assess.type) || 'exam'}
                            onValueChange={(v) => updateAssessment(idx, 'type', v)}
                          >
                            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="exam">Exam</SelectItem>
                              <SelectItem value="quiz">Quiz</SelectItem>
                              <SelectItem value="assignment">Assignment</SelectItem>
                              <SelectItem value="project">Project</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-2">
                          <Label className="text-xs">Max</Label>
                          <Input 
                            type="number"
                            value={Number(assess.maxMarks) || 0}
                            onChange={(e) => updateAssessment(idx, 'maxMarks', Number(e.target.value))}
                            className="h-9"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label className="text-xs">Obtained</Label>
                          <Input 
                            type="number"
                            value={Number(assess.obtainedMarks) || 0}
                            onChange={(e) => updateAssessment(idx, 'obtainedMarks', Number(e.target.value))}
                            className="h-9"
                          />
                        </div>
                        <div className="col-span-2 flex items-center justify-between">
                          <span className="text-sm font-bold text-blue-600">
                            {((Number(assess.obtainedMarks) / Number(assess.maxMarks)) * 100 || 0).toFixed(1)}%
                          </span>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeManualAssessment(idx)} 
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // Read-only view for add mode
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-700 dark:text-gray-200">
                            {ensureString(assess.name)}
                          </span> 
                          <span className="text-xs text-gray-400 bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded-full capitalize">
                            {ensureString(assess.type)}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-mono">
                            {Number(assess.obtainedMarks) || 0} / {Number(assess.maxMarks) || 0}
                          </span>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeManualAssessment(idx)} 
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {/* Add New Assessment Form */}
            <div className="border-t pt-4 mt-4">
              <Label className="text-xs text-gray-500 mb-2 block">Add New Assessment</Label>
              <div className="grid grid-cols-2 md:grid-cols-12 gap-2 items-end">
                <div className="col-span-2 md:col-span-4">
                  <Label className="text-xs">Assessment Name</Label>
                  <Input 
                    value={newManualAssessment.name} 
                    onChange={e => setNewManualAssessment({...newManualAssessment, name: e.target.value})} 
                    placeholder="e.g. Midterm" 
                  />
                </div>
                <div className="col-span-1 md:col-span-3">
                  <Label className="text-xs">Type</Label>
                  <Select 
                    value={newManualAssessment.type} 
                    onValueChange={v => setNewManualAssessment({...newManualAssessment, type: v})}
                  >
                    <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="exam">Exam</SelectItem>
                      <SelectItem value="quiz">Quiz</SelectItem>
                      <SelectItem value="assignment">Assignment</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-1 md:col-span-2">
                  <Label className="text-xs">Max</Label>
                  <Input 
                    type="number" 
                    value={newManualAssessment.maxMarks} 
                    onChange={e => setNewManualAssessment({...newManualAssessment, maxMarks: e.target.value})} 
                  />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <Label className="text-xs">Obtained</Label>
                  <Input 
                    type="number" 
                    value={newManualAssessment.obtainedMarks} 
                    onChange={e => setNewManualAssessment({...newManualAssessment, obtainedMarks: e.target.value})} 
                  />
                </div>
                <div className="col-span-1 md:col-span-1">
                  <Button 
                    type="button" 
                    onClick={addManualAssessment} 
                    size="icon" 
                    className="w-full"
                    disabled={!newManualAssessment.name}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Empty State */}
            {(!formData.assessments || formData.assessments.length === 0) && (
              <div className="text-center py-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800 mt-4">
                <AlertCircle className="w-5 h-5 text-amber-500 mx-auto mb-2" />
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  {t('grade.atLeastOneAssessment') || 'At least one assessment is required'}
                </p>
              </div>
            )}

            {/* Totals Summary */}
            {formData.assessments?.length > 0 && (
              <div className="mt-4 pt-3 border-t grid grid-cols-4 gap-2 text-center text-sm font-bold text-blue-600 dark:text-blue-400">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                  Total: {Number(formData.totalMarks) || 0}
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded text-green-600 dark:text-green-400">
                  Score: {Number(formData.obtainedMarks) || 0}
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded text-purple-600 dark:text-purple-400">
                  %: {ensureString(formData.percentage) || '0'}%
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded text-amber-600 dark:text-amber-400">
                  Grade: {ensureString(formData.grade) || '-'}
                </div>
              </div>
            )}
          </div>

          {/* Teacher Remarks */}
          <div>
            <Label>{t('grade.form.teacherRemarks')}</Label>
            <Textarea 
              value={ensureString(formData.teacherRemarks)} 
              onChange={(e) => handleChange('teacherRemarks', e.target.value)} 
              placeholder="Optional remarks..."
              rows={3}
            />
          </div>
        </TabsContent>

        {/* ==================== EXCEL UPLOAD MODE ==================== */}
        {!isEditMode && (
          <TabsContent value="excel" className="space-y-6">
            
            {/* Info Alert */}
            <Alert className="bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                {t('grade.excelUploadInfo') || 
                  'This will create or update grades for students found in the Excel file. The file must contain columns: studentId and obtainedMarks.'}
              </AlertDescription>
            </Alert>

            {/* Assessment Details Card */}
            <Card>
              <CardContent className="pt-6">
                <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-green-600" />
                  {t('grade.defineAssessmentDetails') || 'Define Assessment Details for this File'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <Label>
                      {t('grade.assessmentName') || 'Assessment Name'} 
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input 
                      value={ensureString(formData.assessment?.name)} 
                      onChange={(e) => handleExcelAssessmentChange('name', e.target.value)} 
                      placeholder="e.g. Final Exam" 
                    />
                  </div>
                  <div>
                    <Label>{t('grade.assessmentType') || 'Type'}</Label>
                    <Select 
                      value={ensureString(formData.assessment?.type) || 'exam'} 
                      onValueChange={(v) => handleExcelAssessmentChange('type', v)}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="exam">{t('grade.types.exam') || 'Exam'}</SelectItem>
                        <SelectItem value="quiz">{t('grade.types.quiz') || 'Quiz'}</SelectItem>
                        <SelectItem value="assignment">{t('grade.types.assignment') || 'Assignment'}</SelectItem>
                        <SelectItem value="project">{t('grade.types.project') || 'Project'}</SelectItem>
                        <SelectItem value="midterm">{t('grade.types.midterm') || 'Midterm'}</SelectItem>
                        <SelectItem value="final">{t('grade.types.final') || 'Final'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>
                      {t('grade.maxMarks') || 'Max Marks'} 
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input 
                      type="number" 
                      value={Number(formData.assessment?.maxMarks) || 100} 
                      onChange={(e) => handleExcelAssessmentChange('maxMarks', Number(e.target.value))} 
                    />
                  </div>
                  <div>
                    <Label>{t('grade.assessmentDate') || 'Date'}</Label>
                    <Input 
                      type="date" 
                      value={ensureString(formData.assessment?.date) || new Date().toISOString().split('T')[0]} 
                      onChange={(e) => handleExcelAssessmentChange('date', e.target.value)} 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* File Upload Area */}
            <div className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${
              formData.file 
                ? 'border-green-300 bg-green-50/30 dark:border-green-700 dark:bg-green-900/10' 
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50 dark:border-gray-600 dark:hover:border-blue-500'
            }`}>
              <div className="text-center">
                {!formData.file ? (
                  <>
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 mb-4">
                      <Upload className="w-8 h-8" />
                    </div>
                    <h5 className="text-base font-semibold mb-1">
                      {t('grade.uploadExcelTitle') || 'Upload Excel File'}
                    </h5>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      {t('grade.supportedFormats') || 'Supported formats: .xlsx, .xls'}
                    </p>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => fileInputRef.current?.click()}
                      className="gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      {t('grade.browseFiles') || 'Browse Files'}
                    </Button>
                  </>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border shadow-sm max-w-md mx-auto">
                    <div className="flex items-center gap-4">
                      <div className="bg-green-100 dark:bg-green-900/40 p-3 rounded-lg text-green-600 dark:text-green-400">
                        <FileSpreadsheet className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium truncate max-w-[200px]">
                          {formData.file.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {(formData.file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={removeFile} 
                      className="text-red-500 hover:text-red-600"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                )}
                
                <Input 
                  ref={fileInputRef} 
                  type="file" 
                  accept=".xlsx,.xls,.csv" 
                  className="hidden" 
                  onChange={handleFileChange} 
                />
              </div>
            </div>

            {formData.file && (
              <Card className="border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10">
                <CardContent className="pt-4">
                  <h5 className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {t('grade.readyToUpload') || 'Ready to Upload'}
                  </h5>
                  <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    <p><strong>File:</strong> {formData.file.name}</p>
                    <p><strong>Class:</strong> {
                      classList.find(c => ensureString(c._id || c.value) === formData.classId)?.label || 
                      formData.classId
                    }</p>
                    <p><strong>Assessment:</strong> {ensureString(formData.assessment?.name) || 'Not set'}</p>
                    <p><strong>Max Marks:</strong> {Number(formData.assessment?.maxMarks) || 100}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default StudentGradeModalFields;
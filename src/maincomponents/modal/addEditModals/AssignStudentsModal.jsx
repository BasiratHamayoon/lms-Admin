// src/components/modal/addEditModals/AssignStudentsModal.jsx
import React, { useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@maincomponents/components/ui/dialog';
import { Button } from '@maincomponents/components/ui/button';
import { Checkbox } from '@maincomponents/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@maincomponents/components/ui/avatar';
import { Badge } from '@maincomponents/components/ui/badge';
import { Input } from '@maincomponents/components/ui/input';
import { ScrollArea } from '@maincomponents/components/ui/scroll-area';
import { Users, Search, UserCheck, Loader2 } from 'lucide-react';

// ✅ Helper function to safely get a string from various name formats
const getStringValue = (value, lang = 'en') => {
  if (!value) return '';
  
  // If it's already a string, return it
  if (typeof value === 'string') return value;
  
  // If it's an object with language keys
  if (typeof value === 'object') {
    // Try language-specific value first
    if (value[lang] && typeof value[lang] === 'string') return value[lang];
    if (value.en && typeof value.en === 'string') return value.en;
    if (value.ar && typeof value.ar === 'string') return value.ar;
    
    // Handle nested name structure like { en: { firstName, lastName }, ar: { firstName, lastName } }
    if (value[lang] && typeof value[lang] === 'object') {
      const langObj = value[lang];
      const firstName = langObj.firstName || langObj.first || '';
      const lastName = langObj.lastName || langObj.last || '';
      return `${firstName} ${lastName}`.trim();
    }
    if (value.en && typeof value.en === 'object') {
      const enObj = value.en;
      const firstName = enObj.firstName || enObj.first || '';
      const lastName = enObj.lastName || enObj.last || '';
      return `${firstName} ${lastName}`.trim();
    }
    
    // Try firstName/lastName at root level
    if (value.firstName || value.lastName) {
      return `${value.firstName || ''} ${value.lastName || ''}`.trim();
    }
    
    // Get first string value from object
    const values = Object.values(value);
    for (const v of values) {
      if (typeof v === 'string' && v.trim()) return v;
    }
  }
  
  return String(value || '');
};

const AssignStudentsModal = ({
  isOpen,
  onClose,
  onSubmit,
  students = [],
  selectedStudentIds = [],
  onSelectionChange,
  assignment,
  isRTL = false,
  currentLanguage = 'en',
  isLoading = false
}) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = React.useState('');

  // ✅ Safe getInitials function
  const getInitials = useCallback((name) => {
    try {
      const displayName = getStringValue(name, currentLanguage);
      
      if (!displayName || displayName.length === 0) {
        return 'ST';
      }
      
      // Split by space and get first letter of each word
      const words = displayName.trim().split(/\s+/);
      if (words.length >= 2) {
        return (words[0][0] + words[1][0]).toUpperCase();
      }
      
      // If single word, get first two characters
      return displayName.substring(0, 2).toUpperCase();
    } catch (error) {
      console.warn('Error getting initials:', error, name);
      return 'ST';
    }
  }, [currentLanguage]);

  // ✅ Safe getDisplayName function
  const getDisplayName = useCallback((student) => {
    try {
      // First try displayName (already formatted by backend)
      if (student.displayName) {
        const display = getStringValue(student.displayName, currentLanguage);
        if (display) return display;
      }
      
      // Try name field
      if (student.name) {
        const name = getStringValue(student.name, currentLanguage);
        if (name) return name;
      }
      
      // Fallback to email or id
      return student.email || student.id || 'Unknown';
    } catch (error) {
      console.warn('Error getting display name:', error, student);
      return 'Unknown';
    }
  }, [currentLanguage]);

  // ✅ Safe search filter
  const filteredStudents = useMemo(() => {
    if (!students || !Array.isArray(students)) return [];
    if (!searchTerm.trim()) return students;
    
    const term = searchTerm.toLowerCase();
    return students.filter(student => {
      try {
        const name = getDisplayName(student).toLowerCase();
        const email = (student.email || '').toLowerCase();
        const id = (student.id || '').toLowerCase();
        
        return (
          name.includes(term) ||
          email.includes(term) ||
          id.includes(term)
        );
      } catch {
        return false;
      }
    });
  }, [students, searchTerm, getDisplayName]);

  // Check if all students are selected
  const allSelected = useMemo(() => {
    return filteredStudents.length > 0 && 
           filteredStudents.every(s => selectedStudentIds.includes(s._id));
  }, [filteredStudents, selectedStudentIds]);

  // Handle select all toggle
  const handleSelectAll = useCallback(() => {
    if (allSelected) {
      const filteredIds = filteredStudents.map(s => s._id);
      onSelectionChange(selectedStudentIds.filter(id => !filteredIds.includes(id)));
    } else {
      const newIds = [...new Set([...selectedStudentIds, ...filteredStudents.map(s => s._id)])];
      onSelectionChange(newIds);
    }
  }, [allSelected, filteredStudents, selectedStudentIds, onSelectionChange]);

  // Handle individual student toggle
  const handleToggleStudent = useCallback((studentId) => {
    if (selectedStudentIds.includes(studentId)) {
      onSelectionChange(selectedStudentIds.filter(id => id !== studentId));
    } else {
      onSelectionChange([...selectedStudentIds, studentId]);
    }
  }, [selectedStudentIds, onSelectionChange]);

  // ✅ Safe assignment title getter
  const getAssignmentTitle = useCallback(() => {
    if (!assignment?.title) return '';
    return getStringValue(assignment.title, currentLanguage);
  }, [assignment, currentLanguage]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-2xl max-h-[90vh] overflow-hidden"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Users className="w-5 h-5 text-blue-500" />
            {t('assignments.assignStudents')}
          </DialogTitle>
          <DialogDescription>
            {assignment && (
              <span>
                {t('assignments.assignStudentsFor')}: <strong>{getAssignmentTitle()}</strong>
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('common.searchStudents')}
              className={isRTL ? 'pr-10' : 'pl-10'}
            />
          </div>

          {/* Stats Bar */}
          <div className={`flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Checkbox 
                checked={allSelected}
                onCheckedChange={handleSelectAll}
                disabled={filteredStudents.length === 0}
              />
              <span className="text-sm font-medium">
                {t('common.selectAll')}
              </span>
            </div>
            <Badge variant="secondary" className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <UserCheck className="w-3 h-3" />
              {selectedStudentIds.length} / {students.length}
            </Badge>
          </div>

          {/* Students List */}
          <ScrollArea className="h-[400px] pr-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                <Users className="w-8 h-8 mb-2 opacity-50" />
                <p>{searchTerm ? t('common.noSearchResults') : t('common.noStudentsFound')}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredStudents.map((student) => {
                  const isSelected = selectedStudentIds.includes(student._id);
                  const displayName = getDisplayName(student);
                  const initials = getInitials(student.name || student.displayName);
                  
                  return (
                    <div
                      key={student._id}
                      onClick={() => handleToggleStudent(student._id)}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700' 
                          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                      } ${isRTL ? 'flex-row-reverse' : ''}`}
                    >
                      <Checkbox 
                        checked={isSelected}
                        onCheckedChange={() => handleToggleStudent(student._id)}
                      />
                      
                      <Avatar className="h-10 w-10 border-2 border-white shadow">
                        <AvatarImage src={student.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : 'text-left'}`}>
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {displayName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {student.email}
                        </p>
                      </div>
                      
                      {student.rollNumber && (
                        <Badge variant="outline" className="text-xs">
                          #{student.rollNumber}
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>

        <DialogFooter className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={onSubmit} 
            disabled={isLoading || selectedStudentIds.length === 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <Loader2 className={`w-4 h-4 animate-spin ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t('common.saving')}
              </>
            ) : (
              <>
                <UserCheck className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t('common.assign')} ({selectedStudentIds.length})
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignStudentsModal;
import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseViewModal from './BaseViewModal';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { User, Phone, Mail, Calendar, GraduationCap, Globe, BookOpen } from 'lucide-react';
import ViewModalSkeleton from '@maincomponents/skeletons/ViewModalSkeleton';

const ViewStudentModal = ({ isOpen, onClose, data, isLoading, isRTL, currentLanguage, onEdit, onDelete }) => {
  const { t } = useTranslation();

  const getLocString = (obj) => {
    if (!obj) return '-';
    if (typeof obj === 'string') return obj;
    return obj[currentLanguage] || obj.en || obj.ar || '-';
  };

  const renderContent = () => {
    if (isLoading) {
      return <ViewModalSkeleton />;
    }

    if (!data) {
      return (
        <div className="flex justify-center items-center p-8 h-64">
          <p className="text-muted-foreground">{t('students.messages.noData')}</p>
        </div>
      );
    }

    const getStudentFullName = (nameData) => {
      if (!nameData) return t('common.unknown');
      if (typeof nameData === 'string') return nameData;
      const langObj = nameData[currentLanguage] || nameData.en || nameData.ar;
      if (!langObj) return t('common.unknown');
      if (typeof langObj === 'object') {
          const first = langObj.firstName || '';
          const last = langObj.lastName || '';
          return `${first} ${last}`.trim() || t('common.unknown');
      }
      return String(langObj);
    };

    const fullName = getStudentFullName(data.name);
    const initials = (fullName.split(' ').map(n => n[0]).join('') || '??').slice(0, 2).toUpperCase();
    const isActive = !!data.currentEnrollment;

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-5 pb-4 border-b border-slate-200 dark:border-slate-700">
          <Avatar className="h-24 w-24 border-4 border-white dark:border-slate-800 shadow-md">
            <AvatarImage src={data.avatar} className="object-cover" />
            <AvatarFallback className="bg-indigo-600 text-white text-2xl font-bold tracking-wider">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight">
              {fullName}
            </h2>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-3 py-1">
                ID: {data.studentId || data.id}
              </Badge>
              <Badge className={`px-3 py-1 border-0 ${isActive ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}`}>
                {isActive ? t('common.active') : t('common.unassigned')}
              </Badge>
            </div>
          </div>
        </div>

        <Card className="shadow-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 pb-3 border-b border-slate-100 dark:border-slate-800">
             <CardTitle className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4"/> {t('students.personalInfo')}
             </CardTitle>
          </CardHeader>
          <CardContent className="pt-5 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
             <InfoItem icon={<Mail/>} label={t('students.form.email')} value={data.email} />
             <InfoItem icon={<Phone/>} label={t('students.form.phone')} value={data.phoneNumber} />
             <InfoItem icon={<Calendar/>} label={t('students.form.enrollmentDate')} value={data.joiningDate ? new Date(data.joiningDate).toLocaleDateString(currentLanguage === 'ar' ? 'ar-EG' : 'en-US') : '-'} />
             <InfoItem icon={<Globe/>} label={t('common.language')} value={data.languagePreference === 'en' ? 'English' : 'العربية'} />
             <InfoItem icon={<GraduationCap/>} label={t('students.form.department')} value={getLocString(data.department?.name)} />
          </CardContent>
        </Card>

        {data.currentEnrollment ? (
          <Card className="border-l-[6px] border-l-indigo-500 shadow-sm border-y border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50">
            <CardHeader className="pb-2">
               <CardTitle className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-500"/> {t('students.currentEnrollment')}
               </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
               <StatBlock label={t('students.form.class')} value={getLocString(data.currentClass)} />
               <StatBlock label={t('students.form.section')} value={getLocString(data.currentSection)} />
               <StatBlock label={t('students.form.rollNumber')} value={data.currentRollNumber} />
               <StatBlock label={t('students.form.academicYear')} value={data.currentEnrollment.academicYear} />
            </CardContent>
          </Card>
        ) : (
            <div className="p-6 bg-amber-50 dark:bg-amber-900/20 text-amber-900 dark:text-amber-200 rounded-lg border border-amber-200 dark:border-amber-800 text-sm flex items-center gap-3">
                <div className="bg-amber-100 dark:bg-amber-900/40 p-2 rounded-full"><BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-400"/></div>
                {t('students.notEnrolled')}
            </div>
        )}

        {data.enrollmentHistory && data.enrollmentHistory.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider pl-1">
              {t('students.enrollmentHistory')}
            </h3>
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-slate-100 dark:bg-slate-800">
                        <TableRow className="hover:bg-transparent border-b border-slate-200 dark:border-slate-700">
                            <TableHead className="font-bold text-slate-700 dark:text-slate-300">{t('students.form.class')}</TableHead>
                            <TableHead className="font-bold text-slate-700 dark:text-slate-300">{t('students.form.academicYear')}</TableHead>
                            <TableHead className="font-bold text-slate-700 dark:text-slate-300">{t('students.form.rollNumber')}</TableHead>
                            <TableHead className="font-bold text-slate-700 dark:text-slate-300">{t('common.status')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.enrollmentHistory.map((hist) => (
                            <TableRow key={hist._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 last:border-0">
                                <TableCell className="font-semibold text-slate-900 dark:text-slate-200">
                                  {getLocString(hist.className)}
                                   <span className="text-slate-500 dark:text-slate-400 font-normal ml-1">({getLocString(hist.section)})</span>
                                </TableCell>
                                <TableCell className="text-slate-700 dark:text-slate-300">{hist.academicYear}</TableCell>
                                <TableCell className="text-slate-700 dark:text-slate-300 font-mono">{hist.rollNumber}</TableCell>
                                <TableCell>
                                    <StatusBadge status={hist.status} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <BaseViewModal
      isOpen={isOpen}
      onClose={onClose}
      data={data}
      title={t('students.modal.viewTitle')}
      description={t('students.modal.viewDesc')}
      gradient="from-blue-500 to-blue-600"
      isRTL={isRTL}
      onEdit={onEdit && data ? () => onEdit(data) : undefined}
      onDelete={onDelete && data ? () => onDelete(data._id) : undefined}
      showEditButton={!!onEdit && !isLoading && !!data}
      showDeleteButton={!!onDelete && !isLoading && !!data}
    >
      {renderContent()}
    </BaseViewModal>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-4">
    <div className="mt-1 h-10 w-10 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-700 shadow-sm">
      {React.cloneElement(icon, { className: "w-5 h-5" })}
    </div>
    <div>
       <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">{label}</p>
       <p className="text-sm font-bold text-slate-900 dark:text-slate-100 break-all">{value || '-'}</p>
    </div>
  </div>
);

const StatBlock = ({ label, value }) => (
  <div>
     <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">{label}</p>
     <p className="font-extrabold text-xl text-slate-900 dark:text-white">{String(value) || '-'}</p>
  </div>
);

const StatusBadge = ({ status }) => {
  let styles = "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
  if (status === 'active') styles = "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800";
  if (status === 'graduated') styles = "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800";
  if (status === 'withdrawn') styles = "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
  return <Badge variant="outline" className={`capitalize border ${styles}`}>{status}</Badge>;
};

export default ViewStudentModal;
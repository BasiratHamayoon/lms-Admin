import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseViewModal from './BaseViewModal';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import { Button } from '../../components/ui/button';
import { FileText, User, Mail, Calendar, Clock, CheckCircle, XCircle, AlertCircle, Download } from 'lucide-react';
import ViewModalSkeleton from '@maincomponents/Skeletons/ViewModalSkeleton';

const ViewContractModal = ({ 
  isOpen, onClose, data, loading, isRTL = false, 
  currentLanguage = 'en', onEdit, onDelete, onDownload
}) => {
  const { t } = useTranslation();

  const renderContent = () => {
    if (loading) {
      return <ViewModalSkeleton />;
    }

    if (!data) {
      return (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">{t('contract.messages.noData')}</p>
        </div>
      );
    }
    
    // All data-dependent logic is now safely inside renderContent
    const formatDate = (dateString) => {
      if (!dateString) return '-';
      const locale = isRTL ? 'ar-EG' : 'en-US'; 
      return new Date(dateString).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
    };
    const getDaysUntilExpiry = (expiryDate) => {
      if (!expiryDate) return null;
      const diffTime = new Date(expiryDate) - new Date();
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };
    const getUserInitials = (name) => {
      if (!name) return 'T';
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };
    const getStatusFromExpiry = (expiryDate) => {
      if (!expiryDate) return 'draft';
      const daysLeft = getDaysUntilExpiry(expiryDate);
      if (daysLeft < 0) return 'expired';
      if (daysLeft <= 30) return 'expiring';
      return 'active';
    };
    const getStatusConfig = (status) => ({
      'active': { label: isRTL ? 'نشط' : 'Active', color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800', icon: CheckCircle },
      'expiring': { label: isRTL ? 'قريب الانتهاء' : 'Expiring Soon', color: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-800', icon: AlertCircle },
      'expired': { label: isRTL ? 'منتهي' : 'Expired', color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800', icon: XCircle },
      'draft': { label: isRTL ? 'مسودة' : 'Draft', color: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/40 dark:text-gray-300 dark:border-gray-800', icon: FileText }
    }[status] || { label: 'Draft', color: 'bg-gray-100 text-gray-800', icon: FileText });
    const getTypeConfig = (type) => ({
      'Contract': { label: isRTL ? 'عقد' : 'Contract', color: 'text-blue-800 dark:text-blue-200 bg-blue-100 dark:bg-blue-800', icon: FileText },
      'Agreement': { label: isRTL ? 'اتفاقية' : 'Agreement', color: 'text-purple-800 dark:text-purple-200 bg-purple-100 dark:bg-purple-800', icon: FileText },
      'NOC': { label: isRTL ? 'شهادة عدم ممانعة' : 'NOC', color: 'text-green-800 dark:text-green-200 bg-green-100 dark:bg-green-800', icon: CheckCircle },
      'Warning': { label: isRTL ? 'تحذير' : 'Warning', color: 'text-orange-800 dark:text-orange-200 bg-orange-100 dark:bg-orange-800', icon: AlertCircle }
    }[type] || { label: 'Contract', color: 'bg-blue-100 text-blue-800', icon: FileText });
    const getFileSize = (bytes) => {
      if (!bytes) return '-';
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      if (bytes === 0) return '0 Byte';
      const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
      return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    };
    const calculateDuration = () => {
      if (!data.uploadDate || !data.expiryDate) return '-';
      const diffTime = Math.abs(new Date(data.expiryDate) - new Date(data.uploadDate));
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const months = Math.floor(diffDays / 30);
      const days = diffDays % 30;
      return `${months} ${isRTL ? 'شهر' : 'months'} ${days} ${isRTL ? 'يوم' : 'days'}`;
    };

    const teacher = data.teacher || {};
    const teacherName = isRTL ? (teacher.nameAr || teacher.name || '-') : (teacher.name || teacher.nameAr || '-');
    const teacherEmail = teacher.email || '-';
    const teacherId = teacher.employeeId || '-';
    const contractStatus = getStatusFromExpiry(data.expiryDate);
    const statusConfig = getStatusConfig(contractStatus);
    const typeConfig = getTypeConfig(data.type);
    const StatusIcon = statusConfig.icon;
    const TypeIcon = typeConfig.icon;
    const daysToExpiry = getDaysUntilExpiry(data.expiryDate);

    const sections = [
      { title: isRTL ? 'معلومات المعلم' : 'Teacher Information', icon: User, color: 'text-blue-600', fields: [{ key: 'teacherName', label: isRTL ? 'اسم المعلم' : 'Teacher Name', value: teacherName, icon: User }, { key: 'employeeId', label: isRTL ? 'رقم الموظف' : 'Employee ID', value: teacherId, icon: User }, { key: 'email', label: isRTL ? 'البريد الإلكتروني' : 'Email', value: teacherEmail, icon: Mail }] },
      { title: isRTL ? 'معلومات العقد' : 'Contract Information', icon: FileText, color: 'text-green-600', fields: [{ key: 'type', label: isRTL ? 'النوع' : 'Type', value: data.type, icon: TypeIcon, isBadge: true, badgeConfig: typeConfig }, { key: 'status', label: isRTL ? 'الحالة' : 'Status', value: contractStatus, icon: StatusIcon, isBadge: true, badgeConfig: statusConfig }, { key: 'uploadDate', label: isRTL ? 'تاريخ الرفع' : 'Upload Date', value: formatDate(data.uploadDate), icon: Calendar }, { key: 'expiryDate', label: isRTL ? 'تاريخ الانتهاء' : 'Expiry Date', value: formatDate(data.expiryDate), icon: Calendar, showDaysLeft: true }, { key: 'duration', label: isRTL ? 'المدة' : 'Duration', value: calculateDuration(), icon: Clock }] },
      { title: isRTL ? 'معلومات المستند' : 'Document Information', icon: FileText, color: 'text-purple-600', fields: data.file ? [{ key: 'fileName', label: isRTL ? 'اسم الملف' : 'File Name', value: data.file.originalName || data.file.filename, icon: FileText }, { key: 'fileSize', label: isRTL ? 'حجم الملف' : 'File Size', value: getFileSize(data.file.size), icon: FileText }, { key: 'fileType', label: isRTL ? 'نوع الملف' : 'File Type', value: data.file.mimeType || '-', icon: FileText }] : [{ key: 'noFile', label: isRTL ? 'الملف' : 'File', value: isRTL ? 'لا يوجد ملف' : 'No file attached', icon: XCircle }] }
    ];

    return (
      <div dir={isRTL ? 'rtl' : 'ltr'} className="space-y-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <Avatar className="h-24 w-24 border-4 border-white dark:border-gray-800 shadow-lg"><AvatarFallback className="bg-gradient-to-r from-green-500 to-green-600 text-white text-2xl">{getUserInitials(teacherName)}</AvatarFallback></Avatar>
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white truncate max-w-full">{teacherName}</h2>
                  <div className="flex items-center gap-2">
                    <Badge className={`text-sm px-3 py-1 font-semibold border flex items-center gap-1 ${typeConfig.color}`}><TypeIcon className="w-3 h-3" />{typeConfig.label}</Badge>
                    <Badge className={`text-sm px-3 py-1 font-semibold border flex items-center gap-1 ${statusConfig.color}`}><StatusIcon className="w-3 h-3" />{statusConfig.label}</Badge>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4 flex items-center gap-2"><span dir="ltr">{teacherEmail}</span><span className="text-gray-300">•</span><span dir="ltr">{teacherId}</span></p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{isRTL ? 'تاريخ الرفع' : 'Upload Date'}</p>
                    <p className="font-medium text-gray-900 dark:text-white flex items-center gap-2"><Calendar className="h-4 w-4 text-gray-400" />{formatDate(data.uploadDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{isRTL ? 'تاريخ الانتهاء' : 'Expiry Date'}</p>
                    <p className="font-medium text-gray-900 dark:text-white flex items-center gap-2 flex-wrap">
                      <Calendar className="h-4 w-4 text-gray-400" />{formatDate(data.expiryDate)}
                      {daysToExpiry !== null && (<span className={`text-xs px-2 py-1 rounded-full ${daysToExpiry > 30 ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' : daysToExpiry > 0 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300' : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'}`}>{daysToExpiry > 0 ? `${daysToExpiry} ${isRTL ? 'يوم متبقي' : 'days left'}` : isRTL ? 'منتهي' : 'Expired'}</span>)}
                    </p>
                  </div>
                </div>
                {data.file && onDownload && (<div className="mt-4"><Button onClick={() => onDownload(data)} variant="outline" size="sm" className="flex items-center gap-2"><Download className="h-4 w-4" />{isRTL ? 'تحميل المستند' : 'Download Document'}</Button></div>)}
              </div>
            </div>
          </CardContent>
        </Card>
        {sections.map((section, sectionIndex) => (
          <Card key={sectionIndex} className="border-0 shadow-lg">
            <CardHeader className="pb-3"><CardTitle className="text-lg font-semibold flex items-center gap-2"><section.icon className={`h-5 w-5 ${section.color}`} />{section.title}</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {section.fields.map((field, fieldIndex) => {
                  if (!field.value || field.value === '-') return null;
                  return (
                    <div key={field.key}>
                      {fieldIndex > 0 && <Separator className="my-4" />}
                      <div className="flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 shrink-0"><field.icon className="h-4 w-4 text-gray-500" /></div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{field.label}</h4>
                          {field.isBadge ? (<Badge className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold border ${field.badgeConfig.color}`}><field.icon className="w-3 h-3" />{field.badgeConfig.label}</Badge>) : field.showDaysLeft && daysToExpiry !== null ? (<div className="flex items-center gap-2 flex-wrap"><p className="text-gray-900 dark:text-white font-medium">{field.value}</p><span className={`text-xs px-2 py-1 rounded-full ${daysToExpiry > 30 ? 'bg-green-100 text-green-800' : daysToExpiry > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{daysToExpiry > 0 ? `${daysToExpiry} ${isRTL ? 'يوم' : 'days'}` : isRTL ? 'منتهي' : 'Expired'}</span></div>) : (<p className="text-gray-900 dark:text-white font-medium break-words">{field.value}</p>)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
        <Card className="border-0 shadow-lg bg-gray-50 dark:bg-gray-800/50">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-500 dark:text-gray-400">
              <div><span className="font-medium">{isRTL ? 'تاريخ الإنشاء:' : 'Created:'}</span>{' '}{formatDate(data.createdAt)}</div>
              {data.updatedAt && (<div><span className="font-medium">{isRTL ? 'آخر تحديث:' : 'Last Updated:'}</span>{' '}{formatDate(data.updatedAt)}</div>)}
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
      title={t('contract.modal.viewTitle')}
      description={t('contract.modal.viewDesc')}
      gradient="from-green-500 to-green-600"
      isRTL={isRTL}
      onEdit={onEdit}
      onDelete={onDelete}
      showEditButton={!loading && !!data}
      showEmailButton={false}
      showDeleteButton={!loading && !!data}
    >
      {renderContent()}
    </BaseViewModal>
  );
};

export default ViewContractModal;
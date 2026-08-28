import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseViewModal from './BaseViewModal';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import { 
  CreditCard, 
  Calendar, 
  User, 
  FileText, 
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Banknote,
  Receipt,
  Building,
  CheckCheck
} from 'lucide-react';
import { Button } from '@maincomponents/components/ui/button';
import ViewModalSkeleton from '../../Skeletons/ViewModalSkeleton';

const ViewFeeHistoryModal = ({ 
  isOpen, 
  onClose, 
  data,
  loading,
  isRTL = false, 
  currentLanguage = 'en',
  onEdit,
  onDelete,
  showActionButtons = true
}) => {
  const { t } = useTranslation();

  const renderContent = () => {
    if (loading) {
      return <ViewModalSkeleton />;
    }

    if (!data) return null;

    const formatDate = (dateString) => {
      if (!dateString) return '-';
      return new Date(dateString).toLocaleDateString(currentLanguage === 'ar' ? 'ar-SA' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };
  
    const getUserInitials = (name) => {
      const displayName = getDisplayValue(name);
      if (!displayName) return 'S';
      return displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };
  
    const getStatusConfig = (status) => {
      const statusMap = {
        'completed': {
          label: 'fee.paymentConfirmed',
          color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800',
          icon: CheckCircle
        },
        'pending': {
          label: 'leave.status.pending',
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-800',
          icon: Clock
        },
        'failed': {
          label: 'fee.paymentFailed',
          color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800',
          icon: XCircle
        },
        'refunded': {
          label: 'fee.paymentRefunded',
          color: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-800',
          icon: AlertCircle
        }
      };
      return statusMap[status] || statusMap['pending'];
    };
  
    const getMethodIcon = (method) => {
      const iconMap = {
        'bank-transfer': Banknote,
        'cash': DollarSign,
        'cheque': FileText,
        'online': CreditCard,
        'credit-card': CreditCard
      };
      return iconMap[method] || CreditCard;
    };
  
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat(currentLanguage === 'ar' ? 'ar-SA' : 'en-US', {
        style: 'currency',
        currency: 'ILS',
        minimumFractionDigits: 0
      }).format(amount);
    };
  
    const getDisplayValue = (value) => {
      if (value === undefined || value === null) return '-';
      
      if (typeof value === 'object') {
        if (value.en !== undefined || value.ar !== undefined) {
          return currentLanguage === 'ar' ? (value.ar || value.en || '') : (value.en || value.ar || '');
        }
        if (value.name) return getDisplayValue(value.name);
        if (value.id) return value.id;
        if (value._id) return value._id;
        return JSON.stringify(value);
      }
      
      return value;
    };
  
    const statusConfig = getStatusConfig(data.status);
    const MethodIcon = getMethodIcon(data.paymentMethod);
    const StatusIcon = statusConfig.icon;
  
    const sections = [
      {
        title: 'fee.studentInfo',
        icon: User,
        color: 'text-teal-600',
        fields: [
          { key: 'student', label: 'fee.form.student', icon: User },
          { key: 'academicYear', label: 'fee.form.academicYear', icon: Calendar }
        ]
      },
      {
        title: 'fee.paymentInfo',
        icon: CreditCard,
        color: 'text-green-600',
        fields: [
          { key: 'amount', label: 'fee.paymentAmount', icon: DollarSign },
          { key: 'paymentMethod', label: 'fee.paymentMethod', icon: MethodIcon },
          { key: 'paymentDate', label: 'fee.paymentDate', icon: Calendar },
          { key: 'status', label: 'fee.paymentStatus', icon: StatusIcon }
        ]
      },
      {
        title: 'fee.transactionInfo',
        icon: CheckCheck,
        color: 'text-blue-600',
        fields: [
          { key: 'transactionId', label: 'fee.transactionId', icon: FileText },
          { key: 'receiptNumber', label: 'fee.receiptNumber', icon: Receipt },
          { key: 'component', label: 'fee.paymentForComponent', icon: FileText },
          { key: 'notes', label: 'fee.paymentNotes', icon: FileText }
        ]
      }
    ];

    return (
        <>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20">
                <CardContent className="p-6">
                <div className={`flex items-start gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Avatar className="h-20 w-20 border-4 border-white dark:border-gray-800 shadow-lg">
                    <AvatarFallback className="bg-gradient-to-r from-teal-500 to-teal-600 text-white text-xl">
                        {getUserInitials(getDisplayValue(data.studentId?.name))}
                    </AvatarFallback>
                    </Avatar>
                    
                    <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                        <div className={`flex items-center gap-3 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            {getDisplayValue(data.studentId?.name)}
                            </h2>
                            <Badge 
                            className={`text-sm px-3 py-1 font-semibold border flex items-center gap-1 ${statusConfig.color} ${isRTL ? 'flex-row-reverse' : ''}`}
                            >
                            <StatusIcon className="w-3 h-3" />
                            {t(statusConfig.label)}
                            </Badge>
                        </div>
                        
                        <div className={`flex flex-wrap gap-4 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <Badge className="flex items-center gap-1 bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/20 dark:text-teal-300">
                            <MethodIcon className="w-3 h-3" />
                            {t(`fee.paymentMethods.${data.paymentMethod}`)}
                            </Badge>
                            <Badge variant="outline" className="border-gray-300 dark:border-gray-700">
                            {getDisplayValue(data.academicYear)}
                            </Badge>
                        </div>
                        
                        <div className={`flex flex-wrap gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className={`flex items-center gap-2 text-gray-600 dark:text-gray-400 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <DollarSign className="h-4 w-4" />
                            <span className="text-lg font-bold">
                                {formatCurrency(data.amount)}
                            </span>
                            </div>
                            
                            <div className={`flex items-center gap-2 text-gray-600 dark:text-gray-400 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm">
                                {formatDate(data.paymentDate)}
                            </span>
                            </div>
                            
                            {data.transactionId && (
                            <div className={`flex items-center gap-2 text-gray-600 dark:text-gray-400 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <FileText className="h-4 w-4" />
                                <span className="text-sm font-mono">#{getDisplayValue(data.transactionId).slice(0, 8)}...</span>
                            </div>
                            )}
                        </div>
                    </div>
                </div>
                </CardContent>
            </Card>

            {sections.map((section, sectionIndex) => (
                <Card key={sectionIndex} className="border-0 shadow-lg">
                <CardHeader className="pb-3">
                    <CardTitle className={`text-lg font-semibold flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <section.icon className={`h-5 w-5 ${section.color}`} />
                    {t(section.title)}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                    {section.fields.map((field, fieldIndex) => {
                        let value;
                        if (field.key === 'student') value = data.studentId;
                        else if (field.key === 'component') value = data.componentId;
                        else value = data[field.key];
                        
                        const FieldIcon = field.icon;
                        
                        if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) return null;
                        
                        return (
                        <div key={field.key}>
                            {fieldIndex > 0 && <Separator className="my-4" />}
                            <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className={`p-2 rounded-lg bg-gray-50 dark:bg-gray-800 ${isRTL ? 'ml-2' : 'mr-2'}`}>
                                <FieldIcon className="h-4 w-4 text-gray-500" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                {t(field.label)}
                                </h4>
                                
                                {field.key === 'paymentDate' ? (
                                <p className="text-gray-900 dark:text-white font-medium">
                                    {formatDate(value)}
                                </p>
                                ) : field.key === 'status' ? (
                                <Badge 
                                    className={`inline-flex items-center gap-1 px-2 py-1 text-sm font-semibold border ${statusConfig.color}`}
                                >
                                    <StatusIcon className="w-3 h-3" />
                                    {t(statusConfig.label)}
                                </Badge>
                                ) : field.key === 'amount' ? (
                                <p className="text-gray-900 dark:text-white font-medium text-lg">
                                    {formatCurrency(value)}
                                </p>
                                ) : field.key === 'paymentMethod' ? (
                                <Badge 
                                    className="inline-flex items-center gap-1 px-2 py-1 bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/20 dark:text-teal-300"
                                >
                                    <MethodIcon className="w-3 h-3" />
                                    {t(`fee.paymentMethods.${value}`)}
                                </Badge>
                                ) : field.key === 'notes' ? (
                                <p className="text-gray-900 dark:text-white font-medium whitespace-pre-line">
                                    {getDisplayValue(value)}
                                </p>
                                ) : field.key === 'student' ? (
                                    <p className="text-gray-900 dark:text-white font-medium">
                                    {getDisplayValue(value.name)} (ID: {getDisplayValue(value.id)})
                                    </p>
                                ) : field.key === 'component' ? (
                                    <p className="text-gray-900 dark:text-white font-medium">
                                    {getDisplayValue(value.name)} ({formatCurrency(value.amount)})
                                    </p>
                                ) : (
                                <p className="text-gray-900 dark:text-white font-medium">
                                    {getDisplayValue(value)}
                                </p>
                                )}
                            </div>
                            </div>
                        </div>
                        );
                    })}
                    </div>
                </CardContent>
                </Card>
            ))}

            {data.receiptUrl && (
                <Card className="border-0 shadow-lg">
                <CardHeader className="pb-3">
                    <CardTitle className={`text-lg font-semibold flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Receipt className="h-5 w-5 text-orange-600" />
                    {t('fee.paymentProof')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded">
                        <FileText className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div className={isRTL ? 'text-right' : 'text-left'}>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {isRTL ? 'إيصال الدفع' : 'Payment Receipt'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            PDF • {(data.fileSize / 1024).toFixed(2)} KB
                        </p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => window.open(data.receiptUrl, '_blank')}
                        className="flex items-center gap-2"
                    >
                        {t('fee.downloadReceipt')}
                    </Button>
                    </div>
                </CardContent>
                </Card>
            )}
        </>
    )
  };
  
  const customButtons = [];
  if (!loading && data && showActionButtons && data.status === 'pending') {
    customButtons.push({
      label: t('fee.markAsCompleted'),
      onClick: () => console.log('Mark as completed:', data),
      variant: "default",
      className: "bg-green-600 hover:bg-green-700 text-white"
    });
  }

  return (
    <BaseViewModal
      isOpen={isOpen}
      onClose={onClose}
      data={data}
      type="fee-history"
      title={t('fee.paymentDetails')}
      description={isRTL ? 'عرض معلومات الدفعة الكاملة' : 'View complete payment information'}
      gradient="from-teal-500 to-teal-600"
      isRTL={isRTL}
      currentLanguage={currentLanguage}
      onEdit={onEdit ? () => onEdit(data) : undefined}
      onDelete={onDelete ? () => onDelete(data._id) : undefined}
      showEditButton={!loading && !!data && !!onEdit}
      showEmailButton={false}
      showDeleteButton={!loading && !!data && !!onDelete}
      customButtons={customButtons}
    >
      {renderContent()}
    </BaseViewModal>
  );
};

export default ViewFeeHistoryModal;
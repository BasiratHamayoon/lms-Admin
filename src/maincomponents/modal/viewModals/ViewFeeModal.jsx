import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseViewModal from './BaseViewModal';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import { 
  User, 
  DollarSign, 
  Calendar, 
  BookOpen,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  AlertTriangle,
  Gift,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Plus,
  Banknote
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import ViewModalSkeleton from '../../Skeletons/ViewModalSkeleton';


const ViewFeeModal = ({ 
  isOpen, 
  onClose, 
  data, 
  loading,
  isRTL = false, 
  currentLanguage = 'en',
  onEdit,
  onRecordPayment,
  onAddDiscount,
  onDelete
}) => {
  const { t } = useTranslation();

  // Helper to get method icon
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

  const renderContent = () => {
    if (loading) {
      return <ViewModalSkeleton />;
    }
  
    if (!data) return null;
  
    const getFieldValue = (fieldValue, lang = null) => {
      if (typeof fieldValue === 'string') return fieldValue;
      if (fieldValue && typeof fieldValue === 'object') {
        const displayLang = lang || currentLanguage;
        return fieldValue[displayLang] || fieldValue.en || fieldValue.ar || '';
      }
      return '';
    };
  
    const formatDate = (dateString) => {
      if (!dateString) return '-';
      return new Date(dateString).toLocaleDateString(currentLanguage === 'ar' ? 'ar-SA' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };
  
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat(currentLanguage === 'ar' ? 'ar-SA' : 'en-US', {
        style: 'currency',
        currency: 'ILS',
        minimumFractionDigits: 0
      }).format(amount);
    };
  
    const getUserInitials = (name) => {
      const displayName = getFieldValue(name);
      if (!displayName) return 'S';
      return displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };
  
    const getStatusConfig = (status) => {
      const statusMap = {
        'paid': {
          label: 'fee.status.paid',
          color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800',
          icon: CheckCircle
        },
        'pending': {
          label: 'fee.status.pending',
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-800',
          icon: Clock
        },
        'partial': {
          label: 'fee.status.partial',
          color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800',
          icon: AlertCircle
        },
        'overdue': {
          label: 'fee.status.overdue',
          color: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/40 dark:text-orange-300 dark:border-orange-800',
          icon: AlertTriangle
        },
        'waived': {
          label: 'fee.status.waived',
          color: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-800',
          icon: Gift
        }
      };
      return statusMap[status] || statusMap['pending'];
    };
  
    const sections = [
      {
        title: 'fee.studentInfo',
        icon: User,
        color: 'text-teal-600',
        fields: [
          { key: 'student', label: 'fee.form.student' },
          { key: 'class', label: 'common.className' },
          { key: 'academicYear', label: 'fee.form.academicYear', icon: Calendar }
        ]
      },
      {
        title: 'fee.feeSummary',
        icon: DollarSign,
        color: 'text-green-600',
        fields: [
          { key: 'amountSummary', label: 'fee.totalAmount', icon: DollarSign }
        ]
      },
      {
        title: 'fee.structureDetails',
        icon: BookOpen,
        color: 'text-gray-600',
        fields: [
          { key: 'feeStructure', label: 'fee.feeStructure' }
        ]
      },
      {
        title: 'fee.components',
        icon: BookOpen,
        color: 'text-blue-600',
        fields: data.components?.map((comp, index) => ({
          key: `component-${index}`,
          label: getFieldValue(comp.name),
          component: comp
        })) || []
      }
    ];

    return (
        <>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20">
                <CardContent className="p-6">
                <div className={`flex items-start gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Avatar className="h-24 w-24 border-4 border-white dark:border-gray-800 shadow-lg">
                    <AvatarFallback className="bg-gradient-to-r from-teal-500 to-teal-600 text-white text-2xl">
                        {getUserInitials(data.student?.name)}
                    </AvatarFallback>
                    </Avatar>
                    
                    <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <div className={`flex items-center gap-3 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {getFieldValue(data.student?.name)}
                        </h2>
                        <Badge variant="outline" className="border-gray-300 dark:border-gray-700">
                        {data.student?.id}
                        </Badge>
                    </div>
                    
                    <p className={`text-gray-600 dark:text-gray-400 mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                        {getFieldValue(data.class?.name)} • {data.academicYear}
                    </p>
                    
                    <div className={`flex flex-wrap gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <DollarSign className="h-4 w-4 text-teal-500" />
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                            {formatCurrency(data.totalAmount)}
                        </span>
                        </div>
                        
                        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                            {t('fee.paid')}: {formatCurrency(data.paidAmount || 0)}
                        </span>
                        </div>
                        
                        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                        <span className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                            {t('fee.pending')}: {formatCurrency(data.pendingAmount || 0)}
                        </span>
                        </div>
                    </div>
                    </div>
                </div>
                </CardContent>
            </Card>

            {sections.map((section, sectionIndex) => (
                <Card key={sectionIndex} className="border-0 shadow-lg">
                <CardHeader className="pb-3">
                    <CardTitle className={`text-lg font-semibold flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {section.icon && <section.icon className={`h-5 w-5 ${section.color}`} />}
                    {t(section.title)}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                    {section.fields.map((field, fieldIndex) => {
                        let valueToDisplay;
                        if (field.key === 'student') valueToDisplay = data.student;
                        else if (field.key === 'class') valueToDisplay = data.class;
                        else if (field.key === 'feeStructure') valueToDisplay = data.feeStructureId;
                        else valueToDisplay = data[field.key];

                        if (valueToDisplay === undefined || valueToDisplay === null) return null;

                        const FieldIcon = field.icon;
                        
                        return (
                        <div key={field.key}>
                            {fieldIndex > 0 && field.key !== 'component-0' && <Separator className="my-4" />}
                            <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            {FieldIcon && (
                                <div className={`p-2 rounded-lg bg-gray-50 dark:bg-gray-800 ${isRTL ? 'ml-2' : 'mr-2'}`}>
                                <FieldIcon className="h-4 w-4 text-gray-500" />
                                </div>
                            )}
                            <div className="flex-1">
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                {field.component ? getFieldValue(field.label) : t(field.label)}
                                </h4>
                                
                                {field.key === 'student' ? (
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-teal-100 text-teal-600 text-xs">
                                        {getUserInitials(valueToDisplay?.name)}
                                    </AvatarFallback>
                                    </Avatar>
                                    <div>
                                    <p className="text-gray-900 dark:text-white font-medium">
                                        {getFieldValue(valueToDisplay?.name)}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {valueToDisplay?.id} • {valueToDisplay?.email}
                                    </p>
                                    </div>
                                </div>
                                ) : field.key === 'class' ? (
                                <p className="text-gray-900 dark:text-white font-medium">
                                    {getFieldValue(valueToDisplay?.name)}
                                </p>
                                ) : field.key === 'feeStructure' ? (
                                <p className="text-gray-900 dark:text-white font-medium">
                                    {getFieldValue(valueToDisplay?.name)}
                                </p>
                                ) : field.key === 'academicYear' ? (
                                <p className="text-gray-900 dark:text-white font-medium">
                                    {valueToDisplay}
                                </p>
                                ) : field.key === 'amountSummary' ? (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">{t('fee.totalAmount')}</span>
                                    <span className="font-medium">{formatCurrency(data.totalAmount)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                        <TrendingUp className="w-3 h-3 text-green-500" />
                                        {t('fee.paidAmount')}
                                    </span>
                                    <span className="font-medium text-green-600 dark:text-green-400">{formatCurrency(data.paidAmount || 0)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                        <TrendingDown className="w-3 h-3 text-orange-500" />
                                        {t('fee.pendingAmount')}
                                    </span>
                                    <span className="font-medium text-orange-600 dark:text-orange-400">{formatCurrency(data.pendingAmount || 0)}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-gray-900 dark:text-white">{t('fee.balance')}</span>
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency((data.totalAmount || 0) - (data.paidAmount || 0) - (data.discounts?.reduce((sum, d) => sum + d.amount, 0) || 0))}</span>
                                    </div>
                                </div>
                                ) : field.component ? (
                                <div className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
                                    <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-gray-900 dark:text-white">{getFieldValue(field.component.name)}</span>
                                    <Badge className={`${getStatusConfig(field.component.status).color} text-xs`}>
                                        {t(`fee.status.${field.component.status}`)}
                                    </Badge>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">{t('fee.amount')}</span>
                                    <span className="font-medium">{formatCurrency(field.component.amount)}</span>
                                    </div>
                                    {field.component.paidAmount > 0 && (
                                    <div className="flex items-center justify-between text-sm mt-1">
                                        <span className="text-gray-600 dark:text-gray-400">{t('fee.paidAmount')}</span>
                                        <span className="text-green-600 dark:text-green-400">{formatCurrency(field.component.paidAmount)}</span>
                                    </div>
                                    )}
                                    {field.component.dueDate && (
                                    <div className="flex items-center justify-between text-sm mt-1">
                                        <span className="text-gray-600 dark:text-gray-400">{t('fee.dueDate')}</span>
                                        <span className="text-gray-600 dark:text-gray-400">{formatDate(field.component.dueDate)}</span>
                                    </div>
                                    )}
                                </div>
                                ) : (
                                <p className="text-gray-900 dark:text-white font-medium">
                                    {getFieldValue(valueToDisplay)}
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

            {data.discounts && data.discounts.length > 0 && (
                <Card className="border-0 shadow-lg">
                <CardHeader className="pb-3">
                    <CardTitle className={`text-lg font-semibold flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Gift className="h-5 w-5 text-purple-600" />
                    {isRTL ? 'الخصومات' : 'Discounts'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                    {data.discounts.map((discount, index) => (
                        <div key={index} className="p-3 border rounded-lg bg-purple-50 dark:bg-purple-900/20">
                        <div className="flex items-center justify-between">
                            <div>
                            <p className="font-medium text-gray-900 dark:text-white">{getFieldValue(discount.name)}</p>
                            {discount.reason && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{getFieldValue(discount.reason)}</p>
                            )}
                            </div>
                            <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                            -{formatCurrency(discount.amount)}
                            </span>
                        </div>
                        </div>
                    ))}
                    <div className="flex items-center justify-between pt-3 border-t">
                        <span className="font-semibold text-gray-900 dark:text-white">{t('fee.totalDiscounts')}</span>
                        <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        -{formatCurrency(data.discounts.reduce((sum, d) => sum + d.amount, 0))}
                        </span>
                    </div>
                    </div>
                </CardContent>
                </Card>
            )}

            {data.transactions && data.transactions.length > 0 && (
                <Card className="border-0 shadow-lg">
                <CardHeader className="pb-3">
                    <CardTitle className={`text-lg font-semibold flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <CreditCard className="h-5 w-5 text-indigo-600" />
                    {isRTL ? 'سجل الدفعات' : 'Payment History'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                    {data.transactions.map((transaction) => {
                        const statusConfig = getStatusConfig(transaction.status);
                        const MethodIcon = getMethodIcon(transaction.paymentMethod);
                        const StatusIcon = statusConfig.icon;
                        return (
                        <div key={transaction._id} className="p-3 border rounded-lg bg-indigo-50 dark:bg-indigo-900/20">
                            <div className="flex items-center justify-between mb-2">
                            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                                {formatCurrency(transaction.amount)}
                                </span>
                                <MethodIcon className="h-4 w-4 text-indigo-500" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                {t(`fee.paymentMethods.${transaction.paymentMethod}`)}
                                </span>
                            </div>
                            <Badge className={`${statusConfig.color} text-xs flex items-center gap-1`}>
                                <StatusIcon className="w-3 h-3" />
                                {t(statusConfig.label)}
                            </Badge>
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                            <span className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <Calendar className="h-3 w-3" />
                                {formatDate(transaction.paymentDate)}
                            </span>
                            {transaction.receiptNumber && (
                                <span className="font-mono text-xs">#{transaction.receiptNumber}</span>
                            )}
                            </div>
                        </div>
                        );
                    })}
                    </div>
                </CardContent>
                </Card>
            )}
        </>
    )
  };

  const customButtons = [];
  if (!loading && data) {
    customButtons.push({
      label: isRTL ? 'تسجيل دفعة' : 'Record Payment',
      icon: CreditCard,
      variant: 'outline',
      className: 'border-teal-200 dark:border-teal-700 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/30',
      onClick: () => onRecordPayment(data)
    });
    customButtons.push({
      label: isRTL ? 'إضافة خصم' : 'Add Discount',
      icon: Plus,
      variant: 'outline',
      className: 'border-purple-200 dark:border-purple-700 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30',
      onClick: () => onAddDiscount(data)
    });
  }

  return (
    <BaseViewModal
      isOpen={isOpen}
      onClose={onClose}
      data={data}
      type="fee"
      title={isRTL ? 'تفاصيل رسوم الطالب' : 'Student Fee Details'}
      description={isRTL ? 'عرض معلومات رسوم الطالب الكاملة' : 'View complete student fee information'}
      gradient="from-teal-500 to-teal-600"
      isRTL={isRTL}
      currentLanguage={currentLanguage}
      onEdit={() => onEdit(data)}
      onDelete={() => onDelete(data.id)}
      showEditButton={!loading && !!data && !!onEdit}
      showEmailButton={false}
      showDeleteButton={false} 
      customButtons={customButtons}
    >
      {renderContent()}
    </BaseViewModal>
  );
};

export default ViewFeeModal;
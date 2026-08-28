import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseViewModal from './BaseViewModal';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import { 
  User, DollarSign, Calendar, Clock, CreditCard, Building, FileText, CheckCircle, 
  XCircle, AlertCircle, Clock4, AlertTriangle, TrendingUp, TrendingDown 
} from 'lucide-react';
import ViewModalSkeleton from '@maincomponents/Skeletons/ViewModalSkeleton';

const ViewSalaryModal = ({ 
  isOpen, onClose, data, isLoading, isRTL = false, currentLanguage = 'en',
  onEdit, onProcessPayment, onDelete
}) => {
  const { t } = useTranslation();

  const renderContent = () => {
    if (isLoading) {
      return <ViewModalSkeleton />;
    }
    if (!data) {
      return null;
    }

    const formatDate = (dateString) => {
      if (!dateString) return '-';
      return new Date(dateString).toLocaleDateString(currentLanguage === 'ar' ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat(currentLanguage === 'ar' ? 'ar-SA' : 'en-US', { style: 'currency', currency: 'ILS', minimumFractionDigits: 0 }).format(amount);
    };

    const getMonthName = (month) => {
      const date = new Date();
      date.setMonth(month - 1);
      return date.toLocaleString(currentLanguage === 'ar' ? 'ar-SA' : 'en-US', { month: 'long' });
    };

    const getUserInitials = (name) => {
      if (!name) return 'U';
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const getStatusConfig = (status) => ({
      'paid': { label: 'salary.status.paid', color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800', icon: CheckCircle },
      'unpaid': { label: 'salary.status.unpaid', color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800', icon: XCircle },
      'partial': { label: 'salary.status.partial', color: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-800', icon: AlertCircle },
      'processing': { label: 'salary.status.processing', color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800', icon: Clock4 },
      'overdue': { label: 'salary.status.overdue', color: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/40 dark:text-orange-300 dark:border-orange-800', icon: AlertTriangle }
    }[status] || { label: 'salary.status.unpaid', color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle });

    const statusConfig = getStatusConfig(data.paymentStatus);
    const StatusIcon = statusConfig.icon;

    return (
      <>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
          <CardContent className="p-6">
            <div className={`flex items-start gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Avatar className="h-24 w-24 border-4 border-white dark:border-gray-800 shadow-lg">
                <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-2xl">{getUserInitials(data.teacher?.name)}</AvatarFallback>
              </Avatar>
              <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                <div className={`flex items-center gap-3 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{data.teacher?.name}</h2>
                  <Badge className={`text-sm px-3 py-1 font-semibold border flex items-center gap-1 ${statusConfig.color} ${isRTL ? 'flex-row-reverse' : ''}`}><StatusIcon className="w-3 h-3" />{t(statusConfig.label)}</Badge>
                </div>
                <p className={`text-gray-600 dark:text-gray-400 mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t(`staff.roles.${data.teacher?.role}`)} • {data.teacher?.teacherId}</p>
                <div className={`flex flex-wrap gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Calendar className="h-4 w-4 text-indigo-500" /><span className="text-sm font-medium text-gray-700 dark:text-gray-300">{getMonthName(data.month)} {data.year}</span>
                  </div>
                  <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <DollarSign className="h-4 w-4 text-green-500" /><span className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(data.amount)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3"><CardTitle className={`text-lg font-semibold flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}><DollarSign className="h-5 w-5 text-green-600" />{t('salary.financialDetails')}</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between"><span>{t('salary.form.baseAmount')}</span><span className="font-medium">{formatCurrency(data.baseAmount)}</span></div>
                {data.bonus > 0 && <div className="flex justify-between"><span className="text-green-600 flex items-center gap-1"><TrendingUp size={14}/>{t('salary.form.bonus')}</span><span className="font-medium text-green-600">+{formatCurrency(data.bonus)}</span></div>}
                {data.deductions > 0 && <div className="flex justify-between"><span className="text-red-600 flex items-center gap-1"><TrendingDown size={14}/>{t('salary.form.deductions')}</span><span className="font-medium text-red-600">-{formatCurrency(data.deductions)}</span></div>}
                <Separator/>
                <div className="flex justify-between"><span className="font-bold">{t('salary.form.amount')}</span><span className="text-lg font-bold">{formatCurrency(data.amount)}</span></div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3"><CardTitle className={`text-lg font-semibold flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}><CreditCard className="h-5 w-5 text-blue-600" />{t('salary.paymentInfo')}</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between"><span>{t('salary.form.dueDate')}</span><span className="font-medium">{formatDate(data.dueDate)}</span></div>
                <div className="flex justify-between"><span>{t('salary.form.paymentDate')}</span><span className="font-medium">{data.paymentDate ? formatDate(data.paymentDate) : '-'}</span></div>
            </CardContent>
          </Card>
        </div>
        {data.remarks && <Card className="border-0 shadow-lg mt-4"><CardHeader className="pb-3"><CardTitle className={`text-lg font-semibold flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}><FileText className="h-5 w-5 text-gray-600" />{t('common.remarks')}</CardTitle></CardHeader><CardContent><p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">{data.remarks}</p></CardContent></Card>}
      </>
    );
  };

  return (
    <BaseViewModal isOpen={isOpen} onClose={onClose} data={data} title={t('salary.modal.viewTitle')} description={t('salary.modal.viewDesc')} gradient="from-indigo-500 to-indigo-600" isRTL={isRTL} currentLanguage={currentLanguage} onEdit={onEdit} onDelete={onDelete} showEditButton={true} showDeleteButton={true}
      customButtons={data && data.paymentStatus !== 'paid' ? [{ label: t('salary.processPayment'), variant: 'outline', className: 'border-green-200 dark:border-green-700 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30', onClick: onProcessPayment }] : []}
    >
      {renderContent()}
    </BaseViewModal>
  );
};

export default ViewSalaryModal;
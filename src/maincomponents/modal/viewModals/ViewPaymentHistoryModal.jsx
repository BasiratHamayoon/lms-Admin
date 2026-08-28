import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseViewModal from './BaseViewModal';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { CreditCard, Calendar, User, FileText, DollarSign, CheckCircle, Clock, Banknote, Copy } from 'lucide-react';
import { toast } from 'sonner';
import ViewModalSkeleton from '../../Skeletons/ViewModalSkeleton';

const CopyableId = ({ label, id, t }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(id);
    toast.success(t('common.copied', { label }));
  };
  if (!id) return null;
  return (
    <div className="flex items-center gap-2 group cursor-pointer" onClick={handleCopy}>
      <span className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">#{id.toString().slice(0, 8)}...</span>
      <Copy className="h-3 w-3 text-gray-400 group-hover:text-gray-600" />
    </div>
  );
};

const ViewPaymentHistoryModal = ({ isOpen, onClose, data, isLoading, isRTL = false, currentLanguage = 'en' }) => {
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

    const getUserInitials = (name) => {
      if (!name) return 'U';
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const getStatusConfig = (status) => ({
      'completed': { label: 'salary.status.paid', color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
      'pending': { label: 'salary.status.unpaid', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock },
      'failed': { label: 'salary.paymentFailed', color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle },
    }[status] || { label: 'salary.status.unpaid', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock });

    const getMethodIcon = (method) => ({
      'bank-transfer': Banknote,
      'cash': DollarSign,
      'check': FileText,
      'online': CreditCard
    }[method] || CreditCard);

    const statusConfig = getStatusConfig(data.status);
    const MethodIcon = getMethodIcon(data.paymentMethod);
    const StatusIcon = statusConfig.icon;

    return (
      <>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
          <CardContent className="p-6">
            <div className={`flex items-start gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-xl">{getUserInitials(data.staffName)}</AvatarFallback>
              </Avatar>
              <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                <div className={`flex items-center gap-3 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{data.staffName}</h2>
                  <Badge className={`text-sm px-3 py-1 font-semibold border flex items-center gap-1 ${statusConfig.color}`}><StatusIcon className="w-3 h-3" />{t(statusConfig.label)}</Badge>
                </div>
                <div className={`flex flex-wrap gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center gap-2 text-gray-600 dark:text-gray-400 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <DollarSign className="h-4 w-4" /><span className="text-lg font-bold">{formatCurrency(data.amount)}</span>
                  </div>
                  <div className={`flex items-center gap-2 text-gray-600 dark:text-gray-400 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Calendar className="h-4 w-4" /><span className="text-sm">{formatDate(data.paymentDate)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Card>
                <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><MethodIcon className="h-4 w-4 text-blue-600"/>{t('salary.paymentMethod')}</CardTitle></CardHeader>
                <CardContent>{t(`salary.paymentMethods.${data.paymentMethod}`)}</CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><FileText className="h-4 w-4 text-purple-600"/>{t('salary.transactionInfo')}</CardTitle></CardHeader>
                <CardContent>
                    <CopyableId label={t('salary.paymentId')} id={data.id || data.paymentId} t={t} />
                    {data.transactionId && <CopyableId label={t('salary.transactionId')} id={data.transactionId} t={t} />}
                </CardContent>
            </Card>
        </div>
        {data.description && <Card className="mt-4"><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><FileText className="h-4 w-4"/>{t('common.description')}</CardTitle></CardHeader><CardContent>{data.description}</CardContent></Card>}
      </>
    );
  };

  return (
    <BaseViewModal isOpen={isOpen} onClose={onClose} data={data} title={t('salary.paymentDetails')} description={t('salary.modal.viewPaymentDesc')} gradient="from-indigo-500 to-indigo-600" isRTL={isRTL} currentLanguage={currentLanguage} showEditButton={false} showDeleteButton={false}>
      {renderContent()}
    </BaseViewModal>
  );
};

export default ViewPaymentHistoryModal;
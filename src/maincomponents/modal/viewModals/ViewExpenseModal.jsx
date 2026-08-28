import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import BaseViewModal from './BaseViewModal';
import { Avatar, AvatarFallback } from '@maincomponents/components/ui/avatar';
import { Badge } from '@maincomponents/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@maincomponents/components/ui/card';
import { Button } from '@maincomponents/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@maincomponents/components/ui/dialog';
import { FileText, DollarSign, Calendar, Building, CheckCircle, XCircle, Clock, Receipt, Download, Image as ImageIcon, File, ExternalLink, ZoomIn } from 'lucide-react';
import ViewModalSkeleton from '@maincomponents/Skeletons/ViewModalSkeleton';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ViewExpenseModal = ({ isOpen, onClose, data, isLoading = false, isRTL = false, currentLanguage = 'en', onEdit, onDelete }) => {
  const { t } = useTranslation();
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);

  const getFileUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${API_BASE_URL}/${cleanPath}`;
  };

  const handleDownload = (file) => {
    if (!file?.path) return;
    const url = getFileUrl(file.path);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', file.name || 'download');
    link.setAttribute('target', '_blank');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const renderContent = () => {
    if (isLoading) {
      return <ViewModalSkeleton />;
    }
    if (!data) {
      return null;
    }
    
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString(currentLanguage === 'ar' ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const formatCurrency = (amount) => `${amount?.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
    const getLocalized = (field) => typeof field === 'object' ? (field?.[currentLanguage] || field?.en || '') : (field || '');

    const getStatusConfig = (status) => ({
      'pending': { label: 'expense.status.pending', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock },
      'approved': { label: 'expense.status.approved', color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
      'rejected': { label: 'expense.status.rejected', color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle },
      'recorded': { label: 'expense.status.recorded', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Receipt }
    }[status] || { label: 'expense.status.pending', color: 'bg-gray-100', icon: Clock });

    const statusConfig = getStatusConfig(data.status);
    const StatusIcon = statusConfig.icon;
    const title = getLocalized(data.title);
    const departmentName = getLocalized(data.department?.name);
    const receiptFile = data.receipt?.file;
    const isImage = receiptFile?.mimetype?.startsWith('image/');

    return (
      <>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20">
          <CardContent className="p-6">
            <div className={`flex items-start gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Avatar className="h-24 w-24 border-4 border-white dark:border-gray-800 shadow-lg rounded-lg">
                <AvatarFallback className="bg-gradient-to-r from-pink-500 to-pink-600 text-white text-2xl rounded-lg"><FileText className="h-10 w-10" /></AvatarFallback>
              </Avatar>
              <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                <div className={`flex items-center gap-3 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
                  <Badge className={`text-sm px-3 py-1 font-semibold border flex items-center gap-1 ${statusConfig.color}`}><StatusIcon className="w-3 h-3" />{t(statusConfig.label)}</Badge>
                </div>
                <p className={`text-gray-600 dark:text-gray-400 mb-4 text-lg font-mono`}>{data.expenseId}</p>
                <div className={`flex flex-wrap gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400"><DollarSign size={16} /><span className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(data.amount)}</span></div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400"><Calendar size={16} /><span className="text-sm">{formatDate(data.date)}</span></div>
                  {departmentName && <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400"><Building size={16} /><span className="text-sm">{departmentName}</span></div>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {receiptFile && (
          <Card className="border-0 shadow-lg mt-4">
            <CardHeader><CardTitle className={`text-lg font-semibold flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}><Receipt size={20} className="text-pink-600" />{t('expense.receipt')}</CardTitle></CardHeader>
            <CardContent>
              {isImage ? (
                <div className="relative group rounded-lg overflow-hidden border bg-gray-50 dark:bg-gray-800/50 cursor-pointer" onClick={() => setIsImagePreviewOpen(true)}>
                  <img src={getFileUrl(receiptFile.path)} alt={receiptFile.name} className="w-full h-48 object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center"><ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" /></div>
                </div>
              ) : (
                <div className={`flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border`}>
                  <div className="flex items-center gap-3"><File size={24} className="text-blue-500" /><p>{receiptFile.name}</p></div>
                  <Button variant="outline" size="sm" onClick={() => window.open(getFileUrl(receiptFile.path), '_blank')}><ExternalLink size={16} className={isRTL ? 'ml-2' : 'mr-2'}/>{t('common.open')}</Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Dialog open={isImagePreviewOpen} onOpenChange={setIsImagePreviewOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader><DialogTitle>{receiptFile?.name}</DialogTitle></DialogHeader>
            <img src={getFileUrl(receiptFile?.path)} alt="Receipt Preview" className="w-full h-auto rounded-lg"/>
            <div className="flex gap-2 mt-4"><Button variant="outline" onClick={() => handleDownload(receiptFile)} className="flex-1"><Download size={16} className="mr-2" />{t('common.download')}</Button></div>
          </DialogContent>
        </Dialog>
      </>
    );
  };

  return (
    <BaseViewModal isOpen={isOpen} onClose={onClose} data={data} type="expense" title={t('expense.modal.viewTitle')} description={t('expense.modal.viewDesc')} gradient="from-pink-500 to-pink-600" isRTL={isRTL} onEdit={() => onEdit(data)} onDelete={() => onDelete(data._id)} showEditButton showDeleteButton>
      {renderContent()}
    </BaseViewModal>
  );
};

export default ViewExpenseModal;
import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseViewModal from './BaseViewModal';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import { 
  DollarSign, 
  Calendar, 
  BookOpen,
  Users,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Building,
  Layers,
  Tag,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import ViewModalSkeleton from '../../Skeletons/ViewModalSkeleton';

const ViewFeeStructureModal = ({ 
  isOpen, 
  onClose, 
  data, 
  loading,
  isRTL = false, 
  currentLanguage = 'en',
  onEdit,
  onDelete
}) => {
  const { t } = useTranslation();

  const renderContent = () => {
    if (loading) {
      return <ViewModalSkeleton />;
    }
  
    if (!data) return null;
  
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat(currentLanguage === 'ar' ? 'ar-SA' : 'en-US', {
        style: 'currency',
        currency: 'ILS',
        minimumFractionDigits: 0
      }).format(amount);
    };
  
    const getStatusConfig = (status) => {
      const statusMap = {
        'active': {
          label: 'fee.status.active',
          color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800',
          icon: CheckCircle2
        },
        'draft': {
          label: 'fee.status.draft',
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-800',
          icon: Clock
        },
        'archived': {
          label: 'fee.status.archived',
          color: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/40 dark:text-gray-300 dark:border-gray-800',
          icon: AlertTriangle
        }
      };
      return statusMap[status] || statusMap['draft'];
    };
  
    const getFrequencyLabel = (frequency) => {
      const frequencyMap = {
        'yearly': t('fee.frequencies.yearly'),
        'semester': t('fee.frequencies.semester'),
        'quarterly': t('fee.frequencies.quarterly'),
        'monthly': t('fee.frequencies.monthly'),
        'one-time': t('fee.frequencies.oneTime')
      };
      return frequencyMap[frequency] || frequency;
    };
  
    const getText = (value) => {
      if (!value) return '';
      if (typeof value === 'object') {
        return value[currentLanguage === 'ar' ? 'ar' : 'en'] || value.en || '';
      }
      return value;
    };
  
    const getName = () => getText(data.name);
    const getDescription = () => getText(data.description) || '';
    const getClassName = () => {
      if (!data.class) return t('fee.allClasses');
      return getText(data.class.name) || t('fee.allClasses');
    };
  
    const statusConfig = getStatusConfig(data.status);
    const StatusIcon = statusConfig.icon;
  
    const sections = [
      {
        title: 'fee.basicInfo',
        icon: FileText,
        color: 'text-teal-600',
        fields: [
          { key: 'name', label: 'fee.form.name', icon: Tag },
          { key: 'description', label: 'common.description', icon: FileText },
          { key: 'academicYear', label: 'fee.form.academicYear', icon: Calendar },
          { key: 'class', label: 'common.className', icon: Building }
        ]
      },
      {
        title: 'fee.financialInfo',
        icon: DollarSign,
        color: 'text-green-600',
        fields: [
          { key: 'totalAmount', label: 'fee.totalAmount', icon: DollarSign },
          { key: 'status', label: 'common.status', icon: StatusIcon },
          { key: 'isDefault', label: 'fee.defaultStructure', icon: CheckCircle2 }
        ]
      },
      {
        title: 'fee.components',
        icon: Layers,
        color: 'text-blue-600',
        fields: data.components?.map((comp, index) => ({
          key: `component-${index}`,
          label: comp.name,
          component: comp
        })) || []
      }
    ];

    return (
        <>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20">
                <CardContent className="p-6">
                <div className={`flex items-start gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="h-20 w-20 flex items-center justify-center rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 shadow-lg">
                    <BookOpen className="h-10 w-10 text-white" />
                    </div>
                    
                    <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <div className={`flex items-center gap-3 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {getName()}
                        </h2>
                        <Badge 
                        className={`text-sm px-3 py-1 font-semibold border flex items-center gap-1 ${statusConfig.color} ${isRTL ? 'flex-row-reverse' : ''}`}
                        >
                        <StatusIcon className="w-3 h-3" />
                        {t(statusConfig.label)}
                        </Badge>
                    </div>
                    
                    <p className={`text-gray-600 dark:text-gray-400 mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                        {data.academicYear} • {getClassName()}
                    </p>
                    
                    <div className={`flex flex-wrap gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <DollarSign className="h-4 w-4 text-teal-500" />
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                            {formatCurrency(data.totalAmount)}
                        </span>
                        </div>
                        
                        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Layers className="h-4 w-4 text-blue-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            {t('fee.components')}: {data.components?.length || 0}
                        </span>
                        </div>
                        
                        {data.isDefault && (
                        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300">
                            {t('fee.default')}
                            </Badge>
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
                    {section.icon && <section.icon className={`h-5 w-5 ${section.color}`} />}
                    {t(section.title)}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                    {section.fields.map((field, fieldIndex) => {
                        let valueToDisplay;
                        if (field.key === 'name') valueToDisplay = getName();
                        else if (field.key === 'description') valueToDisplay = getDescription();
                        else if (field.key === 'class') valueToDisplay = data.class;
                        else valueToDisplay = data[field.key];

                        if (valueToDisplay === undefined || valueToDisplay === null || (typeof valueToDisplay === 'string' && valueToDisplay.trim() === '')) return null;
                        
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
                                {field.component ? getText(field.label) : t(field.label)}
                                </h4>
                                
                                {field.key === 'name' ? (
                                <p className="text-gray-900 dark:text-white font-medium text-lg">
                                    {valueToDisplay}
                                </p>
                                ) : field.key === 'description' ? (
                                <p className="text-gray-900 dark:text-white font-medium whitespace-pre-line">
                                    {valueToDisplay}
                                </p>
                                ) : field.key === 'academicYear' ? (
                                <p className="text-gray-900 dark:text-white font-medium">
                                    {valueToDisplay}
                                </p>
                                ) : field.key === 'class' ? (
                                <p className="text-gray-900 dark:text-white font-medium">
                                    {getText(valueToDisplay.name)}
                                </p>
                                ) : field.key === 'totalAmount' ? (
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {formatCurrency(valueToDisplay)}
                                </p>
                                ) : field.key === 'status' ? (
                                <Badge 
                                    className={`inline-flex items-center gap-1 px-2 py-1 text-sm font-semibold border ${statusConfig.color}`}
                                >
                                    <StatusIcon className="w-3 h-3" />
                                    {t(statusConfig.label)}
                                </Badge>
                                ) : field.key === 'isDefault' ? (
                                <div className="flex items-center gap-2">
                                    {valueToDisplay ? (
                                    <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" />
                                        {t('fee.defaultStructure')}
                                    </Badge>
                                    ) : (
                                    <Badge variant="outline" className="border-gray-300 dark:border-gray-700 flex items-center gap-1">
                                        <XCircle className="w-3 h-3" />
                                        {t('fee.notDefault')}
                                    </Badge>
                                    )}
                                </div>
                                ) : field.component ? (
                                <div className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
                                    <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {getText(field.component.name)}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        {field.component.optional && (
                                        <Badge className="bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 text-xs">
                                            {t('fee.optional')}
                                        </Badge>
                                        )}
                                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                                        {formatCurrency(field.component.amount)}
                                        </span>
                                    </div>
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                                    <span>{getFrequencyLabel(field.component.frequency)}</span>
                                    {field.component.dueDate && (
                                        <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(field.component.dueDate).toLocaleDateString(currentLanguage === 'ar' ? 'ar-SA' : 'en-US')}
                                        </span>
                                    )}
                                    </div>
                                    {field.component.description && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                        {getText(field.component.description)}
                                    </p>
                                    )}
                                </div>
                                ) : (
                                <p className="text-gray-900 dark:text-white font-medium">
                                    {getText(valueToDisplay)}
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

            <Card className="border-0 shadow-lg">
                <CardHeader className="pb-3">
                <CardTitle className={`text-lg font-semibold flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Calendar className="h-5 w-5 text-orange-600" />
                    {t('fee.additionalInfo')}
                </CardTitle>
                </CardHeader>
                <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('fee.createdAt')}
                        </h4>
                    </div>
                    <p className="text-gray-900 dark:text-white font-medium">
                        {data.createdAt ? new Date(data.createdAt).toLocaleDateString(currentLanguage === 'ar' ? 'ar-SA' : 'en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                        }) : '-'}
                    </p>
                    </div>

                    <div className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('fee.lastUpdated')}
                        </h4>
                    </div>
                    <p className="text-gray-900 dark:text-white font-medium">
                        {data.updatedAt ? new Date(data.updatedAt).toLocaleDateString(currentLanguage === 'ar' ? 'ar-SA' : 'en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                        }) : '-'}
                    </p>
                    </div>
                </div>

                {data.description && (
                    <div className="mt-4 p-3 border rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                    <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4 text-yellow-600" />
                        <h4 className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                        {t('fee.notes')}
                        </h4>
                    </div>
                    <p className="text-yellow-800 dark:text-yellow-200 text-sm whitespace-pre-line">
                        {getDescription()}
                    </p>
                    </div>
                )}
                </CardContent>
            </Card>
        </>
    )
  };

  return (
    <BaseViewModal
      isOpen={isOpen}
      onClose={onClose}
      data={data}
      type="fee-structure"
      title={t('fee.feeStructureDetails')}
      description={isRTL ? 'عرض معلومات هيكل الرسوم الكاملة' : 'View complete fee structure information'}
      gradient="from-teal-500 to-teal-600"
      isRTL={isRTL}
      currentLanguage={currentLanguage}
      onEdit={onEdit ? () => onEdit(data) : undefined}
      onDelete={onDelete ? () => onDelete(data.id) : undefined}
      showEditButton={!loading && !!data && !!onEdit}
      showEmailButton={false}
      showDeleteButton={!loading && !!data && !!onDelete}
    >
      {renderContent()}
    </BaseViewModal>
  );
};

export default ViewFeeStructureModal;
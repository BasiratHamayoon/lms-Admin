
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { 
  Users, UserCheck, Edit, Save, X, AlertCircle,
  Pill, Coffee, CalendarDays, User, BookOpen,
  Loader2, Search, RotateCcw
} from 'lucide-react';
import TablePagination from '../Pagination/index';
import { ConfirmationModal } from '../modal/ConfirmationModal';

const QuotaManager = ({ 
  data = [], 
  onUpdate, 
  onBulkUpdate,
  isRTL = false,
  currentLanguage = 'en',
  loading = false,
  
  pagination = { total: 0, page: 1, limit: 10, pages: 0 },
  onPageChange,
  onPageSizeChange,
  searchTerm = '',
  onSearchChange,
  filters = { userRole: 'all', academicYear: 'all' },
  onFilterChange,
  onResetFilters,
  serverSide = false,
  academicYears = ['2023-2024', '2024-2025', '2025-2026']
}) => {
  const { t } = useTranslation();
  
  
  const getNameString = (name) => {
    if (!name) return 'U';
    if (typeof name === 'string') return name;
    if (typeof name === 'object') {
      return name[currentLanguage] || name.en || name.ar || 'U';
    }
    return 'U';
  };
  
  
  const [editingQuota, setEditingQuota] = useState(null);
  const [editingValues, setEditingValues] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  
  const [bulkData, setBulkData] = useState({
    userRole: '',
    academicYear: '2024-2025',
    quotas: { sick: 10, casual: 8, annual: 15 },
    notes: ''
  });
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);

  
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  const LEAVE_TYPES = {
    sick: { label: 'leave.types.sick', icon: Pill, color: 'text-red-500', bgColor: 'bg-red-50 dark:bg-red-900/20' },
    casual: { label: 'leave.types.casual', icon: Coffee, color: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
    annual: { label: 'leave.types.annual', icon: CalendarDays, color: 'text-green-500', bgColor: 'bg-green-50 dark:bg-green-900/20' }
  };

  const USER_ROLES = {
    student: { label: 'leave.roles.student' },
    teacher: { label: 'leave.roles.teacher' },
    hr: { label: 'leave.roles.hr' },
    accountant: { label: 'leave.roles.accountant' },
  };

  
  const handleSearchInputChange = (value) => {
    setLocalSearchTerm(value);
    if (serverSide && onSearchChange) {
      onSearchChange(value);
    }
  };

  
  const handleFilterChange = (key, value) => {
    if (serverSide && onFilterChange) {
      onFilterChange(key, value);
    }
  };

  
  const handleResetFilters = () => {
    setLocalSearchTerm('');
    if (serverSide && onResetFilters) {
      onResetFilters();
    }
  };

  
  const normalizeQuota = (quotas) => {
    const normalized = {};
    ['sick', 'casual', 'annual'].forEach(type => {
      if (quotas && quotas[type]) {
        normalized[type] = {
          total: quotas[type].total || 0,
          used: quotas[type].used || 0,
          pending: quotas[type].pending || 0,
          available: quotas[type].available ?? (quotas[type].total - quotas[type].used - quotas[type].pending)
        };
      } else {
        normalized[type] = { total: 0, used: 0, pending: 0, available: 0 };
      }
    });
    return normalized;
  };

  const handleEdit = (quota) => {
    const normalizedQuotas = normalizeQuota(quota.quotas);
    setEditingQuota(quota);
    setEditingValues({ ...quota, quotas: normalizedQuotas });
  };

  const handleSave = async () => {
    if (!editingValues) return;
    
    setIsSaving(true);
    try {
      const updatePayload = {
        userId: editingValues.userId,
        academicYear: editingValues.academicYear,
        quotas: {
          sick: editingValues.quotas.sick.total,
          casual: editingValues.quotas.casual.total,
          annual: editingValues.quotas.annual.total
        },
        notes: `Updated by admin on ${new Date().toLocaleDateString()}`
      };
      
      await onUpdate(updatePayload);
      setEditingQuota(null);
      setEditingValues(null);
    } catch (error) {
      console.error('Error saving quota:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingQuota(null);
    setEditingValues(null);
  };

  const handleBulkUpdateConfirm = async () => {
    if (!bulkData.userRole || !bulkData.academicYear) return;
    
    setIsBulkUpdating(true);
    try {
      await onBulkUpdate({
        academicYear: bulkData.academicYear,
        userRole: bulkData.userRole,
        quotas: bulkData.quotas,
        notes: bulkData.notes || `Bulk updated on ${new Date().toLocaleDateString()}`
      });
      setShowBulkConfirm(false);
      setBulkData({
        userRole: '',
        academicYear: '2024-2025',
        quotas: { sick: 10, casual: 8, annual: 15 },
        notes: ''
      });
    } catch (error) {
      console.error('Error bulk updating quotas:', error);
    } finally {
      setIsBulkUpdating(false);
    }
  };

  const updateEditingQuotaValue = (type, field, value) => {
    setEditingValues(prev => {
      const newQuotas = { ...prev.quotas };
      newQuotas[type] = { ...newQuotas[type], [field]: parseInt(value) || 0 };
      newQuotas[type].available = newQuotas[type].total - newQuotas[type].used - newQuotas[type].pending;
      return { ...prev, quotas: newQuotas };
    });
  };

  
  const hasActiveFilters = useMemo(() => {
    return localSearchTerm || 
           (filters.userRole && filters.userRole !== 'all') ||
           (filters.academicYear && filters.academicYear !== 'all');
  }, [localSearchTerm, filters]);

  const renderQuotaBadge = (type, quota) => {
    const typeConfig = LEAVE_TYPES[type];
    const IconComponent = typeConfig?.icon;
    const normalizedQuota = {
      total: quota?.total || 0,
      used: quota?.used || 0,
      pending: quota?.pending || 0,
      available: quota?.available ?? ((quota?.total || 0) - (quota?.used || 0) - (quota?.pending || 0))
    };
    const percentage = normalizedQuota.total > 0 ? ((normalizedQuota.used / normalizedQuota.total) * 100) : 0;
    
    return (
      <div className={`flex flex-col gap-2 p-3 rounded-lg ${typeConfig.bgColor}`}>
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {IconComponent && <IconComponent className={`w-4 h-4 ${typeConfig.color}`} />}
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {t(typeConfig?.label || type)}
          </span>
        </div>
        
        <div className="space-y-1.5">
          <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="text-xs text-gray-500">{t('leave.quota.totalQuota')}</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">{normalizedQuota.total}</span>
          </div>
          <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="text-xs text-gray-500">{t('leave.quota.usedQuota')}</span>
            <span className="text-sm font-semibold text-red-600">{normalizedQuota.used}</span>
          </div>
          <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="text-xs text-gray-500">{t('leave.quota.pendingQuota')}</span>
            <span className="text-sm font-semibold text-yellow-600">{normalizedQuota.pending}</span>
          </div>
          <div className={`flex justify-between items-center pt-1 border-t border-gray-200 dark:border-gray-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="text-xs font-medium text-gray-600">{t('leave.quota.availableQuota')}</span>
            <span className={`text-sm font-bold ${normalizedQuota.available > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {normalizedQuota.available}
            </span>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              percentage > 80 ? 'bg-red-500' : percentage > 50 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
    );
  };

  const renderEditableQuota = (type) => {
    const typeConfig = LEAVE_TYPES[type];
    const IconComponent = typeConfig?.icon;
    const quota = editingValues?.quotas?.[type] || { total: 0, used: 0, pending: 0, available: 0 };
    
    return (
      <div className={`flex flex-col gap-3 p-3 rounded-lg border-2 border-teal-300 ${typeConfig.bgColor}`}>
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {IconComponent && <IconComponent className={`w-4 h-4 ${typeConfig.color}`} />}
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {t(typeConfig?.label || type)}
          </span>
        </div>
        
        <div className="space-y-3">
          <div>
            <Label htmlFor={`${type}-total`} className="text-xs font-medium">
              {t('leave.quota.totalQuota')} *
            </Label>
            <Input
              id={`${type}-total`}
              type="number"
              value={quota.total}
              onChange={(e) => updateEditingQuotaValue(type, 'total', e.target.value)}
              min="0"
              className="h-9 text-sm mt-1"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center p-2 bg-white dark:bg-gray-800 rounded">
              <span className="text-xs text-gray-500 block">{t('leave.quota.usedQuota')}</span>
              <span className="text-sm font-semibold text-red-600">{quota.used}</span>
            </div>
            <div className="text-center p-2 bg-white dark:bg-gray-800 rounded">
              <span className="text-xs text-gray-500 block">{t('leave.quota.pendingQuota')}</span>
              <span className="text-sm font-semibold text-yellow-600">{quota.pending}</span>
            </div>
          </div>
          
          <div className="text-center p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
            <span className="text-xs text-gray-500 block">{t('leave.quota.availableQuota')}</span>
            <span className={`text-lg font-bold ${quota.available > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {quota.available}
            </span>
          </div>
        </div>
      </div>
    );
  };

  
  if (loading && data.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-teal-600" />
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {isRTL ? 'جاري التحميل...' : 'Loading quotas...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <CardHeader className="pb-4">
          <CardTitle className={`flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Users className="w-5 h-5 text-teal-600" />
            {t('leave.quota.bulkUpdate')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className={`text-sm font-medium flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <User className="w-4 h-4 text-gray-500" />
                {t('leave.form.userRole')} *
              </Label>
              <select
                value={bulkData.userRole}
                onChange={(e) => setBulkData({ ...bulkData, userRole: e.target.value })}
                className={`w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm ${isRTL ? 'text-right' : 'text-left'}`}
              >
                <option value="">{t('leave.form.selectRole')}</option>
                {Object.entries(USER_ROLES).map(([key, config]) => (
                  <option key={key} value={key}>{t(config.label)}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label className={`text-sm font-medium flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <BookOpen className="w-4 h-4 text-gray-500" />
                {t('leave.form.academicYear')} *
              </Label>
              <select
                value={bulkData.academicYear}
                onChange={(e) => setBulkData({ ...bulkData, academicYear: e.target.value })}
                className={`w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm ${isRTL ? 'text-right' : 'text-left'}`}
              >
                {academicYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">{isRTL ? 'ملاحظات' : 'Notes'}</Label>
              <Input
                value={bulkData.notes}
                onChange={(e) => setBulkData({ ...bulkData, notes: e.target.value })}
                placeholder={isRTL ? 'ملاحظات اختيارية...' : 'Optional notes...'}
                className="h-10"
              />
            </div>
            
            <div className="flex items-end">
              <Button
                onClick={() => setShowBulkConfirm(true)}
                disabled={!bulkData.userRole || isBulkUpdating}
                className="w-full h-10 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
              >
                {isBulkUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Users className="w-4 h-4 mr-2" />}
                {t('leave.quota.bulkUpdate')}
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            {['sick', 'casual', 'annual'].map(type => {
              const typeConfig = LEAVE_TYPES[type];
              const IconComponent = typeConfig?.icon;
              return (
                <div key={type} className="space-y-2">
                  <Label className={`text-sm font-medium flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {IconComponent && <IconComponent className={`w-4 h-4 ${typeConfig.color}`} />}
                    {t(typeConfig?.label || type)}
                  </Label>
                  <Input
                    type="number"
                    value={bulkData.quotas[type]}
                    onChange={(e) => setBulkData({
                      ...bulkData,
                      quotas: { ...bulkData.quotas, [type]: parseInt(e.target.value) || 0 }
                    })}
                    min="0"
                    className="h-10"
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4">
            <CardTitle className={`flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white ${isRTL ? 'flex-row-reverse' : ''}`}>
              <UserCheck className="w-5 h-5 text-blue-600" />
              {t('leave.quota.userQuota')}
            </CardTitle>
            
            <div className={`flex flex-col sm:flex-row gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
              <div className="relative flex-1">
                <Search className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                <Input
                  type="text"
                  placeholder={isRTL ? 'بحث بالاسم أو البريد...' : 'Search by name or email...'}
                  value={localSearchTerm}
                  onChange={(e) => handleSearchInputChange(e.target.value)}
                  className={`h-10 ${isRTL ? 'pr-10 text-right' : 'pl-10'}`}
                />
              </div>
              
              <select
                value={filters.userRole || 'all'}
                onChange={(e) => handleFilterChange('userRole', e.target.value)}
                className={`px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm min-w-[150px] ${isRTL ? 'text-right' : 'text-left'}`}
              >
                <option value="all">{t('common.all')} {t('leave.form.userRole')}</option>
                {Object.entries(USER_ROLES).map(([key, config]) => (
                  <option key={key} value={key}>{t(config.label)}</option>
                ))}
              </select>
              
              <select
                value={filters.academicYear || 'all'}
                onChange={(e) => handleFilterChange('academicYear', e.target.value)}
                className={`px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm min-w-[150px] ${isRTL ? 'text-right' : 'text-left'}`}
              >
                <option value="all">{t('common.all')} {t('leave.form.academicYear')}</option>
                {academicYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              
              
              {hasActiveFilters && (
                <Button variant="outline" size="sm" onClick={handleResetFilters} className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  {isRTL ? 'إعادة تعيين' : 'Reset'}
                </Button>
              )}
            </div>
            
            <div className={`text-sm text-gray-600 dark:text-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}>
              {isRTL 
                ? `عرض ${data.length} من ${pagination.total} نتيجة`
                : `Showing ${data.length} of ${pagination.total} results`
              }
              {loading && <Loader2 className="w-4 h-4 animate-spin inline-block ml-2" />}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {data.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {t('common.noData')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {hasActiveFilters 
                    ? (isRTL ? 'لم يتم العثور على نتائج' : 'No results found')
                    : (isRTL ? 'لا توجد حصص إجازات' : 'No leave quotas found')
                  }
                </p>
                {hasActiveFilters && (
                  <Button variant="outline" size="sm" onClick={handleResetFilters} className="mt-4">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    {isRTL ? 'إعادة تعيين الفلاتر' : 'Reset Filters'}
                  </Button>
                )}
              </div>
            ) : (
              data.map((quota, index) => {
                const isEditing = editingQuota?.userId === quota.userId;
                const displayData = isEditing ? editingValues : quota;
                const normalizedQuotas = normalizeQuota(displayData?.quotas);
                
                return (
                  <motion.div
                    key={quota.userId || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      isEditing 
                        ? 'border-teal-400 bg-teal-50/50 dark:bg-teal-900/20 shadow-lg' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}>
                      
                      <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <Avatar className="h-12 w-12 border-2 border-gray-200 dark:border-gray-600">
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold">
                              {getNameString(quota.name).split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {getNameString(quota.name)}
                            </p>
                            <div className={`flex items-center gap-2 text-sm text-gray-500 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                                {quota.id || quota.userId}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {t(USER_ROLES[quota.role]?.label || quota.role)}
                              </Badge>
                              <span className="text-xs">{quota.academicYear}</span>
                            </div>
                            {quota.email && (
                              <p className="text-xs text-gray-400 mt-1">{quota.email}</p>
                            )}
                          </div>
                        </div>
                        
                        {isEditing ? (
                          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <Button size="sm" onClick={handleSave} disabled={isSaving} className="bg-gradient-to-r from-teal-500 to-teal-600">
                              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            </Button>
                            <Button size="sm" variant="outline" onClick={handleCancel} disabled={isSaving}>
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => handleEdit(quota)} className="hover:bg-teal-50 hover:text-teal-600">
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      
                    
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {['sick', 'casual', 'annual'].map(type => (
                          <div key={type}>
                            {isEditing ? renderEditableQuota(type) : renderQuotaBadge(type, normalizedQuotas[type])}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {pagination.total > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <TablePagination
                totalPages={pagination.pages}
                limit={pagination.limit}
                totalRecords={pagination.total}
                currentPage={pagination.page}
                onPageChange={onPageChange}
                onLimitChange={onPageSizeChange}
                isRTL={isRTL}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmationModal
        isOpen={showBulkConfirm}
        onClose={() => setShowBulkConfirm(false)}
        onConfirm={handleBulkUpdateConfirm}
        titleKey="leave.quota.bulkUpdate"
        descriptionKey={
          isRTL 
            ? `هل أنت متأكد من تحديث حصص الإجازات لجميع "${t(USER_ROLES[bulkData.userRole]?.label || bulkData.userRole)}"؟`
            : `Are you sure you want to update quotas for all "${t(USER_ROLES[bulkData.userRole]?.label || bulkData.userRole)}"?`
        }
        confirmTextKey="leave.quota.bulkUpdate"
        cancelTextKey="common.cancel"
        isProcessing={isBulkUpdating}
      />
    </div>
  );
};

export default QuotaManager;
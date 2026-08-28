import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Button } from '../../maincomponents/components/ui/button.jsx';
import { Plus, RefreshCw, Bell, Send, FileText, AlertTriangle } from 'lucide-react';
import StatsCard from '../../maincomponents/cards/StatsCard.jsx';
import NotificationTable from '../../maincomponents/tables/NotificationTable.jsx'; 
import BaseCreateModal from '@maincomponents/modal/addEditModals/BaseCreateModal.jsx';
import PageHeader from '../../maincomponents/headerbar/PageHeader.jsx';
import NotificationModalFields from '@maincomponents/modal/addEditModals/NotificationModalFields.jsx';
import ViewNotificationsModal from '@maincomponents/modal/viewModals/ViewNotificationsModal.jsx';
import { ANIMATION_CONFIG } from '../../data/Constants.js';

import {
  fetchNotifications,
  fetchNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
  publishNotification,
  archiveNotification,
  fetchNotificationStats
} from '@redux/actions/notification';

import { fetchClassOptions } from '@redux/actions/class';

import {
  clearErrors,
  clearSuccess,
  setSelectedNotification,
  clearSelectedNotification
} from '@redux/slice/notificationSlice';

const DEFAULT_STATS = {
  totalNotifications: 0,
  publishedNotifications: 0,
  draftNotifications: 0,
  archivedNotifications: 0,
  urgentNotifications: 0,
  highPriorityNotifications: 0
};

const DEFAULT_PAGINATION = {
  total: 0,
  page: 1,
  limit: 10,
  pages: 0
};

const NOTIFICATION_TYPES = [
  'announcement', 'event', 'assignment', 'quiz', 'grade', 'fee', 'attendance', 'other'
];

const PRIORITIES = ['low', 'medium', 'high', 'urgent'];
const AUDIENCES = ['all', 'students', 'teachers', 'staff', 'parents', 'admin', 'specific'];

const Notifications = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const isRTL = i18n.language === 'ar';
  const currentLanguage = i18n.language;

  const isInitialMount = useRef(true);

  const notificationState = useSelector((state) => state.notifications);
  const {
    notifications = [],
    pagination = DEFAULT_PAGINATION,
    stats = DEFAULT_STATS,
    loading = false,
    statsLoading = false,
    createLoading = false,
    updateLoading = false,
    deleteLoading = false,
    publishLoading = false,
    archiveLoading = false,
    error = null,
    createSuccess = false,
    updateSuccess = false,
    deleteSuccess = false,
    publishSuccess = false,
    archiveSuccess = false,
    selectedNotification = null
  } = notificationState || {};

  const classesState = useSelector((state) => state.classes);
  const { classOptions = [] } = classesState || {};

  const safeStats = useMemo(() => ({
    ...DEFAULT_STATS,
    ...(stats || {})
  }), [stats]);

  const safePagination = useMemo(() => ({
    ...DEFAULT_PAGINATION,
    ...(pagination || {})
  }), [pagination]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [formData, setFormData] = useState({
    title: { en: '', ar: '' },
    message: { en: '', ar: '' },
    type: 'announcement',
    priority: 'medium',
    targetAudience: 'all',
    targetClasses: [],
    targetUsers: [],
    validFrom: '',
    validUntil: '',
    link: { url: '', text: { en: '', ar: '' } },
    status: 'draft'
  });

  const formattedClasses = useMemo(() => {
    if (!classOptions || !Array.isArray(classOptions)) return [];
    return classOptions.map(cls => {
      const id = cls.value || cls._id || '';
      let displayName = cls.label || '';
      if (!displayName || displayName.trim() === '-' || displayName.trim() === ' - ') {
        displayName = cls.displayName || cls.name?.[currentLanguage] || cls.name?.en || '';
      }
      if (!displayName) return null;
      return { _id: id, name: displayName };
    }).filter(Boolean);
  }, [classOptions, currentLanguage]);

  const loadNotifications = useCallback(() => {
    const params = {
      page: currentPage,
      limit: pageSize,
      search: searchTerm || undefined,
      type: filters.type && filters.type !== 'all' ? filters.type : undefined,
      priority: filters.priority && filters.priority !== 'all' ? filters.priority : undefined,
      status: filters.status && filters.status !== 'all' ? filters.status : undefined,
      targetAudience: filters.targetAudience && filters.targetAudience !== 'all' ? filters.targetAudience : undefined
    };
    dispatch(fetchNotifications(params));
  }, [dispatch, currentPage, pageSize, searchTerm, filters]);

  useEffect(() => {
    loadNotifications();
    dispatch(fetchNotificationStats());
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    loadNotifications();
  }, [currentPage, pageSize, searchTerm, filters]);

  useEffect(() => {
    loadNotifications();
    dispatch(fetchNotificationStats());
  }, [currentLanguage]);

  useEffect(() => {
    if (isModalOpen && classOptions.length === 0) {
      dispatch(fetchClassOptions({}));
    }
  }, [isModalOpen, dispatch, classOptions.length]);

  useEffect(() => {
    if (createSuccess) {
      toast.success(isRTL ? 'تم إنشاء الإشعار بنجاح' : 'Notification created successfully');
      setIsModalOpen(false);
      resetForm();
      dispatch(clearSuccess());
      loadNotifications();
      dispatch(fetchNotificationStats());
    }
  }, [createSuccess]);

  useEffect(() => {
    if (updateSuccess) {
      toast.success(isRTL ? 'تم تحديث الإشعار بنجاح' : 'Notification updated successfully');
      setIsModalOpen(false);
      resetForm();
      dispatch(clearSuccess());
      loadNotifications();
      dispatch(fetchNotificationStats());
    }
  }, [updateSuccess]);

  useEffect(() => {
    if (deleteSuccess) {
      toast.success(isRTL ? 'تم حذف الإشعار بنجاح' : 'Notification deleted successfully');
      dispatch(clearSuccess());
      loadNotifications();
      dispatch(fetchNotificationStats());
    }
  }, [deleteSuccess]);

  useEffect(() => {
    if (publishSuccess) {
      toast.success(isRTL ? 'تم نشر الإشعار بنجاح' : 'Notification published successfully');
      dispatch(clearSuccess());
      loadNotifications();
      dispatch(fetchNotificationStats());
    }
  }, [publishSuccess]);

  useEffect(() => {
    if (archiveSuccess) {
      toast.success(isRTL ? 'تم أرشفة الإشعار بنجاح' : 'Notification archived successfully');
      dispatch(clearSuccess());
      loadNotifications();
      dispatch(fetchNotificationStats());
    }
  }, [archiveSuccess]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [error]);

  const resetForm = () => {
    setFormData({
      title: { en: '', ar: '' },
      message: { en: '', ar: '' },
      type: 'announcement',
      priority: 'medium',
      targetAudience: 'all',
      targetClasses: [],
      targetUsers: [],
      validFrom: '',
      validUntil: '',
      link: { url: '', text: { en: '', ar: '' } },
      status: 'draft'
    });
    setSelectedFiles([]);
    dispatch(clearSelectedNotification());
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFilesChange = (files) => {
    setSelectedFiles(files);
  };

 const handleFormSubmit = async (e) => {
  e.preventDefault();

  const titleEn = formData.title?.en?.trim() || '';
  const titleAr = formData.title?.ar?.trim() || '';

  if (!titleEn && !titleAr) {
    toast.error(isRTL ? 'عنوان الإشعار مطلوب' : 'Notification title is required');
    return;
  }

  const messageEn = formData.message?.en?.trim() || '';
  const messageAr = formData.message?.ar?.trim() || '';

  if (!messageEn && !messageAr) {
    toast.error(isRTL ? 'رسالة الإشعار مطلوبة' : 'Notification message is required');
    return;
  }

  const submitData = new FormData();
  
  // Use bracket notation for nested objects in FormData
  submitData.append('title[en]', titleEn);
  submitData.append('title[ar]', titleAr);
  submitData.append('message[en]', messageEn);
  submitData.append('message[ar]', messageAr);
  
  submitData.append('type', formData.type);
  submitData.append('priority', formData.priority);
  submitData.append('targetAudience', formData.targetAudience);
  
  if (formData.targetClasses?.length > 0) {
    formData.targetClasses.forEach((id, index) => {
      submitData.append(`targetClasses[${index}]`, id);
    });
  }
  
  if (formData.targetUsers?.length > 0) {
    formData.targetUsers.forEach((id, index) => {
      submitData.append(`targetUsers[${index}]`, id);
    });
  }
  
  if (formData.validFrom) submitData.append('validFrom', formData.validFrom);
  if (formData.validUntil) submitData.append('validUntil', formData.validUntil);
  
  if (formData.link?.url) {
    submitData.append('link[url]', formData.link.url);
    submitData.append('link[text][en]', formData.link.text?.en || '');
    submitData.append('link[text][ar]', formData.link.text?.ar || '');
  }
  
  submitData.append('status', formData.status);

  if (selectedFiles && selectedFiles.length > 0) {
    Array.from(selectedFiles).forEach(file => {
      submitData.append('file', file);
    });
  }

  if (modalMode === 'add') {
    dispatch(createNotification(submitData));
  } else if (selectedNotification?._id) {
    dispatch(updateNotification({
      id: selectedNotification._id,
      data: submitData
    }));
  }
};

  const handleAddNotification = () => {
    setModalMode('add');
    resetForm();
    setIsModalOpen(true);
  };

  const handleEditNotification = async (notification) => {
    if (!notification?._id) return;

    try {
      const result = await dispatch(fetchNotificationById(notification._id)).unwrap();

      if (!result) {
        toast.error(isRTL ? 'فشل في جلب بيانات الإشعار' : 'Failed to fetch notification data');
        return;
      }

      setModalMode('edit');
      dispatch(setSelectedNotification(result));

      setFormData({
        title: result.title || { en: '', ar: '' },
        message: result.message || { en: '', ar: '' },
        type: result.type || 'announcement',
        priority: result.priority || 'medium',
        targetAudience: result.targetAudience || 'all',
        targetClasses: result.targetClassIds || [],
        targetUsers: result.targetUserIds || [],
        validFrom: result.validFrom ? new Date(result.validFrom).toISOString().slice(0, 16) : '',
        validUntil: result.validUntil ? new Date(result.validUntil).toISOString().slice(0, 16) : '',
        link: result.link || { url: '', text: { en: '', ar: '' } },
        status: result.status || 'draft'
      });

      setIsModalOpen(true);
    } catch (err) {
      toast.error(isRTL ? 'فشل في جلب بيانات الإشعار' : 'Failed to fetch notification data');
    }
  };

  const handleViewNotification = (notification) => {
    if (!notification?._id) return;
    dispatch(fetchNotificationById(notification._id));
    setIsViewModalOpen(true);
  };

  const handleDeleteClick = (notificationId) => {
    if (!notificationId) return;
    dispatch(deleteNotification(notificationId))
  };

  const handlePublishClick = (notification) => {
    const id = notification._id || notification;
    if (!id) return;
    dispatch(publishNotification(id));
  };

  const handleArchiveClick = (notification) => {
    const id = notification._id || notification;
    if (!id) return;
    dispatch(archiveNotification(id));
  };

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((size) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  const handleFilterChange = useCallback((filterKey, value) => {
    setFilters((prev) => ({ ...prev, [filterKey]: value }));
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  const handleRefresh = useCallback(() => {
    loadNotifications();
    dispatch(fetchNotificationStats());
  }, [loadNotifications, dispatch]);

  const statsCards = useMemo(() => [
    {
      title: 'notifications.totalNotifications',
      value: safeStats.totalNotifications,
      icon: Bell,
      color: 'blue',
    },
    {
      title: 'notifications.publishedNotifications',
      value: safeStats.publishedNotifications,
      icon: Send,
      color: 'green',
    },
    {
      title: 'notifications.draftNotifications',
      value: safeStats.draftNotifications,
      icon: FileText,
      color: 'purple',
    },
    {
      title: 'notifications.urgentNotifications',
      value: safeStats.urgentNotifications,
      icon: AlertTriangle,
      color: 'teal',
    }
  ], [safeStats]);

  return (
    <div className="space-y-6 py-6 px-2" dir={isRTL ? 'rtl' : 'ltr'}>
      <PageHeader
        title={t('sidebar.notifications')}
        description={t('notifications.pageDescription')}
        action={
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* <Button
              onClick={handleRefresh}
              variant="outline"
              className="gap-2"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {t('common.refresh')}
            </Button> */}
            <Button
              onClick={handleAddNotification}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg gap-2"
            >
              <Plus className="w-4 h-4" />
              {t('notifications.addNotification')}
            </Button>
          </div>
        }
        isRTL={isRTL}
      />

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
        }}
      >
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <StatsCard
              title={t(stat.title)}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              delay={index * 0.1}
              isRTL={isRTL}
              loading={statsLoading}
            />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <NotificationTable
          data={notifications}
          onView={handleViewNotification}
          onEdit={handleEditNotification}
          onDelete={handleDeleteClick}
          onSend={handlePublishClick}
          onPublish={handlePublishClick}
          onArchive={handleArchiveClick}
          isRTL={isRTL}
          currentLanguage={currentLanguage}
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          filters={filters}
          onFilterChange={handleFilterChange}
          loading={loading}
          showPagination={true}
          pageSize={pageSize}
          currentPage={currentPage}
          totalItems={safePagination.total}
          totalPages={safePagination.pages}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </motion.div>

      <BaseCreateModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={modalMode === 'add' ? t('notifications.addNotification') : t('notifications.editNotification')}
        description={
          modalMode === 'add'
            ? (isRTL ? 'إنشاء إشعار جديد' : 'Create a new notification')
            : (isRTL ? 'تحديث معلومات الإشعار' : 'Update notification information')
        }
        onSubmit={handleFormSubmit}
        submitLabel={modalMode === 'add' ? t('notifications.addNotification') : t('common.save')}
        isSubmitting={createLoading || updateLoading}
        type="notification"
        icon={Bell}
        gradient="from-emerald-500 to-emerald-600"
        isRTL={isRTL}
      >
        <NotificationModalFields
          formData={formData}
          handleChange={handleInputChange}
          isRTL={isRTL}
          currentLanguage={currentLanguage}
          classes={formattedClasses}
          types={NOTIFICATION_TYPES}
          priorities={PRIORITIES}
          audiences={AUDIENCES}
          mode={modalMode}
          enableMultiLanguage={true}
          onFilesChange={handleFilesChange}
          selectedFiles={selectedFiles}
        />
      </BaseCreateModal>

      <ViewNotificationsModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          dispatch(clearSelectedNotification());
        }}
        data={selectedNotification}
        isRTL={isRTL}
        currentLanguage={currentLanguage}
        onEdit={(notification) => {
          setIsViewModalOpen(false);
          handleEditNotification(notification);
        }}
        onDelete={(notification) => {
          setIsViewModalOpen(false);
          handleDeleteClick(notification._id);
        }}
        onSend={(notification) => {
          handlePublishClick(notification);
          setIsViewModalOpen(false);
        }}
        loading={loading}
      />
    </div>
  );
};

export default Notifications;
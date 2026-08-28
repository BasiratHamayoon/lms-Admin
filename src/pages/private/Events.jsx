import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Button } from '../../maincomponents/components/ui/button';
import { Plus, Calendar, CheckCircle, Clock } from 'lucide-react';
import StatsCard from '@maincomponents/cards/StatsCard';
import EventsTable from '@maincomponents/tables/EventsTable';
import PageHeader from '@maincomponents/headerbar/PageHeader';
import BaseCreateModal from '@maincomponents/modal/addEditModals/BaseCreateModal';
import EventsModalFields from '@maincomponents/modal/addEditModals/EventsModalFields';
import ViewEventsModal from '@maincomponents/modal/viewModals/ViewEventsModal';
import { ANIMATION_CONFIG } from '../../data/Constants';
import {
  fetchEvents,
  fetchEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  fetchEventStats
} from '@redux/actions/events';
import {
  clearErrors,
  clearSuccess,
  clearSelectedEvent
} from '@redux/slice/eventSlice';

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
    return () => { clearTimeout(handler); };
  }, [value, delay]);
  return debouncedValue;
};

const Events = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const isRTL = i18n.language === 'ar';
  const currentLanguage = i18n.language;
  const initialFetchDone = useRef(false);

  const {
    events, pagination, stats, selectedEvent, loading, statsLoading, createLoading,
    updateLoading, error, createSuccess, updateSuccess, deleteSuccess,
  } = useSelector((state) => state.events);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ type: 'all', visibility: 'all', status: 'all' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [formData, setFormData] = useState({});

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const loadData = useCallback((isInitial = false) => {
    const params = {
      page: currentPage,
      limit: pageSize,
      search: debouncedSearchTerm || undefined,
      type: filters.type !== 'all' ? filters.type : undefined,
      visibility: filters.visibility !== 'all' ? filters.visibility : undefined,
      status: filters.status !== 'all' ? filters.status : undefined,
    };
    dispatch(fetchEvents(params));
    
    if (isInitial) {
      dispatch(fetchEventStats());
    }
  }, [dispatch, currentPage, pageSize, debouncedSearchTerm, filters]);
  
  useEffect(() => {
    if (!initialFetchDone.current) {
      loadData(true);
      initialFetchDone.current = true;
    } else {
      loadData(false);
    }
  }, [currentPage, pageSize, debouncedSearchTerm, filters, currentLanguage, loadData]);

  const resetForm = () => {
    const now = new Date();
    setFormData({
      title: { en: '', ar: '' },
      description: { en: '', ar: '' },
      startDate: now.toISOString().slice(0, 16),
      endDate: new Date(now.getTime() + 60 * 60 * 1000).toISOString().slice(0, 16),
      allDay: false,
      location: { en: '', ar: '' },
      type: 'other',
      visibility: 'all',
      color: '#10b981',
      reminder: false,
      status: 'scheduled'
    });
    dispatch(clearSelectedEvent());
  };
  
  useEffect(() => { if (error) { toast.error(error); dispatch(clearErrors()); } }, [error, dispatch]);
  useEffect(() => {
    if (createSuccess) {
      toast.success(t('events.messages.createSuccess')); setIsModalOpen(false); resetForm();
      dispatch(clearSuccess()); loadData(true);
    }
  }, [createSuccess, t, dispatch, loadData]);
  useEffect(() => {
    if (updateSuccess) {
      toast.success(t('events.messages.updateSuccess')); setIsModalOpen(false); resetForm();
      dispatch(clearSuccess()); loadData(true);
    }
  }, [updateSuccess, t, dispatch, loadData]);
  useEffect(() => {
    if (deleteSuccess) {
      toast.success(t('events.messages.deleteSuccess')); dispatch(clearSuccess());
      if (events.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      } else {
        loadData(true);
      }
    }
  }, [deleteSuccess, t, dispatch, events.length, currentPage, loadData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.title?.en && !formData.title?.ar) {
      return toast.error(t('events.validations.titleRequired'));
    }
    const payload = { ...formData };
    if (modalMode === 'add') {
      dispatch(createEvent(payload));
    } else if (selectedEvent?._id) {
      dispatch(updateEvent({ id: selectedEvent._id, data: payload }));
    }
  };

  const handleAddEvent = () => {
    setModalMode('add');
    resetForm();
    setIsModalOpen(true);
  };

  const handleEditEvent = async (event) => {
    if (!event?._id) return;
    setIsViewModalOpen(false);
    try {
      const result = await dispatch(fetchEventById(event._id)).unwrap();
      setModalMode('edit');
      setFormData({
        title: result.title || { en: '', ar: '' },
        description: result.description || { en: '', ar: '' },
        location: result.location || { en: '', ar: '' },
        startDate: result.startDate ? new Date(result.startDate).toISOString().slice(0, 16) : '',
        endDate: result.endDate ? new Date(result.endDate).toISOString().slice(0, 16) : '',
        allDay: result.allDay || false,
        type: result.type || 'other',
        visibility: result.visibility || 'all',
        color: result.color || '#10b981',
        reminder: result.reminder || false,
        status: result.status || 'scheduled'
      });
      setIsModalOpen(true);
    } catch (err) {
      toast.error(t('events.messages.fetchError'));
    }
  };

  const handleViewEvent = async (event) => {
    if (!event?._id) return;
    setIsViewModalOpen(true);
    setIsDetailsLoading(true);
    try {
      await dispatch(fetchEventById(event._id)).unwrap();
    } catch (err) {
      toast.error(t('events.messages.fetchError'));
      setIsViewModalOpen(false);
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const handleDeleteEvent = (eventId) => {
    if (!eventId) return;
    dispatch(deleteEvent(eventId));
    setIsViewModalOpen(false);
  };
  
  const handlePageChange = useCallback((page) => { setCurrentPage(page); }, []);
  const handlePageSizeChange = useCallback((size) => { setPageSize(size); setCurrentPage(1); }, []);
  const handleFilterChange = useCallback((key, value) => { setFilters(p => ({ ...p, [key]: value })); setCurrentPage(1); }, []);
  const handleSearchChange = useCallback((value) => { setSearchTerm(value); setCurrentPage(1); }, []);

  const statsCards = useMemo(() => [
    { title: 'events.totalEvents', value: stats.totalEvents || 0, icon: Calendar, color: 'blue' },
    { title: 'events.upcomingEvents', value: stats.upcomingEvents || 0, icon: Clock, color: 'green' },
    { title: 'events.pastEvents', value: stats.pastEvents || 0, icon: CheckCircle, color: 'teal' }
  ], [stats]);

  const formattedEvents = useMemo(() => {
    if (!Array.isArray(events)) return [];
    return events.map(event => ({
      ...event,
      title: event.title?.[currentLanguage] || event.title?.en || '',
      description: event.description?.[currentLanguage] || event.description?.en || '',
      location: event.location?.[currentLanguage] || event.location?.en || ''
    }));
  }, [events, currentLanguage]);

  return (
    <div className="space-y-6 py-6 px-2" dir={isRTL ? 'rtl' : 'ltr'}>
      <PageHeader
        title={t('sidebar.events')}
        description={t('events.pageDescription')}
        action={
          <Button onClick={handleAddEvent} className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-lg">
            <Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />{t('events.addEvent')}
          </Button>
        }
        isRTL={isRTL}
      />

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 }}}}
      >
        {statsCards.map((stat, index) => (
          <StatsCard
            key={stat.title}
            title={t(stat.title)}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            delay={index * 0.1}
            isRTL={isRTL}
            loading={statsLoading}
          />
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <EventsTable
          data={formattedEvents}
          onView={handleViewEvent}
          onEdit={handleEditEvent}
          onDelete={handleDeleteEvent}
          isRTL={isRTL}
          currentLanguage={currentLanguage}
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          filters={filters}
          onFilterChange={handleFilterChange}
          loading={loading}
          showPagination
          pageSize={pageSize}
          currentPage={currentPage}
          totalItems={pagination.total}
          totalPages={pagination.pages}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </motion.div>
      
      <BaseCreateModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); resetForm(); }}
        title={modalMode === 'add' ? t('events.addEvent') : t('events.editEvent')}
        description={modalMode === 'add' ? t('events.modal.addDesc') : t('events.modal.editDesc')}
        onSubmit={handleFormSubmit}
        submitLabel={modalMode === 'add' ? t('events.addEvent') : t('common.save')}
        isSubmitting={createLoading || updateLoading}
        type="event"
        icon={Calendar}
        gradient="from-teal-500 to-teal-600"
        isRTL={isRTL}
      >
        <EventsModalFields 
          formData={formData}
          handleChange={handleInputChange}
          isRTL={isRTL}
          enableMultiLanguage
          currentLanguage={currentLanguage}
        />
      </BaseCreateModal>

      <ViewEventsModal
        isOpen={isViewModalOpen}
        onClose={() => { setIsViewModalOpen(false); dispatch(clearSelectedEvent()); }}
        data={selectedEvent}
        loading={isDetailsLoading}
        isRTL={isRTL}
        currentLanguage={currentLanguage}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
      />
    </div>
  );
};

export default Events;
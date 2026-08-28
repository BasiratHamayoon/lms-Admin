import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Button } from '../../maincomponents/components/ui/button';
import {
  Plus, RefreshCw, X, Calendar, CheckCircle, XCircle, Clock, AlertTriangle, CalendarOff, Timer, Users, TrendingUp
} from 'lucide-react';

// Chart-specific imports
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../../maincomponents/components/ui/card';
import { ChartContainer } from '../../maincomponents/components/ui/chart';

import StatsCard from '@maincomponents/cards/StatsCard';
import AttendanceTable from '@maincomponents/tables/AttendanceTable';
import PageHeader from '@maincomponents/headerbar/PageHeader';
import BaseCreateModal from '@maincomponents/modal/addEditModals/BaseCreateModal';
import AttendanceModalFields from '@maincomponents/modal/addEditModals/AttendanceModalFields';

import {
  getAllStaffForAttendance,
  getAttendanceList,
  getAttendanceStats,
  getAttendanceCharts,
  adminBulkCheckIn,
  adminBulkCheckOut,
  adminBulkMarkAbsent,
  adminBulkMarkLeave,
  updateAttendance,
  deleteAttendance,
  getWorkHours
} from '../../redux/actions/attendance';
import { clearError, clearActionSuccess, clearBulkResults } from '../../redux/slice/attendanceSlice';
import ChartSkeleton from '@maincomponents/skeletons/ChartSkeleton';

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const DEFAULT_STATS_STRUCTURE = [
  { title: 'attendance.stats.totalPresent', icon: CheckCircle, color: 'green' },
  { title: 'attendance.stats.totalAbsent', icon: XCircle, color: 'blue' },
  { title: 'attendance.stats.totalLate', icon: Clock, color: 'purple' },
  { title: 'attendance.stats.halfDay', icon: AlertTriangle, color: 'teal' },
  { title: 'attendance.stats.totalLeave', icon: CalendarOff, color: 'blue' },
  { title: 'attendance.stats.totalHours', icon: Timer, color: 'purple' },
  { title: 'attendance.stats.totalRecords', icon: Users, color: 'teal' },
  { title: 'attendance.stats.attendanceRate', icon: TrendingUp, color: 'green' }
];

// Custom Tooltip for Chart to match text color with chart color
const CustomChartTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const data = payload[0];
        const color = data.stroke || data.color || '#f59e0b'; // Use stroke/color from payload, with fallback
        return (
            <div className="rounded-lg border bg-background/95 p-2 text-sm shadow-lg backdrop-blur-sm">
                <p className="mb-1 font-bold text-foreground">{label}</p>
                <div className="flex items-center" style={{ color: color }}>
                    <span
                        className="mr-2 h-2.5 w-2.5 shrink-0 rounded-[2px]"
                        style={{ backgroundColor: color }}
                    />
                    {data.name}: {data.value}
                </div>
            </div>
        );
    }
    return null;
};


const Attendance = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const isInitialMount = useRef(true);

  const {
    staffList,
    attendanceRecords,
    pagination,
    stats,
    chartData,
    loading,
    error,
    bulkResults,
    actionSuccess,
    workHours
  } = useSelector((state) => state.attendance);

  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [formData, setFormData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedDate, setSelectedDate] = useState('');
  const [filterByDate, setFilterByDate] = useState(false);

  const isRTL = i18n.language === 'ar';
  const currentLanguage = i18n.language;
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const statsData = useMemo(() => {
    if (!stats) {
      return DEFAULT_STATS_STRUCTURE.map(stat => ({ ...stat, value: 0, change: null }));
    }
    const totalRecords = stats.totalRecords || 1;
    const getPercent = (val) => Math.round((val / totalRecords) * 100);
    return [
      { title: 'attendance.stats.totalPresent', value: stats.present || 0, icon: CheckCircle, color: 'green', change: `${getPercent(stats.present)}%` },
      { title: 'attendance.stats.totalAbsent', value: stats.absent || 0, icon: XCircle, color: 'blue', change: `${getPercent(stats.absent)}%` },
      { title: 'attendance.stats.totalLate', value: stats.late || 0, icon: Clock, color: 'purple', change: `${getPercent(stats.late)}%` },
      { title: 'attendance.stats.halfDay', value: stats.halfDay || 0, icon: AlertTriangle, color: 'teal', change: `${getPercent(stats.halfDay)}%` },
      { title: 'attendance.stats.totalLeave', value: stats.leave || 0, icon: CalendarOff, color: 'blue', change: `${getPercent(stats.leave)}%` },
      { title: 'attendance.stats.totalHours', value: `${stats.totalHours || 0}`, icon: Timer, color: 'purple', change: null },
      { title: 'attendance.stats.totalRecords', value: stats.totalRecords || 0, icon: Users, color: 'teal', change: null },
      { title: 'attendance.stats.attendanceRate', value: `${stats.attendancePercentage || 0}%`, icon: TrendingUp, color: 'green', change: null }
    ];
  }, [stats]);

  const getName = useCallback((nameValue) => { if (!nameValue) return 'Unknown'; if (typeof nameValue === 'string') return nameValue || 'Unknown'; if (typeof nameValue === 'object') { const currentLangName = currentLanguage === 'ar' ? nameValue.ar : nameValue.en; if (currentLangName && typeof currentLangName === 'object') { const fullName = `${currentLangName.firstName || ''} ${currentLangName.lastName || ''}`.trim(); if (fullName) return fullName; } const fallbackName = currentLanguage === 'ar' ? nameValue.en : nameValue.ar; if (fallbackName && typeof fallbackName === 'object') { const fullName = `${fallbackName.firstName || ''} ${fallbackName.lastName || ''}`.trim(); if (fullName) return fullName; } } return 'Unknown'; }, [currentLanguage]);
  const getDeptName = useCallback((dept) => { if (!dept) return 'N/A'; if (typeof dept === 'string') return dept; if (typeof dept === 'object') return dept.name || 'N/A'; return 'N/A'; }, []);
  const fetchData = useCallback(() => { const listParams = { page: currentPage, limit: pageSize, search: debouncedSearchTerm, date: filterByDate && selectedDate ? selectedDate : undefined, ...filters }; const statsParams = { fromDate: filterByDate && selectedDate ? selectedDate : undefined, toDate: filterByDate && selectedDate ? selectedDate : undefined, ...filters }; const chartParams = { type: 'daily', date: filterByDate && selectedDate ? selectedDate : undefined, ...filters }; dispatch(getAttendanceList(listParams)); dispatch(getAttendanceStats(statsParams)); dispatch(getAttendanceCharts(chartParams)); }, [dispatch, currentPage, pageSize, debouncedSearchTerm, filterByDate, selectedDate, filters]);
  
  useEffect(() => {
    // This effect runs only once on initial mount to fetch essential, less-frequently-changing data.
    const today = new Date().toISOString().split('T')[0];
    dispatch(getAllStaffForAttendance({ date: selectedDate || today }));
    dispatch(getWorkHours());
    fetchData(); 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);
  
  useEffect(() => { 
    // This effect handles re-fetching data when filters, search, or pagination change.
    // It's guarded to prevent running on the initial render, which is handled by the effect above.
    if (isInitialMount.current) { isInitialMount.current = false; return; } 
    fetchData(); 
  }, [fetchData, debouncedSearchTerm, currentPage, pageSize, filterByDate, selectedDate, filters]);
  
  useEffect(() => { 
    // This effect handles side-effects like showing toasts and refreshing data after an action.
    if (error) { toast.error(error); dispatch(clearError()); } 
    if (actionSuccess) { dispatch(clearActionSuccess()); fetchData(); } 
    if (bulkResults) { const { summary } = bulkResults; if (summary) { const message = `${summary.successful}/${summary.total} successful${summary.failed > 0 ? `, ${summary.failed} failed` : ''}`; summary.failed > 0 ? toast.warning(message) : toast.success(message); } dispatch(clearBulkResults()); } 
  }, [error, actionSuccess, bulkResults, dispatch, fetchData]);

  const mainChartData = useMemo(() => { const statusColors = { present: '#22c55e', absent: '#3b82f6', late: '#8b5cf6', 'half-day': '#14b8a6', leave: '#6366f1' }; return (chartData || []).map((item) => ({ name: t(`attendance.status.${item._id || 'unknown'}`), value: item.count || 0, fill: statusColors[item._id] || '#6b7280' })); }, [chartData, t]);
  const tableData = useMemo(() => (attendanceRecords || []).map(record => ({ id: record._id, _id: record._id, userId: record.user?._id || record.userId, name: getName(record.user?.name || record.userName), role: record.user?.role || record.userRole, department: getDeptName(record.department), date: record.date, status: record.status, timeIn: record.timeIn ? new Date(record.timeIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : null, timeOut: record.timeOut ? new Date(record.timeOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : null, totalHours: record.totalHours || 0, method: record.method || 'manual', remarks: record.remarks, markedBy: getName(record.markedBy?.name) || 'System' })), [attendanceRecords, getName, getDeptName]);
  const departments = useMemo(() => [...new Set(staffList.map(staff => getDeptName(staff.department)).filter(dept => dept && dept !== 'N/A'))], [staffList, getDeptName]);
  const handleInputChange = useCallback((field, value) => setFormData(prev => ({ ...prev, [field]: value })), []);
  const handleRefresh = useCallback(() => { fetchData(); toast.success(t('attendance.messages.dataRefreshed')); }, [fetchData, t]);
  const handleToggleDateFilter = () => { setFilterByDate(!filterByDate); if (filterByDate) setSelectedDate(''); setCurrentPage(1); };
  const handleDateChange = (date) => { setSelectedDate(date); setFilterByDate(true); setCurrentPage(1); };
  const handleFilterChange = (key, value) => { setFilters(prev => ({ ...prev, [key]: value === 'all' ? undefined : value })); setCurrentPage(1); };
  const handleSearchChange = (value) => setSearchTerm(value);
  const handlePageChange = (page) => setCurrentPage(page);
  const handlePageSizeChange = (size) => setPageSize(size);
  const handleAddAttendance = () => { setSelectedAttendance(null); setModalMode('add'); const startTime = workHours?.global?.startTime; const endTime = workHours?.global?.endTime; setFormData({ employees: [], departments: [], date: selectedDate || new Date().toISOString().split('T')[0], timeIn: startTime ? `${String(startTime.hour).padStart(2, '0')}:${String(startTime.minute).padStart(2, '0')}` : '09:00', timeOut: endTime ? `${String(endTime.hour).padStart(2, '0')}:${String(endTime.minute).padStart(2, '0')}` : '17:00', status: 'present', method: 'manual', remarks: '' }); setIsModalOpen(true); };
  const handleEditAttendance = (record) => { setSelectedAttendance(record); setModalMode('edit'); setFormData({ employee: record.userId, date: record.date ? new Date(record.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0], department: record.department, timeIn: record.timeIn || '09:00', timeOut: record.timeOut || '17:00', status: record.status, method: record.method, remarks: record.remarks || '' }); setIsModalOpen(true); };
  const handleDeleteAttendance = async (id) => { try { await dispatch(deleteAttendance(id)).unwrap(); toast.success(t('attendance.messages.deleteSuccess')); } catch (err) { toast.error(err.message || t('attendance.messages.deleteError')); } };
  const handleFormSubmit = async (e) => { e.preventDefault(); try { if (modalMode === 'add') { let employeesToProcess = []; if (formData.employees?.length) { employeesToProcess = staffList.filter(s => formData.employees.includes(s._id)); } else if (formData.departments?.length) { employeesToProcess = staffList.filter(s => formData.departments.includes(getDeptName(s.department))); } if (employeesToProcess.length === 0) { toast.error(t('attendance.messages.selectEmployee')); return; } const date = formData.date || new Date().toISOString().split('T')[0]; const userIds = employeesToProcess.map(e => e._id); const remarks = formData.remarks; if (formData.status === 'absent') { await dispatch(adminBulkMarkAbsent({ date, userIds, remarks })).unwrap(); } else if (formData.status === 'leave') { await dispatch(adminBulkMarkLeave({ date, userIds, remarks })).unwrap(); } else { const records = userIds.map(userId => ({ userId, timeIn: new Date(`${date}T${formData.timeIn}:00`).toISOString(), remarks })); await dispatch(adminBulkCheckIn({ date, records })).unwrap(); if (formData.timeOut) { const checkOutRecords = userIds.map(userId => ({ userId, timeOut: new Date(`${date}T${formData.timeOut}:00`).toISOString(), remarks })); await dispatch(adminBulkCheckOut({ date, records: checkOutRecords })).unwrap(); } } } else if (modalMode === 'edit' && selectedAttendance) { const { date, timeIn, timeOut, status, remarks } = formData; const payload = { id: selectedAttendance._id, status, remarks, timeIn: timeIn ? new Date(`${date}T${timeIn}:00`).toISOString() : undefined, timeOut: timeOut ? new Date(`${date}T${timeOut}:00`).toISOString() : undefined }; await dispatch(updateAttendance(payload)).unwrap(); } toast.success(t('attendance.messages.saveSuccess')); setIsModalOpen(false); } catch (err) { toast.error(err.message || t('attendance.messages.saveError')); } };

  return (
    <div className="space-y-6 py-6 px-2" dir={isRTL ? 'rtl' : 'ltr'}>
      <PageHeader title={t('sidebar.attendance')} description={t('attendance.pageDescription')} action={
        <div className={`flex flex-wrap gap-3 items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button variant={filterByDate ? "default" : "outline"} size="sm" onClick={handleToggleDateFilter} className={`gap-2 ${filterByDate ? 'bg-amber-500 hover:bg-amber-600' : ''}`}><Calendar className="w-4 h-4" />{filterByDate ? t('attendance.filterByDate') : t('attendance.allDates')}</Button>
            {filterByDate && <div className="flex items-center gap-1"><input type="date" value={selectedDate} onChange={(e) => handleDateChange(e.target.value)} className="px-3 py-2 border rounded-lg bg-card text-sm" /><Button variant="ghost" size="sm" onClick={() => { setFilterByDate(false); setSelectedDate(''); }} className="p-1 h-8 w-8"><X className="w-4 h-4" /></Button></div>}
          </div>
          <Button onClick={handleRefresh} variant="outline" disabled={loading.list || loading.staff} className="gap-2"><RefreshCw className={`w-4 h-4 ${loading.list ? 'animate-spin' : ''}`} />{t('attendance.refresh')}</Button>
          <Button onClick={handleAddAttendance} className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-lg" disabled={loading.action}><Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />{t('attendance.addAttendance')}</Button>
        </div>} isRTL={isRTL} />

      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4" 
        initial="hidden" 
        animate="visible" 
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } }}
      >
        {statsData.map((stat, index) => <StatsCard key={index} title={t(stat.title)} value={stat.value} change={stat.change} icon={stat.icon} color={stat.color} delay={index * 0.05} loading={loading.stats} />)}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-card">
          <CardHeader><CardTitle className={`text-lg font-bold text-card-foreground ${isRTL ? 'text-right' : 'text-left'}`}>{t('attendance.charts.overview')}</CardTitle></CardHeader>
          <CardContent className="h-96 p-0">
            {loading.charts ? <ChartSkeleton type="curve" isRTL={isRTL} /> : (
              <ChartContainer config={{}} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mainChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs><linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} /><stop offset="95%" stopColor="#f59e0b" stopOpacity={0} /></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted-foreground/30" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'hsl(var(--foreground) / 0.7)' }} stroke={'hsl(var(--foreground) / 0.7)'} />
                    <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--foreground) / 0.7)' }} stroke={'hsl(var(--foreground) / 0.7)'} />
                    <Tooltip content={<CustomChartTooltip />} cursor={{ fill: 'hsl(var(--foreground) / 0.1)' }} />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Area type="monotone" dataKey="value" name={t('attendance.count')} stroke="#f59e0b" fill="url(#colorValue)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="col-span-full">
        <AttendanceTable data={tableData} onEdit={handleEditAttendance} onDelete={handleDeleteAttendance} isRTL={isRTL} searchTerm={searchTerm} onSearchChange={handleSearchChange} filters={filters} onFilterChange={handleFilterChange} showPagination pageSize={pageSize} currentPage={currentPage} totalPages={pagination?.pages || 1} totalItems={pagination?.total || 0} onPageChange={handlePageChange} onPageSizeChange={handlePageSizeChange} loading={loading.list} dynamicFilters={{ department: ['all', ...departments] }} />
      </motion.div>

      <BaseCreateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'add' ? t('attendance.addAttendance') : t('attendance.editAttendance')} description={modalMode === 'add' ? t('attendance.modal.addDescription') : t('attendance.modal.editDescription')} onSubmit={handleFormSubmit} submitLabel={modalMode === 'add' ? t('attendance.markAttendance') : t('common.save')} isSubmitting={loading.action} type="attendance" gradient="from-amber-500 to-amber-600" isRTL={isRTL}>
        <AttendanceModalFields formData={formData} handleChange={handleInputChange} isRTL={isRTL} staffList={staffList} departments={departments} modalMode={modalMode} workHours={workHours?.global} />
      </BaseCreateModal>
    </div>
  );
};

export default Attendance;
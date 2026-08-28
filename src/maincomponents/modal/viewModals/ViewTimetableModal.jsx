import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseViewModal from './BaseViewModal';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Clock, Calendar, BookOpen, MapPin, GraduationCap, Building, Users, CheckCircle, XCircle, User, Layers, Mail, Hash } from 'lucide-react';
import ViewModalSkeleton from '@maincomponents/skeletons/ViewModalSkeleton';

const ViewTimetableModal = ({
  isOpen,
  onClose,
  data,
  isRTL = false,
  currentLanguage = 'en',
  onEdit,
  onDelete,
  loading = false
}) => {
  const { t } = useTranslation();

  const getBilingualValue = (obj) => {
    if (!obj) return '-';
    if (typeof obj === 'string') return obj || '-';
    if (typeof obj === 'object' && obj !== null) {
      return obj[currentLanguage] || obj.en || obj.ar || '-';
    }
    return String(obj) || '-';
  };

  const renderContent = () => {
    if (loading) {
      return <ViewModalSkeleton />;
    }

    if (!data) return null;
    
    const getClassName = () => getBilingualValue(data.classInfo?.name || data.className) || t('timetable.unknownClass');
    const getClassSection = () => getBilingualValue(data.classInfo?.section || data.section) || '-';

    const formatDate = (dateString) => {
      if (!dateString) return '-';
      try {
        return new Date(dateString).toLocaleDateString(currentLanguage === 'ar' ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      } catch { return '-'; }
    };

    const formatTime = (dateString) => {
      if (!dateString) return '-';
      try {
        return new Date(dateString).toLocaleTimeString(currentLanguage === 'ar' ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      } catch { return '-'; }
    };
    
    const getTeacherDisplay = (teacherInfo) => {
      if (!teacherInfo) return t('timetable.unknownTeacher');
      const name = getBilingualValue(teacherInfo.name);
      if (name && name !== '-') return name;
      if (teacherInfo.email) return teacherInfo.email;
      if (teacherInfo.id) return `${t('timetable.teacher')} (${teacherInfo.id})`;
      return t('timetable.unknownTeacher');
    };
    
    const getCourseDisplay = (courseInfo) => {
      if (!courseInfo) return t('common.unspecified');
      const name = getBilingualValue(courseInfo.name);
      if (name && name !== '-') return name;
      if (courseInfo.code) return courseInfo.code;
      return t('common.unspecified');
    };
    
    const groupScheduleByDay = (schedule) => {
      if (!schedule || !Array.isArray(schedule)) return {};
      return schedule.reduce((acc, item) => {
        const dayEn = typeof item.day === 'string' ? item.day : (item.day?.en || 'Unknown');
        if (!acc[dayEn]) acc[dayEn] = { dayEn, dayAr: typeof item.day === 'string' ? item.day : (item.day?.ar || dayEn), items: [] };
        acc[dayEn].items.push(item);
        return acc;
      }, {});
    };

    const scheduleItems = data?.schedule || [];
    const groupedSchedule = groupScheduleByDay(scheduleItems);
    const isActive = data?.active !== false;
    const dayOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const sortedDays = Object.keys(groupedSchedule).sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b));

    return (
      <>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
          <CardContent className="p-6">
            <div className={`flex items-start gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-20 h-20 flex items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg flex-shrink-0">
                <Calendar className="w-10 h-10 text-white" />
              </div>
              <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
                <div className={`flex items-center gap-3 mb-2 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{getClassName()}</h2>
                  <Badge className={`text-sm px-3 py-1 font-semibold border flex items-center gap-1 ${isActive ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}>
                    {isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {isActive ? t('timetable.activeTimetables') : t('timetable.inactiveTimetables')}
                  </Badge>
                </div>
                <div className={`flex flex-wrap gap-4 text-gray-600 dark:text-gray-400 mt-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className={`flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}><Building className="w-4 h-4 text-indigo-500" />{t('classes.form.section')}: {getClassSection()}</span>
                  <span className={`flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}><Clock className="w-4 h-4 text-blue-500" />{scheduleItems.length} {t('timetable.entries')}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3"><CardTitle className={`text-lg font-semibold flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}><GraduationCap className="h-5 w-5 text-indigo-600" />{t('timetable.academicInfo')}</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <InfoItem icon={Calendar} label={t('classes.form.academicYear')} value={getBilingualValue(data?.academicYear)} />
              <InfoItem icon={BookOpen} label={t('classes.form.semester')} value={getBilingualValue(data?.semester)} />
              <InfoItem icon={Layers} label={t('classes.form.level')} value={getBilingualValue(data?.level)} />
              <InfoItem icon={Building} label={t('classes.form.section')} value={getBilingualValue(data?.section)} />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3"><CardTitle className={`text-lg font-semibold flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}><Clock className="h-5 w-5 text-orange-600" />{t('timetable.scheduleEntries')}<Badge variant="secondary" className="ml-2 bg-indigo-100 text-indigo-800">{scheduleItems.length} {t('timetable.entries')}</Badge></CardTitle></CardHeader>
          <CardContent>
            {scheduleItems.length === 0 ? (
              <div className="text-center py-12 text-gray-500"><Clock className="w-16 h-16 mx-auto mb-4 opacity-30" /><p className="text-lg font-medium">{t('timetable.noEntries')}</p><p className="text-sm mt-1">{t('timetable.uploadToAdd')}</p></div>
            ) : (
              <div className="space-y-6">
                {sortedDays.map((dayKey) => {
                  const dayData = groupedSchedule[dayKey];
                  return (
                    <div key={dayKey} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                      <div className={`bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-3 ${isRTL ? 'text-right' : ''}`}>
                        <h3 className={`font-semibold text-white flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}><Calendar className="w-4 h-4" />{currentLanguage === 'ar' ? dayData.dayAr : dayData.dayEn}<Badge className="bg-white/20 text-white border-0 ml-2">{dayData.items.length} {t('timetable.entries')}</Badge></h3>
                      </div>
                      <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        {dayData.items.map((item, index) => (
                          <div key={item._id || index} className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${isRTL ? 'text-right' : ''}`}>
                            <div className={`flex items-center gap-4 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <div className={`flex items-center gap-2 min-w-[140px] ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-indigo-100"><Clock className="w-5 h-5 text-indigo-600" /></div>
                                <div><p className="font-semibold text-sm">{formatTime(item.startTime)}</p><p className="text-xs text-gray-500">{formatTime(item.endTime)}</p></div>
                              </div>
                              <div className={`flex items-center gap-2 flex-1 min-w-[150px] ${isRTL ? 'flex-row-reverse' : ''}`}><BookOpen className="w-4 h-4 text-blue-500" /><div><p className="font-medium text-sm">{getCourseDisplay(item.courseInfo)}</p>{item.courseInfo?.code && <p className="text-xs text-gray-500">{item.courseInfo.code}</p>}</div></div>
                              <div className={`flex items-center gap-2 flex-1 min-w-[180px] ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-100"><User className="w-4 h-4 text-purple-600" /></div>
                                <div><p className="font-medium text-sm">{getTeacherDisplay(item.teacherInfo)}</p>{item.teacherInfo?.id && <p className={`text-xs text-gray-500 flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}><Hash className="w-3 h-3" />{item.teacherInfo.id}</p>}</div>
                              </div>
                              <div className={`flex items-center gap-2 min-w-[100px] ${isRTL ? 'flex-row-reverse' : ''}`}><MapPin className="w-4 h-4 text-green-500" /><Badge variant="outline">{getBilingualValue(item.room)}</Badge></div>
                            </div>
                            {item.teacherInfo?.email && <div className={`mt-2 pt-2 border-t ${isRTL ? 'text-right' : ''}`}><p className={`text-xs text-gray-500 flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}><Mail className="w-3 h-3" />{item.teacherInfo.email}</p></div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </>
    );
  };
  
  const InfoItem = ({ icon: Icon, label, value }) => (
    <div className={`p-4 bg-gray-50 dark:bg-gray-800 rounded-xl ${isRTL ? 'text-right' : ''}`}>
      <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Icon className="w-4 h-4 text-indigo-500" />
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</span>
      </div>
      <p className="text-lg font-semibold text-gray-900 dark:text-white">{value}</p>
    </div>
  );

  return (
    <BaseViewModal isOpen={isOpen} onClose={onClose} data={data} type="timetable"
      title={t('timetable.modal.viewTitle')} description={t('timetable.modal.viewDesc')} gradient="from-indigo-500 to-indigo-600"
      isRTL={isRTL} onEdit={onEdit} onDelete={onDelete} showEditButton showDeleteButton
      loading={loading}
    >
      {renderContent()}
    </BaseViewModal>
  );
};

export default ViewTimetableModal;
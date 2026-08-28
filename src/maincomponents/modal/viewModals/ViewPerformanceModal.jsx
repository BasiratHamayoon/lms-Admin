import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import BaseViewModal from './BaseViewModal';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import ViewModalSkeleton from '../../Skeletons/ViewModalSkeleton';
import {
  Calendar, Star, Building, Award, Target, Clock, Users, MessageSquare, TrendingUp
} from 'lucide-react';

const ViewPerformanceModal = ({
  isOpen,
  onClose,
  data,
  isLoading = false,
  isRTL = false,
  currentLanguage = 'en'
}) => {
  const { t } = useTranslation();

  const transformedData = useMemo(() => {
    if (!data) return null;
    const { teacher, currentPerformance } = data;
    if (!teacher || !currentPerformance) return null;

    const ratings = currentPerformance.ratings || {};

    return {
      userName: teacher.name,
      avatar: teacher.avatar,
      userRole: teacher.role,
      department: teacher.department,
      position: currentPerformance.position || 'N/A',
      reviewPeriod: currentPerformance.period,
      ratings: {
        overallRating: ratings.overallRating ?? 0,
        teachingQuality: ratings.teachingQuality ?? 0,
        punctuality: ratings.punctuality ?? 0,
        classroomManagement: ratings.classroomManagement ?? 0,
        teamwork: ratings.teamwork ?? 0,
        communication: ratings.communication ?? 0,
        initiative: ratings.initiative ?? 0,
        professionalDevelopment: ratings.professionalDevelopment ?? 0,
      },
      reviewerComments: currentPerformance.feedback,
      achievements: currentPerformance.achievements || [],
      areasOfImprovement: currentPerformance.areasOfImprovement || [],
    };
  }, [data]);

  const renderStarRating = (rating) => (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
      ))}
      <span className="ml-2 text-sm font-medium">{Number(rating).toFixed(1)}</span>
    </div>
  );

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300';
    if (rating >= 4.0) return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300';
    if (rating >= 3.0) return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/40 dark:text-orange-300';
    return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-300';
  };

  const getUserInitials = (name) => {
    if (!name) return 'U';
    return String(name).split(' ').map(n => n[0]?.toUpperCase() || '').join('').slice(0, 2) || 'U';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString(currentLanguage === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  const ratingCategories = [
    { key: 'teachingQuality', label: 'performance.teachingQuality', icon: Target },
    { key: 'punctuality', label: 'performance.punctuality', icon: Clock },
    { key: 'classroomManagement', label: 'performance.classroomManagement', icon: Users },
    { key: 'teamwork', label: 'performance.teamwork', icon: Users },
    { key: 'communication', label: 'performance.communication', icon: MessageSquare },
    { key: 'initiative', label: 'performance.initiative', icon: TrendingUp },
    { key: 'professionalDevelopment', label: 'performance.professionalDevelopment', icon: TrendingUp }
  ];

  const renderContent = () => {
    if (isLoading) {
      return <ViewModalSkeleton />;
    }

    const displayData = transformedData;
    if (!displayData) return null;

    return (
      <div className="space-y-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <CardContent className="p-6">
            <div className={`flex items-start gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                <AvatarImage src={displayData.avatar} />
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xl">
                  {getUserInitials(displayData.userName)}
                </AvatarFallback>
              </Avatar>

              <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                <div className={`flex items-center gap-3 mb-2 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{displayData.userName}</h2>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    {displayData.userRole}
                  </Badge>
                </div>

                <div className={`flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4" /> {displayData.department}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatDate(displayData.reviewPeriod?.startDate)} - {formatDate(displayData.reviewPeriod?.endDate)}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className={`text-lg font-semibold flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Award className="h-5 w-5 text-yellow-600" />
              {t('performance.overallRating')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
                  {Number(displayData.ratings.overallRating).toFixed(1)}
                </div>
                <div className="text-sm text-gray-500">{t('performance.outOf5')}</div>
                <div className="flex justify-center mt-2">
                  {renderStarRating(displayData.ratings.overallRating)}
                </div>
              </div>

              <div className="flex-1 w-full">
                <div className="space-y-3">
                  {ratingCategories.map((cat) => {
                    const val = displayData.ratings?.[cat.key] ?? 0;
                    return (
                      <div key={cat.key} className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0">
                        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <cat.icon className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{t(cat.label)}</span>
                        </div>
                        <Badge className={`${getRatingColor(val)}`}>{Number(val).toFixed(1)}</Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {displayData.reviewerComments && (
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className={`text-lg font-semibold flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <MessageSquare className="h-5 w-5 text-blue-600" />
                {t('performance.reviewerComments')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {displayData.reviewerComments}
              </div>
            </CardContent>
          </Card>
        )}

        {(displayData.achievements.length > 0 || displayData.areasOfImprovement.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayData.achievements.length > 0 && (
              <Card className="border-0 shadow-lg">
                <CardHeader><CardTitle className="text-md flex items-center gap-2"><Award className="w-4 h-4 text-green-500" /> {t('performance.achievements')}</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {displayData.achievements.map((item, i) => (
                    <div key={i} className="text-sm p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-100 dark:border-green-800">
                      {item.description}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
            {displayData.areasOfImprovement.length > 0 && (
              <Card className="border-0 shadow-lg">
                <CardHeader><CardTitle className="text-md flex items-center gap-2"><Target className="w-4 h-4 text-red-500" /> {t('performance.areasOfImprovement')}</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {displayData.areasOfImprovement.map((item, i) => (
                    <div key={i} className="text-sm p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-100 dark:border-red-800">
                      {item.description}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <BaseViewModal
      isOpen={isOpen}
      onClose={onClose}
      data={transformedData}
      type="performance"
      title={t('performance.performanceDetails')}
      description={t('performance.modal.viewDescription')}
      gradient="from-purple-500 to-purple-600"
      isRTL={isRTL}
      showEditButton={false}
      showEmailButton={false}
      showDeleteButton={false}
    >
      {renderContent()}
    </BaseViewModal>
  );
};

export default ViewPerformanceModal;
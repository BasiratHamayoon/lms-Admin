import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { useAppTranslation } from '../../hooks/use-translation';
import { DASHBOARD_CONSTANTS } from '../../data/Constants';
import { useNavigate } from 'react-router-dom';
import RecentActivitiesSkeleton from '../Skeletons/RecentActivitiesSkeleton';

const RecentActivities = ({ activities = [], loading = false }) => {
  const { t } = useAppTranslation();
  const navigate = useNavigate();
  const { RECENT_ACTIVITIES } = DASHBOARD_CONSTANTS;

  // Show skeleton if loading
  if (loading) {
    return <RecentActivitiesSkeleton />;
  }

  // Format time with translation support
  const formatTime = hoursAgo => {
    if (hoursAgo < 0.0167) { // Less than 1 minute
      return t('dashboard.time.justNow');
    }
    if (hoursAgo < 1) {
      const minutes = Math.round(hoursAgo * 60);
      return t('dashboard.time.minutesAgo', { count: minutes });
    }
    if (hoursAgo < 24) {
      const hours = Math.round(hoursAgo);
      return t('dashboard.time.hoursAgo', { count: hours });
    }
    const days = Math.round(hoursAgo / 24);
    return t('dashboard.time.daysAgo', { count: days });
  };

  // Get translated role/type name
  const getTranslatedType = type => {
    const typeKey = type?.toLowerCase();
    return t(`dashboard.roles.${typeKey}`, type);
  };

  const getTypeColor = type => {
    const colorMap = {
      student: 'blue',
      course: 'green',
      staff: 'purple',
      teacher: 'indigo',
      department: 'orange',
      system: 'teal',
      admin: 'red'
    };
    return colorMap[type?.toLowerCase()] || 'blue';
  };

  const getTypeColorClasses = type => {
    const color = getTypeColor(type);
    const colorClasses = {
      blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
      green: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
      purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
      indigo: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300',
      orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
      teal: 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300',
      red: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
    };
    return colorClasses[color] || colorClasses.blue;
  };

  const handleActivityClick = route => {
    if (route) {
      navigate(route);
    }
  };

  const safeActivities = Array.isArray(activities) ? activities : [];

  return (
    <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white via-white to-gray-50/80 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900/80 backdrop-blur-sm py-2">
      <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-700">
        <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900 dark:text-white">
          <div className="w-3 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg"></div>
          <span className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
            {t('dashboard.recentActivity')}
          </span>
          <Badge
            variant="secondary"
            className="ml-auto bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-md"
          >
            {safeActivities.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <motion.div
          className="space-y-4"
          key={safeActivities.length}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: RECENT_ACTIVITIES.ANIMATION.STAGGER || 0.1
              }
            }
          }}
        >
          {safeActivities.length > 0 ? (
            safeActivities.slice(0, 5).map((activity, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ duration: RECENT_ACTIVITIES.ANIMATION.DURATION || 0.3 }}
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/80 dark:hover:bg-gray-700/50 transition-all duration-300 group cursor-pointer border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-500/30 hover:shadow-md backdrop-blur-sm"
                onClick={() => handleActivityClick(activity.route)}
              >
                <div className="relative">
                  <Avatar className="h-14 w-14 border-2 border-white dark:border-gray-600 shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                    <AvatarFallback
                      className={`bg-gradient-to-br ${
                        RECENT_ACTIVITIES.COLORS[activity.color] ||
                        RECENT_ACTIVITIES.COLORS.blue
                      } text-white shadow-inner`}
                    >
                      <activity.icon className="w-6 h-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white dark:bg-gray-800 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                    <div
                      className={`w-2 h-2 rounded-full bg-gradient-to-r ${
                        RECENT_ACTIVITIES.COLORS[activity.color] ||
                        RECENT_ACTIVITIES.COLORS.blue
                      }`}
                    ></div>
                  </div>
                </div>

                <div className="flex-1 min-w-0 space-y-2">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
                    {activity.message}
                  </p>
                  <div className="flex items-center gap-3">
                    {/* Translated Role/Type Badge */}
                    <Badge
                      variant="secondary"
                      className={`text-xs px-3 py-1 font-semibold border-0 shadow-sm ${getTypeColorClasses(activity.type)}`}
                    >
                      {getTranslatedType(activity.type)}
                    </Badge>
                    {/* Translated Time */}
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                      {formatTime(activity.hoursAgo)}
                    </span>
                  </div>
                </div>

                <div
                  className={`w-3 h-3 rounded-full bg-gradient-to-r ${
                    RECENT_ACTIVITIES.COLORS[activity.color] ||
                    RECENT_ACTIVITIES.COLORS.blue
                  } opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg`}
                ></div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                {t('common.noData', 'No recent activities')}
              </p>
            </motion.div>
          )}
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default RecentActivities;
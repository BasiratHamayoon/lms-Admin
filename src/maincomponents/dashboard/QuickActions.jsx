import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useAppTranslation } from '../../hooks/use-translation';
import { DASHBOARD_CONSTANTS } from '../../data/Constants';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap } from 'lucide-react';
import QuickActionsSkeleton from '../Skeletons/QuickActionsSkeleton';

const QuickActions = ({ actions = [], loading = false }) => {
  const { t } = useAppTranslation();
  const navigate = useNavigate();
  const { QUICK_ACTIONS } = DASHBOARD_CONSTANTS;

  // Show skeleton if loading
  if (loading) {
    return <QuickActionsSkeleton />;
  }

  const handleActionClick = route => {
    if (route) {
      navigate(route);
    }
  };

  const safeActions = Array.isArray(actions) ? actions : [];

  const getColorClass = color => {
    const colorMap = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600',
      teal: 'from-teal-500 to-teal-600'
    };
    return colorMap[color] || 'from-blue-500 to-blue-600';
  };

  const getIconBgClass = color => {
    const bgMap = {
      blue: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
      green: 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400',
      purple: 'bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400',
      orange: 'bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400',
      teal: 'bg-teal-500/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400'
    };
    return (
      bgMap[color] ||
      'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'
    );
  };

  return (
    <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white via-white to-gray-50/80 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900/80 backdrop-blur-sm py-2">
      <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-700">
        <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900 dark:text-white">
          <div className="w-3 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-lg"></div>
          <span className="bg-gradient-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-600 bg-clip-text text-transparent">
            {t('dashboard.quickActions')}
          </span>
          <Badge
            variant="secondary"
            className="ml-auto bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-md"
          >
            {safeActions.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: QUICK_ACTIONS.ANIMATION.STAGGER
              }
            }
          }}
        >
          {safeActions.length > 0 ? (
            safeActions.map((action, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, scale: 0.9, y: 10 },
                  visible: { opacity: 1, scale: 1, y: 0 }
                }}
                transition={{ duration: QUICK_ACTIONS.ANIMATION.DURATION }}
                className="group"
              >
                <Button
                  variant="outline"
                  onClick={() => handleActionClick(action.route)}
                  className="w-full h-full min-h-[140px] p-5 flex flex-col items-center justify-between border-2 border-gray-200/80 dark:border-gray-600/80 hover:border-transparent bg-white/60 dark:bg-gray-700/60 hover:bg-gradient-to-br hover:from-white hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-800/80 transition-all duration-500 group-hover:scale-105 shadow-md hover:shadow-2xl backdrop-blur-sm relative overflow-hidden"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${getColorClass(
                      action.color
                    )} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                  ></div>

                  <div className="flex flex-col items-center gap-4 flex-1 w-full">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:shadow-2xl ${getIconBgClass(
                        action.color
                      )} group-hover:bg-opacity-20 group-hover:shadow-lg backdrop-blur-sm border border-white/20`}
                    >
                      <action.icon className="w-7 h-7 transition-transform duration-500 group-hover:scale-110" />
                    </div>

                    <div className="flex-1 text-center space-y-2 w-full">
                      <p className="font-bold text-gray-900 dark:text-white text-sm leading-tight group-hover:text-gray-800 dark:group-hover:text-gray-100 transition-colors">
                        {t(action.title)}
                      </p>
                      {action.description && (
                        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
                          {t(action.description)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-600 flex items-center justify-center group-hover:bg-gradient-to-r group-hover:from-gray-200 group-hover:to-gray-300 dark:group-hover:from-gray-500 dark:group-hover:to-gray-600 transition-all duration-500 mt-3 group-hover:scale-110 shadow-sm">
                    <ArrowRight className="w-3 h-3 text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-100 transition-colors duration-500 group-hover:translate-x-0.5" />
                  </div>
                </Button>
              </motion.div>
            ))
          ) : (
            <div className="col-span-2 text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                {t('dashboard.noData')}
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                {t('dashboard.noQueriesDesc')}
              </p>
            </div>
          )}
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
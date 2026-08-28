// src/maincomponents/cards/StatsCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import StatsCardSkeleton from '@maincomponents/Skeletons/StatsCardSkeleton';

const StatsCard = ({ title, value, change, icon: Icon, color, delay = 0, route, loading = false }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const colorClasses = {
    blue: 'bg-gradient-to-r from-blue-500 to-blue-600',
    green: 'bg-gradient-to-r from-green-500 to-green-600',
    purple: 'bg-gradient-to-r from-purple-500 to-purple-600',
    teal: 'bg-gradient-to-r from-teal-500 to-teal-600'
  };

  const iconContainerClasses = {
    blue: 'bg-white/20',
    green: 'bg-white/20',
    purple: 'bg-white/20',
    teal: 'bg-white/20'
  };

  const handleClick = () => {
    if (route) {
      navigate(route);
    }
  };

  if (loading) {
    return <StatsCardSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onClick={handleClick}
      className={`${colorClasses[color]} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer`}
    >
      <div
        className={`flex items-center justify-between ${
          i18n.language === 'ar' ? 'flex-row-reverse' : ''
        }`}
      >
        <div className={i18n.language === 'ar' ? 'text-right' : ''}>
          <h3 className="text-white/90 text-sm font-medium uppercase tracking-wide">
            {t(title)}
          </h3>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
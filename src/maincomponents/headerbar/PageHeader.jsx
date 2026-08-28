import { motion } from 'framer-motion';

const PageHeader = ({ title, description, action, align = 'left', className = '', isRTL = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        ease: [0.25, 0.46, 0.45, 0.94] 
      }}
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 ${className} ${
        isRTL ? 'sm:flex-row-reverse' : ''
      }`}
    >
      {/* For RTL: Show action button first, then title/description */}
      {isRTL && action && <div className="flex-shrink-0">{action}</div>}
      
      <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'} ${align === 'center' ? 'text-center' : ''}`}>
        <h1 className={`text-2xl font-semibold text-gray-900 dark:text-white mb-2 ${
          isRTL ? 'text-left' : ''
        } ${align === 'center' ? 'text-center' : ''}`}>
          {title}
        </h1>
        {description && (
          <p className={`text-gray-600 dark:text-gray-400 text-sm max-w-2xl ${isRTL ? 'text-left' : ''} ${
            align === 'center' ? 'text-center' : ''
          }`}>
            {description}
          </p>
        )}
      </div>
      
      {/* For LTR: Show action button after title/description */}
      {!isRTL && action && <div className="flex-shrink-0">{action}</div>}
    </motion.div>
  );
};

export default PageHeader;
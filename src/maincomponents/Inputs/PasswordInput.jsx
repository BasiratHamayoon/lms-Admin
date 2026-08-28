import React, { useState } from 'react';
import { Input } from '@maincomponents/components/ui/input';
import { FormControl, FormItem, FormLabel, FormMessage } from '@maincomponents/components/ui/form';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { MdLock } from 'react-icons/md';
import { LOGIN_CONSTANTS } from '../../data/Constants';

const PasswordInput = ({ label, placeHolder, field, fieldState, isRTL = false }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormItem>
      <FormLabel className={LOGIN_CONSTANTS.TEXT_STYLES.label}>{label}</FormLabel>
      <div className="relative">
        {/* Password icon on the start side */}
        <div className={`${LOGIN_CONSTANTS.INPUT_STYLES.icon.base} ${
          isRTL ? 'right-3' : 'left-3'
        } flex items-center justify-center`}>
          <MdLock size={LOGIN_CONSTANTS.ICON_SIZES.input} />
        </div>
        
        <FormControl>
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder={placeHolder}
            {...field}
            className={`${LOGIN_CONSTANTS.INPUT_STYLES.base} ${LOGIN_CONSTANTS.INPUT_STYLES.light} ${LOGIN_CONSTANTS.INPUT_STYLES.dark} ${LOGIN_CONSTANTS.INPUT_STYLES.focus} ${
              isRTL ? 'pr-10 pl-3' : 'pl-10 pr-3'
            }`}
            value={field.value || ''}
          />
        </FormControl>

        {/* Show/Hide password button on the opposite side */}
        <button
          type='button'
          onClick={() => setShowPassword(!showPassword)}
          className={`absolute top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 ${
            isRTL ? 'left-3' : 'right-3'
          }`}
          tabIndex={-1}
        >
          {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
        </button>
      </div>
      {fieldState?.error && (
        <motion.div 
          className={LOGIN_CONSTANTS.TEXT_STYLES.error}
          variants={LOGIN_CONSTANTS.ANIMATIONS.error}
          initial="hidden"
          animate="visible"
        >
          {fieldState.error.message}
        </motion.div>
      )}
    </FormItem>
  );
};

export default PasswordInput;
import { FormControl, FormItem, FormLabel, FormMessage } from '@maincomponents/components/ui/form';
import { Input } from '@maincomponents/components/ui/input';
import React from 'react';
import { motion } from 'framer-motion';
import { MdEmail } from 'react-icons/md';
import { LOGIN_CONSTANTS } from '../../data/Constants';

const TextInput = ({ label, placeHolder, type, field, fieldState, isRTL = false }) => {
  return (
    <FormItem>
      <FormLabel className={LOGIN_CONSTANTS.TEXT_STYLES.label}>{label}</FormLabel>
      <div className="relative">
        <div className={`${LOGIN_CONSTANTS.INPUT_STYLES.icon.base} ${
          isRTL ? 'right-3' : 'left-3'
        } flex items-center justify-center`}>
          <MdEmail size={LOGIN_CONSTANTS.ICON_SIZES.input} />
        </div>
        <FormControl>
          <Input
            type={type}
            placeholder={placeHolder}
            {...field}
            className={`${LOGIN_CONSTANTS.INPUT_STYLES.base} ${LOGIN_CONSTANTS.INPUT_STYLES.light} ${LOGIN_CONSTANTS.INPUT_STYLES.dark} ${LOGIN_CONSTANTS.INPUT_STYLES.focus} ${
              isRTL ? 'pr-10 pl-3' : 'pl-10 pr-3'
            }`}
            value={field.value || ''}
          />
        </FormControl>
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

export default TextInput;
import { useState } from 'react';
import { useToast } from '../../../hooks/use-toast';
import { useAppTranslation } from '../../../hooks/use-translation';

export function useSettingsForm(initialData, onSuccess) {
  const [formData, setFormData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useAppTranslation();

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e, validationFn) => {
    e?.preventDefault();
    
    if (validationFn && !validationFn(formData)) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onSuccess) {
        onSuccess(formData);
      }
      
      toast({
        title: t('settings.changesSaved'),
        description: t('settings.saving'),
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialData);
  };

  return {
    formData,
    isLoading,
    handleChange,
    handleSubmit,
    resetForm,
    setFormData
  };
}
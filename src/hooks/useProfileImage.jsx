import { useState, useRef } from 'react';
import { useAppTranslation } from '../hooks/use-translation';

export function useProfileImage() {
  const [avatarUrl, setAvatarUrl] = useState('/avatars/01.png');
  const fileInputRef = useRef(null);
  const { toast } = useToast();
  const { t } = useAppTranslation();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file size
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: t('settings.uploadError'),
        description: t('settings.profileSection.photoSize'),
        variant: 'destructive'
      });
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: t('settings.uploadError'),
        description: t('settings.profileSection.photoSize'),
        variant: 'destructive'
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarUrl(reader.result);
      toast({
        title: t('settings.profileSection.uploadSuccess'),
        description: t('settings.changesSaved'),
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl('');
    toast({
      title: t('settings.profileSection.removeSuccess'),
      description: t('settings.changesSaved'),
    });
  };

  return {
    avatarUrl,
    fileInputRef,
    handleFileChange,
    handleRemoveAvatar
  };
}
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppTranslation } from '../../hooks/use-translation';
import { ANIMATION_CONFIG } from '../../data/Constants';
import { SETTINGS_CONSTANTS } from '../../data/Constants';
import { Card } from '../../maincomponents/components/ui/card';
import ProfileTab from '@maincomponents/settings/ProfileTab';
import SecurityTab from '@maincomponents/settings/SecurityTab';
// import NotificationsTab from '@maincomponents/settings/NotificationsTab';
import SettingsLayout from '@layouts/SettingsLayout';
import LogoutTab from '@maincomponents/settings/LogoutSection';
import { User, Lock, Bell, LogOut } from 'lucide-react';
import PageHeader from '@maincomponents/headerbar/PageHeader';

export default function Settings() {
  const { t, isRTL } = useAppTranslation();
  const [activeTab, setActiveTab] = useState(SETTINGS_CONSTANTS.TABS.PROFILE);

  const tabs = [
    { id: SETTINGS_CONSTANTS.TABS.PROFILE, label: t('settingsPage.profile.tab'), icon: User },
    { id: SETTINGS_CONSTANTS.TABS.SECURITY, label: t('settingsPage.security.tab'), icon: Lock },
    // { id: SETTINGS_CONSTANTS.TABS.NOTIFICATIONS, label: t('settingsPage.notifications.tab'), icon: Bell },
    { id: SETTINGS_CONSTANTS.TABS.LOGOUT, label: t('common.logout'), icon: LogOut }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case SETTINGS_CONSTANTS.TABS.PROFILE:
        return <ProfileTab />;
      case SETTINGS_CONSTANTS.TABS.SECURITY:
        return <SecurityTab />;
      // case SETTINGS_CONSTANTS.TABS.NOTIFICATIONS:
      //   return <NotificationsTab />;
      case SETTINGS_CONSTANTS.TABS.LOGOUT:
        return <LogoutTab />;
      default:
        return <ProfileTab />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: ANIMATION_CONFIG.duration.normal }}
      className="space-y-6 py-6 px-2"
    >
      <PageHeader
        title={t('settingsPage.title')}
        description={t('settingsPage.description')}
        isRTL={isRTL}
        align={isRTL ? 'right' : 'left'}
      />
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white via-white to-gray-50/80 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900/80 backdrop-blur-sm p-6">
        <SettingsLayout
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        >
          {renderTabContent()}
        </SettingsLayout>
      </Card>
    </motion.div>
  );
}
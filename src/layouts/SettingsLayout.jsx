import { Tabs, TabsContent, TabsList, TabsTrigger } from '../maincomponents/components/ui/tabs';
import { useAppTranslation } from '../hooks/use-translation';

export default function SettingsLayout({ tabs, activeTab, onTabChange, children }) {
  const { isRTL } = useAppTranslation();

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <TabsList className={`flex w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-1 shadow-sm ${
        isRTL ? 'flex-row-reverse' : ''
      }`}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <TabsTrigger 
              key={tab.id} 
              value={tab.id} 
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 data-[state=active]:shadow-lg ${
                isRTL ? 'flex-row-reverse' : ''
              } ${
                tab.id === 'profile' ? 'data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white' :
                tab.id === 'security' ? 'data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white' :
                tab.id === 'notifications' ? 'data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white' :
                'data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-600 data-[state=active]:text-white'
              } text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white data-[state=active]:text-white`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>
      
      <TabsContent value={activeTab} className="space-y-4 mt-0">
        {children}
      </TabsContent>
    </Tabs>
  );
}
import { useState, useEffect } from 'react';
import { Globe, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { useAppTranslation } from '../../hooks/use-translation';

const languages = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
];

export function LanguageSwitcher() {
  const { changeLanguage, currentLanguage, isRTL } = useAppTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Set initial direction
    document.documentElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  const handleLanguageChange = (languageCode) => {
    changeLanguage(languageCode);
  };

  const currentLang = languages.find(lang => lang.code === currentLanguage);

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="gap-2">
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">EN</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLanguage.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Select Language</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <span className="text-lg">{language.flag}</span>
              <div className="flex flex-col text-left">
                <span className="font-medium">{language.name}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {language.nativeName}
                </span>
              </div>
            </div>
            {currentLanguage === language.code && (
              <Check className="h-4 w-4 text-blue-600" />
            )}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <div className="p-2">
          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
            <div className={`w-2 h-2 rounded-full ${
              isRTL ? 'bg-green-500' : 'bg-blue-500'
            }`} />
            <span>
              {isRTL ? 'Right to Left Layout' : 'Left to Right Layout'}
            </span>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
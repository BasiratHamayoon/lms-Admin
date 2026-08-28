// ThemeSwitch.jsx
import { Computer, Moon, PcCase, Sun } from 'lucide-react';
import { Button } from '../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { useTheme } from '../../hooks/themeProvider';
import { MdSystemSecurityUpdate } from 'react-icons/md';

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <DropdownMenuItem 
          onClick={() => setTheme('light')}
          className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <Sun className="mr-2 h-4 w-4" />
          <span className="text-gray-900 dark:text-gray-100">Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('dark')}
          className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <Moon className="mr-2 h-4 w-4" />
          <span className="text-gray-900 dark:text-gray-100">Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('system')}
          className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <span className="mr-2"><Computer /></span>
          <span className="text-gray-900 dark:text-gray-100">System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
import { RouterProvider } from 'react-router-dom';
import routes from './routes';
import { useEffect, useState } from 'react';
import MainLoader from '@maincomponents/loaders/MainLoader';
import { ThemeProvider } from '@hooks/themeProvider';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { Toaster } from '@maincomponents/components/ui/sonner';
import AuthLoader from '@utils/authLoader'

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <AuthLoader>
        {loading ? <MainLoader /> : <RouterProvider router={routes} />}
        </AuthLoader>
      </ThemeProvider>
      <Toaster />
    </I18nextProvider>
  );
}

export default App;
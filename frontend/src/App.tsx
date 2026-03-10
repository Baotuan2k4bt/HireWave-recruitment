import './App.css';
import { createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/tiptap/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import { Notifications } from '@mantine/notifications';
import { Provider } from 'react-redux';
import Store from './Store';
import AppRoutes from './Pages/AppRoutes';
// @ts-ignore
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    AOS.init({
      offset: 0,
      duration: 800,
      easing: 'ease-out',
    });
    AOS.refresh();
  }, []);

  const theme = createTheme({
    focusRing: 'never',
    fontFamily: 'Poppins, sans-serif',
    primaryColor: 'oceanTeal',
    primaryShade: 4,
    colors: {
      oceanTeal: [
        '#e6fafa',
        '#b3ebeb',
        '#80dbdb',
        '#4dcccc',
        '#1abcbd',
        '#009a9b',
        '#007a7a',
        '#005a5a',
        '#003a3a',
        '#001a1a',
        '#000a0a',
      ],
      deepSlate: [
        '#e9ecef',
        '#dee2e6',
        '#ced4da',
        '#adb5bd',
        '#868e96',
        '#6c757d',
        '#565e64',
        '#474f56',
        '#3b4349',
        '#2f373d',
        '#212529',
      ],
    },
  });

  return (
      <Provider store={Store}>
        <MantineProvider defaultColorScheme="light" theme={theme}>
          <Notifications position="top-center" zIndex={2001} />
          <AppRoutes />
        </MantineProvider>
      </Provider>
  );
}

export default App;
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import 'mobx-react-lite/batchingForReactDom';

import {
  AppFooter,
  VerticalLayout,
  FlexFillLayout,
} from '../components/shared/layout';
import { authStore } from '../store';
import { withStore } from '../lib/utils';
import { initializeAuthListener } from '../lib/firebase';
import '../assets/css/main.css';
import 'remixicon/fonts/remixicon.css';

initializeAuthListener();

const MyApp = observer(({ Component, pageProps, authStore }) => {
  const router = useRouter();

  useEffect(() => {
    if (!authStore.isLoggedIn) {
      if (router.pathname === '/editor') {
        router.push('/');
      }
      return;
    }
    if (router.pathname === '/') {
      router.push('/editor');
    }
  }, [authStore.isLoggedIn]);

  return (
    <VerticalLayout fillHorizontal className='min-h-screen' as='main'>
      <Component {...pageProps} />
      <AppFooter>Built in 2020 by Chidiebere Nnadi.</AppFooter>
    </VerticalLayout>
  );
});

export default withStore(MyApp, { authStore });

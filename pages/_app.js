import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { AppContainer, AppFooter } from '../components/shared/layout';
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
    <AppContainer fillVertical fillHorizontal as='main'>
      <Head>
        <title>Whitespace</title>
      </Head>
      <Component {...pageProps} />
      <AppFooter>Built in 2020 by Chidiebere Nnadi.</AppFooter>
    </AppContainer>
  );
});

export default withStore(MyApp, { authStore });

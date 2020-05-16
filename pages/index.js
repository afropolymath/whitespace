import { useState, useRef } from 'react';
import styled from 'styled-components';
import 'mobx-react-lite/batchingForReactDom';

import { VerticalLayout } from '../components/shared/layout';
import { LogoText } from '../components/shared/typography';
import { Button } from '../components/shared/forms';
import { loginWithGoogle } from '../lib/firebase';

const UIAppCard = styled.div`
  text-align: center;
  max-width: 300px;
`;

const AppDescriptionText = styled.h3`
  font-weight: 300;
  font-size: 1.5em;
  line-height: 1.6em;
  margin: 1.5em 0;
  color: #232323;
`;

export const GoogleButton = styled(Button)`
  background-color: #1a73e8;
  border-color: #1a73e8;
  color: white;

  &:hover {
    border-color: #174ea6;
  }

  &:active {
    background-color: #174ea6;
    background-color: #174ea6;
  }
`;

export const SlidingContainer = styled.div`
  max-height: ${(props) => (props.isVisible ? '60px' : '0')};
  height: auto;
  transition: max-height 0.4s;
  overflow: hidden;
`;

export default function Home() {
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [loginControlsVisible, setLoginControlsVisible] = useState(false);
  const slidingContainerRef = useRef(null);

  const toggleLoginControls = () => {
    setLoginControlsVisible(!loginControlsVisible);
  };

  const triggerGoogleLogin = async () => {
    try {
      setIsLoadingUser(true);
      await loginWithGoogle();
    } finally {
      setIsLoadingUser(false);
    }
  };

  return (
    <VerticalLayout flexFill fillHorizontal>
      <UIAppCard>
        <LogoText>Whitespace</LogoText>
        <AppDescriptionText>
          Write your life story with no distractions.
        </AppDescriptionText>
        <SlidingContainer
          ref={slidingContainerRef}
          isVisible={loginControlsVisible}
        >
          <GoogleButton onClick={triggerGoogleLogin} disabled={isLoadingUser}>
            Login with Google
          </GoogleButton>
        </SlidingContainer>
        <Button onClick={toggleLoginControls}>
          {loginControlsVisible ? 'Cancel' : 'Login to get started'}
        </Button>
      </UIAppCard>
    </VerticalLayout>
  );
}

import styled from 'styled-components';
import Link from 'next/link';
import { User } from 'firebase/auth';

import { LogoText } from './typography';
import { logout } from '../../lib/firebase';

export const FlexLayout = styled.div`
  display: flex;
  ${(props) => props.alignCenter && 'align-items: center;'}
  ${(props) => props.alignStretch && 'align-items: stretch;'}
  ${(props) => props.flexFill && 'flex-grow: 1'};
`;

export const FlexFillLayout = styled.div`
  flex-grow: 1;
`;

export const VerticalLayout = styled(FlexLayout)`
  flex-direction: column;
  justify-content: ${(props) => (props.alignTop ? 'flex-start' : 'center')};
  align-items: center;
  height: ${(props) => (props.fillVertical ? '100%' : 'auto')};
  width: ${(props) => (props.fillHorizontal ? '100%' : 'auto')};
  ${(props) => props.flexFill && 'flex-grow: 1'};
`;

export const AppContainer = styled(VerticalLayout)`
  position: absolute;
  left: 0;
  top: 0;
`;

export const AppFooter = styled.footer`
  height: 100px;
  line-height: 100px;
  width: 100%;
  font-size: 0.9em;
  text-align: center;
  color: #868686;
`;

const Header = styled.header`
  padding: 1.2em 0;
  box-sizing: border-box;
`;

const NavControls = styled.ul`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-grow: 1;
  list-style: none;
`;

const NavItem = styled.li`
  display: inline-block;
  font-size: 0.9em;
  font-weight: 300;
  color: #888;

  & + li {
    margin-left: 1.6em;
  }

  i {
    cursor: pointer;
    font-size: 3em;
    color: #232323;
    transition: color 0.3s ease;

    &:hover {
      color: #000;
    }
  }
`;

const LoggedInUserInfo = styled.a`
  text-decoration: none;
  border-bottom: dotted 1px #bbb;
  padding-bottom: 6px;
`;

const EmailSpan = styled.span`
  color: #232323;
`;

export const AppHeader = ({ user }: { user: User }) => (
  <Header className='grid grid-cols-1 md:grid-cols-3'>
    <LogoText noMargins>Whitespace</LogoText>
    <NavControls className='md:col-span-2'>
      {user && (
        <NavItem>
          <Link href=''>
            <LoggedInUserInfo>
              Logged in as <EmailSpan>{user.email}</EmailSpan>
            </LoggedInUserInfo>
          </Link>
        </NavItem>
      )}
      <NavItem onClick={logout}>
        <i className='ri-shut-down-line'></i>
      </NavItem>
    </NavControls>
  </Header>
);

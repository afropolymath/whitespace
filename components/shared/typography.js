import styled from 'styled-components';

export const LogoText = styled.h1`
  font-family: 'Bangers', cursive;
  font-size: 3em;
  color: #ffba0a;
  ${(props) => props.noMargins && 'margin: 0;'}
`;

import styled from 'styled-components';

export const Button = styled.button`
  font-family: 'Fira Sans', Arial, Helvetica, sans-serif;
  font-size: ${(props) =>
    props.small ? '1em' : props.dense ? '0.9em' : '1.2em'};
  color: #868686;
  height: ${(props) => (props.small ? '40px' : props.dense ? '30px' : '50px')};
  line-height: ${(props) =>
    props.small ? '40px' : props.dense ? '30px' : '50px'};
  padding: 0
    ${(props) => (props.small ? '1em' : props.dense ? '0.3em' : '1.8em')};
  background: #ffffff;
  border: 1px solid #dedede;
  box-sizing: border-box;
  box-shadow: 1px 2px 2px rgba(0, 0, 0, 0.15);
  border-radius: ${(props) => (props.small || props.dense ? '4px' : '8px')};
  margin-bottom: 5px;
  cursor: pointer;
  transition: border 0.2s, box-shadow 0.2s, background 0.2s, opacity 0.2s;
  outline: none;
  ${(props) => props.hasIcon && 'display: inline-flex; align-items: center'};

  i {
    ${(props) => !props.iconOnly && 'margin-right: 0.4em;'}
    font-size: 1.3em;
  }

  &:hover {
    border-color: #bbb;
  }

  &:active {
    background: #f9f9f9;
    box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.15) inset;
  }

  &:last-child {
    margin-bottom: none;
  }
`;

const FacebookButton = styled(Button)`
  background-color: #4267b2;
  border-color: #4267b2;
  color: #fff;

  &:hover {
    border-color: #365899;
  }

  &:active {
    background-color: #365899;
  }
`;

export const FlatButton = styled(Button)`
  box-shadow: none;
  border: none;
  background: #545454;
  color: white;

  &:hover {
    box-shadow: none;
    border: none;
  }

  &:active {
    background: #232323;
    box-shadow: none;
  }
`;

export const TransparentButton = styled(Button)`
  border-color: transparent;
  background: transparent;
  box-shadow: none;

  &:hover {
    background: white;
    box-shadow: 1px 2px 2px rgba(0, 0, 0, 0.15);
  }
`;

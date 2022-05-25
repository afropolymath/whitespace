import styled from 'styled-components';

export const ContextMenuControl = styled.div`
  display: inline-block;
  position: relative;
  transition: opacity 0.3s;

  ul {
    display: none;
    z-index: 90;
  }

  button {
    margin-bottom: 0;
  }

  &:hover {
    opacity: 1;

    button {
      position: relative;
      border-color: #bbb;
      box-shadow: 1px 2px 2px rgba(0, 0, 0, 0.15);
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;

      &:after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0.5px;
        right: 0.5px;
        height: 4px;
        background: white;
        z-index: 99;
      }
    }
  }
`;

export const FloatingContextMenuControl = styled(ContextMenuControl)`
  position: absolute;
  right: 0;
  top: 0;
  opacity: 0.3;
  z-index: 90;
`;

export const ContextMenu = styled.ul`
  animation: menuSlide 0.2s ease-in-out;
  position: absolute;
  padding: 0;
  margin: 0;
  top: 100%;
  ${(props) => (!props.right ? 'left:0;' : 'right:0;')}
  width: 150px;
  list-style: none;
  background: white;
  box-shadow: 1px 2px 2px rgba(0, 0, 0, 0.15);
  border: 1px solid #bbb;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;

  ${ContextMenuControl}:hover & {
    display: block;
    ${(props) =>
      !props.right
        ? 'border-top-left-radius: 0; border-top-right-radius: 4px;'
        : 'border-top-left-radius: 4px; border-top-right-radius: 0;'}
  }

  li {
    display: block;
    height: 30px;
    line-height: 30px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    padding: 0 0.6em;
    border-bottom: 1px solid #dedede;
    cursor: pointer;
    transition: border 0.3s;

    &:hover {
      border-color: #bbb;
      background: #f9f9f9;
    }

    &:first-child {
      ${(props) =>
        !props.right
          ? 'border-top-right-radius: 4px;'
          : 'border-top-left-radius: 4px;'}
    }

    &:last-child {
      border-bottom: none;
      border-bottom-right-radius: 4px;
      border-bottom-left-radius: 4px;
    }

    i {
      margin-right: 0.4em;
      font-size: 0.9em;
    }
  }
`;

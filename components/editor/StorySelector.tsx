import styled from 'styled-components';

const FloatingControl = styled.div`
  display: flex;
  align-items: center;
  color: #232323;
  padding: 0.9em 1em;
  background: #ffffff;
  border: 1px solid #d8d8d8;
  box-sizing: border-box;
  box-shadow: 1px 2px 4px 0 rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  width: 100%;
  margin-bottom: 2.5em;
  font-size: 1.1em;

  h4 {
    margin: 0;
    margin-left: 0.7em;
    font-weight: 400;
  }

  i {
    font-size: 1.5em;
  }
`;

export default function StorySelector() {
  return (
    <FloatingControl>
      <i className='ri-pencil-line'></i>
      <h4>A new story is born here</h4>
    </FloatingControl>
  );
}

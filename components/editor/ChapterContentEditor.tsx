import styled from 'styled-components';

import { FlexFillLayout } from '../shared/layout';

const StyledInput = styled.input`
  border: none;
  font-size: 1.5em;
  outline: none;
`;

const StyledTextarea = styled.textarea`
  border: none;
  font-size: 1.2em;
  outline: none;
  font-weight: 300;
  resize: none;
  min-height: 100%;
  margin-top: 1em;
`;

const ChapterContentEditorLayout = styled(FlexFillLayout)`
  padding: 0 4em 0 2em;
`;

export default function ChapterContentEditor() {
  return (
    <ChapterContentEditorLayout>
      <StyledInput type='text' placeholder='Enter chapter title...' />
      <StyledTextarea name='' placeholder='Enter some text...' />
    </ChapterContentEditorLayout>
  );
}

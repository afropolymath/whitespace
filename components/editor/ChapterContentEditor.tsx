import { useState, useCallback, useEffect, useMemo, Fragment } from 'react';
import styled from 'styled-components';

import { FlexFillLayout } from '../shared/layout';
import { Chapter } from '../../lib/firebase';

export const StyledInput = styled.input`
  border: none;
  font-size: 1.5em;
  outline: none;
`;

export const StyledTextarea = styled.textarea`
  border: none;
  font-size: 1.1em;
  line-height: 1.5em;
  outline: none;
  font-weight: 300;
  resize: none;
  min-height: 100%;
  margin-top: 1em;
`;

const ChapterContentEditorLayout = styled(FlexFillLayout)`
  padding: 0 4em 0 2em;
`;

type PartialChapterContent = {
  title: string;
  contents: string;
};

export default function ChapterContentEditor({
  chapter,
  onContentChanged,
}: {
  chapter: Chapter;
  onContentChanged: (content: PartialChapterContent) => void;
}) {
  const chapterId = useMemo(() => (chapter && chapter.id) || null, [chapter]);
  const [chapterContent, setChapterContent] = useState<PartialChapterContent>({
    title: '',
    contents: '',
  });

  const contentChangeHandler = useCallback(
    (fieldName, fieldValue) => {
      setChapterContent({
        ...chapterContent,
        [fieldName]: fieldValue,
      });
      onContentChanged(chapterContent);
    },
    [chapterContent],
  );

  useEffect(() => {
    if (chapterId)
      setChapterContent({
        title: chapter.title,
        contents: chapter.contents,
      });
  }, [chapterId]);

  useEffect(() => {
    if (chapterId) onContentChanged(chapterContent);
  }, [chapterContent]);

  return (
    <ChapterContentEditorLayout>
      {chapterId ? (
        <Fragment>
          <StyledInput
            type='text'
            placeholder='Enter chapter title...'
            value={chapterContent.title}
            onChange={(evt) => contentChangeHandler('title', evt.target.value)}
          />
          <StyledTextarea
            name=''
            placeholder='Enter some text...'
            onChange={(evt) =>
              contentChangeHandler('contents', evt.target.value)
            }
            value={chapterContent.contents}
          />
        </Fragment>
      ) : (
        <div>You have not selected a chapter</div>
      )}
    </ChapterContentEditorLayout>
  );
}

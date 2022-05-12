import { useState, useCallback, useEffect, useMemo, Fragment } from 'react';
import styled from 'styled-components';

import { FlexFillLayout } from '../shared/layout';
import { Chapter, ChapterContent, PartialChapter } from '../../lib/whitespace';
import { Button } from '../shared/forms';

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

export default function ChapterContentEditor({
  chapter,
  onContentChanged,
  onChapterContentAdded,
}: {
  chapter: Chapter | null;
  onContentChanged: (content: PartialChapter) => void;
  onChapterContentAdded: (
    type: 'text',
    initialContent?: string,
  ) => Promise<string>;
}) {
  const chapterId = useMemo(() => (chapter && chapter.id) || null, [chapter]);
  const [activeContentId, setActiveContentId] = useState(null);
  const [chapterContent, setChapterContent] = useState<PartialChapter>({
    title: chapter?.title || '',
    contents: chapter?.contents || null,
  });

  const contentChangeHandler = useCallback(
    (
      fieldName: keyof PartialChapter,
      fieldValue: string | { [key: string]: ChapterContent },
    ) => {
      setChapterContent({
        ...chapterContent,
        [fieldName]:
          typeof fieldValue === 'string'
            ? fieldValue
            : {
                ...(chapterContent['contents']
                  ? chapterContent['contents']
                  : {}),
                ...fieldValue,
              },
      });
    },
    [chapterContent],
  );

  const contentAddedHandler = useCallback(
    async (type: 'text') => {
      const contentId = await onChapterContentAdded(type);
      setActiveContentId(contentId);
    },
    [setActiveContentId],
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
          {chapterContent.contents &&
            Object.keys(chapterContent.contents).map((contentId) => (
              <StyledTextarea
                name=''
                placeholder='Enter some text...'
                onChange={(evt) =>
                  contentChangeHandler('contents', {
                    [contentId]: {
                      type: 'text',
                      content: evt.target.value,
                    },
                  })
                }
                value={chapterContent.contents}
              />
            ))}
          <Button onClick={() => contentAddedHandler('text')}>
            Add content block
          </Button>
        </Fragment>
      ) : (
        <div>You have not selected a chapter</div>
      )}
    </ChapterContentEditorLayout>
  );
}

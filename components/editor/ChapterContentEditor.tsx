import {
  useState,
  useCallback,
  useEffect,
  useMemo,
  Fragment,
  forwardRef,
} from 'react';
import styled from 'styled-components';
import Editor from 'react-simple-code-editor';
import MarkdownEditor from 'rich-markdown-editor';
import TextareaAutosize from 'react-textarea-autosize';
import { highlight, languages } from 'prismjs/components/prism-core';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  useSortable,
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-solarizedlight.min.css';

import { FlexFillLayout, FlexLayout } from '../shared/layout';
import {
  Chapter,
  PartialChapterContent,
  PartialChapter,
  ContentBlockTypes,
} from '../../lib/whitespace';
import { Button, TransparentButton } from '../shared/forms';
import {
  ContextMenu,
  ContextMenuControl,
  FloatingContextMenuControl,
} from '../shared/widgets/menu';
import { Loader } from '../shared/widgets/loader';
import ChapterStats from './ChapterStats';

const ChapterContentEditorLayout = styled.div`
  padding: 0 4em 0 2em;
`;

export const StyledInput = styled.input`
  border: none;
  font-size: 1.5em;
  outline: none;
`;

const StyledTextAreaContainer = styled.div`
  position: relative;
  margin-left: -2em;
  padding-left: 2em;
  margin-right: -2em;
  padding-right: 2em;
  margin-bottom: 1em;

  button {
    display: none;
  }

  &:hover button {
    display: initial;
  }
`;

const DragHandle = styled(Button)`
  position: absolute;
  left: 0;
  top: 0;
  font-size: 0.7em;
  height: 20px;
  line-height: 20px;
  z-index: 99;
  padding: 0 0.3em;
  border-radius: 4px;
  opacity: 0.3;

  &:hover {
    opacity: 1;
  }
`;

const StyledEditor = styled(Editor)`
  background: #fdf6e3;
  border-radius: 4px;
`;

export const StyledTextarea = styled(TextareaAutosize)`
  border: none;
  font-size: 1.1em;
  line-height: 1.5em;
  outline: none;
  font-weight: 300;
  resize: none;
`;

const StyledOverlayIndicator = styled.div`
  cursor: move;
  box-shadow: 1px 2px 2px rgba(0, 0, 0, 0.15);
  font-size: 1.2em;
  height: 35px;
  line-height: 35px;
  background: white;
  border: solid 1px #dedede;
  padding: 0 0.5em;
  border-radius: 8px;
`;

const DragOverlayItem = forwardRef<
  HTMLDivElement,
  { id: string; type: ContentBlockTypes }
>(({ id, type, ...props }, ref) => {
  return (
    <StyledOverlayIndicator ref={ref} {...props}>
      {type === 'text' && <i className='ri-text' />}
      {type === 'code' && <i className='ri-code-line' />}
    </StyledOverlayIndicator>
  );
});

const ControlWithContextMenu = ({
  id,
  children,
  onDelete,
}: {
  id: string;
  children: React.ReactElement;
  onDelete?: () => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <StyledTextAreaContainer ref={setNodeRef}>
      <DragHandle {...attributes} {...listeners} style={style} hasIcon iconOnly>
        <i className='ri-drag-move-fill'></i>
      </DragHandle>
      <FloatingContextMenuControl>
        <Button hasIcon iconOnly dense>
          <i className='ri-more-2-fill' />
        </Button>
        <ContextMenu right>
          <li onClick={onDelete}>
            <i className='ri-delete-bin-fill' />
            Delete components
          </li>
        </ContextMenu>
      </FloatingContextMenuControl>
      {children}
    </StyledTextAreaContainer>
  );
};

export default function ChapterContentEditor({
  chapter,
  onContentChanged,
  onChapterContentAdded,
  onChapterContentDeleted,
}: {
  chapter: Chapter | null;
  onContentChanged: (content: PartialChapter) => void;
  onChapterContentAdded: (
    type: ContentBlockTypes,
    initialContent: string,
    index: number,
    cb?: (contentId: string) => void,
  ) => void;
  onChapterContentDeleted?: (contentId: string) => Promise<void>;
}) {
  const chapterId = useMemo(() => (chapter && chapter.id) || null, [chapter]);
  const [dragActiveId, setDragActiveId] = useState<string | null>(null);
  const [activeContentId, setActiveContentId] = useState(null);
  const [addingContentBlock, setAddingContentBlock] = useState(false);
  const [chapterContent, setChapterContent] = useState<PartialChapter>({
    title: chapter?.title || '',
    contents: chapter?.contents || {},
  });
  const sortedChapterContentBlocks = useMemo(
    () =>
      Object.keys(chapterContent.contents).sort(
        (a, b) =>
          chapterContent.contents[a].index - chapterContent.contents[b].index,
      ),
    [chapterContent],
  );
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const contentChangeHandler = useCallback(
    (
      fieldName: keyof PartialChapter,
      fieldValue: string | { [key: string]: PartialChapterContent },
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
    [chapterContent, setChapterContent],
  );

  const contentAddedHandler = useCallback(
    (type: ContentBlockTypes) => {
      setAddingContentBlock(true);
      onChapterContentAdded(
        type,
        undefined,
        sortedChapterContentBlocks.length,
        (contentId) => {
          setAddingContentBlock(false);
          setActiveContentId(contentId);
        },
      );
    },
    [setActiveContentId, onChapterContentAdded],
  );

  const contentDeletedHandler = useCallback(
    async (contentId) => {
      await onChapterContentDeleted(contentId);
    },
    [onChapterContentDeleted],
  );

  const handleDragStart = (event) => {
    const { active } = event;
    setDragActiveId(active.id);
  };

  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event;
      if (active.id !== over.id) {
        const activeItem = chapterContent.contents[active.id];
        const overItem = chapterContent.contents[over.id];
        const newIndices = arrayMove(
          sortedChapterContentBlocks,
          activeItem.index,
          overItem.index,
        );
        contentChangeHandler('contents', {
          ...newIndices.reduce(
            (updatedContents, currentItem, currentItemIndex) => ({
              ...updatedContents,
              [currentItem]: {
                ...chapterContent.contents[currentItem],
                index: currentItemIndex,
              },
            }),
            {},
          ),
        });
      }
      setDragActiveId(null);
    },
    [chapterContent, contentChangeHandler, sortedChapterContentBlocks],
  );

  const renderContentBlock = useCallback(
    (type: ContentBlockTypes, contentId: string) => {
      switch (type) {
        case 'code':
          return (
            <StyledEditor
              key={contentId}
              padding={10}
              value={chapterContent.contents[contentId].content}
              onValueChange={(updatedContent) =>
                contentChangeHandler('contents', {
                  [contentId]: {
                    ...chapterContent.contents[contentId],
                    content: updatedContent,
                  },
                })
              }
              highlight={(code) => highlight(code, languages.js)}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 12,
              }}
            />
          );
        case 'markdown':
          return (
            <MarkdownEditor
              defaultValue={chapterContent.contents[contentId].content}
              onChange={(updatedValue) =>
                contentChangeHandler('contents', {
                  [contentId]: {
                    ...chapterContent.contents[contentId],
                    content: updatedValue(),
                  },
                })
              }
            />
          );
        case 'text':
        default:
          return (
            <StyledTextarea
              rows='1'
              placeholder='Enter some text...'
              onChange={(evt) =>
                contentChangeHandler('contents', {
                  [contentId]: {
                    ...chapterContent.contents[contentId],
                    content: evt.target.value,
                  },
                })
              }
              value={chapterContent.contents[contentId].content}
            />
          );
      }
    },
    [contentChangeHandler, chapterContent],
  );

  useEffect(() => {
    if (chapterId) onContentChanged(chapterContent);
  }, [chapterContent]);

  /**
   * This hook triggers whenever there is a change to the chapter which deviates for the current editor chapter content.
   * This will happen in any of the following scenarios:
   *  - Content has been loaded from the Firebase. This content is the last saved content and might not reflect the current state of the editor. It's fine to have this content saved in memory somewhere but this should definitely not overwrite the currently set content.
   *  - The editor is just loaded and the chapter content has loaded but after chapterContent has already been set to the default initial value.
   */
  useEffect(() => {
    if (
      chapter &&
      chapterContent &&
      Object.keys(chapter.contents || {}).length !==
        Object.keys(chapterContent.contents || {}).length
    )
      setChapterContent({
        title: chapter.title,
        contents: chapter.contents,
      });
  }, [chapter, chapterContent, setChapterContent]);

  return (
    <ChapterContentEditorLayout className='md:col-span-2 lg:col-span-6'>
      {chapterId ? (
        <Fragment>
          <FlexLayout alignCenter>
            <StyledInput
              type='text'
              placeholder='Enter chapter title...'
              value={chapterContent.title}
              onChange={(evt) =>
                contentChangeHandler('title', evt.target.value)
              }
            />
            <ContextMenuControl>
              <TransparentButton hasIcon iconOnly small>
                <i className='ri-settings-5-fill' />
              </TransparentButton>
              <ContextMenu right>
                <li>
                  <i className='ri-globe-fill' />
                  Publish
                </li>
                <li>
                  <i className='ri-share-fill'></i>
                  Share
                </li>
              </ContextMenu>
            </ContextMenuControl>
          </FlexLayout>
          {chapter && <ChapterStats chapter={chapter} />}
          {!sortedChapterContentBlocks.length ? null : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              onDragStart={handleDragStart}
            >
              <SortableContext
                items={sortedChapterContentBlocks}
                strategy={verticalListSortingStrategy}
              >
                {sortedChapterContentBlocks.map((contentId) => (
                  <ControlWithContextMenu
                    id={contentId}
                    key={contentId}
                    onDelete={() => contentDeletedHandler(contentId)}
                  >
                    {renderContentBlock(
                      chapterContent.contents[contentId]
                        .type as ContentBlockTypes,
                      contentId,
                    )}
                  </ControlWithContextMenu>
                ))}
              </SortableContext>
              <DragOverlay>
                {dragActiveId ? (
                  <DragOverlayItem
                    id={dragActiveId}
                    type={
                      chapterContent.contents[dragActiveId]
                        .type as ContentBlockTypes
                    }
                  />
                ) : null}
              </DragOverlay>
            </DndContext>
          )}
          <ContextMenuControl>
            <Button hasIcon dense disabled={addingContentBlock}>
              {addingContentBlock ? (
                <Loader loadingText={''} />
              ) : (
                <i className='ri-add-fill' />
              )}
              Add content block
            </Button>
            <ContextMenu>
              <li onClick={() => contentAddedHandler('text')}>
                <i className='ri-text' />
                Text
              </li>
              <li onClick={() => contentAddedHandler('code')}>
                <i className='ri-code-line' />
                Code
              </li>
              <li onClick={() => contentAddedHandler('markdown')}>
                <i className='ri-markdown-fill' />
                Markdown
              </li>
            </ContextMenu>
          </ContextMenuControl>
        </Fragment>
      ) : (
        <div>You have not selected a chapter</div>
      )}
    </ChapterContentEditorLayout>
  );
}

import { useState, useEffect, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import 'mobx-react-lite/batchingForReactDom';

import {
  AppHeader,
  FlexFillLayout,
  VerticalLayout,
} from '../../components/shared/layout';
import StorySelector from '../../components/editor/StorySelector';
import ChapterList from '../../components/editor/ChapterList';
import ChapterContentEditor from '../../components/editor/ChapterContentEditor';

import { authStore, IAuthStore } from '../../store';
import { withStore } from '../../lib/utils';
import {
  addStory,
  getUserStories,
  getStoryChapters,
  getChapterContents,
  Story,
  Chapter,
  addChapter,
  updateChapter,
  addChapterContent,
  deleteChapterContent,
  updateChapterContent,
  PartialChapter,
  ContentBlockTypes,
} from '../../lib/whitespace';

type EditorProps = { authStore: IAuthStore };

const Editor = ({ authStore: { user } }: EditorProps) => {
  const [selectedChapter, setSelectedChapter] = useState<Chapter>(null);
  const [selectedStory, setSelectedStory] = useState<Story>(null);
  const [storiesLoading, setStoriesLoading] = useState<boolean>(false);
  const [chapterLoading, setChapterLoading] = useState<boolean>(false);
  const [stories, setStories] = useState<Story[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [willSave, setWillSave] = useState(false);
  const [willSaveTimeout, setWillSaveTimeout] = useState(null);

  const loadStories = useCallback(async () => {
    setStoriesLoading(true);
    const userStories = await getUserStories(user.uid);
    setStories(userStories);
    setStoriesLoading(false);
  }, [user]);

  const loadChapters = useCallback(
    async (autoselect = false) => {
      if (selectedStory) {
        setChapterLoading(true);
        const storyChapters = await Promise.all(
          (
            await getStoryChapters(selectedStory.id)
          ).map(async (chapter) => ({
            ...chapter,
            contents: (
              await getChapterContents(selectedStory.id, chapter.id)
            ).reduce(
              (allContents, content) => ({
                ...allContents,
                [content.id]: content,
              }),
              {},
            ),
          })),
        );
        setChapters(storyChapters);
        setChapterLoading(false);
        if (autoselect || (storyChapters.length && !selectedChapter))
          setSelectedChapter(storyChapters[0]);
        if (selectedChapter)
          setSelectedChapter(
            storyChapters.find((chapter) => chapter.id === selectedChapter.id),
          );
      }
    },
    [selectedStory, selectedChapter],
  );

  /**
   * This function is triggered when the content in the ChapterEditor changes. This function queues the save action
   * every 2 seconds while the content is being edited.
   */
  const handleContentChanged = useCallback(
    (updatedContent: PartialChapter) => {
      if (!willSaveTimeout) {
        setWillSaveTimeout(setTimeout(() => setWillSave(true), 2000));
      }
      setSelectedChapter({
        ...selectedChapter,
        ...updatedContent,
      });
    },
    [selectedChapter, willSaveTimeout],
  );

  /**
   * This function is triggered when a new content block is added to the chapter
   */
  const handleChapterContentAdded = useCallback(
    (
      type: ContentBlockTypes,
      content: string | undefined,
      index: number,
      cb?: (contentId: string) => void,
    ) => {
      if (selectedStory && selectedChapter) {
        // TODO: Refactor function to use async/await
        addChapterContent(selectedStory.id, selectedChapter.id, {
          type,
          content: content || '',
          index,
        }).then((addedRef) => {
          if (cb) cb(addedRef.id);
          loadChapters();
        });
      }
    },
    [selectedStory, selectedChapter],
  );

  /**
   * This function is triggered when the save action is fired. This happens every 2 seconds while changes are being made
   * to the content in the ChapterEditor
   */
  const handleContentSave = useCallback(
    async ({ id, title, contents }) => {
      if (selectedChapter && selectedStory) {
        await updateChapter(selectedStory.id, id, title);
        await Promise.all(
          Object.keys(contents).map((contentId) =>
            updateChapterContent(
              selectedStory.id,
              id,
              contentId,
              contents[contentId],
            ),
          ),
        );
        await loadChapters();
      }
    },
    [selectedChapter, selectedStory],
  );

  /**
   * This function is triggered when a new story is added using the StorySelector
   */
  const handleStoryAdded = useCallback(
    async (storyTitle) => {
      const newStoryRef = await addStory(storyTitle);
      await loadStories();
      const newStory = stories.find((story) => story.id === newStoryRef);
      if (newStory) {
        setSelectedStory(newStory);
      }
    },
    [stories],
  );

  const handleChapterContentDeleted = useCallback(
    async (contentId: string) => {
      await deleteChapterContent(
        selectedStory.id,
        selectedChapter.id,
        contentId,
      );
      await loadChapters();
    },
    [selectedStory, selectedChapter],
  );

  /**
   * This function is triggered when a new chapter is added in the ChapterList
   */
  const handleChapterAdded = useCallback(async () => {
    const { id } = selectedStory;
    const newChapterRef = await addChapter(id, '');
    await loadChapters();
    const newChapter = chapters.find((chapter) => chapter.id === newChapterRef);
    if (newChapter) {
      setSelectedChapter(newChapter);
    }
  }, [selectedStory, chapters]);

  useEffect(() => {
    if (user) loadStories();
  }, [user]);

  useEffect(() => {
    if (selectedStory) loadChapters(true);
  }, [selectedStory]);

  useEffect(() => {
    if (willSave) {
      setWillSave(false);
      setWillSaveTimeout(null);
      handleContentSave(selectedChapter);
    }
  }, [willSave]);

  return (
    <FlexFillLayout className='container' as='main'>
      <AppHeader user={authStore.user} />
      <StorySelector
        stories={stories}
        onSelectStory={setSelectedStory}
        selectedStory={selectedStory}
        onAddStory={handleStoryAdded}
        loading={storiesLoading}
      />
      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-8 gap-4'>
        <ChapterList
          chapters={chapters}
          onSelect={setSelectedChapter}
          onAddChapter={handleChapterAdded}
          selectedChapter={selectedChapter}
        />
        <ChapterContentEditor
          chapter={selectedChapter}
          onContentChanged={handleContentChanged}
          onChapterContentAdded={handleChapterContentAdded}
          onChapterContentDeleted={handleChapterContentDeleted}
        />
      </div>
    </FlexFillLayout>
  );
};

export default withStore(observer<EditorProps>(Editor), {
  authStore,
});

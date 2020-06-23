import { useState, useEffect, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import 'mobx-react-lite/batchingForReactDom';

import {
  FlexLayout,
  VerticalLayout,
  PageLayout,
  AppHeader,
} from '../../components/shared/layout';
import StorySelector from '../../components/editor/StorySelector';
import ChapterList from '../../components/editor/ChapterList';
import ChapterStats from '../../components/editor/ChapterStats';
import ChapterContentEditor from '../../components/editor/ChapterContentEditor';

import { authStore, IAuthStore } from '../../store';
import { withStore } from '../../lib/utils';
import {
  addStory,
  getUserStories,
  getStoryChapters,
  Story,
  Chapter,
  addChapter,
  updateChapter,
} from '../../lib/firebase';

type EditorProps = { authStore: IAuthStore };

const Editor = ({ authStore: { user } }: EditorProps) => {
  const [selectedChapter, setSelectedChapter] = useState<Chapter>(null);
  const [selectedStory, setSelectedStory] = useState<Story>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [willSave, setWillSave] = useState(false);
  const [willSaveTimeout, setWillSaveTimeout] = useState(null);

  const loadStories = useCallback(async () => {
    const userStories = await getUserStories(user.uid);
    setStories(userStories);
  }, [user]);

  const loadChapters = useCallback(
    async (autoselect = false) => {
      if (selectedStory) {
        const storyChapters = await getStoryChapters(selectedStory.id);
        setChapters(storyChapters);
        if (autoselect || (storyChapters.length && !selectedChapter))
          setSelectedChapter(storyChapters[0]);
      }
    },
    [selectedStory, selectedChapter],
  );

  const handleContentChanged = useCallback(
    (updatedContent) => {
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

  const handleContentSave = useCallback(
    async ({ title, contents }) => {
      if (selectedChapter && selectedStory) {
        await updateChapter(
          selectedStory.id,
          selectedChapter.id,
          title,
          contents,
        );
        await loadChapters();
      }
    },
    [selectedChapter, selectedStory],
  );

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

  const handleChapterAdded = useCallback(async () => {
    const { id } = selectedStory;
    const newChapterRef = await addChapter(id, '', '');
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
    <VerticalLayout flexFill fillHorizontal alignTop>
      <PageLayout>
        <AppHeader user={authStore.user} />
        <StorySelector
          stories={stories}
          onSelectStory={setSelectedStory}
          selectedStory={selectedStory}
          onAddStory={handleStoryAdded}
        />
        <FlexLayout>
          <ChapterList
            chapters={chapters}
            onSelect={setSelectedChapter}
            onAddChapter={handleChapterAdded}
            selectedChapter={selectedChapter}
          ></ChapterList>
          <ChapterContentEditor
            chapter={selectedChapter}
            onContentChanged={handleContentChanged}
          />
          <ChapterStats chapter={selectedChapter} />
        </FlexLayout>
      </PageLayout>
    </VerticalLayout>
  );
};

export default withStore(observer<EditorProps>(Editor), {
  authStore,
});

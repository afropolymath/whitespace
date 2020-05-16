import { useState, useEffect, useCallback } from 'react';

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
import { getUserStories } from '../../lib/firebase';
import { observer } from 'mobx-react-lite';

type EditorProps = { authStore: IAuthStore };

const Editor = ({ authStore: { user } }: EditorProps) => {
  const [selectedChapter, setSelectedChapter] = useState(0);
  const [selectedStory, setSelectedStory] = useState(null);
  const [stories, setStories] = useState([]);
  const [chapters, setChapters] = useState([]);

  const loadStories = useCallback(async () => {
    const userStories = await getUserStories(user.uid);
    setStories(userStories);
  }, [user]);

  useEffect(() => {
    if (user) loadStories();
  }, [user]);

  const chaptersList = [];

  return (
    <VerticalLayout flexFill fillHorizontal alignTop>
      <PageLayout>
        <AppHeader user={authStore.user} />
        <StorySelector stories={stories} onSelect={setSelectedStory} />
        <FlexLayout>
          <ChapterList
            chapters={['Chapter 1']}
            onSelect={setSelectedChapter}
            selectedChapter={selectedChapter}
          ></ChapterList>
          <ChapterContentEditor chapter={selectedChapter} />
          <ChapterStats />
        </FlexLayout>
      </PageLayout>
    </VerticalLayout>
  );
};

export default withStore(observer<EditorProps>(Editor), {
  authStore,
});

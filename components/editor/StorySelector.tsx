import styled from 'styled-components';
import { useState, useRef, useCallback, useEffect } from 'react';

import { FlexLayout } from '../shared/layout';
import { Story } from '../../lib/firebase';

const Card = styled.div`
  background: #ffffff;
  color: #232323;
  border: 1px solid #d8d8d8;
  box-shadow: 1px 2px 4px 0 rgba(0, 0, 0, 0.15);
  box-sizing: border-box;
`;

const FloatingControl = styled(Card)`
  position: relative;
  display: flex;
  align-items: stretch;
  height: 50px;
  width: 100%;
  margin-bottom: 2.5em;
  border-radius: ${(props) => (props.widgetVisible ? '4px 4px 0 0' : '4px')};

  &:hover {
    ${(props) => !props.widgetVisible && 'border-color: #bbb;'}
  }

  &:active {
    ${(props) =>
      !props.widgetVisible &&
      'background: #f9f9f9; box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.15) inset;'}
  }
`;

const FloatingControlClickHandle = styled(FlexLayout)`
  padding: 0 1em;
  font-size: 1.1em;
  cursor: pointer;

  h4 {
    margin: 0;
    margin-left: 0.7em;
    font-weight: 400;
  }

  i {
    font-size: 1.5em;
  }
`;

const StorySearchWidget = styled(Card)`
  position: absolute;
  left: -1px;
  right: -1px;
  top: 48px;
  border-radius: 0 0 4px 4px;
  z-index: 9;
`;

const StyledInput = styled.input`
  font-size: 0.9em;
  height: 34px;
  padding: 0 0.7em;
  outline: none;
  background: #ffffff;
  border: 1px solid #d8d8d8;
  box-sizing: border-box;
  border-radius: 4px;
  transition: width 0.4s ease, padding 0.5s ease, border 0.4s, margin 0.4s;
`;

const CollapsingInput = styled(StyledInput)`
  ${(props) => props.isCollapsed && 'width: 0; padding: 0;'}
  ${(props) => props.isCollapsed && 'border: 0px solid transparent;'}
  ${(props) => !props.isCollapsed && 'margin-right: 0.5em;'}
`;

const StoryList = styled.div`
  padding: 0 1em;

  ul {
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      display: flex;
      align-items: center;
      padding: 1em 0.3em;
      cursor: pointer;

      &:hover {
        color: 232323;
      }

      h4 {
        font-size: 1em;
        font-weight: bold;
        flex-grow: 1;
        margin: 0;
      }

      small {
        color: #a9a9a9;
      }
    }
  }
`;

const NewStoryForm = styled(FlexLayout)`
  height: 50px;
  padding: 0 1em;
  border-top: solid 1px #e5e5e5;
  align-items: center;
`;

const NewStoryButton = styled.button`
  cursor: pointer;
  font-size: 0.9em;
  padding: 0 0.3em;
  height: 50px;
  display: inline-flex;
  align-items: center;
  background: transparent;
  border: none;
  white-space: nowrap;
  outline: none;

  i {
    color: #ffba0a;
    margin-right: 0.5em;
  }
`;

const FormButton = styled(NewStoryButton)`
  padding: 0 0.8em;
  height: 35px;
  color: #fff;
  background: #393b3c;
  border-radius: 4px;

  & + & {
    margin-left: 0.3em;
  }
`;

export default function StorySelector({
  stories,
  selectedStory,
  onAddStory,
  onSelectStory,
}: {
  stories: Story[];
  selectedStory: null | Story;
  onAddStory: (storyTitle: string) => Promise<void>;
  onSelectStory: (story: Story) => void;
}) {
  const [titleInputCollapsed, setTitleInputCollapsed] = useState(true);
  const [searchWidgetVisible, setSearchWidgetVisible] = useState(false);
  const [newStoryTitle, setNewStoryTitle] = useState('');
  const titleInputRef = useRef(null);

  const hideSearchWidget = useCallback(() => {
    setSearchWidgetVisible(false);
    setTitleInputCollapsed(true);
    setNewStoryTitle('');
  }, []);

  const addNewStory = useCallback(async () => {
    await onAddStory(newStoryTitle);
    hideSearchWidget();
  }, [newStoryTitle]);

  useEffect(() => {
    if (!selectedStory && stories.length) {
      onSelectStory(stories[0]);
    }
  }, [stories]);

  return (
    <FloatingControl widgetVisible={searchWidgetVisible}>
      <FloatingControlClickHandle
        alignCenter
        flexFill
        onClick={() => setSearchWidgetVisible(!searchWidgetVisible)}
      >
        <i className='ri-pencil-line'></i>
        {selectedStory && <h4>{selectedStory.title}</h4>}
      </FloatingControlClickHandle>
      {searchWidgetVisible && (
        <StorySearchWidget>
          <StoryList>
            <ul>
              {stories.map((story) => (
                <li
                  key={story.id}
                  onClick={() => {
                    onSelectStory(story);
                    hideSearchWidget();
                  }}
                >
                  <h4>{story.title}</h4>
                  <small>2 days ago</small>
                </li>
              ))}
            </ul>
          </StoryList>
          <NewStoryForm>
            <CollapsingInput
              ref={titleInputRef}
              isCollapsed={titleInputCollapsed}
              onInput={(evt) => setNewStoryTitle(evt.target.value)}
              type='text'
              placeholder='Enter story title...'
            />
            {titleInputCollapsed && (
              <NewStoryButton
                onClick={() => {
                  setTitleInputCollapsed(!titleInputCollapsed);
                  titleInputRef.current.focus();
                }}
              >
                <i className='ri-add-fill'></i> New Story
              </NewStoryButton>
            )}
            {!titleInputCollapsed && (
              <FormButton onClick={addNewStory}>Create story</FormButton>
            )}
            {!titleInputCollapsed && (
              <FormButton onClick={() => setTitleInputCollapsed(true)}>
                Cancel
              </FormButton>
            )}
          </NewStoryForm>
        </StorySearchWidget>
      )}
    </FloatingControl>
  );
}

import { shallow } from 'enzyme';

import ChapterContentEditor, {
  StyledInput,
} from '../../../components/editor/ChapterContentEditor';

describe('<ChapterContentEditor/> tests', () => {
  let component;

  it('initializes the text fields with the chapter content', () => {
    const chapterDetails = {
      id: 'SAMPLE_CHAPTER_ID',
      title: 'Chapter title',
      contents: 'Chapter contents',
      modified: new Date(),
    };
    const onChangeHandler = jest.fn(() => {});
    component = shallow(
      <ChapterContentEditor
        chapter={chapterDetails}
        onContentChanged={onChangeHandler}
      />,
    );
    setTimeout(() => {
      console.log(component.find(StyledInput).first().props());
    }, 10);
  });

  it("calls the handler everytime there's a change to the content", () => {});
});

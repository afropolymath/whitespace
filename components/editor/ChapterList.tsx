import styled from 'styled-components';

const ChapterListLayout = styled.div`
  min-width: 150px;
  padding-left: 1.5em;

  h4 {
    margin-top: 0;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    color: #868686;
  }
`;

const ChapterListItem = styled.li`
  position: relative;
  padding: 0.2em 0;
  color: #868686;
  ${(props) => props.selected && 'font-weight: bold'};
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #232323;
  }

  & + & {
    margin-top: 0.5em;
  }

  &:before {
    content: '';
    position: absolute;
    height: 100%;
    top: 0;
    left: -1.5em;
    border-right: 4px solid
      ${(props) => (props.selected ? 'orange' : 'transparent')};
    transition: border 0.3s ease;
  }
`;

const NewChapterButton = styled.li`
  margin-top: 1em;
  display: inline-flex;
  align-items: center;

  i {
    margin-right: 0.4em;
  }
`;

type ChapterListProps = {
  chapters: string[];
  onSelect: (number) => void;
  selectedChapter: number;
};

export default function ChapterList({
  chapters,
  onSelect,
  selectedChapter,
}: ChapterListProps) {
  return (
    <ChapterListLayout>
      <h4>Chapters</h4>
      <ul>
        {chapters.map((chapter, index) => (
          <ChapterListItem
            onClick={() => onSelect(index)}
            key={index}
            selected={index === selectedChapter}
          >
            {chapter}
          </ChapterListItem>
        ))}
        <NewChapterButton>
          <i className='ri-add-line' />
          <span>New Chapter</span>
        </NewChapterButton>
      </ul>
    </ChapterListLayout>
  );
}

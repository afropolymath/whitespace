import styled from 'styled-components';

import { Chapter } from '../../lib/whitespace';

const ChapterListLayout = styled.div`
  padding-left: 1.5em;

  h4 {
    margin-top: 0;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    color: #868686;
    width: 100%;
  }
`;

const ChapterListItem = styled.li`
  position: relative;
  color: #868686;
  ${(props) => props.selected && 'font-weight: bold'};
  cursor: pointer;
  transition: color 0.3s ease;
  width: 100%;

  span {
    display: inline-block;
    max-width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding-top: 0.6em;
    overflow-x: hidden;
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -1.5em;
    width: 4px;
    height: 100%;
    background: ${(props) => (props.selected ? 'orange' : 'transparent')};
    transition: background 0.3s ease;
  }

  &:hover {
    color: #232323;
  }

  & + & {
    margin-top: 0.5em;
  }
`;

const NewChapterButton = styled.li`
  margin-top: 1em;
  display: inline-flex;
  align-items: center;
  cursor: pointer;

  i {
    margin-right: 0.4em;
  }
`;

type ChapterListProps = {
  chapters: Chapter[];
  onSelect: (number) => void;
  onAddChapter: () => void;
  selectedChapter: Chapter;
};

export default function ChapterList({
  chapters,
  onSelect,
  onAddChapter,
  selectedChapter,
}: ChapterListProps) {
  return (
    <ChapterListLayout className='md:col-span-1 lg:col-span-2'>
      <h4>Chapters</h4>
      <ul>
        {chapters.map((chapter, index) => (
          <ChapterListItem
            onClick={() => onSelect(chapter)}
            key={chapter.id}
            selected={!!selectedChapter && chapter.id === selectedChapter.id}
          >
            <span>{chapter.title || `New Chapter ${index + 1}`}</span>
          </ChapterListItem>
        ))}
        <NewChapterButton onClick={onAddChapter}>
          <i className='ri-add-line' />
          <span>New Chapter</span>
        </NewChapterButton>
      </ul>
    </ChapterListLayout>
  );
}

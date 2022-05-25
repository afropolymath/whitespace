import styled from 'styled-components';
import { formatDistanceToNow } from 'date-fns';

import { Chapter } from '../../lib/whitespace';
import { FlexLayout } from '../shared/layout';

const ChapterStatsLayout = styled(FlexLayout)`
  color: #393939;
  margin: 1em 0 1.5em 0;

  span + span {
    margin-left: 1.4em;
  }
`;

export default function ChapterStats({ chapter }: { chapter: Chapter }) {
  const chapterWordCount =
    chapter && chapter.contents
      ? (typeof chapter.contents === 'string'
          ? chapter.contents
          : Object.values(chapter.contents)
              .reduce(
                (allContents, contentBlock) => [
                  ...allContents,
                  contentBlock.content,
                ],
                [],
              )
              .join(' ')
        )
          .split(' ')
          .filter(Boolean).length
      : 0;
  return chapter ? (
    <ChapterStatsLayout>
      <span>
        Modified{' '}
        {chapter.modified &&
          formatDistanceToNow(chapter.modified, {
            addSuffix: true,
          })}
      </span>
      <span>{chapter ? chapterWordCount : 0} words</span>
    </ChapterStatsLayout>
  ) : null;
}

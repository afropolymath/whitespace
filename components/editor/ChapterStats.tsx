import styled from 'styled-components';

import { Button } from '../shared/forms';
import { Chapter } from '../../lib/firebase';

const ChapterStatsLayout = styled.div`
  color: #393939;
  margin-top: 2em;

  h4 {
    margin-top: 0;
    margin-top: 2em;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;

    li + li {
      margin-top: 0.5em;
    }
  }
`;

export default function ChapterStats({ chapter }: { chapter: Chapter }) {
  return (
    <ChapterStatsLayout>
      <Button small hasIcon>
        <i className='ri-settings-5-fill' /> Story Settings
      </Button>
      <h4>Chapter Stats</h4>
      <ul>
        <li>
          {chapter
            ? chapter.contents.trim().split(' ').filter(Boolean).length
            : 0}{' '}
          words
        </li>
        <li>0 share snippets</li>
      </ul>
    </ChapterStatsLayout>
  );
}

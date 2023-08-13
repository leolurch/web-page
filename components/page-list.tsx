import { NextMarkdownFile } from 'next-markdown';
import Link from 'next/link';
import { readingTime } from '../util/reading-time';
import { FrontMatter } from '../pages/[[...nextmd]]';

export type PageFrontMatter = FrontMatter & {
  date: string;
};
export const PageList = (props: {
  title: string;
  pages: NextMarkdownFile<PageFrontMatter>[] | null;
}) => {
  const { title, pages } = props;

  return (
    pages && (
      <>
        {pages.length > 0 && <h2>{title}</h2>}
        <ul>
          {pages
            .sort((a, b) =>
              b.frontMatter.date.localeCompare(a.frontMatter.date)
            ) // sort by date
            .map((page, index) => (
              <li key={index}>
                <Link href={page.nextmd.join('/')}>
                  <a>{page.nextmd.slice(-1).pop()}</a>
                </Link>
                {' - '}
                {page.frontMatter.date}
                {' - '}
                {readingTime(page.markdown)} min read
              </li>
            ))}
        </ul>
      </>
    )
  );
};

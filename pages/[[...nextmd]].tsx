import { GetStaticPropsContext } from 'next';
import NextMarkdown, { NextMarkdownFile, YAMLFrontMatter } from 'next-markdown';
import Head from 'next/head';
import { ReactElement, ReactNode, useEffect } from 'react';
import { MDXRemote } from 'next-mdx-remote';
import { PageFrontMatter, PageList } from '../components/page-list';
import { TableOfContentItem } from '../components/table-of-contents';
import { RenderHtml } from '../components/render-html';
import { TableOfContentItem as TocItem } from 'next-markdown';

export type FrontMatter = { title: string };

const nextmarkdown = NextMarkdown({
  pathToContent: './pages-markdown',
});

export const getStaticProps = async (
  context: GetStaticPropsContext<{ nextmd: string[] }>
) => {
  if (context.params?.nextmd === undefined) {
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ==> http://localhost:3000
    // we want to list all the blog posts in the home page
    // so we need to re-shape accordingly the home page's getStaticProps.
    return {
      props: {
        ...(await nextmarkdown.getStaticProps(context)).props,
        posts: (await nextmarkdown.getStaticPropsForNextmd(['posts'])).props
          .subPaths,
        projects: (await nextmarkdown.getStaticPropsForNextmd(['projects']))
          .props.subPaths,
      },
    };
  } else {
    return await nextmarkdown.getStaticProps(context);
  }
};

export const getStaticPaths = nextmarkdown.getStaticPaths;

type PageProps = {
  nextmd: string[];
  frontMatter: FrontMatter;
  mdxSource: any;
  tableOfContents: any;
  html: string;
  projects: NextMarkdownFile<PageFrontMatter>[] | null;
  posts: NextMarkdownFile<PageFrontMatter>[] | null;
};

export default function MyMarkdownPage(props: PageProps) {
  const { nextmd, frontMatter, mdxSource, tableOfContents, html } = props;

  const isHomePage = nextmd.length <= 1; // == [] or ["<something>"]
  const isSubPage = nextmd.length === 2; // == ["posts", "slug-of-your-blog-post"]

  const hasTableOfContents = tableOfContents.length > 0 && !isHomePage;

  // useEffect(() => {
  //   if (process.env.NODE_ENV === 'development') {
  //     setInterval(() => {
  //       window.location.reload();
  //     }, 1000);
  //   }
  // }, []);

  const BlogPostList = () => <PageList pages={props.posts} title="Blog" />;

  const ProjectList = () => <PageList pages={props.projects} title="Work" />;

  const components: Record<string, () => JSX.Element> = {
    BlogPostList,
    ProjectList,
  };

  return (
    <>
      <Head>
        <title>{frontMatter.title}</title>
      </Head>
      <div
        key={nextmd.join('/')}
        style={{
          margin: '0 auto',
          maxWidth: '900px',
        }}
      >
        {hasTableOfContents && (
          <>
            <div>
              <strong>Table of Contents</strong>
              {tableOfContents.map((item: TocItem) => (
                <TableOfContentItem key={item.id} {...item} />
              ))}
            </div>
            <hr />
          </>
        )}
        {html && <RenderHtml html={html} components={components} />}
        <a href="imprint">imprint</a>
      </div>
    </>
  );
}

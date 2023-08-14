import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </Head>
      <body
        style={{
          backgroundColor: 'rgb(214 211 209)',
          height: '100vh',
          width: '100vw',
          margin: '0px',
          padding: '0px',
          fontFamily: 'serif',
        }}
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

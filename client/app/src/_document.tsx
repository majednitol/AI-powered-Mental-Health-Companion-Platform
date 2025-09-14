import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Meta tags */}
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1"
        />

        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Architects+Daughter&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Fira+Code:wght@300..700&display=swap"
          rel="stylesheet"
        />

        {/* You can add other <link> tags here */}
      </Head>
      <body>
        <Main />
        <NextScript />

        {/* Optional: replit banner script */}
        <script
          type="text/javascript"
          src="https://replit.com/public/js/replit-dev-banner.js"
        ></script>
      </body>
    </Html>
  );
}

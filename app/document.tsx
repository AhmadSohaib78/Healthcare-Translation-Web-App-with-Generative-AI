import { Html, Head, Main, NextScript } from "next/document";
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

export default function Document() {
  return (
    <Html>
      <Head>
        {/* Load ResponsiveVoice before page renders */}
        <script
          src="https://code.responsivevoice.org/responsivevoice.js?key=sEoD2kl5"
          onLoad={() => {
            console.log("ResponsiveVoice loaded");
          }}
        ></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

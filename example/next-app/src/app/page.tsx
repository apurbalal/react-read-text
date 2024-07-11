import dynamic from "next/dynamic";
import Markdown from "react-markdown";
import remarkGfm from 'remark-gfm';

const DynamicReadingController = dynamic(() => import("@/component/ReadingController").then(mod => mod.ReadingController), {
  ssr: false,
});

const markdown = `
  # A demo of \`react-markdown\`

  \`react-markdown\` is a markdown component for React.

  👉 Changes are re-rendered as you type.

  👈 Try writing some markdown on the left.

  ## Overview

  * Follows [CommonMark](https://commonmark.org)
  * Optionally follows [GitHub Flavored Markdown](https://github.github.com/gfm/)
  * Renders actual React elements instead of using \`dangerouslySetInnerHTML\`
  * Lets you define your own components (to render \`MyHeading\` instead of \`'h1'\`)
  * Has a lot of plugins

  ## Contents

  Here is an example of a plugin in action
  ([\`remark-toc\`](https://github.com/remarkjs/remark-toc)).
  **This section is replaced by an actual table of contents**.

  ## Syntax highlighting

  Here is an example of a plugin to highlight code:
  [\`rehype - highlight\`](https://github.com/rehypejs/rehype-highlight).
`;

export default function Home() {
  return (
    <main className="main">
      <div>
        <DynamicReadingController />
        <span id="read-block">
          <Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown>
        </span>
      </div>
    </main>
  );
}

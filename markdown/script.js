// eslint-disable-next-line no-unused-vars
const projectName = "markdown-previewer";

marked.setOptions({
  breaks: true,
  highlight: function (code) {
    return Prism.highlight(code, Prism.languages.javascript, "javascript");
  },
});

const renderer = {
  link(href, title, text) {
    return `<a target="_blank" href="${href}">${text}</a>`;
  },
};

marked.use({ renderer });

const placeholder = `# Welcome to my React Markdown Previewer!

## This is a sub-heading...
### And here's some other cool stuff:

Heres some code, \`<div></div>\`, between 2 backticks.

\`\`\`
// this is multi-line code:

function anotherExample(firstLine, lastLine) {
  if (firstLine == '\`\`\`' && lastLine == '\`\`\`') {
    return multiLineCode;
  }
}
\`\`\`

You can also make text **bold**... whoa!
Or _italic_.
Or... wait for it... **_both!_**
And feel free to go crazy ~~crossing stuff out~~.

There's also [links](https://www.freecodecamp.org), and
> Block Quotes!

And if you want to get really crazy, even tables:

Wild Header | Crazy Header | Another Header?
------------ | ------------- | -------------
Your content can | be here, and it | can be here....
And here. | Okay. | I think we get it.

- And of course there are lists.
  - Some are bulleted.
     - With different indentation levels.
        - That look like this.


1. And there are numbered lists too.
1. Use just 1s if you want!
1. And last but not least, let's not forget embedded images:

![freeCodeCamp Logo](https://cdn.freecodecamp.org/testable-projects-fcc/images/fcc_secondary.svg)
`;

function App() {
  const [markdown, setMarkdown] = React.useState(() => placeholder);

  return (
    <main className="container-fluid row justify-content-around p-3">
      <section id="markdown-input" className="card p-1 col-12 col-lg-5 mb-4">
        <div className="card-body">
          <h2 className="card-title">Editor</h2>
          <hr />
          <textarea
            id="editor"
            onChange={(event) => setMarkdown(event.currentTarget.value)}
            value={markdown}
          ></textarea>
        </div>
      </section>
      <section id="markdown-output" className="card p-1 col-12 col-lg-6">
        <div className="card-body">
          <h2 className="card-title">Previewer</h2>
          <hr />
          <div
            id="preview"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(marked.parse(markdown)),
            }}
          ></div>
        </div>
      </section>
    </main>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));

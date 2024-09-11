import { promises as fs } from "fs";
import path from "path";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";
import { Marked } from "marked";

let toc: { label: string; index: number }[] = [];
let headingCountMap: { [key: string]: number } = {}; // 用于记录每个标题的出现次数

const marked = new Marked(
  markedHighlight({
    highlight: (code, lang) => {
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(code, { language: lang }).value;
      }
      return hljs.highlightAuto(code).value;
    },
  }),
  {
    renderer: {
      heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens);

        // 生成唯一的id
        let headingId = text;
        if (headingCountMap[headingId]) {
          headingCountMap[headingId]++;
          headingId = `${headingId}-${headingCountMap[headingId]}`;
        } else {
          headingCountMap[headingId] = 1;
        }

        if (depth <= 3) {
          let item = { label: text, index: depth, id: headingId };
          toc.push(item);
          return `<h${depth} id="${headingId}"><a href="#${text}">${text}</a></h${depth}>`;
        } else {
          return `<h${depth}>${text}</h${depth}>`;
        }
      },
    },
    gfm: true,
    breaks: true,
  },
);

export default defineEventHandler(async (event) => {
  // 获取前端传入的文件名
  const body: { filename: string } = await readBody(event);
  const filename = body.filename;

  const filePath = path.join(process.cwd(), "content", `${filename}`);

  try {
    toc = [];
    headingCountMap = {};
    const fileContent = await fs.readFile(filePath, "utf-8");
    const renderedContent = marked.parse(fileContent);

    return useResponseWrapper({ content: renderedContent, toc: toc });
  } catch (error) {
    return useErrorWrapper(error, 500);
  }
});

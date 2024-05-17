import { SetStateAction, Dispatch, useRef } from "react";
import ReactQuill from "react-quill";
("react-quill");
import "react-quill/dist/quill.bubble.css";

type Props = {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  // "indent",
  // "link",
  // "image",
  "color",
  "clean",
  "background",
  "color",
];

function Editor({ value, setValue }: Props) {
  const editorRef = useRef<HTMLDivElement>(null);

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "blockquote"],
        [{ color: [] }, { background: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["clean"],
      ],
    },
    clipboard: {
      matchVisual: true,
    },
  };

  return (
    <div ref={editorRef} className="w-full h-full" id="editor">
      <ReactQuill
        placeholder="Start typing here..."
        theme="bubble"
        value={value}
        formats={formats}
        onChange={setValue}
        modules={modules}
        bounds={"#editor"}
        className="custom-scrollbar h-full w-full resize-none col-span-3 bg-transparent text-white pl-2 pr-6 py-1 text-sm placeholder:text-white/40 leading-6 border-none outline-none disabled:bg-zinc-500/20 disabled:text-white/50"
      />
    </div>
  );
}

export default Editor;

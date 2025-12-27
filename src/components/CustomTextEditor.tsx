import SunEditor from "suneditor-react";
import "./customeditor.css";
import { useRef, useState } from "react";

export const stripHtml = (html: string) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};

const CustomTextEditor = ({
  onChange,
  value,
}: {
  onChange: (e: string) => void;
  value: string;
}) => {
  const options = [
    ["bold", "italic", "underline", "strike"],
    ["align", "list", "table", "link", "image"],
    ["font", "fontSize", "formatBlock", "blockquote"],
  ];

  const [plainText, setPlainText] = useState("");
  const editorRef = useRef<any>(null);

  return (
    <>
      <SunEditor
        setOptions={{ buttonList: options }}
        defaultValue={value}
        onChange={(html) => {
          const text = stripHtml(html); // ✅ plain text
          onChange(text); // send clean text
          setPlainText(text); // store clean text
        }}
        height="400px"
      />

      <div className="mt-2 text-sm text-muted">
        Characters: {plainText.length} <br />
        Words: {plainText.trim().split(/\s+/).filter(Boolean).length}
      </div>
    </>
  );
};

export default CustomTextEditor;

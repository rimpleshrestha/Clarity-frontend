import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css"; // Ensure CSS is imported
import "./customeditor.css";
import { useEffect, useState } from "react";

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
    ["align", "list", "table"],
    ["font", "fontSize", "formatBlock", "blockquote"],
  ];

  const [plainText, setPlainText] = useState("");

  useEffect(() => {
    setPlainText(stripHtml(value || ""));
  }, [value]);

  return (
    <>
      <SunEditor
        setOptions={{ buttonList: options }}
        setContents={value}
        onChange={(html) => {
          const text = stripHtml(html);
          onChange(html);
          setPlainText(text);
        }}
        height="400px"
      />

      <div className="mt-2 text-sm text-card-foreground">
        Characters: {plainText.length} <br />
        Words: {plainText.trim().split(/\s+/).filter(Boolean).length}
      </div>
    </>
  );
};

export default CustomTextEditor;

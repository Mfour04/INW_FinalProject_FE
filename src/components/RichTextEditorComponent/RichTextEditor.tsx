import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CharacterCount from "@tiptap/extension-character-count";

export const RichTextEditor = () => {
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit,
      CharacterCount.configure({
        limit: 5000,
      }),
    ],
    content: "<p>Hãy thử tài sáng tác của bạn tại đây....</p>",
    onCreate({ editor }) {
      setCharCount(editor.storage.characterCount.characters());
      setWordCount(editor.storage.characterCount.words());
    },
    onUpdate({ editor }) {
      setCharCount(editor.storage.characterCount.characters());
      setWordCount(editor.storage.characterCount.words());
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[200px] w-full hover:border border-gray-400 p-4 rounded-md focus:outline-none",
      },
      handleKeyDown(view, event) {
        if (event.key === "Tab") {
          event.preventDefault();
          view.dispatch(view.state.tr.insertText("\t"));
          return true;
        }
        return false;
      },
    },
  });

  return (
    <div className="w-full mt-10">
      {/* <MenuBar editor={editor} /> */}
      <EditorContent editor={editor} />
      <div className="mt-2 text-sm text-end">
        Characters: {charCount} / 5000 - Words: {wordCount}
      </div>
    </div>
  );
};

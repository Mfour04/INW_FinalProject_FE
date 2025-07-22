import { EditorContent, Editor } from "@tiptap/react";

type RichTextEditorProps = {
  editor: Editor | null;
};

export const RichTextEditor = ({ editor }: RichTextEditorProps) => {
  if (!editor) return null;
  const charCount = editor.storage.characterCount?.characters() ?? 0;
  const wordCount = editor.storage.characterCount?.words() ?? 0;

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

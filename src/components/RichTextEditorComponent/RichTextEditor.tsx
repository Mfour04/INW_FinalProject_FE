import { EditorContent, Editor } from "@tiptap/react";

type RichTextEditorProps = {
  editor: Editor | null;
};

export const RichTextEditor = ({ editor }: RichTextEditorProps) => {
  if (!editor) return null;

  return (
    <div className="w-full mt-10">
      <EditorContent editor={editor} />
    </div>
  );
};

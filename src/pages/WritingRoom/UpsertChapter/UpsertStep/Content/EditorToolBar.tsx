import {
  BoldIcon,
  ItalicIcon,
  Redo2,
  UnderlineIcon,
  Undo2,
} from "lucide-react";
import { TBtn } from "./TBtn";
import type { Editor } from "@tiptap/react";

export const EditorToolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null;
  return (
    <div className="flex items-center gap-2">
      <TBtn
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
        label="In đậm"
      >
        <BoldIcon className="h-4 w-4" />
      </TBtn>
      <TBtn
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
        label="In nghiêng"
      >
        <ItalicIcon className="h-4 w-4" />
      </TBtn>
      <TBtn
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        active={editor.isActive("underline")}
        label="Gạch chân"
      >
        <UnderlineIcon className="h-4 w-4" />
      </TBtn>

      <TBtn
        onClick={() => editor.chain().focus().undo().run()}
        label="Hoàn tác"
      >
        <Undo2 className="h-4 w-4" />
      </TBtn>
      <TBtn onClick={() => editor.chain().focus().redo().run()} label="Làm lại">
        <Redo2 className="h-4 w-4" />
      </TBtn>
    </div>
  );
};

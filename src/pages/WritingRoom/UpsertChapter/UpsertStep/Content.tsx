import { RichTextEditor } from "../../../../components/RichTextEditorComponent/RichTextEditor";
import type { ChapterForm } from "../UpsertChapter";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CharacterCount from "@tiptap/extension-character-count";

type ContentStepProps = {
  chapterForm: ChapterForm;
  setChapterForm: (value: ChapterForm) => void;
};

export const Content = ({ chapterForm, setChapterForm }: ContentStepProps) => {
  const editor = useEditor({
    extensions: [StarterKit, CharacterCount.configure({ limit: 5000 })],
    content:
      chapterForm.content || "<p>Hãy thử tài sáng tác của bạn tại đây...</p>",
    onUpdate({ editor }) {
      setChapterForm({
        ...chapterForm,
        content: editor.getHTML(),
      });
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
    <div className=" bg-[#1e1e21] text-neutral-200 px-[50px] py-8 flex flex-col justify-center rounded-[10px]">
      {/* Header */}
      <div className="border-b-[1px] border-gray-400 pb-8">
        <h1 className="text-orange-500 text-lg font-semibold">
          {chapterForm.title}
        </h1>
      </div>

      <RichTextEditor editor={editor} />
    </div>
  );
};

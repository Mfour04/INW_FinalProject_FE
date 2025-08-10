import { RichTextEditor } from "../../../../components/RichTextEditorComponent/RichTextEditor";
import type { ChapterForm } from "../UpsertChapter";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CharacterCount from "@tiptap/extension-character-count";
import { useMutation } from "@tanstack/react-query";
import type { PlagiarismAIRequest } from "../../../../api/AI/ai.type";
import { PlagiarismCheck } from "../../../../api/AI/ai.api";
import Button from "../../../../components/ButtonComponent";
import { stripHtmlTags } from "../../../../utils/regex";
import { useToast } from "../../../../context/ToastContext/toast-context";

type ContentStepProps = {
  chapterForm: ChapterForm;
  setChapterForm: (value: ChapterForm) => void;
};

export const Content = ({ chapterForm, setChapterForm }: ContentStepProps) => {
  const toast = useToast();
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

  const PlagiarismMutation = useMutation({
    mutationFn: (request: PlagiarismAIRequest) =>
      PlagiarismCheck(request).then((res) => res.data),
    onSuccess: (data) => {
      if (data.data.matchCount > 0) toast?.onOpen("Phát hiện đạo văn");
      else
        toast?.onOpen(
          "Kiểm tra đạo văn hoàn thành, không có dấu hiệu đạo văn!"
        );
    },
  });

  const handleCheckPlagiarism = (content: string) => {
    const rawContent = stripHtmlTags(content);
    PlagiarismMutation.mutate({ content: rawContent });
  };

  return (
    <div className=" bg-[#1e1e21] text-neutral-200 px-[50px] py-8 flex flex-col justify-center rounded-[10px]">
      {/* Header */}
      <div className="border-b-[1px] border-gray-400 pb-8">
        <h1 className="text-orange-500 text-lg font-semibold">
          {chapterForm.title}
        </h1>
      </div>

      <RichTextEditor editor={editor} />
      <div className="mt-6 flex justify-end">
        <Button
          onClick={() => handleCheckPlagiarism(chapterForm.content)}
          isLoading={PlagiarismMutation.isPending}
          className="w-fit border-none bg-[#ff6740] hover:bg-orange-600"
        >
          Kiểm tra đạo văn
        </Button>
      </div>
    </div>
  );
};

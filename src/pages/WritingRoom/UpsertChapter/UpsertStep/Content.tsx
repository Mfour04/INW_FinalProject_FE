import { useState, useMemo, useRef, useEffect } from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CharacterCount from "@tiptap/extension-character-count";
import { Mark, mergeAttributes, Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";

import { useMutation } from "@tanstack/react-query";
import { RichTextEditor } from "../../../../components/RichTextEditorComponent/RichTextEditor";
import type { ChapterForm } from "../UpsertChapter";
import type {
  Matches,
  PlagiarismAIApiResponse,
  PlagiarismAIRequest,
} from "../../../../api/AI/ai.type";
import { PlagiarismCheck } from "../../../../api/AI/ai.api";
import { stripHtmlTags } from "../../../../utils/regex";
import { useToast } from "../../../../context/ToastContext/toast-context";

import { FileText, ShieldCheck, Loader2 } from "lucide-react";
import { EditorToolbar } from "./Content/EditorToolBar";
import { PlagiarismModalMinimal } from "../PlagiarismModalMinimal";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    underline: {
      toggleUnderline: () => ReturnType;
      setUnderline: () => ReturnType;
      unsetUnderline: () => ReturnType;
    };
  }
}

const Underline = Mark.create({
  name: "underline",
  parseHTML() {
    return [
      { tag: "u" },
      {
        style: "text-decoration",
        getAttrs: (value) => (String(value).includes("underline") ? {} : false),
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["u", mergeAttributes(HTMLAttributes), 0];
  },
  addCommands() {
    return {
      toggleUnderline:
        () =>
        ({ commands }) =>
          commands.toggleMark(this.name),
      setUnderline:
        () =>
        ({ commands }) =>
          commands.setMark(this.name),
      unsetUnderline:
        () =>
        ({ commands }) =>
          commands.unsetMark(this.name),
    };
  },
});

const SimplePlaceholder = Extension.create({
  name: "simplePlaceholder",
  addOptions() {
    return {
      placeholder: "Hãy thử tài sáng tác của bạn tại đây…",
      className: "tiptap-placeholder",
    };
  },
  addProseMirrorPlugins() {
    const { placeholder, className } = this.options;
    return [
      new Plugin({
        key: new PluginKey("simplePlaceholder"),
        props: {
          decorations: (state) => {
            const { doc } = state;
            const first = doc.firstChild;
            const isEmpty =
              doc.childCount === 1 &&
              first?.isTextblock &&
              first.content.size === 0;

            if (!isEmpty) return DecorationSet.empty;

            const deco = Decoration.widget(
              1,
              () => {
                const span = document.createElement("span");
                span.className = className;
                span.textContent = placeholder;
                return span;
              },
              { side: -1 }
            );

            return DecorationSet.create(doc, [deco]);
          },
        },
      }),
    ];
  },
});

const LIMIT = 20000;

function useContainerWidth<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = (entry?: ResizeObserverEntry) => {
      const w = entry?.contentRect?.width ?? el.clientWidth ?? 0;
      setWidth(w);
    };

    const ro = new ResizeObserver((entries) => update(entries[0]));
    ro.observe(el);
    update();

    return () => ro.disconnect();
  }, []);

  return { ref, width };
}

type ContentStepProps = {
  chapterForm: ChapterForm;
  setChapterForm: (value: ChapterForm) => void;
  setIsCheck: (data: boolean) => void;
};

export const Content = ({
  chapterForm,
  setChapterForm,
  setIsCheck,
}: ContentStepProps) => {
  const [showPlagiarismModal, setShowPlagiarismModal] = useState(false);
  const [plagiarismMatches, setPlagiarismMatches] = useState<Matches[]>([]);
  const toast = useToast();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      CharacterCount.configure({ limit: LIMIT }),
      SimplePlaceholder.configure({
        placeholder: "Hãy thử tài sáng tác của bạn tại đây…",
      }),
    ],
    content: chapterForm.content || "<p></p>",
    onUpdate({ editor }) {
      setChapterForm({
        ...chapterForm,
        content: editor.getHTML(),
      });
    },
    editorProps: {
      attributes: {
        class: [
          "relative",
          "min-h-[320px] w-full rounded-xl",
          "bg-[#0e1014] ring-1 ring-white/10 px-4 py-3",
          "focus:outline-none focus:ring-2 focus:ring-white/25",
          "selection:bg-orange-500/20",
        ].join(" "),
      },
    },
  });

  const rawText = useMemo(
    () => stripHtmlTags(chapterForm.content || ""),
    [chapterForm.content]
  );
  const charCount =
    (editor?.storage as any)?.characterCount?.characters?.() ?? rawText.length;
  const progress = Math.min(100, (charCount / LIMIT) * 100);
  const nearLimit = LIMIT - charCount <= 150;

  const plagiarismMutation = useMutation({
    mutationFn: (request: PlagiarismAIRequest) =>
      PlagiarismCheck(request).then((res) => res.data),
    onSuccess: (data: PlagiarismAIApiResponse) => {
      if (data.data.matchCount > 0) {
        setIsCheck(false);
        setPlagiarismMatches(data.data.matches);
        setShowPlagiarismModal(true);
      } else {
        toast?.onOpen(
          "Kiểm tra đạo văn hoàn thành, không có dấu hiệu đạo văn!"
        );
        setIsCheck(true);
      }
    },
  });

  const handleCheckPlagiarism = () => {
    const raw = stripHtmlTags(chapterForm.content || "");
    plagiarismMutation.mutate({ content: raw });
  };

  const { ref: sectionRef, width: sectionW } = useContainerWidth<HTMLElement>();

  const barPx = useMemo(() => {
    const raw = Math.round(sectionW * 0.2);
    return Math.max(100, Math.min(320, raw));
  }, [sectionW]);

  return (
    <section ref={sectionRef} className="rounded-2xl p-2 py-2 px-3">
      <header className="mb-3 pb-2">
        <div className="flex items-center gap-3 ">
          <div className="h-10 w-10 grid place-items-center rounded-xl bg-white/[0.06] ring-1 ring-white/10">
            <FileText className="h-4 w-4 text-white/90" />
          </div>
          <div>
            <h1 className="text-[15px] md:text-[16px] font-semibold leading-tight">
              {chapterForm.title || "Chương mới"}
            </h1>
            <p className="text-[12px] text-white/55">Soạn thảo nội dung</p>
          </div>
        </div>
      </header>

      <div className="sticky top-0 z-30 -mx-3 px-3 py-2 backdrop-blur-xl border-b border-white/10 bg-[#0e1014]/60 supports-[backdrop-filter]:bg-[#0e1014]/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <EditorToolbar editor={editor} />
            <button
              onClick={handleCheckPlagiarism}
              disabled={plagiarismMutation.isPending}
              className={[
                "flex-shrink-0 whitespace-nowrap",
                "inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-medium text-white",
                "ring-1 ring-white/10 shadow-sm shadow-black/10",
                "bg-[linear-gradient(90deg,#ff512f_0%,#ff6740_45%,#ff9966_100%)]",
                plagiarismMutation.isPending
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:brightness-110 active:brightness-95",
              ].join(" ")}
            >
              {plagiarismMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang kiểm tra
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  Kiểm tra đạo văn
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2 min-w-0">
            <div
              className={[
                "hidden sm:block h-2 rounded-full bg-white/[0.06] overflow-hidden ring-1 ring-white/10",
                "transition-[width] duration-300 ease-out",
              ].join(" ")}
              style={{
                width: `${barPx}px`,
                willChange: "width",
              }}
            >
              <div
                className={[
                  "h-full",
                  nearLimit ? "bg-rose-500/85" : "bg-orange-500/85",
                  "transition-[width] duration-250 ease-out",
                ].join(" ")}
                style={{
                  width: `${progress}%`,
                  willChange: "width",
                }}
              />
            </div>

            <span
              className={[
                "flex-shrink-0 whitespace-nowrap",
                "ml-2 inline-flex items-center rounded-full px-2.5 py-1 text-[11px]",
                "ring-1 ring-white/10 bg-white/[0.05]",
                "transition-all duration-300 ease-out",
              ].join(" ")}
            >
              <span
                className="font-mono transition-opacity duration-300 ease-out"
                key={charCount}
              >
                {charCount.toLocaleString()}/{LIMIT.toLocaleString()}
              </span>
              <span className="ml-1 text-white/60">ký tự</span>
            </span>
          </div>
        </div>
      </div>

      <style>{`
        .ProseMirror { position: relative; }
        .tiptap-placeholder {
          position: absolute;
          left: 16px;
          top: 12px;
          pointer-events: none;
          color: rgba(255,255,255,0.45);
          font-size: 14px;
        }
      `}</style>

      <RichTextEditor editor={editor} />

      <PlagiarismModalMinimal
        open={showPlagiarismModal}
        onClose={() => setShowPlagiarismModal(false)}
        matches={plagiarismMatches}
      />
    </section>
  );
};

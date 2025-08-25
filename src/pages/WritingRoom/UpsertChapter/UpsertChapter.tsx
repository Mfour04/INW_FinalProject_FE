import ArrowLeft02 from "../../../assets/svg/WritingRoom/arrow-left-02-stroke-rounded.svg";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import type {
  CreateChapterRequest,
  UpdateChapterRequest,
} from "../../../api/Chapters/chapter.type";
import {
  CreateChapter,
  GetChapter,
  UpdateChapter,
} from "../../../api/Chapters/chapter.api";
import { useToast } from "../../../context/ToastContext/toast-context";
import { TEXT } from "./constants";
import { Title } from "./UpsertStep/Title";
import { Content } from "./UpsertStep/Content";
import { ScheduleAndPrice } from "./UpsertStep/ScheduleAndPrice";
import type {
  ModerationAIRequest,
  ModerationAIResponse,
} from "../../../api/AI/ai.type";
import { ModerationContent } from "../../../api/AI/ai.api";
import { stripHtmlTags } from "../../../utils/regex";
import { ConfirmModal } from "../../../components/ConfirmModal/ConfirmModal";

// new
import { SaveStatus } from "./components/SaveStatus";
import { Stepper } from "./components/Stepper"; // non-click version
import { StatusSummary } from "./components/StatusSummary";
import { ticksToDate } from "../../../utils/date_format";
import { ModerationReviewModal } from "./ModerationReviewModal";

export type ChapterForm = CreateChapterRequest & UpdateChapterRequest;

const initialChapterForm: ChapterForm = {
  novelId: "",
  title: "",
  content: "",
  isPaid: false,
  price: 0,
  isDraft: true,
  isPublic: false,
  chapterId: "",
  chapterNumber: 0,
  scheduledAt: null,
};

const categoryMap: Record<string, string> = {
  sexual: "Nội dung tình dục",
  "sexual/minors": "Nội dung tình dục liên quan đến trẻ vị thành niên",
  harassment: "Quấy rối",
  "harassment/threatening": "Quấy rối mang tính đe dọa",
  hate: "Thù ghét / kỳ thị",
  "hate/threatening": "Thù ghét mang tính đe dọa",
  illicit: "Hoạt động bất hợp pháp",
  "illicit/violent": "Hoạt động bất hợp pháp mang tính bạo lực",
  "self-harm": "Tự gây hại",
  "self-harm/intent": "Có ý định tự gây hại",
  "self-harm/instructions": "Hướng dẫn hoặc khuyến khích tự gây hại",
  violence: "Bạo lực",
  "violence/graphic": "Bạo lực có yếu tố hình ảnh kinh hoàng",
};

export const UpsertChapter = () => {
  const [chapterForm, setChapterForm] =
    useState<ChapterForm>(initialChapterForm);
  const [currentForm, setCurrentForm] =
    useState<ChapterForm>(initialChapterForm);
  const [isDraftChange, setIsDraftChange] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  const [confirmUpsertModal, setConfirmUpsertModal] = useState<boolean>(false);
  const [moderationData, setModerationData] =
    useState<ModerationAIResponse | null>(null);
  const [openModerationModal, setOpenModerationModal] = useState(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);

  const chapterFormRef = useRef(chapterForm);

  const toast = useToast();
  const navigate = useNavigate();
  const { novelId, chapterId } = useParams();

  const { data } = useQuery({
    queryKey: ["chapters", chapterId],
    queryFn: async () => {
      const res = await GetChapter(chapterId!);
      return res.data.data;
    },
    enabled: !!chapterId,
  });

  const createChapterMutation = useMutation({
    mutationFn: (request: CreateChapterRequest) => CreateChapter(request),
    onSuccess: () => {
      toast?.onOpen(TEXT.TOAST_CREATE_SUCCESS);
      navigate(`/novels/writing-room/${novelId}`);
    },
    onError: () => {
      toast?.onOpen(TEXT.TOAST_CREATE_ERROR);
    },
  });

  const updateChapterMutation = useMutation({
    mutationFn: (request: UpdateChapterRequest) => UpdateChapter(request),
    onSuccess: () => {
      toast?.onOpen(TEXT.TOAST_UPDATE_SUCCESS);
      navigate(`/novels/writing-room/${novelId}`);
    },
    onError: () => {
      toast?.onOpen(TEXT.TOAST_UPDATE_ERROR);
    },
  });

  const autoSaveMutation = useMutation({
    mutationFn: async (
      request: CreateChapterRequest | UpdateChapterRequest
    ) => {
      if (isUpdate) return UpdateChapter(request as UpdateChapterRequest);
      return CreateChapter(request as CreateChapterRequest);
    },
    onSuccess: (data) => {
      const chapter = data.data.data.chapter;
      setChapterForm({
        chapterId: chapter.chapterId,
        novelId: chapter.novelId,
        title: chapter.title,
        content: chapter.content,
        chapterNumber: chapter.chapterNumber!,
        isDraft: chapter.isDraft,
        isPaid: chapter.isPaid,
        isPublic: chapter.isPublic,
        price: chapter.price,
        scheduledAt: chapter.scheduledAt
          ? ticksToDate(chapter.scheduledAt)
          : null,
      });
      setCurrentForm({
        chapterId: chapter.chapterId,
        novelId: chapter.novelId,
        title: chapter.title,
        content: chapter.content,
        chapterNumber: chapter.chapterNumber!,
        isDraft: chapter.isDraft,
        isPaid: chapter.isPaid,
        isPublic: chapter.isPublic,
        price: chapter.price,
        scheduledAt: chapter.scheduledAt
          ? ticksToDate(chapter.scheduledAt)
          : null,
      });
      if (!isUpdate) {
        setIsUpdate(true);
        toast?.onOpen("Tự động lưu bản nháp hiện tại.");
      } else toast?.onOpen("Tự động lưu chỉnh sửa hiện tại.");
    },
  });

  const ModerationMutation = useMutation({
    mutationFn: (request: ModerationAIRequest) => ModerationContent(request),
    onSuccess: (resp) => {
      const mapped = resp.data.data.sensitive.map((item) => ({
        category: categoryMap[item.category] || item.category,
        score: Number(item.score),
      }));
      if (mapped.length > 0) {
        setModerationData({ flagged: true, sensitive: mapped });
        setOpenModerationModal(true);
      } else {
        handleConfirmUpsert();
      }
    },
  });

  const handleNextStep = () => setStep((s) => Math.min(3, s + 1));
  const handlePrevStep = () => setStep((s) => Math.max(1, s - 1));
  const handleUpsertButtonClick = () => {
    const rawContent = stripHtmlTags(chapterForm.content);
    ModerationMutation.mutate({ content: rawContent });
  };
  const handleConfirmUpsert = () => {
    if (isUpdate)
      updateChapterMutation.mutate(chapterForm as UpdateChapterRequest);
    else createChapterMutation.mutate(chapterForm as CreateChapterRequest);
    setConfirmUpsertModal(false);
  };

  const content = useMemo(() => {
    switch (step) {
      case 1:
        return (
          <Title chapterForm={chapterForm} setChapterForm={setChapterForm} />
        );
      case 2:
        return (
          <Content chapterForm={chapterForm} setChapterForm={setChapterForm} />
        );
      case 3:
        return (
          <ScheduleAndPrice
            chapterForm={chapterForm}
            setChapterForm={setChapterForm}
          />
        );
    }
  }, [step, chapterForm, setChapterForm]);

  useEffect(() => {
    if (novelId) setChapterForm((prev) => ({ ...prev, novelId }));
  }, [novelId]);

  useEffect(() => {
    if (data) {
      setIsUpdate(true);
      setChapterForm({
        chapterId: chapterId!,
        novelId: data.chapter.novelId,
        title: data.chapter.title,
        content: data.chapter.content,
        chapterNumber: data.chapter.chapterNumber,
        isDraft: data.chapter.isDraft,
        isPaid: data.chapter.isPaid,
        isPublic: data.chapter.isPublic,
        price: data.chapter.price,
        scheduledAt: data.chapter.scheduledAt,
      });
      setCurrentForm({
        chapterId: chapterId!,
        novelId: data.chapter.novelId,
        title: data.chapter.title,
        content: data.chapter.content,
        chapterNumber: data.chapter.chapterNumber,
        isDraft: data.chapter.isDraft,
        isPaid: data.chapter.isPaid,
        isPublic: data.chapter.isPublic,
        price: data.chapter.price,
        scheduledAt: data.chapter.scheduledAt,
      });
    }
  }, [data, chapterId]);

  useEffect(() => {
    setIsDraftChange(chapterForm === currentForm);
  }, [chapterForm, currentForm]);

  useEffect(() => {
    chapterFormRef.current = chapterForm;
  }, [chapterForm]);

  // useEffect(() => {
  //   const id = setInterval(() => {
  //     const currentForm = chapterFormRef.current;
  //     if (currentForm.title || currentForm.content) {
  //       autoSaveMutation.mutate(currentForm);
  //     }
  //   }, 5 * 60 * 1000);
  //   return () => clearInterval(id);
  // }, [isUpdate, autoSaveMutation]);

  return (
    <div
      className="min-h-screen bg-[#0b0c10] text-white"
      style={{
        backgroundImage:
          "radial-gradient(1200px 700px at 10% -10%, rgba(255,103,64,0.08), transparent 45%), radial-gradient(1000px 600px at 110% 0%, rgba(255,153,102,0.06), transparent 46%)",
      }}
    >
      <div className="max-w-6xl mx-auto py-4">
        {/* Header */}
        <div className="flex top-0 z-20 mb-10">
          <div className="w-full rounded-2xl backdrop-blur-md shadow-[0_16px_56px_-28px_rgba(0,0,0,0.75)] overflow-hidden">
            <div className="relative py-3">
              <div className="flex items-center justify-between">
                {/* Trái */}
                <div className="flex items-center gap-4 md:gap-6">
                  <button
                    onClick={() => navigate(-1)}
                    className="h-9 w-9 grid place-items-center rounded-lg bg-white/[0.06] 
                              ring-1 ring-white/10 hover:bg-white/[0.12] transition"
                    title="Quay lại"
                    aria-label="Quay lại"
                  >
                    <img src={ArrowLeft02} className="h-4 w-4" />
                  </button>
                  <div className="flex flex-col">
                    <div className="text-[18px] md:text-[20px] font-semibold leading-tight">
                      {isUpdate ? "Chỉnh sửa chương" : "Tạo chương mới"}
                    </div>
                    <div className="text-white/60 text-[12.5px]">
                      {chapterForm.title?.trim()
                        ? chapterForm.title
                        : "Chưa đặt tiêu đề"}
                    </div>
                  </div>
                </div>

                {/* Phải */}
                <div className="flex items-center gap-3">
                  {/* <button
                    onClick={() => refetch()}
                    className="h-9 w-9 grid place-items-center rounded-lg bg-white/[0.06] 
                              ring-1 ring-white/10 hover:bg-white/[0.12] transition"
                    title="Làm mới"
                    aria-label="Làm mới"
                  >
                    <span className="i-lucide-rotate-ccw h-4 w-4" />
                  </button> */}
                  <SaveStatus
                    loading={
                      autoSaveMutation.isPending ||
                      createChapterMutation.isPending ||
                      updateChapterMutation.isPending
                    }
                    moderated={ModerationMutation.isPending}
                    isDraftChange={isDraftChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div
          className="
            mt-6 grid grid-cols-1 gap-6
            lg:grid-cols-[260px_minmax(0,1fr)]
            xl:grid-cols-[280px_minmax(0,1fr)]
            2xl:grid-cols-[300px_minmax(0,1fr)]
          "
        >
          {/* Sidebar: Stepper + Status Summary */}
          <aside className="space-y-6">
            <div className="rounded-2xl ring-1 ring-white/10 bg-white/[0.04] p-3 md:p-4">
              <Stepper current={step} />
            </div>
            <div className="rounded-2xl ring-1 ring-white/10 bg-white/[0.04] p-3 md:p-4">
              <StatusSummary chapterForm={chapterForm} />
            </div>
          </aside>

          {/* Main content + per-step actions */}
          <main className="space-y-6">
            <div className="rounded-2xl ring-1 ring-white/10 bg-white/[0.04] p-4 md:p-5">
              {content}

              {/* Actions ngay dưới mỗi step */}
              <div className="mt-4 flex items-center justify-between px-2">
                {step > 1 ? (
                  <SecondaryButton onClick={handlePrevStep}>
                    <ChevronLeftMini />
                    <span>Quay lại</span>
                  </SecondaryButton>
                ) : (
                  <span />
                )}

                {step < 3 ? (
                  <PrimaryButton onClick={handleNextStep}>
                    Tiếp theo
                  </PrimaryButton>
                ) : (
                  <PrimaryButton
                    onClick={handleUpsertButtonClick}
                    loading={ModerationMutation.isPending}
                  >
                    {ModerationMutation.isPending
                      ? `Đang kiểm duyệt`
                      : `Xác nhận`}
                  </PrimaryButton>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmUpsertModal}
        title="Xem lại trước khi đăng"
        message="Bạn có muốn đăng chương với các thiết lập hiện tại?"
        onCancel={() => setConfirmUpsertModal(false)}
        onConfirm={handleConfirmUpsert}
      />
      <ModerationReviewModal
        open={openModerationModal}
        onClose={() => {
          setOpenModerationModal(false);
          setModerationData(null);
        }}
        onContinue={handleConfirmUpsert}
        data={moderationData}
      />
    </div>
  );
};

function PrimaryButton({
  children,
  onClick,
  disabled,
  loading,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={[
        "inline-flex items-center justify-center gap-2 h-8 px-4",
        "rounded-full text-[14px] font-semibold",
        "text-white ring-1 ring-white/10 shadow-sm shadow-black/10",
        "bg-[linear-gradient(90deg,#ff512f_0%,#ff6740_45%,#ff9966_100%)]",
        disabled || loading
          ? "opacity-70 cursor-not-allowed"
          : "hover:brightness-110 active:brightness-95",
        "transition",
      ].join(" ")}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          <circle
            className="opacity-30"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            d="M22 12a10 10 0 0 1-10 10"
            stroke="currentColor"
            strokeWidth="4"
          />
        </svg>
      )}
      <span className="whitespace-nowrap">{children}</span>
    </button>
  );
}

function SecondaryButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "rounded-full text-[14px] font-semibold",
        "inline-flex items-center justify-center gap-2 h-8 px-4",
        "bg-white/10 hover:bg-white/18",
        "ring-1 ring-white/12 text-white/90",
        disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
        "transition",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function ChevronLeftMini() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

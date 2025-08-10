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
import Button from "../../../components/ButtonComponent";
import { ScheduleAndPrice } from "./UpsertStep/ScheduleAndPrice";
import type { ModerationAIRequest } from "../../../api/AI/ai.type";
import { ModerationContent } from "../../../api/AI/ai.api";
import { stripHtmlTags } from "../../../utils/regex";
import { ConfirmModal } from "../../../components/ConfirmModal/ConfirmModal";

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
  const [step, setStep] = useState<number>(1);
  const [confirmUpsertModal, setConfirmUpsertModal] = useState<boolean>(false);

  const chapterFormRef = useRef(chapterForm);

  const toast = useToast();

  const navigate = useNavigate();
  const { novelId, chapterId } = useParams();

  const isUpdate = Boolean(chapterId);

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
      if (isUpdate) {
        return UpdateChapter(request as UpdateChapterRequest);
      } else {
        return CreateChapter(request as CreateChapterRequest);
      }
    },
    onSuccess: () => {
      if (!isUpdate)
        toast?.onOpen("Tự động lưu tiến trình hiện tại dưới dạng bản nháp");
      else toast?.onOpen("Tự động lưu tiến trình chỉnh sửa hiện tại!");
    },
  });

  const ModerationMutation = useMutation({
    mutationFn: (request: ModerationAIRequest) => ModerationContent(request),
    onSuccess: (data) => {
      const mappedResult = data.data.data.sensitive.map((item) => ({
        category: categoryMap[item.category] || item.category,
        score: Number(item.score),
      }));
      if (mappedResult.length > 0) setConfirmUpsertModal(true);
      else handleConfirmUpsert();
    },
  });

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

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
    if (novelId)
      setChapterForm((prev) => ({
        ...prev,
        novelId: novelId,
      }));
  }, [novelId]);

  useEffect(() => {
    if (data) {
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
    }
  }, [data]);

  useEffect(() => {
    chapterFormRef.current = chapterForm;
  }, [chapterForm]);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentForm = chapterFormRef.current;
      if (currentForm.title || currentForm.content) {
        autoSaveMutation.mutate(currentForm);
      }
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isUpdate]);

  // <div className="flex gap-3">
  //         {/* <button>Đã lưu</button> */}
  //         <button
  //           onClick={handleUpsertButtonClick}
  //           className="h-[36px] w-[100px] rounded-[10px] bg-[#ff6740] hover:bg-[#e14b2e] text-white"
  //         >
  //           {TEXT.PUBLISH}
  //         </button>
  //       </div>

  return (
    <div className="h-full bg-[#0f0f11] text-white px-6 py-2">
      <div className="flex items-center justify-between mb-2 h-[40px]">
        <button onClick={() => navigate(-1)} className="cursor-pointer">
          <img src={ArrowLeft02} />
        </button>
        <div className="gap-2 flex">
          <Button
            onClick={handlePreviousStep}
            disabled={step === 1}
            className="cursor-pointer bg-[#ff6740] hover:bg-orange-600"
          >
            Trước
          </Button>
          <Button
            onClick={step < 3 ? handleNextStep : handleUpsertButtonClick}
            disabled={step > 3}
            isLoading={step >= 3 && ModerationMutation.isPending}
            className="cursor-pointer bg-[#ff6740] hover:bg-orange-600"
          >
            {step < 3 ? "Tiếp theo" : "Xác nhận"}
          </Button>
        </div>
      </div>
      {content}
      <ConfirmModal
        isOpen={confirmUpsertModal}
        title="Nội dung nhạy cảm"
        message="nội dung của bạn chứa yếu cố nhạy cảm. Bạn có chắc chắn muốn đăng không?"
        onCancel={() => setConfirmUpsertModal(false)}
        onConfirm={handleConfirmUpsert}
      />
    </div>
  );
};

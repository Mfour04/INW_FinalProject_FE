import ArrowLeft02 from "../../../assets/svg/WritingRoom/arrow-left-02-stroke-rounded.svg";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
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

export const UpsertChapter = () => {
  const [chapterForm, setChapterForm] =
    useState<ChapterForm>(initialChapterForm);
  const [step, setStep] = useState<number>(1);

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

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleUpsertButtonClick = () => {
    if (isUpdate)
      updateChapterMutation.mutate(chapterForm as UpdateChapterRequest);
    else createChapterMutation.mutate(chapterForm as CreateChapterRequest);
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
    const interval = setInterval(() => {
      if (chapterForm.title || chapterForm.content) {
        autoSaveMutation.mutate(chapterForm);
      }
    }, 10 * 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, [chapterForm, isUpdate]);

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
        <div className="gap-10">
          <Button
            onClick={handlePreviousStep}
            disabled={step === 1}
            className="cursor-pointer bg-[#ff6740] hover:bg-orange-600"
          >
            Previous
          </Button>
          <Button
            onClick={step < 3 ? handleNextStep : handleUpsertButtonClick}
            disabled={step > 3}
            className="cursor-pointer bg-[#ff6740] hover:bg-orange-600"
          >
            {step < 3 ? "Next" : "Submit"}
          </Button>
        </div>
      </div>
      {content}
    </div>
  );
};

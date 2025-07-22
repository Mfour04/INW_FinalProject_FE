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
import { TitleAndSchedule } from "./UpsertStep/TitleAndSchedule";
import { Content } from "./UpsertStep/Content";
import Button from "../../../components/ButtonComponent";

const initialCreateChapterForm: CreateChapterRequest = {
  novelId: "",
  title: "",
  content: "",
  isPaid: false,
  price: 0,
  isDraft: false,
  isPublic: true,
};

const initialUpdateChapterForm: UpdateChapterRequest = {
  chapterId: "",
  title: "",
  content: "",
  chapterNumber: 0,
  isPaid: false,
  price: 0,
  scheduledAt: new Date(),
  isDraft: false,
  isPublic: true,
};

export const UpsertChapter = () => {
  const [createChapterForm, setCreateChapterForm] =
    useState<CreateChapterRequest>(initialCreateChapterForm);
  const [updateChapterForm, setUpdateChapterForm] =
    useState<UpdateChapterRequest>(initialUpdateChapterForm);
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

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleUpsertButtonClick = () => {
    if (isUpdate) updateChapterMutation.mutate(updateChapterForm);
    else createChapterMutation.mutate(createChapterForm);
  };

  const content = useMemo(() => {
    console.log(step);
    switch (step) {
      case 1:
        return <TitleAndSchedule />;
      case 2:
        return <Content />;
      case 3:
    }
  }, [step]);

  useEffect(() => {
    if (novelId)
      setCreateChapterForm((prev) => ({
        ...prev,
        novelId: novelId,
      }));
  }, [novelId]);

  useEffect(() => {
    if (data) {
      setUpdateChapterForm({
        chapterId: chapterId!,
        title: data.chapter.title,
        content: data.chapter.content,
        chapterNumber: data.chapter.chapterNumber,
        isDraft: data.chapter.isDraft,
        isPaid: data.chapter.isPaid,
        isPublic: data.chapter.isPublic,
        price: data.chapter.price,
        scheduledAt: new Date(),
      });
    }
  }, [data]);

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
            onClick={handleNextStep}
            disabled={step === 3}
            className="cursor-pointer bg-[#ff6740] hover:bg-orange-600"
          >
            Next
          </Button>
        </div>
      </div>
      {content}
    </div>
  );
};

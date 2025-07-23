import { useState } from "react";
import Switch from "../../../../components/SwitchComponent";
import { TEXT } from "../constants";
import type { ChapterForm } from "../UpsertChapter";

type TitleStepProps = {
  chapterForm: ChapterForm;
  setChapterForm: (param: ChapterForm) => void;
};

export const Title = ({ chapterForm, setChapterForm }: TitleStepProps) => {
  const [check, setCheck] = useState<boolean>(false);

  return (
    <div>
      <div className="mb-6 h-[116px]">
        <label className="h-[23px] text-[18px]">
          {TEXT.TITLE_LABEL + " "}
          <span className="text-red-500">{TEXT.CONTENT_REQUIRED_SYMBOL}</span>
        </label>
        <input
          type="text"
          maxLength={100}
          placeholder={TEXT.TITLE_PLACEHOLDER}
          value={chapterForm.title}
          onChange={(e) =>
            setChapterForm({
              ...chapterForm,
              title: e.target.value,
            })
          }
          className="my-[10px] h-[50px] w-full  border border-gray-400 rounded px-3 py-2 text-sm"
        />
        <p className="text-right text-xs text-white">
          {chapterForm.title.length}/100
        </p>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <div className="flex flex-col gap-5">
          <label className="h-[23px] text-[18px]">Bật bình luận</label>
          <div className="flex gap-4">
            <label className="h-[23px] text-[12px]">
              Cho phép người đọc bình luận trên chương truyện của bạn hay không?
            </label>
          </div>
        </div>
        <div>
          <Switch
            checked={check}
            onChange={setCheck}
            variant="primary"
            size="lg"
          />
        </div>
      </div>
    </div>
  );
};

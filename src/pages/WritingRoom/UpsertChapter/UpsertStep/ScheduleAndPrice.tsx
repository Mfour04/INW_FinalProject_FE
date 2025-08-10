import type { ChapterForm } from "../UpsertChapter";
import { useEffect, useState } from "react";

type ScheduleAndPriceStepProps = {
  chapterForm: ChapterForm;
  setChapterForm: React.Dispatch<React.SetStateAction<ChapterForm>>;
};

type PublishOption = "draft" | "now" | "scheduled";

export const ScheduleAndPrice = ({
  chapterForm,
  setChapterForm,
}: ScheduleAndPriceStepProps) => {
  const [publishOption, setPublishOption] = useState<PublishOption>(
    chapterForm.isDraft
      ? "draft"
      : chapterForm.scheduledAt
      ? "scheduled"
      : "now"
  );
  const [publishDate, setPublishDate] = useState<Date | null>(
    chapterForm.scheduledAt ? new Date(chapterForm.scheduledAt) : null
  );
  const [isPaid, setIsPaid] = useState<boolean>(chapterForm.isPaid);
  const [price, setPrice] = useState<number>(chapterForm.price);

  useEffect(() => {
    setChapterForm((prev) => {
      const newForm = {
        ...prev,
        isPaid,
        isDraft: publishOption === "draft",
        isPublic: publishOption !== "draft",
        price: isPaid ? price : 0,
        scheduledAt: publishOption === "scheduled" ? publishDate : null,
      };

      if (JSON.stringify(prev) === JSON.stringify(newForm)) {
        return prev;
      }

      return newForm;
    });
  }, [publishOption, isPaid, price, publishDate]);

  return (
    <div>
      <div className="mb-6">
        <label className="block text-lg font-semibold text-white mb-2">
          Lưu truyện của bạn dưới dạng
        </label>
        <div className="flex gap-4 h-[50px]">
          {["draft", "now", "scheduled"].map((option) => (
            <label
              key={option}
              className="flex items-center gap-2 text-white text-sm"
            >
              <input
                type="radio"
                value={option}
                checked={publishOption === option}
                onChange={(e) =>
                  setPublishOption(e.target.value as PublishOption)
                }
                className="accent-blue-500"
              />
              {option === "draft"
                ? "Bản nháp"
                : option === "now"
                ? "Xuất bản ngay bây giờ"
                : "Xuất bản theo lịch"}
            </label>
          ))}
        </div>

        {publishOption === "scheduled" && (
          <div className="mt-4">
            <label className="block text-sm text-white font-medium mb-1">
              Chọn ngày xuất bản
            </label>
            <input
              type="date"
              className="bg-gray-800 text-white border border-gray-600 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => {
                const selectedDate = new Date(e.target.value);
                setPublishDate(
                  isNaN(selectedDate.getTime()) ? null : selectedDate
                );
              }}
            />
          </div>
        )}
      </div>

      {/* Price Option */}
      <div className="mb-6">
        <label className="block text-lg font-semibold text-white mb-1">
          Chi phí
        </label>
        <p className="text-xs text-gray-400 mb-2">
          Bạn có thể điều chỉnh giá coin cho mỗi chương truyện
        </p>

        <select
          className="bg-gray-800 text-white border border-gray-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={isPaid.toString()}
          onChange={(e) => setIsPaid(e.target.value === "true")}
        >
          <option value="false">Miễn phí</option>
          <option value="true">Tính phí</option>
        </select>

        {isPaid && (
          <div className="mt-3">
            <label className="block text-sm font-medium text-white mb-1">
              Chọn mức giá (coin)
            </label>
            <select
              className="bg-gray-800 text-white border border-gray-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5].map((val) => (
                <option key={val} value={val}>
                  {val} coin
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

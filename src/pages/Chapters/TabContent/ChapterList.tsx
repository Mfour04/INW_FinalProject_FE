import type { GetNovelChaptersParams } from "../../../api/Novels/novel.api";
import type { NovelChaptersResponse } from "../../../api/Novels/novel.type";
import ArrowLeft02 from "../../../assets/svg/Novels/arrow-left-02-stroke-rounded.svg";
import ArrowRight02 from "../../../assets/svg/Novels/arrow-right-02-stroke-rounded.svg";
import Lock from "@mui/icons-material/Lock";

import { formatTicksToRelativeTime } from "../../../utils/date_format";

export type ChapterListProps = {
  novelData?: NovelChaptersResponse;
  handleClickChapter: (id: string, isPaid: boolean, price: number) => void;
  params: GetNovelChaptersParams;
  setParams: React.Dispatch<React.SetStateAction<GetNovelChaptersParams>>;
};
export const ChapterList = ({
  novelData,
  handleClickChapter,
  params,
  setParams,
}: ChapterListProps) => {
  const chapters = novelData?.allChapters;
  const lastChapter = chapters?.[chapters?.length - 1];
  return (
    <div>
      <div className="flex items-center h-[54px] text-[18px] gap-6 pb-[20px] border-b-2 border-[#d9d9d9]">
        <p className="flex items-center">Cập nhật gần nhất:</p>
        <p className="flex items-center text-[#ff6740]">
          Chương {lastChapter?.chapterNumber}: {lastChapter?.title}
        </p>
        <p className="flex items-center text-[#cfcfcf]">
          {formatTicksToRelativeTime(lastChapter?.updateAt!)}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-[25px]">
        {chapters?.map((chapter) => (
          <div
            onClick={() =>
              handleClickChapter(
                chapter.chapterId,
                chapter.isPaid,
                chapter.price
              )
            }
            key={chapter.chapterId}
            className="h-[72px] rounded cursor-pointer hover:bg-gray-700 transition-colors duration-200"
          >
            <div className="flex items-center h-full px-4 border-b-2 border-[#d9d9d9] mr-4 justify-between">
              <div className="flex items-center">
                <h1 className="w-[20px] text-[20px]">
                  {chapter.chapterNumber}
                </h1>
                <div className="ml-2">
                  <p className="text-[18px] font-normal line-clamp-1">
                    {chapter.title}
                  </p>
                  <p className="text-sm text-gray-400">
                    {formatTicksToRelativeTime(chapter.updateAt)}
                  </p>
                </div>
              </div>
              {chapter.isPaid && !novelData?.isAccessFull && <Lock />}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-[30px] flex justify-center items-center gap-[25px] h-[50px]">
        <button
          onClick={() =>
            setParams((prev) => ({
              ...prev,
              page: (prev.page || 1) - 1,
            }))
          }
          disabled={params.page === 0}
          className="cursor-pointer h-[50px] w-[50px] flex items-center justify-center bg-[#2c2c2c] rounded-[50%] hover:bg-[#555555]"
        >
          <img src={ArrowLeft02} />
        </button>
        <div className="w-[200px] h-[50px] flex items-center justify-center bg-[#ff6740] rounded-[25px]">
          <span className="text-sm">
            Trang <span className="border-1 rounded-[5px] px-2.5">{1}</span> /
            {novelData?.totalPages}
          </span>
        </div>
        <button
          onClick={() =>
            setParams((prev) => ({
              ...prev,
              page: (prev.page || 1) + 1,
            }))
          }
          disabled={params.page === (novelData?.totalPages ?? 1) - 1}
          className="cursor-pointer h-[50px] w-[50px] flex items-center justify-center bg-[#2c2c2c] rounded-[50%] hover:bg-[#555555]"
        >
          <img src={ArrowRight02} />
        </button>
      </div>
    </div>
  );
};

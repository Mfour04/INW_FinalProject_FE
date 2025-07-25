import StarRate from "@mui/icons-material/StarRate";
import BookMark from "@mui/icons-material/Bookmark";
import Comment from "@mui/icons-material/Comment";
import Share from "@mui/icons-material/Share";
import ModeEdit from "@mui/icons-material/ModeEdit";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { GetNovelById } from "../../../api/Novels/novel.api";
import { formatTicksToRelativeTime } from "../../../utils/date_format";

type Tabs = "Chapter" | "Draft";

const CreateChapters = () => {
  const [tab, setTab] = useState<Tabs>("Chapter");

  const { novelId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["novel", novelId],
    queryFn: () => GetNovelById(novelId!).then((res) => res.data.data),
    enabled: !!novelId,
  });

  const novel = data?.novelInfo;
  const chapters = data?.allChapters;
  const lastChapter = chapters?.[chapters?.length - 1];

  return (
    <div className="max-w-6xl mx-[50px] p-4 text-white">
      <div className="flex flex-col md:flex-row gap-4 ">
        <img
          src={novel?.novelImage || undefined}
          alt="Novel Cover"
          className="w-[200px] h-[320px] rounded-lg shadow-md"
        />

        <div className="flex-1 space-y-2">
          <h1 className="text-[44px] font-bold">{novel?.title}</h1>
          <div className="flex justify-between h-[40px]">
            <p className="h-9 w-[198px] border border-white rounded-[10px] flex items-center justify-center text-xl text-white">
              {novel?.authorName}
            </p>
            <div className="flex gap-2.5">
              <div className="flex items-center gap-1 text-[20px]">
                <StarRate sx={{ height: "20px", width: "20px" }} />
                <div className="flex items-center">0</div>
              </div>
              <div className="flex items-center gap-1 text-[20px]">
                <BookMark sx={{ height: "20px", width: "20px" }} />
                <div className="flex items-center">0</div>
              </div>
              <div className="flex items-center gap-1 text-[20px]">
                <Comment sx={{ height: "20px", width: "20px" }} />
                <div className="flex items-center">0</div>
              </div>
              <div className="w-[150px] h-full text-[18px] px-3 py-2.5 gap-3 flex items-center rounded-[5px] text-white bg-[#2e2e2e]">
                <span
                  className={`h-2 w-2 rounded-full inline-block bg-green-400`}
                />
                Đang diễn ra
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-7 mt-10 h-[37px]">
            {/* <button className="flex items-center justify-center gap-2.5 bg-[#ff6740] w-[228px] hover:bg-orange-600 px-4 py-1 rounded text-[18px]"><BookMark sx={{ height: '20px', width: '20px' }} /><p>Chỉnh sửa</p></button> */}
            <button
              onClick={() =>
                navigate(`/novels/writing-room/${novelId}/upsert-chapter`)
              }
              className="flex items-center justify-center gap-2.5 bg-[#ff6740] w-[228px] hover:bg-orange-600 px-4 py-1 rounded text-[18px]"
            >
              <BookMark sx={{ height: "20px", width: "20px" }} />
              <p>Chương mới</p>
            </button>
            <button className="flex items-center justify-center gap-2.5 px-4 py-1 text-sm text-[#ff6740] text-[18px]">
              <Share sx={{ height: "20px", width: "20px" }} />
              <p>Chia sẻ</p>
            </button>
          </div>

          <div className="flex flex-wrap mt-7 gap-2 text-xs text-gray-300">
            <div className="border-2 rounded-[5px] px-2 py-1 bg-black text-white text-sm">
              Phiêu lưu{" "}
            </div>
            <div className="border-2 rounded-[5px] px-2 py-1 bg-black text-white text-sm">
              Huyền huyễn{" "}
            </div>
            <div className="border-2 rounded-[5px] px-2 py-1 bg-black text-white text-sm">
              Tiên hiệp
            </div>
          </div>
        </div>
      </div>

      <div className="text-[18px] text-white mt-7 h-[130px] line-clamp-5 overflow-hidden">
        {novel?.description}
      </div>

      {/* Tabs */}
      <div className="flex gap-6 text-[20px] h-[44px] mt-6 mb-4">
        <button
          onClick={() => setTab("Chapter")}
          className={`cursor-pointer hover:bg-gray-800 flex items-center justify-center rounded-[10px] ${
            tab === "Chapter" ? "bg-[#2e2e2e]" : undefined
          } w-[263px]`}
        >
          Đã Đăng
        </button>
        <button
          onClick={() => setTab("Draft")}
          className={`cursor-pointer hover:bg-gray-800 flex items-center justify-center rounded-[10px] ${
            tab === "Draft" ? "bg-[#2e2e2e]" : undefined
          } w-[263px]`}
        >
          Bản Nháp{" "}
        </button>
      </div>

      <div className="flex items-center h-[54px] text-[18px] gap-6 pb-[20px] border-b-2 border-[#d9d9d9]">
        <p className="flex items-center">Cập nhật gần nhất:</p>
        <p className="flex items-center text-[#ff6740]">
          Chương {lastChapter?.chapterNumber}: {lastChapter?.title}
        </p>
        <p className="flex items-center text-[#cfcfcf]">
          {formatTicksToRelativeTime(lastChapter?.createAt!)}
        </p>
      </div>

      {/* Chapter List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-[25px]">
        {chapters
          ?.filter((chapter) =>
            tab === "Draft" ? chapter.isDraft : !chapter.isDraft
          )
          .map((chapter) => (
            <div
              key={chapter.chapterId}
              className="h-[72px] rounded cursor-pointer hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="flex items-center h-full px-4 border-b-2 border-[#d9d9d9] mr-10 justify-between">
                <div className="flex items-center">
                  {chapter.chapterNumber ? (
                    <h1 className="w-[60px] text-[20px]">
                      {chapter.chapterNumber}
                    </h1>
                  ) : undefined}
                  <div className="ml-2">
                    <p className="text-[18px] font-normal">{chapter.title}</p>
                    <p className="text-sm text-gray-400">
                      {formatTicksToRelativeTime(chapter.createAt)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    navigate(
                      `/novels/writing-room/${novelId}/upsert-chapter/${chapter.chapterId}`
                    )
                  }
                  className="cursor-pointer"
                >
                  <ModeEdit />
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CreateChapters;

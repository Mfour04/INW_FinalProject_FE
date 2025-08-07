import { useEffect, useState } from "react";
import BookSolid from "../../assets/svg/WritingRoom/clarity_book-solid.svg";
import ModeEdit from "@mui/icons-material/ModeEdit";
import ModeDelete from "@mui/icons-material/Delete";
import Add from "@mui/icons-material/Add";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DeleteNovel, GetAuthorNovels } from "../../api/Novels/novel.api";
import { formatTicksToDateString } from "../../utils/date_format";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext/toast-context";
import { ConfirmModal } from "../../components/ConfirmModal/ConfirmModal";

export const WritingRoom = () => {
  const [isNull, setIsNull] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [novelIdToDelete, setNovelIdToDelete] = useState<string | null>(null);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const toast = useToast();

  // const { data, isLoading, isSuccess } = useQuery({
  //     queryKey: ['novel', selectedNovelId],
  //     queryFn: () => GetNovelById(selectedNovelId!).then(res => res.data.data.novelInfo),
  //     enabled: !!selectedNovelId,
  // });

  const { data: novelsData } = useQuery({
    queryKey: ["authorNovels"],
    queryFn: () => GetAuthorNovels().then((res) => res.data.data),
  });

  const deleteNovelMutation = useMutation({
    mutationFn: (id: string) => DeleteNovel(id),
    onSuccess: () => {
      toast?.onOpen("Xóa truyện thành công!");
      queryClient.invalidateQueries({ queryKey: ["authorNovels"] });
    },
  });

  const handleIsCreateNovelClick = () => {
    navigate(`upsert-novel`);
  };

  const handleEditNovelButtonClick = (novelId: string) => {
    navigate(`upsert-novel/${novelId}`);
  };

  const handleDeleteNovelClick = (novelId: string) => {
    setNovelIdToDelete(novelId);
    setShowConfirmModal(true);
  };

  const confirmDelete = () => {
    if (novelIdToDelete) {
      deleteNovelMutation.mutate(novelIdToDelete);
    }
    setShowConfirmModal(false);
    setNovelIdToDelete(null);
  };

  useEffect(() => {
    if (!novelsData?.novels || novelsData.novels.length === 0) {
      setIsNull(false);
    } else {
      setIsNull(true);
    }
  }, [novelsData]);

  // useEffect(async () => {
  //     let file
  //     if (isSuccess && data) {
  //         file = await urlToFile(data.novel_image, 'novel-image.jpg')
  //         setCreateNovelForm({
  //             title: data.title,
  //             description: data.description,
  //             authorId: data.author_id,
  //             novelImage: file,
  //             tags: ['256D3E460C401085FE2F4EF5', '256DA37C123346EB93C0E5F4'],
  //             status: 1,
  //             isPublic: true,
  //             isPaid: false,
  //             isLock: false,
  //             purchaseType: 0,
  //             price: 0
  //         })
  //     }

  //     const url = URL.createObjectURL(file)
  //     setImagePreview(url)

  // }, [isSuccess, data]);

  return (
    <div className="bg-[#0f0f11] min-h-screen text-white px-4 py-6">
      {!isNull ? (
        <div className="bg-[#1e1e21] h-[244px] rounded-[10px] mx-[50px] flex flex-col justify-center items-center">
          <img src={BookSolid} />
          <p className="mt-4 mb-3 text-[20px]">Chưa có truyện nào!</p>
          <button
            onClick={handleIsCreateNovelClick}
            className="w-[111px] h-[37px] rounded-[10px] bg-[#ff6740] "
          >
            Tạo mới
          </button>
        </div>
      ) : (
        <div className="mx-[50px]">
          <h1 className="text-center text-xl font-semibold mb-6">
            Phòng sáng tác
          </h1>
          <div>
            <h1 className="text-left text-sm font-semibold mb-6">Tổng quan</h1>
            <div className="grid grid-cols-3 h-[125px] gap-4 mb-6 max-w mx-auto center">
              <div className="bg-[#45454e] rounded-lg py-4 px-6 text-center flex flex-col items-center justify-center">
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-gray-300">Tổng lượt xem</p>
              </div>
              <div className="bg-[#45454e] rounded-lg py-4 px-6 text-center flex flex-col items-center justify-center">
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-gray-300">Tổng lượt like</p>
              </div>
              <div className="bg-[#45454e] rounded-lg py-4 px-6 text-center flex flex-col items-center justify-center">
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-gray-300">Tổng lượt bình luận</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mx-auto mb-4">
            <h2 className="text-lg font-semibold">
              Tủ truyện ({novelsData?.novels.length})
            </h2>
            <button
              onClick={handleIsCreateNovelClick}
              className="h-[37px] w-[175px] bg-[#ff6740] hover:bg-[#e14b2e] text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Tạo truyện mới
            </button>
          </div>
          <div className="flex flex-col gap-5">
            {novelsData?.novels.map((novel) => (
              <div
                key={novel.novelId}
                className="h-[200px] bg-[#1e1e21] rounded-[10px] p-4 "
              >
                <div className="flex gap-4">
                  <img
                    src={novel.novelImage || undefined}
                    className="w-[120px] h-[150px] bg-[#d9d9d9] my-[10px] ml-[10px] rounded-[10px]"
                  />

                  <div className="flex-1 mt-[10px]">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex justify-between items-center w-full">
                        <div className="w-[150px] h-[35px] text-[18px] px-3 py-2.5 gap-3 flex items-center rounded-[5px] text-white bg-[#2e2e2e]">
                          <span
                            className={`h-2 w-2 rounded-full inline-block ${
                              novel.status === 0
                                ? "bg-gray-400"
                                : "bg-green-400"
                            }`}
                          />
                          {novel.status === 0 ? "Hoàn thành" : "Đang diễn ra"}
                        </div>
                        <div className="flex gap-[25px]">
                          <button
                            onClick={() =>
                              handleEditNovelButtonClick(novel.slug)
                            }
                            className="bg-[#555555] h-[35px] w-[35px] p-1 rounded-[5px] hover:bg-gray-600"
                          >
                            <ModeEdit sx={{ height: "20px", width: "20px" }} />
                          </button>
                          <button
                            onClick={() => navigate(`${novel.novelId}`)}
                            className="bg-[#555555] h-[35px] w-[35px] p-1 rounded-[5px] hover:bg-gray-600"
                          >
                            <Add sx={{ height: "20px", width: "20px" }} />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteNovelClick(novel.novelId)
                            }
                            className="bg-red-700 h-[35px] w-[35px] p-1 rounded-[5px] hover:bg-red-500"
                          >
                            <ModeDelete
                              sx={{ height: "20px", width: "20px" }}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="text-[18px] text-white line-clamp-1">
                      {novel.title}
                    </p>
                    <div className="mt-[20px] text-xs text-gray-400 grid grid-cols-3 gap-y-4 gap-x-10">
                      <div className="flex gap-[40px]">
                        <div className="flex flex-col gap-y-5">
                          <p className="text-[15px]">Tổng chương</p>
                          <p className="text-[15px]">Ngày cập nhật</p>
                        </div>
                        <div className="flex flex-col gap-y-5">
                          <p className="text-[15px]">
                            <strong>1</strong>
                          </p>
                          <p className="text-[15px]">
                            <strong>
                              {formatTicksToDateString(novel.createAt)}
                            </strong>
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-[40px]">
                        <div className="flex flex-col gap-y-5">
                          <p className="text-[15px]">Lượt đọc</p>
                          <p className="text-[15px]">Lượt theo dõi</p>
                        </div>
                        <div className="flex flex-col gap-y-5">
                          <p className="text-[15px]">
                            <strong>{novel.totalViews}</strong>
                          </p>
                          <p className="text-[15px]">
                            <strong>{novel.followers}</strong>
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-[40px]">
                        <div className="flex flex-col gap-y-5">
                          <p className="text-[15px]">Lượt bình luận</p>
                          <p className="text-[15px]">Lượt đánh giá</p>
                        </div>
                        <div className="flex flex-col gap-y-5">
                          <p className="text-[15px]">
                            <strong>1</strong>
                          </p>
                          <p className="text-[15px]">
                            <strong>2</strong>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={showConfirmModal}
        title="Xóa truyện"
        message="Bạn có chắc chắn muốn xóa truyện này không? Thao tác này không thể hoàn tác."
        onConfirm={confirmDelete}
        onCancel={() => setShowConfirmModal(false)}
      />
    </div>
  );
};

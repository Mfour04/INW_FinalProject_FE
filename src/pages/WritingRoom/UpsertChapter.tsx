import ArrowLeft02 from '../../assets/svg/WritingRoom/arrow-left-02-stroke-rounded.svg'
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import type { Chapter, CreateChapterRequest, UpdateChapterRequest } from "../../api/Chapters/chapter.type"
import { CreateChapter, GetChapter, UpdateChapter } from "../../api/Chapters/chapter.api"
import { useToast } from "../../context/ToastContext/toast-context"

const initialCreateChapterForm: CreateChapterRequest = {
    novelId: '',
    title: '',
    content: '',
    isPaid: false,
    price: 0,
    isDraft: false,
    isPublic: true,
}

const initialUpdateChapterForm: UpdateChapterRequest = {
    chapterId: '',
    title: '',
    content: '',
    chapterNumber: 0,
    isPaid: false,
    price: 0,
    scheduledAt: new Date(),
    isDraft: false,
    isPublic: true
}

export const UpsertChapter = () => {
  const [createChapterForm, setCreateChapterForm] = useState<CreateChapterRequest>(initialCreateChapterForm);
  const [updateChapterForm, setUpdateChapterForm] = useState<UpdateChapterRequest>(initialUpdateChapterForm);

  const toast = useToast();

  const navigate = useNavigate()
  const { novelId, chapterId } = useParams()

  const isUpdate = Boolean(chapterId);

  const { data } = useQuery({
        queryKey: ['chapters', chapterId],
        queryFn: async () => {
            const res = await GetChapter(chapterId!);
            return res.data.data;
        },
        enabled: !!chapterId
    });


  const createChapterMutation = useMutation({
    mutationFn: (request: CreateChapterRequest) => CreateChapter(request),
    onSuccess: () => {
      toast?.onOpen('Bạn đã tạo chương truyện thành công');
      navigate(`/novels/writing-room/${novelId}`);
    },
    onError:() => {
      toast?.onOpen('Có lỗi xảy ra trong lúc tạo chương truyện');
    }
  })

  const updateChapterMutation = useMutation({
    mutationFn: (request: UpdateChapterRequest) => UpdateChapter(request),
    onSuccess: () => {
      toast?.onOpen('Bạn đã cập nhật chương truyện thành công');
      navigate(`/novels/writing-room/${novelId}`);
    },
    onError:() => {
      toast?.onOpen('Có lỗi xảy ra trong lúc cập nhật chương truyện');
    }
  })

  const handleUpsertButtonClick = () => {
    if (isUpdate) updateChapterMutation.mutate(updateChapterForm)
    else createChapterMutation.mutate(createChapterForm)
  }

  useEffect(() => {
    if (novelId) setCreateChapterForm(prev => ({
      ...prev,
      novelId: novelId
    }))
  }, [novelId])

  useEffect(() => {
    if(data) {
      setUpdateChapterForm({
        chapterId: chapterId!,
        title: data.title,
        content: data.content,
        chapterNumber: data.chapterNumber,
        isDraft: data.isDraft,
        isPaid: data.isPaid,
        isPublic: data.isPublic,
        price: data.price,
        scheduledAt: new Date()
      })
    }
    console.log(isUpdate)
  }, [data])

  useEffect(() => {
    console.log(updateChapterForm)
  }, [updateChapterForm])

  return (
    <div className="min-h-screen bg-[#1e1e21] text-white px-6 py-8">
      <div className="flex items-center justify-between mb-8 h-[40px]">
        <button onClick={() => navigate(-1)} className="cursor-pointer">
          <img src={ArrowLeft02} />
        </button>
        <div className="flex gap-3">
          {/* <button>Đã lưu</button> */}
          <button onClick={handleUpsertButtonClick} className="h-[36px] w-[100px] rounded-[10px] bg-[#ff6740] hover:bg-[#e14b2e] text-white">Xuất bản</button>
        </div>
      </div>

      <div className="mb-6 h-[116px]">
        <label className="h-[23px] text-[18px]">Tiêu đề <span className="text-red-500">*</span></label>
        <input
          type="text"
          maxLength={100}
          placeholder="Nhập tên truyện"
          value={!isUpdate? createChapterForm.title ?? "": updateChapterForm.title ?? ""}
          onChange={
            (e) => {
              !isUpdate ?
              setCreateChapterForm(prev => ({
                ...prev,
                title: e.target.value
              })) :
              setUpdateChapterForm(prev => ({
                ...prev,
                title: e.target.value
              }))
            }
        }
          className="my-[10px] h-[50px] w-full bg-[#1e1e21] border border-gray-600 rounded px-3 py-2 text-sm"
        />
        <p className="text-right text-xs text-white">{createChapterForm.title.length}/100</p>
      </div>

      {/* <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">Lịch đăng truyện</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input type="radio" value="now" />
            Ngay bắy giờ
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" value="later"  />
            Đặt lịch đăng
          </label>
        </div>
      </div> */}

      <div className="mb-6">
        <label className="h-[23px] text-[18px]">Nội dung <span className="text-red-500">*</span></label>
        <textarea
          rows={10}
          maxLength={15000}
          value={!isUpdate ?createChapterForm.content ?? "": updateChapterForm.content ?? ""}
          onChange={
            (e) => {
              !isUpdate ?
              setCreateChapterForm(prev => ({
                ...prev,
                content: e.target.value
              })): 
              setUpdateChapterForm(prev => ({
                ...prev,
                content: e.target.value
              }))
            }
        }
          className="h-[300px] w-full bg-[#1e1e21] border border-gray-600 rounded-[10px] my-[10px] px-3 py-2 text-sm resize-none"
        />
        <div className="flex justify-between">
          <p className="text-xs text-white mt-1">- Nội tối đa 5000 ký tự<br />- Vui lòng tuân thủ <span className="text-[#ff6740] underline">đúng luật</span></p>
          <p className="text-right text-xs text-white">{createChapterForm.content.length}/5000</p>
        </div>
      </div>

      {/* <div className="mb-6 flex items-center justify-between">
        <div>
          <label className="block text-sm font-semibold mb-1">Bật bình luận?</label>
          <p className="text-xs text-white max-w-sm">Khi tắt bình luận, người dùng sẽ không thể để lại nhận xét.</p>
        </div>
        <Switch  />
      </div> */}

      {/* <div className="mb-6">
        <label className="block text-sm font-semibold mb-1">Thiết lập xu</label>
        <p className="text-xs text-white mb-2">Bạn có thể điều chỉnh giá coin cho mỗi chương truyện</p>
        <RadioGroup className="flex gap-6">
          <RadioGroupItem value="0" id="xu-0" label="0" />
          <RadioGroupItem value="1" id="xu-1" label="1" />
          <RadioGroupItem value="2" id="xu-2" label="2" />
          <RadioGroupItem value="3" id="xu-3" label="3" />
        </RadioGroup>
      </div> */}
    </div>
  )
}

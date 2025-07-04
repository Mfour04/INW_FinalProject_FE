import { useEffect, useState } from 'react'
import BookSolid from '../../assets/svg/WritingRoom/clarity_book-solid.svg'
import ModeEdit from '@mui/icons-material/ModeEdit'
import ArrowLeft02 from '../../assets/svg/WritingRoom/arrow-left-02-stroke-rounded.svg'
import Add from '@mui/icons-material/Add'
import type { CreateNovelRequest } from '../../api/Novels/novel.type'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getTags } from '../../api/Tags/tag.api'
import { useAuth } from '../../hooks/useAuth'
import { CreateNovels, GetAuthorNovels, GetNovelById } from '../../api/Novels/novel.api'
import { formatTicksToDateString } from '../../utils/date_format'
import Button from '../../components/ButtonComponent'
import { urlToFile } from '../../utils/img'

const initialCreateNovelForms: CreateNovelRequest = {
    title: '',
    description: '',
    authorId: '',
    novelImage: null,
    tags: ['256D3E460C401085FE2F4EF5', '256DA37C123346EB93C0E5F4'],
    status: 1,
    isPublic: true,
    isPaid: false,
    isLock: false,
    purchaseType: 0,
    price: 0
}

export const WritingRoom = () => {
    const [isNull, setIsNull] = useState<boolean>(false)
    const [createNovel, setCreateNovel] = useState<boolean>(false)
    const [selectedNovelId, setSelectedNovelId] = useState<string | null>(null);
    const [createNovelForm, setCreateNovelForm] = useState<CreateNovelRequest>(initialCreateNovelForms);
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const { auth } = useAuth();

    // const { data, isLoading, isSuccess } = useQuery({
    //     queryKey: ['novel', selectedNovelId],
    //     queryFn: () => GetNovelById(selectedNovelId!).then(res => res.data.data.novelInfo),
    //     enabled: !!selectedNovelId,
    // });

    
    const { data: tagData } = useQuery({
        queryKey: ['tags'],
        queryFn: () => getTags().then(res => res.data.data)
    })

    const {data: novelsData } = useQuery({
        queryKey: ['authorNovels'],
        queryFn: () => GetAuthorNovels().then(res => res.data.data)
    })


    const createNovelMutation = useMutation({
        mutationFn: (formData: FormData) => CreateNovels(formData),
    })

    const handleIsCreateNovelClick = () => {
        setCreateNovel(true)
    }

    const handleCreateNovelClick = () => {
        const formData = new FormData()
        formData.append("title", createNovelForm.title)
        formData.append("description", createNovelForm.description)

        if (auth?.user?.userId) {
            formData.append("authorId", auth.user.userId)
        }

        if (createNovelForm.novelImage) {
            formData.append("novelImage", createNovelForm.novelImage)
        }

        createNovelForm.tags.forEach(tag =>
            formData.append("tags", tag)
        )

        formData.append("status", createNovelForm.status.toString())
        formData.append("isPublic", createNovelForm.isPublic.toString())
        formData.append("isPaid", createNovelForm.isPaid.toString())
        formData.append("isLock", createNovelForm.isLock.toString())
        formData.append("purchaseType", createNovelForm.purchaseType.toString())
        formData.append("price", createNovelForm.price.toString())

        createNovelMutation.mutate(formData);
    }

    const handleEditNovelButtonClick = (novelId: string) => {
        setSelectedNovelId(novelId);
        setCreateNovel(true);
    }

    useEffect(() => {
        if (createNovelForm.novelImage) {
            const url = URL.createObjectURL(createNovelForm.novelImage)
            setImagePreview(url)

            return () => URL.revokeObjectURL(url)
        } else {
            setImagePreview(null)
        }
    }, [createNovelForm.novelImage])

    useEffect(() => {
        if (novelsData) {
            setIsNull(true);
        } else {
            setIsNull(false);
        }
    }, [novelsData])

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
            {
                createNovel? (
                    <div className="min-h-screen bg-[#1e1e21] text-white px-6 py-8 rounded-[10px] mx-[50px]">
                        <div className="relative flex items-center justify-center mb-8 h-[40px]">
                            <button onClick={() => setCreateNovel(false)} className="absolute left-0">
                                <img src={ArrowLeft02} />
                            </button>

                            <h1 className="text-xl font-semibold text-center w-full">Tạo truyện mới</h1>
                        </div>

                        <div className="mb-4">
                            <label className="block text-xl mb-1">
                                Tên truyện <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={createNovelForm.title}
                                onChange={(e) => setCreateNovelForm(
                                    prev => ({
                                        ...prev,
                                        title: e.target.value
                                    }
                                    )
                                )}
                                className="w-full bg-[#1e1e21] border border-gray-600 rounded px-3 py-2 text-sm"
                                placeholder="Nhập tên truyện"
                            />
                            <p className="text-right text-xs text-gray-400 mt-1">{createNovelForm.title.length}/100</p>
                        </div>

                        {/* <div className="mb-4">
                            <label className="block text-xl mb-1">URL</label>
                            <div className="flex items-center bg-[#1e1e21] border border-gray-600 rounded overflow-hidden">
                            <span className="px-3 text-gray-500 text-sm bg-[#2a2a2d]">🔗 https://linkwave.io/</span>
                            <input
                                type="text"
                                className="flex-1 bg-transparent px-2 py-2 text-sm text-white"
                                placeholder="ten-truyen"
                            />
                            </div>
                            <p className="text-right text-xs text-gray-400 mt-1">0/100</p>
                        </div> */}

                        <div className="mb-6">
                            <label className="block text-sm mb-1">Mô tả <span className="text-red-500">*</span></label>
                            <textarea
                                rows={4}
                                value={createNovelForm.description}
                                onChange={(e) => setCreateNovelForm(
                                    prev => ({
                                        ...prev,
                                        description: e.target.value
                                    })
                                )}
                                className="w-full bg-[#1e1e21] border border-gray-600 rounded px-3 py-2 text-sm resize-none"
                                placeholder="Nhập mô tả truyện..."
                            />
                            <p className="text-right text-xs text-gray-400 mt-1">{createNovelForm.description.length}/1000</p>
                        </div>

                        <div className="grid grid-cols-10 gap-6 mb-6">
                            <div className="col-span-3">
                                <label className="block text-xl mb-1">
                                Bìa truyện <span className="text-red-500">*</span>
                                </label>
                                <label className="border border-dashed border-gray-600 rounded-[8px] flex items-center justify-center h-[200px] w-[150px] cursor-pointer">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        
                                        onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (file) {
                                            setCreateNovelForm(prev => ({
                                                ...prev,
                                                novelImage: file
                                            })
                                            )
                                        }
                                        }}
                                    />
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Bìa truyện" className="h-full object-cover" />
                                    ) : (
                                        <span className="text-sm text-gray-400">+ Thêm bìa</span>
                                    )}
                                </label>

                            </div>

                            {/* <div className="col-span-7">
                                <label className="block text-xl mb-1">
                                Banner
                                </label>
                                <div className="border border-dashed border-gray-600 rounded-[8px] flex items-center justify-center h-[200px] text-center px-4">
                                <span className="text-sm text-gray-400">
                                    + Thêm bìa
                                    <br />
                                    <span className="text-[10px] block mt-1 text-orange-300">
                                    Nếu không có ảnh banner truyện, hệ thống sẽ dùng ảnh mặc định.
                                    </span>
                                </span>
                                </div>
                            </div> */}
                        </div>


                        <div className="mb-6">
                            <label className="block text-sm mb-2">
                            Chủ đề <span className="text-orange-300 text-xs ml-1">⚠️ Tối đa 3 thẻ</span>
                            </label>
                            <div className="flex flex-wrap gap-2">
                            {tagData?.map((tag) => (
                                <button
                                key={tag.name}
                                className="px-3 py-1 bg-[#1e1e21] border border-gray-600 rounded-full text-sm hover:bg-[#2e2e2e] transition"
                                >
                                {tag.name}
                                </button>
                            ))}
                            </div>
                        </div>

                        <Button isLoading={createNovelMutation.isPending} onClick={handleCreateNovelClick} className="bg-[#ff6740] hover:bg-[#e14b2e] text-white px-5 py-2 rounded-md text-sm font-semibold">
                            Tạo truyện mới
                        </Button>
                    </div>

                ): ( 
                    !isNull ? (
                        <div className="bg-[#1e1e21] h-[244px] rounded-[10px] mx-[50px] flex flex-col justify-center items-center">
                                    <img src={BookSolid} />
                                    <p className='mt-4 mb-3 text-[20px]'>Chưa có truyện nào!</p>
                                    <button onClick={handleIsCreateNovelClick} className='w-[111px] h-[37px] rounded-[10px] bg-[#ff6740] '>Tạo mới</button>
                                </div>
                        ): (
                            <div className='mx-[50px]'>
                                <h1 className="text-center text-xl font-semibold mb-6">Phòng sáng tác</h1>
                                <div>
                                    <h1 className="text-left text-sm font-semibold mb-6">Tổng quan</h1>
                                    <div className="grid grid-cols-3 h-[125px] gap-4 mb-6 max-w mx-auto center">
                                        <div className="bg-[#45454e] rounded-lg py-4 px-6 text-center flex flex-col items-center justify-center">
                                            <p className="text-2xl font-bold">6</p>
                                            <p className="text-sm text-gray-300">Tổng lượt xem</p>
                                        </div>
                                        <div className="bg-[#45454e] rounded-lg py-4 px-6 text-center flex flex-col items-center justify-center">
                                            <p className="text-2xl font-bold">0</p>
                                            <p className="text-sm text-gray-300">Tổng lượt like</p>
                                        </div>
                                        <div className="bg-[#45454e] rounded-lg py-4 px-6 text-center flex flex-col items-center justify-center">
                                            <p className="text-2xl font-bold">1</p>
                                            <p className="text-sm text-gray-300">Tổng lượt bình luận</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between max-w-5xl mx-auto mb-4">
                                    <h2 className="text-lg font-semibold">Tủ truyện ({novelsData?.length})</h2>
                                    <button onClick={handleIsCreateNovelClick} className="h-[37px] w-[175px] bg-[#ff6740] hover:bg-[#e14b2e] text-white px-4 py-2 rounded-md text-sm font-medium">
                                        Tạo truyện mới
                                    </button>
                                </div>
                                <div className='flex flex-col gap-5'>
                                    {novelsData?.map((novel) => (
                                        <div key={novel.id} className="h-[200px] bg-[#1e1e21] rounded-[10px] p-4 max-w-5xl ">
                                            <div className="flex gap-4">
                                                <img src={novel.novel_image || undefined} className="w-[120px] h-[150px] bg-[#d9d9d9] my-[10px] ml-[10px] rounded-[10px]" />

                                                <div className="flex-1 mt-[10px]">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <div className='flex justify-between items-center w-full'>
                                                            <div className="w-[150px] h-[35px] text-[18px] px-3 py-2.5 gap-3 flex items-center rounded-[5px] text-white bg-[#2e2e2e]">
                                                                <span className={`h-2 w-2 rounded-full inline-block ${
                                                                    novel.status === 0 ? 'bg-gray-400' : 'bg-green-400'
                                                                }`} />
                                                                {novel.status === 0 ? 'Hoàn thành' : 'Đang diễn ra'}
                                                            </div>
                                                            <div className="flex gap-[25px]">
                                                                <button onClick={() => handleEditNovelButtonClick(novel.id)} className="bg-[#555555] h-[35px] w-[35px] p-1 rounded-[5px] hover:bg-gray-600"><ModeEdit sx={{ height: '20px', width: '20px'}}/></button>
                                                                <button className="bg-[#555555] h-[35px] w-[35px] p-1 rounded-[5px] hover:bg-gray-600"><Add sx={{ height: '20px', width: '20px'}}/></button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="text-[18px] text-white line-clamp-1">
                                                        {novel.title}
                                                    </p>
                                                    <div className="mt-[20px] text-xs text-gray-400 grid grid-cols-3 gap-y-4 gap-x-10">
                                                        <div className='flex gap-[40px]'>
                                                            <div className='flex flex-col gap-y-5'>
                                                                <p className='text-[15px]'>Tổng chương</p>
                                                                <p className='text-[15px]'>Ngày cập nhật</p>
                                                            </div>
                                                            <div className='flex flex-col gap-y-5'>
                                                                <p className='text-[15px]'><strong>1</strong></p>
                                                                <p className='text-[15px]'><strong>{formatTicksToDateString(novel.created_at)}</strong></p>
                                                            </div>
                                                        </div>
                                                        <div className='flex gap-[40px]'>
                                                            <div className='flex flex-col gap-y-5'>
                                                                <p className='text-[15px]'>Lượt đọc</p>
                                                                <p className='text-[15px]'>Lượt theo dõi</p>
                                                            </div>
                                                            <div className='flex flex-col gap-y-5'>
                                                                <p className='text-[15px]'><strong>{novel.total_views}</strong></p>
                                                                <p className='text-[15px]'><strong>{novel.followers}</strong></p>
                                                            </div>
                                                        </div>
                                                        <div className='flex gap-[40px]'>
                                                            <div className='flex flex-col gap-y-5'>
                                                                <p className='text-[15px]'>Lượt bình luận</p>
                                                                <p className='text-[15px]'>Lượt đánh giá</p>
                                                            </div>
                                                            <div className='flex flex-col gap-y-5'>
                                                                <p className='text-[15px]'><strong>1</strong></p>
                                                                <p className='text-[15px]'><strong>2</strong></p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                )
            }
        </div>
    )
}

import ArrowLeft02 from '../../assets/svg/Novels/arrow-left-02-stroke-rounded.svg'
import ArrowRight02 from '../../assets/svg/Novels/arrow-right-02-stroke-rounded.svg'
import ViewList from '@mui/icons-material/ViewList'
import Dashboard from '@mui/icons-material/Dashboard'
import StarRate from '@mui/icons-material/StarRate'
import BookMark from '@mui/icons-material/Bookmark'
import Comment from '@mui/icons-material/Comment'
import { useMemo, useState } from 'react'

type ViewAction = 'Grid' | 'List';

export const Novels = () => {
    const [actionState, setActionState] = useState<ViewAction>('Grid');

    const view = useMemo(() => {
        switch (actionState) {
            case 'Grid':
                return (
                    <>
                        <div className="grid grid-cols-6 gap-4 mb-6">
                            {[...Array(18)].map((_, i) => (
                                <div key={i} className='cursor-pointer w-full flex flex-col bg-[#1c1c1f] rounded-[10px] overflow-hidden'>
                                    <img
                                        className="w-full h-[275px] object-cover bg-[#d9d9d9] rounded-[10px]"
                                    />
                                    <p className="mt-[15px] h-10 text-sm font-medium text-center w-full line-clamp-2">Championship no Majo asdasd</p>
                                </div>
                            ))}
                        </div>
                    </>
                )
            case 'List':
                return (
                    <>
                        {[...Array(18)].map((_, i) => (
                            <div className="mb-[15px] flex h-[150px] p-[15px] bg-[#1e1e21] text-white rounded-[10px] gap-[20px] border border-black w-full">
                                <img
                                    className="h-[120px] w-[100px] object-cover bg-[#d9d9d9] rounded-[10px]"
                                />

                                <div className="flex flex-col flex-1 overflow-hidden justify-between">
                                    <div>
                                        <h2 className="text-[18px] font-medium truncate">
                                            Osoraku Kanojo wa Ore no Aniki wo Neratteru Osoraku Kanojo wa Ore no Aniki wo Neratteru Kanojo wa...
                                        </h2>
                                        <div className="flex flex-wrap gap-2 my-1">
                                            {['Trinh thám', 'Hài', 'Lãng mạn', 'Học đường', 'Gia đình'].map((tag, index) => (
                                                <div
                                                key={index}
                                                className="h-[24px] border-2 rounded-[5px] px-2 bg-black text-white text-sm"
                                                >
                                                    {tag}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className='flex justify-between w-full'>
                                        <p className="italic text-[16px] text-white">Iris Cavana</p>
                                        <div className="h-9 flex items-center gap-4 text-xs text-white mt-1">
                                            <div className='flex gap-2.5'>
                                                <div className="flex items-center gap-1 text-sm">
                                                    <StarRate sx={{height: '20px', width: '20px'}} /> 
                                                    <div className='flex items-center'>
                                                        4.9
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 text-sm ">
                                                    <BookMark sx={{ height: '20px', width: '20px' }} />
                                                    <div className='flex items-center'>
                                                        11K
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 text-sm ">
                                                    <Comment sx={{ height: '20px', width: '20px' }} /> 
                                                    <div>
                                                        123
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="w-[150px] h-full text-[18px] px-3 py-2.5 gap-3 flex items-center rounded-[5px] text-white bg-[#2e2e2e]">
                                                <span className="h-2 w-2 bg-green-400 rounded-full inline-block" />
                                                Đang diễn ra
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )
        }
    }, [actionState])
  return (
    <div className="flex flex-col flex-1 p-6 bg-[#1c1c1f] text-white overflow-auto">
        <div className=" justify-between items-center mb-6">
            <div className="flex items-center justify-between">
                <img src={ArrowLeft02} className="h-6 w-6 cursor-pointer" />
                <div className="flex-1 text-center">
                    <h1 className="text-2xl font-semibold">Tiểu thuyết mới nhất</h1>
                </div>
                <div className="w-6" />
            </div>

            <div className="flex items-center justify-between w-full h-10">
                {/* <div>Đang đọc</div> */}
                <div className='flex gap-[30px]'>
                    {/* <select id="filter" className="cursor-pointer bg-[#d9d9d9] text-black rounded-md w-[140px] px-2.5">
                        <option>Đang đọc</option>
                        <option>Đã đọc</option>
                        <option>Muốn đọc</option>
                    </select> */}
                    <div className='flex gap-2.5'>
                        <div onClick={() => setActionState('List')} className={`cursor-pointer h-10 w-10 rounded-[5px] flex items-center justify-center ${actionState === 'List' ? `bg-[#555555]`: `bg-[#2c2c2c]`}`}>
                            <ViewList sx={{ height: '30px', width: '30px'}} />
                        </div>
                        <div onClick={() => {setActionState('Grid')}} className={`cursor-pointer h-10 w-10 rounded-[5px] flex items-center justify-center ${actionState === 'Grid' ? `bg-[#555555]`: `bg-[#2c2c2c]`}`}>
                            <Dashboard sx={{ height: '30px', width: '30px'}} />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {view}

        <div className="mt-[30px] flex justify-center items-center gap-[25px] h-[50px]">
            <button className="cursor-pointer h-[50px] w-[50px] flex items-center justify-center bg-[#2c2c2c] rounded-[50%] hover:bg-[#555555]"><img src={ArrowLeft02} /></button>
            <div className='w-[200px] h-[50px] flex items-center justify-center bg-[#ff6740] rounded-[25px]'>
                <span className="text-sm">Trang <span className="border-1 rounded-[5px] px-2.5">1</span> / 7</span>
            </div>
            <button className="cursor-pointer h-[50px] w-[50px] flex items-center justify-center bg-[#2c2c2c] rounded-[50%] hover:bg-[#555555]"><img src={ArrowRight02} /></button>
        </div>
    </div>

  )
}

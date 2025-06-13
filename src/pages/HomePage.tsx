import { DarkModeToggler } from "../components/DarkModeToggler"
import Typography from "../components/TypographyComponent"
import ArrowLeftIcon from "../assets/svg/HomePage/arrow-left-01-stroke-rounded.svg"
import ArrowRightIcon from "../assets/svg/HomePage/arrow-right-01-stroke-rounded.svg"
import { useQuery } from "@tanstack/react-query"
import { GetNovels } from "../api/Novels/novel.api"
import type { Novel } from "../api/Novels/novel.type"

export const HomePage = () => {
  const { isLoading, data } = useQuery({
    queryKey: ['novels'],
    queryFn: async () => {
      const res = await GetNovels()
      return res.data.data as Novel[]
    },
  })

  return (
    <div>
      <div className="flex-col items-center px-[50px] bg-white dark:text-white dark:bg-[#0f0f11] justify-between">
        <div className="h-[412px] w-full flex-col">
          <div className="pt-6">
            <Typography variant="h4" size="large" >Truyện Vừa Ra Mắt</Typography>
          </div>
          <div className="mt-7 h-80 border border-black rounded-[10px] bg-[#1c1c1f] flex">
            <img src="" alt="" className="h-full min-w-1/5 bg-[#d9d9d9] rounded-[10px]" />
            {/* <div className="h-full min-w-1/5 bg-[#d9d9d9] rounded-[10px]" /> */}
            <div className="my-5 mx-6 flex-col">
              <Typography variant="h3" size="large">{isLoading? 'title': data?.[0].title}</Typography>
              <div className="flex gap-2.5">
                <div className="border-2 rounded-[5px] w-fit px-1.5 py-0.5 bg-black">Trinh Thám</div>
                <div className="border-2 rounded-[5px] w-fit px-1.5 py-0.5 bg-black">Hài</div>
                <div className="border-2 rounded-[5px] w-fit px-1.5 py-0.5 bg-black">Lãng mạn</div>
                <div className="border-2 rounded-[5px] w-fit px-1.5 py-0.5 bg-black">Học đường</div>
                <div className="border-2 rounded-[5px] w-fit px-1.5 py-0.5 bg-black">Gia đình</div>
              </div>
              <div className="mt-4">
                <Typography variant="p" size="small" className="font-sans">{isLoading? 'des': data?.[0].description}</Typography>
              </div>
              <div className="py-3.5 flex justify-between">
                <div className="italic text-lg">
                  Iris Cavana
                </div>
                <div className="flex gap-14">
                  <div className="text-[#ff6740]">
                    NO.1
                  </div>
                  <div>
                    <img src={ArrowLeftIcon} />
                  </div>
                   <div>
                    <img src={ArrowRightIcon} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="my-8 h-[595px] w-full border border-black bg-[#1c1c1f] gap-5 flex rounded-[10px]">
          <div className="w-1/3">
            <div className="h-14 bg-[#585876] rounded-[10px] flex items-center justify-center">
              <Typography>ĐỌC NHIỀU NHẤT</Typography>
            </div>
            <div className="h-[88px] mt-[15px] px-5 py-1 flex">
              <div className="bg-[#d9d9d9] h-[80px] min-w-[60px] rounded-[10px]" />
              <div className="mx-2.5 mt-3">
                <div className="text-[13px] py-[1px]">
                  Atticus’s Odyssey: Reincar...
                </div>
                <div className="text-[13px] py-[1px]">
                  Atticus’s Odyssey: Reincar...
                </div>
                <div className="text-[13px] py-[1px]">
                  Atticus’s Odyssey: Reincar...
                </div>
              </div>
            </div>
            <div className="h-[88px] mt-[15px] px-5 py-1 flex">
              <div className="bg-[#d9d9d9] h-[80px] min-w-[60px] rounded-[10px]" />
              <div className="mx-2.5 mt-3">
                <div className="text-[13px] py-[1px]">
                  Atticus’s Odyssey: Reincar...
                </div>
                <div className="text-[13px] py-[1px]">
                  Atticus’s Odyssey: Reincar...
                </div>
                <div className="text-[13px] py-[1px]">
                  Atticus’s Odyssey: Reincar...
                </div>
              </div>
            </div>
            <div className="h-[88px] mt-[15px] px-5 py-1 flex">
              <div className="bg-[#d9d9d9] h-[80px] min-w-[60px] rounded-[10px]" />
              <div className="mx-2.5 mt-3">
                <div className="text-[13px] py-[1px]">
                  Atticus’s Odyssey: Reincar...
                </div>
                <div className="text-[13px] py-[1px]">
                  Atticus’s Odyssey: Reincar...
                </div>
                <div className="text-[13px] py-[1px]">
                  Atticus’s Odyssey: Reincar...
                </div>
              </div>
            </div>
            <div className="h-[88px] mt-[15px] px-5 py-1 flex">
              <div className="bg-[#d9d9d9] h-[80px] min-w-[60px] rounded-[10px]" />
              <div className="mx-2.5 mt-3">
                <div className="text-[13px] py-[1px]">
                  Atticus’s Odyssey: Reincar...
                </div>
                <div className="text-[13px] py-[1px]">
                  Atticus’s Odyssey: Reincar...
                </div>
                <div className="text-[13px] py-[1px]">
                  Atticus’s Odyssey: Reincar...
                </div>
              </div>
            </div>
            <div className="h-[88px] mt-[15px] px-5 py-1 flex">
              <div className="bg-[#d9d9d9] h-[80px] min-w-[60px] rounded-[10px]" />
              <div className="mx-2.5 mt-3">
                <div className="text-[13px] py-[1px]">
                  Atticus’s Odyssey: Reincar...
                </div>
                <div className="text-[13px] py-[1px]">
                  Atticus’s Odyssey: Reincar...
                </div>
                <div className="text-[13px] py-[1px]">
                  Atticus’s Odyssey: Reincar...
                </div>
              </div>
            </div>
          </div>
          <div className="w-1/3">
            <div className="h-14 bg-[#585876] rounded-[10px] flex items-center justify-center">
              <Typography>XU HƯỚNG MỚI</Typography>
            </div>
            <div className="h-[88px] mt-[15px] px-5 py-1 flex">
              <div className="bg-[#d9d9d9] h-[80px] min-w-[60px] rounded-[10px]" />
              <div className="mx-2.5 mt-3">
                <div className="text-[13px] py-[1px]">
                  Atticus’s Odyssey: Reincar...
                </div>
                <div className="text-[13px] py-[1px]">
                  Atticus’s Odyssey: Reincar...
                </div>
                <div className="text-[13px] py-[1px]">
                  Atticus’s Odyssey: Reincar...
                </div>
              </div>
            </div>
            <div className="h-[88px] mt-[15px] px-5 py-1 flex">
              <div className="bg-[#d9d9d9] h-[80px] min-w-[60px] rounded-[10px]" />
              <div className="mx-2.5 mt-3">
                <div className="text-[13px] py-[1px]">
                  Atticus’s Odyssey: Reincar...
                </div>
                <div className="text-[13px] py-[1px]">
                  Atticus’s Odyssey: Reincar...
                </div>
                <div className="text-[13px] py-[1px]">
                  Atticus’s Odyssey: Reincar...
                </div>
              </div>
            </div>
            <div className="h-[88px] mt-[15px] px-5 py-1 flex">
              <div className="bg-[#d9d9d9] h-[80px] min-w-[60px] rounded-[10px]" />
              <div className="mx-2.5 mt-3">
                <div className="text-[13px] py-[1px]">
                  Atticus’s Odyssey: Reincar...
                </div>
                <div className="text-[13px] py-[1px]">
                  Atticus’s Odyssey: Reincar...
                </div>
                <div className="text-[13px] py-[1px]">
                  Atticus’s Odyssey: Reincar...
                </div>
              </div>
            </div>
            <div className="h-[88px] mt-[15px] px-5 py-1 flex">
              <div className="bg-[#d9d9d9] h-[80px] min-w-[60px] rounded-[10px]" />
              <div className="mx-2.5 mt-3">
                <div className="text-[13px] py-[1px]">
                  Atticus’s Odyssey: Reincar...
                </div>
                <div className="text-[13px] py-[1px]">
                  Atticus’s Odyssey: Reincar...
                </div>
                <div className="text-[13px] py-[1px]">
                  Atticus’s Odyssey: Reincar...
                </div>
              </div>
            </div>
            <div className="h-[88px] mt-[15px] px-5 py-1 flex">
              <div className="bg-[#d9d9d9] h-[80px] min-w-[60px] rounded-[10px]" />
              <div className="mx-2.5 mt-3">
                <div className="text-[13px] py-[1px]">
                  Atticus’s Odyssey: Reincar...
                </div>
                <div className="text-[13px] py-[1px]">
                  Atticus’s Odyssey: Reincar...
                </div>
                <div className="text-[13px] py-[1px]">
                  Atticus’s Odyssey: Reincar...
                </div>
              </div>
            </div>
          </div>
          <div className="w-1/3">
            <div className="h-14 bg-[#585876] rounded-[10px] flex items-center justify-center">
              <Typography>ĐÁNH GIÁ CAO</Typography>
            </div>
            <div className="h-[88px] mt-[15px] px-5 py-1 flex">
              <div className="bg-[#d9d9d9] h-[80px] min-w-[60px] rounded-[10px]" />
              <div className="mx-2.5 mt-3">
                <div className="text-[13px] py-[1px]">
                  Atticus’s Odyssey: Reincar...
                </div>
                <div className="text-[13px] py-[1px]">
                  Atticus’s Odyssey: Reincar...
                </div>
                <div className="text-[13px] py-[1px]">
                  Atticus’s Odyssey: Reincar...
                </div>
              </div>
            </div>
            <div className="h-[88px] mt-[15px] px-5 py-1 flex">
              <div className="bg-[#d9d9d9] h-[80px] min-w-[60px] rounded-[10px]" />
              <div className="mx-2.5 mt-3">
                <div className="text-[13px] py-[1px]">
                  Atticus’s Odyssey: Reincar...
                </div>
                <div className="text-[13px] py-[1px]">
                  Atticus’s Odyssey: Reincar...
                </div>
                <div className="text-[13px] py-[1px]">
                  Atticus’s Odyssey: Reincar...
                </div>
              </div>
            </div>
            <div className="h-[88px] mt-[15px] px-5 py-1 flex">
              <div className="bg-[#d9d9d9] h-[80px] min-w-[60px] rounded-[10px]" />
              <div className="mx-2.5 mt-3">
                <div className="text-[13px] py-[1px]">
                  Atticus’s Odyssey: Reincar...
                </div>
                <div className="text-[13px] py-[1px]">
                  Atticus’s Odyssey: Reincar...
                </div>
                <div className="text-[13px] py-[1px]">
                  Atticus’s Odyssey: Reincar...
                </div>
              </div>
            </div>
            <div className="h-[88px] mt-[15px] px-5 py-1 flex">
              <div className="bg-[#d9d9d9] h-[80px] min-w-[60px] rounded-[10px]" />
              <div className="mx-2.5 mt-3">
                <div className="text-[13px] py-[1px]">
                  Atticus’s Odyssey: Reincar...
                </div>
                <div className="text-[13px] py-[1px]">
                  Atticus’s Odyssey: Reincar...
                </div>
                <div className="text-[13px] py-[1px]">
                  Atticus’s Odyssey: Reincar...
                </div>
              </div>
            </div>
            <div className="h-[88px] mt-[15px] px-5 py-1 flex">
              <div className="bg-[#d9d9d9] h-[80px] min-w-[60px] rounded-[10px]" />
              <div className="mx-2.5 mt-3">
                <div className="text-[13px] py-[1px]">
                  Atticus’s Odyssey: Reincar...
                </div>
                <div className="text-[13px] py-[1px]">
                  Atticus’s Odyssey: Reincar...
                </div>
                <div className="text-[13px] py-[1px]">
                  Atticus’s Odyssey: Reincar...
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-[490px] w-full flex-col">
          <div className="py-6">
            <Typography variant="h4" size="large" >Đề cử</Typography>
          </div>
          <div className="gap-12 flex max-w-screen overflow-x-hidden">
            <div className="h-[280px] w-[160px] bg-[#d9d9d9] rounded-[10px]" />
            <div className="h-[280px] w-[160px] bg-[#d9d9d9] rounded-[10px]" />
            <div className="h-[280px] w-[160px] bg-[#d9d9d9] rounded-[10px]" />
            <div className="h-[280px] w-[160px] bg-[#d9d9d9] rounded-[10px]" />
            <div className="h-[280px] w-[160px] bg-[#d9d9d9] rounded-[10px]" />
          </div>
        </div>

        <div className="h-[625px] w-full flex-col">
          <div className="py-6">
            <Typography variant="h4" size="large" >Truyện mới cập nhật</Typography>
          </div>
          <div>
            <div className="h-64 gap-12 flex max-w-screen overflow-x-hidden">
              <div className="h-[180px] w-[100px] bg-[#d9d9d9] rounded-[10px]" />
              <div className="h-[180px] w-[100px] bg-[#d9d9d9] rounded-[10px]" />
              <div className="h-[180px] w-[100px] bg-[#d9d9d9] rounded-[10px]" />
              <div className="h-[180px] w-[100px] bg-[#d9d9d9] rounded-[10px]" />
              <div className="h-[180px] w-[100px] bg-[#d9d9d9] rounded-[10px]" />
              <div className="h-[180px] w-[100px] bg-[#d9d9d9] rounded-[10px]" />
              <div className="h-[180px] w-[100px] bg-[#d9d9d9] rounded-[10px]" />
            </div>
            <div className="h-64 gap-12 flex max-w-screen overflow-x-hidden">
              <div className="h-[180px] w-[100px] bg-[#d9d9d9] rounded-[10px]" />
              <div className="h-[180px] w-[100px] bg-[#d9d9d9] rounded-[10px]" />
              <div className="h-[180px] w-[100px] bg-[#d9d9d9] rounded-[10px]" />
              <div className="h-[180px] w-[100px] bg-[#d9d9d9] rounded-[10px]" />
              <div className="h-[180px] w-[100px] bg-[#d9d9d9] rounded-[10px]" />
              <div className="h-[180px] w-[100px] bg-[#d9d9d9] rounded-[10px]" />
              <div className="h-[180px] w-[100px] bg-[#d9d9d9] rounded-[10px]" />
            </div>
          </div>
        </div>
        <DarkModeToggler />
      </div>
    </div>
  )
}

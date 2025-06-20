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
         <Typography variant="h4" size="large" className="mb-4">
              Truyện Vừa Ra Mắt
            </Typography>
        <div className="lg:h-[412px] w-full flex flex-col lg:flex-row bg-[#1c1c1f] rounded-[10px] border border-black overflow-hidden">
          <img
            src=""
            alt=""
            className="w-full lg:w-1/4 h-52 lg:h-auto object-cover bg-[#d9d9d9]"
          />

          <div className="p-4 flex flex-col flex-1 min-w-0">
           
            <Typography variant="h3" size="large" className="mb-2 line-clamp-1">
              {isLoading ? 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Inventore, at facere. Ab vero excepturi nemo. Id iure expedita ratione iusto vel corporis! Officia amet nisi suscipit, voluptas laborum odio mollitia.' : data?.[0].title}
            </Typography>

            <div className="flex flex-wrap gap-2 mb-4">
              {['Trinh Thám', 'Hài', 'Lãng mạn', 'Học đường', 'Gia đình'].map((tag) => (
                <div
                  key={tag}
                  className="border-2 rounded-[5px] px-2 py-1 bg-black text-white text-sm"
                >
                  {tag}
                </div>
              ))}
            </div>
            <Typography variant="p" size="small" className="mb-4 line-clamp-2 lg:line-clamp-8">
              {isLoading ? 
              'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum, reiciendis distinctio? Vel eos magni fugit fugiat dignissimos exercitationem harum optio voluptatum tempora molestias inventore dolorum eligendi officiis, minus facere esse? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum, reiciendis distinctio? Vel eos magni fugit fugiat dignissimos exercitationem harum optio voluptatum tempora molestias inventore dolorum eligendi officiis, minus facere esse? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum, reiciendis distinctio? Vel eos magni fugit fugiat dignissimos exercitationem harum optio voluptatum tempora molestias inventore dolorum eligendi officiis, minus facere esse? um eligendi officiis, minus facere esse um eligendi officiis, minus facere esse um eligendi officiis, minus facere esse ng elit. Laborum, reiciendis distinctio? Vel eos magni fugit fugiat dignissimos exercitationem harum optio voluptatum tempora molestias inventore dolorum eligendi officiis, minus facere esse? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum, reiciendis distinctio? Vel eos magni fugit fugiat dignissimos exercitationem harum optio voluptatum tempora molestias inventore dolorum eligendi officiis, minus facere esse? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum, reiciendis distinctio? Vel eos magni fugit fugiat dignissimos exercitationem harum optio voluptatum tempora molestias inventore dolorum eligendi officiis, minus facere esse? um eligendi officiis, minus facere esse um eligendi officiis, minus facere esse um eligendi officiis, minus facere esse' : 
              data?.[0].description}
            </Typography>

            <div className="flex justify-between items-center mt-auto pt-2 text-white">
              <div className="italic text-lg">Iris Cavana</div>
              <div className="flex items-center gap-4">
                <div className="text-[#ff6740]">NO.1</div>
                <img src={ArrowLeftIcon} alt="left" />
                <img src={ArrowRightIcon} alt="right" />
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

import { NavLink } from "react-router-dom";
import logo from "../../../assets/img/logo.png"
import HomeIcon from "../../../assets/svg/SideBar/home-11-stroke-rounded.svg"
import BookMarkIcon from "../../../assets/svg/SideBar/bookmark-01-stroke-rounded.svg"
import BookOpenIcon from "../../../assets/svg/SideBar/book-open-01-stroke-rounded.svg"
import CommunityIcon from "../../../assets/svg/SideBar/user-group-02-stroke-rounded.svg"
import PinIcon from "../../../assets/svg/SideBar/pin-stroke-rounded.svg"
import type { MenuItem } from "./type";



// interface SidebarProps {
//   onClose?: () => void;
// }

export const SideBar = () => {  
  const menuItems: MenuItem[] = [
    {
      icon: HomeIcon,
      label: "Trang chủ",
      path: "/",
      isHeader: true
    },
    {
      icon: BookMarkIcon,
      label: "Theo dõi",
      path: "/following",
      isHeader: true,
      subItems: [
        { label: "Cập nhập", path: "/following/updates" },
        { label: "Thư viện", path: "/following/library" },
        { label: "Lịch sử", path: "/following/history" }
      ]
    },
    {
      icon: BookOpenIcon,
      label: "Tiểu thuyết",
      path: "/novels",
      isHeader: true,
      subItems: [
        { label: "Tìm kiếm nâng cao", path: "/novels/advanced-search" },
        { label: "Phòng sáng tác", path: "/novels/writing-room" }
      ]
    },
    {
      icon: CommunityIcon,
      label: "Cộng đồng",
      path: "/community",
      isHeader: true,
      subItems: [
        { label: "Diễn đàn", path: "/community/forum" },
        { label: "Kết nối", path: "/community/connect" }
      ]
    },
    {
      icon: PinIcon,
      label: "InkWave",
      path: "/inkwave",
      isHeader: true,
      subItems: [
        { label: "Nội quy", path: "/inkwave/rules" },
        { label: "Về chúng tôi", path: "/inkwave/about" },
        { label: "Liên hệ", path: "/inkwave/contact" }
      ]
    }
  ];

  return (
    <div className="w-[250px] flex flex-col bg-amber-100 text-black dark:bg-[#151517] dark:text-white">
      <div className="p-5 flex items-center justify-between">
        <div className="max-h-[50px] w-[150px] overflow-hidden flex items-center justify-center">
            <img 
                src={logo}
                alt="InkWave Logo"
                className="h-full w-auto object-contain "
            />
        </div>
        <button className="focus:outline-none">
          <img src="/images/img_multiplicationsign.svg" alt="Close" className="w-6 h-6" />
        </button>
      </div>
      
      <div className="border-t border-[#3d3d3d] mt-2"></div>
      <div className="flex flex-col flex-1 py-4">
        {menuItems.map((item, index) => (
          <div key={index} className="mb-2">
            {item.isHeader && (
              <div className="block">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-1.5 mx-1.5 rounded-md ${isActive ? 'bg-[#ff6740]' : 'hover:bg-[#2c2c2c]'}`
                }
                  end
                >
                  {item.icon && <img src={item.icon} alt={item.label} className="w-[25px] h-[25px] mr-5" />}
                  <span className="text-lg font-bold">{item.label}</span>
                </NavLink>
              </div>
            )}
            
            {item.subItems && item.subItems.map((subItem, subIndex) => (
              <NavLink
                key={`${index}-${subIndex}`}
                to={subItem.path}
                className={({ isActive }) =>
                  `flex items-center px-5 py-2 ml-4 mt-1 mr-1.5 rounded-md ${
                    isActive ? 'bg-[#ff6740]' : 'hover:bg-[#2c2c2c]'
                  }`
                }
              >
                <span className="text-base font-semibold">{subItem.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

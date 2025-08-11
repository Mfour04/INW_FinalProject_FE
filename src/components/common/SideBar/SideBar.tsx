import { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../../../assets/img/logo.png";
import HomeIcon from "../../../assets/svg/SideBar/home-11-stroke-rounded.svg";
import BookMarkIcon from "../../../assets/svg/SideBar/bookmark-01-stroke-rounded.svg";
import BookOpenIcon from "../../../assets/svg/SideBar/book-open-01-stroke-rounded.svg";
import CommunityIcon from "../../../assets/svg/SideBar/user-group-02-stroke-rounded.svg";
import PinIcon from "../../../assets/svg/SideBar/pin-stroke-rounded.svg";
import MenuClose from "../../../assets/svg/SideBar/multiplication-sign-stroke-rounded.svg";
import WebsiteIcon from "../../../assets/img/icon_logo.png";
import { motion, AnimatePresence } from "framer-motion";

import type { MenuItem } from "./type";

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const SideBar = ({ isOpen, onClose }: SidebarProps) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const menuItems: MenuItem[] = [
    {
      icon: HomeIcon,
      label: "Trang chủ",
      path: "/",
      isHeader: true,
    },
    {
      icon: BookMarkIcon,
      label: "Theo dõi",
      path: "/following",
      isHeader: true,
      subItems: [
        // { label: "Cập nhật", path: "/following/updates" },
        { label: "Thư viện", path: "/following/library" },
        { label: "Lịch sử", path: "/following/history" },
      ],
    },
    {
      icon: BookOpenIcon,
      label: "Tiểu thuyết",
      path: "/novels",
      isHeader: true,
      subItems: [{ label: "Phòng sáng tác", path: "/novels/writing-room" }],
    },
    {
      icon: CommunityIcon,
      label: "Cộng đồng",
      path: "/community",
      isHeader: true,
      subItems: [
        { label: "Diễn đàn", path: "/blogs" },
        // { label: "Kết nối", path: "/community/connect" },
      ],
    },
    {
      icon: PinIcon,
      label: "InkWave",
      path: "/inkwave",
      isHeader: true,
      subItems: [
        { label: "Nội quy", path: "/inkwave/rules" },
        { label: "Về chúng tôi", path: "/inkwave/about" },
        { label: "Liên hệ", path: "/inkwave/contact" },
      ],
    },
  ];

  const toggleMenu = (path: string) => {
    setOpenMenu(openMenu === path ? null : path);
  };

  return (
    <motion.div
      animate={{
        width: isOpen ? 250 : window.innerWidth < 1024 ? 0 : 60,
        display: isOpen ? "flex" : window.innerWidth < 1024 ? "none" : "flex",
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`bg-white text-black dark:bg-[#151517] dark:text-white
        flex flex-col h-full
        fixed top-0 left-0 z-40 h-screen
        lg:static lg:h-full
        overflow-hidden`}
    >
      <div className="p-5 flex items-center justify-between">
        <AnimatePresence>
          {isOpen ? (
            <>
              <motion.div
                key="logo"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 150 }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="max-h-[50px] w-[150px] overflow-hidden flex items-center justify-center"
              >
                <img
                  src={logo}
                  alt="InkWave Logo"
                  className="h-full w-auto object-contain"
                />
              </motion.div>
              <motion.button
                key="close"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="cursor-pointer"
                onClick={onClose}
              >
                <img src={MenuClose} alt="Close" className="w-6 h-6" />
              </motion.button>
            </>
          ) : (
            <motion.button
              key="website-icon"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="cursor-pointer w-full flex justify-center"
              onClick={onClose}
            >
              <img src={WebsiteIcon} alt="Website Icon" className="w-6 h-6" />
            </motion.button>
          )}
        </AnimatePresence>
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
                    `flex items-center px-4 py-1.5 mx-1.5 rounded-md cursor-pointer ${
                      isActive ? "bg-[#ff6740]" : "hover:bg-[#2c2c2c]"
                    }`
                  }
                  onClick={() =>
                    item.subItems && isOpen && toggleMenu(item.path)
                  }
                  end
                >
                  {item.icon && (
                    <img
                      src={item.icon}
                      alt={item.label}
                      className="w-[25px] h-[25px] mr-5"
                    />
                  )}
                  <motion.span
                    animate={{
                      opacity: isOpen ? 1 : 0,
                      width: isOpen ? "auto" : 0,
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="text-lg font-bold"
                  >
                    {item.label}
                  </motion.span>
                </NavLink>
              </div>
            )}

            <AnimatePresence>
              {item.subItems && openMenu === item.path && isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  {item.subItems.map((subItem, subIndex) => (
                    <NavLink
                      key={`${index}-${subIndex}`}
                      to={subItem.path}
                      className={({ isActive }) =>
                        `flex items-center px-5 py-2 ml-4 mt-1 mr-1.5 rounded-md ${
                          isActive ? "bg-[#ff6740]" : "hover:bg-[#2c2c2c]"
                        }`
                      }
                    >
                      <span className="text-base font-semibold">
                        {subItem.label}
                      </span>
                    </NavLink>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

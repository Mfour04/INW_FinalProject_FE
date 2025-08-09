import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import logo from "../../../assets/img/logo.png";
import UsersIcon from "../../../assets/img/AdminSidebar/user-group-02-stroke-rounded.svg";
import NovelsIcon from "../../../assets/img/AdminSidebar/book-02-stroke-rounded.svg";
import ReportsIcon from "../../../assets/img/AdminSidebar/complaint-stroke-rounded.svg";
import WalletsIcon from "../../../assets/img/AdminSidebar/wallet-done-01-stroke-rounded.svg";
import MenuClose from "../../../assets/img/AdminSidebar/cancel-01-stroke-rounded.svg";
import HomeIcon from "../../../assets/img/AdminSidebar/home-01-stroke-rounded.svg";
import WebsiteIcon from "../../../assets/img/icon_logo.png";
import TransactionIcon from "../../../assets/img/AdminSidebar/transaction-stroke-rounded.svg";
import type { MenuItem } from "./type";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const AdminSidebar = ({ isOpen, onClose }: AdminSidebarProps) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const menuItems: MenuItem[] = [
    {
      icon: HomeIcon,
      label: "Trang chủ",
      path: "/admin",
      isHeader: true,
    },
    {
      icon: UsersIcon,
      label: "Người dùng",
      path: "/admin/users",
      isHeader: true,
    },
    {
      icon: NovelsIcon,
      label: "Tiểu thuyết",
      path: "/admin/novels",
      isHeader: true,
    },
    {
      icon: TransactionIcon,
      label: "Ngân sách",
      path: "/admin/transaction",
      isHeader: true,
    },
    {
      icon: ReportsIcon,
      label: "Báo cáo",
      path: "/admin/reports",
      isHeader: true,
    },
    {
      icon: WalletsIcon,
      label: "Yêu cầu",
      path: "/admin/wallets",
      isHeader: true,
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
      className={`bg-white text-black dark:bg-[#1a1a1c] dark:text-white
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
                  alt="InkWave Admin Logo"
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

      <div className="border-t border-[#3d3d3d] "></div>
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

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
import UsersIconBlack from "../../../assets/img/AdminSidebar/user-group-02-stroke-rounded-black.svg";
import NovelsIconBlack from "../../../assets/img/AdminSidebar/book-02-stroke-rounded-black.svg";
import HomeIconBlack from "../../../assets/img/AdminSidebar/home-01-stroke-rounded-black.svg";
import ReportsIconBlack from "../../../assets/img/AdminSidebar/complaint-stroke-rounded-black.svg";
import WalletsIconBlack from "../../../assets/img/AdminSidebar/wallet-done-01-stroke-rounded-black.svg";
import TransactionIconBlack from "../../../assets/img/AdminSidebar/transaction-stroke-rounded-black.svg";
import type { MenuItem } from "./type";
import { useDarkMode } from "../../../context/ThemeContext/ThemeContext";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const AdminSidebar = ({ isOpen, onClose }: AdminSidebarProps) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const { darkMode } = useDarkMode();

  const menuItems: MenuItem[] = [
    {
      icon: darkMode ? HomeIcon : HomeIconBlack,
      label: "Trang chủ",
      path: "/admin",
      isHeader: true,
    },
    {
      icon: darkMode ? UsersIcon : UsersIconBlack,
      label: "Người dùng",
      path: "/admin/users",
      isHeader: true,
    },
    {
      icon: darkMode ? NovelsIcon : NovelsIconBlack,
      label: "Tiểu thuyết",
      path: "/admin/novels",
      isHeader: true,
    },
    {
      icon: darkMode ? TransactionIcon : TransactionIconBlack,
      label: "Ngân sách",
      path: "/admin/transaction",
      isHeader: true,
    },
    {
      icon: darkMode ? ReportsIcon : ReportsIconBlack,
      label: "Báo cáo",
      path: "/admin/reports",
      isHeader: true,
    },
    {
      icon: darkMode ? WalletsIcon : WalletsIconBlack,
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
      className={`flex flex-col h-full fixed top-0 left-0 z-40 h-screen lg:static lg:h-full overflow-hidden
        ${darkMode ? "bg-[#1a1a1c] text-white" : "bg-white text-black"}`}
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

      <div
        className={`border-t ${
          darkMode ? "border-[#3d3d3d]" : "border-gray-200"
        }`}
      ></div>
      <div className="flex flex-col flex-1 py-4">
        {menuItems.map((item, index) => (
          <div key={index} className="mb-2">
            {item.isHeader && (
              <div className="block">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-1.5 mx-1.5 rounded-md cursor-pointer ${
                      isActive
                        ? darkMode
                          ? "bg-[#ff6740] text-white"
                          : "bg-[#ff6740] text-white"
                        : darkMode
                        ? "hover:bg-[#2c2c2c]"
                        : "hover:bg-gray-100"
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
                          isActive
                            ? darkMode
                              ? "bg-[#ff6740] text-white"
                              : "bg-[#ff6740] text-white"
                            : darkMode
                            ? "hover:bg-[#2c2c2c]"
                            : "hover:bg-gray-100"
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

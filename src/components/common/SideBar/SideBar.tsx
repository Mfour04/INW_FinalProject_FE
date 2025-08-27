import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import logo from "../../../assets/img/icon_logo.png";
import { Home, Bookmark, BookOpen, Users, MapPin, X } from "lucide-react";

import type { MenuItem } from "./type";

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const SideBar = ({ isOpen, onClose }: SidebarProps) => {
  const { pathname } = useLocation();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const renderIcon = (label: string) => {
    const cls = "w-5 h-5 shrink-0";
    switch (label) {
      case "Trang chủ":
        return <Home className={cls} />;
      case "Theo dõi":
        return <Bookmark className={cls} />;
      case "Tiểu thuyết":
        return <BookOpen className={cls} />;
      case "Cộng đồng":
        return <Users className={cls} />;
      case "InkWave":
        return <MapPin className={cls} />;
      default:
        return <MapPin className={cls} />;
    }
  };

  const menuItems: MenuItem[] = [
    { label: "Trang chủ", path: "/", isHeader: true },
    {
      label: "Theo dõi",
      path: "/following",
      isHeader: true,
      subItems: [
        { label: "Thư viện", path: "/following/library" },
        { label: "Lịch sử", path: "/following/history" },
      ],
    },
    {
      label: "Tiểu thuyết",
      path: "/",
      isHeader: true,
      subItems: [
        { label: "Khám phá", path: "/novels" },
        { label: "Phòng sáng tác", path: "/novels/writing-room" },
        { label: "Thống kê", path: "/novels/analytics" },
      ],
    },
    {
      label: "Cộng đồng",
      path: "/community",
      isHeader: true,
      subItems: [{ label: "Diễn đàn", path: "/blogs" }],
    },
    {
      label: "InkWave",
      path: "/inkwave",
      isHeader: true,
      subItems: [
        { label: "Giới thiệu", path: "/about" },
        { label: "Liên hệ", path: "/contact" },
        { label: "Nội quy", path: "/rules" },
        { label: "Điều khoản", path: "/terms" },
      ],
    },
  ];

  useEffect(() => {
    const parent = menuItems.find((m) =>
      m.subItems?.some((s) => pathname.startsWith(s.path))
    );
    setOpenMenu(parent ? parent.path : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const isMobile =
    typeof window !== "undefined" ? window.innerWidth < 1024 : false;
  const expandedW = 220;
  const collapsedW = 56;

  const itemVariants = {
    hidden: { opacity: 0, x: -6 },
    show: { opacity: 1, x: 0, transition: { duration: 0.16 } },
    exit: { opacity: 0, x: -6, transition: { duration: 0.12 } },
  };

  const caret = (open: boolean) => (
    <motion.svg
      initial={false}
      animate={{ rotate: open ? 90 : 0 }}
      transition={{ duration: 0.2 }}
      width="12"
      height="12"
      viewBox="0 0 24 24"
      className="opacity-70"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6" />
    </motion.svg>
  );

  return (
    <motion.aside
      animate={{
        width: isOpen ? expandedW : isMobile ? 0 : collapsedW,
        display: isOpen ? "flex" : isMobile ? "none" : "flex",
      }}
      transition={{ duration: 0.26, ease: "easeInOut" }}
      className="bg-white text-zinc-900 dark:bg-[#0a0f16] dark:text-zinc-50 fixed top-0 left-0 z-40 h-screen lg:static lg:h-full flex flex-col overflow-hidden border-r border-zinc-200 dark:border-white/10"
    >
      {/* Header */}
      <div className="p-3 flex items-center justify-between">
        <AnimatePresence initial={false} mode="wait">
          {isOpen ? (
            <>
              <motion.div
                key="logo"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 140 }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.22 }}
                className="min-h-[40px] w-full overflow-hidden flex items-center"
              >
               <img
                src={logo}
                alt="InkWave"
                className="h-[30px] w-[90px] object-fit"
              />
              </motion.div>
              <motion.button
                key="close"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                onClick={onClose}
                className="h-8 w-8 grid place-items-center rounded-md hover:bg-[#ff6740]/10 dark:hover:bg-[#ff6740]/20 transition"
                aria-label="Đóng sidebar"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="border-t border-zinc-200 dark:border-white/10" />

      {/* Nav */}
      <nav className="flex-1 py-3 space-y-1">
        {menuItems.map((item, idx) => {
          const hasSubs = !!item.subItems?.length;
          const open = openMenu === item.path && isOpen;
          const hasActiveChild = hasSubs
            ? item.subItems!.some((s) => pathname.startsWith(s.path))
            : false;

          return (
            <div key={idx} className="px-1.5">
              <div className="group relative">
                <NavLink
                  to={item.path}
                  end
                  className={({ isActive }) => {
                    const base =
                      "relative flex items-center gap-3 px-3 rounded-md h-10 outline-none transition-colors";
                    if (hasSubs) {
                      const baseGroup = `${base} focus:ring-0`;
                      if (isActive)
                        return [
                          baseGroup,
                          "bg-gradient-to-r from-[#ff512f]/20 via-[#ff6740]/20 to-[#ff9966]/20",
                          "text-[#ff6740] dark:text-[#ff9966]",
                          "border border-[#ff6740]/40",
                        ].join(" ");
                      return [
                        baseGroup,
                        "hover:bg-[#ff6740]/10 dark:hover:bg-[#ff6740]/20",
                        "text-zinc-700 dark:text-zinc-200",
                      ].join(" ");
                    } else {
                      const baseLeaf = `${base} focus-visible:ring-2 focus-visible:ring-[#ff6740]/45`;
                      return isActive
                        ? [
                            baseLeaf,
                            "bg-gradient-to-r from-[#ff512f]/20 via-[#ff6740]/20 to-[#ff9966]/20",
                            "text-[#ff6740] dark:text-[#ff9966]",
                            "border border-[#ff6740]/40",
                          ].join(" ")
                        : [
                            baseLeaf,
                            "hover:bg-[#ff6740]/10 dark:hover:bg-[#ff6740]/20",
                            "text-zinc-700 dark:text-zinc-200",
                          ].join(" ");
                    }
                  }}
                  onMouseDown={(e) => {
                    if (item.subItems?.length) e.preventDefault();
                  }}
                  onClick={(e) => {
                    if (item.subItems?.length) {
                      e.preventDefault();
                      const isOpenGroup = openMenu === item.path && isOpen;
                      if (!isOpen) {
                        onClose?.();
                        setTimeout(
                          () => setOpenMenu(isOpenGroup ? null : item.path),
                          0
                        );
                      } else {
                        setOpenMenu(isOpenGroup ? null : item.path);
                      }
                    }
                  }}
                >
                  {/* Rail gradient khi hover */}
                  {!(hasSubs
                    ? pathname === item.path || hasActiveChild
                    : pathname === item.path) && (
                    <span className="absolute left-0 inset-y-0 w-[3px] rounded-r-full bg-gradient-to-b from-[#ff512f] via-[#ff6740] to-[#ff9966] opacity-0 group-hover:opacity-70 transition" />
                  )}

                  {renderIcon(item.label)}

                  <AnimatePresence initial={false} mode="wait">
                    {isOpen ? (
                      <motion.span
                        variants={itemVariants}
                        initial="hidden"
                        animate="show"
                        exit="exit"
                        className="text-[14px] leading-none font-semibold tracking-wide select-none"
                      >
                        {item.label}
                      </motion.span>
                    ) : null}
                  </AnimatePresence>

                  {hasSubs && isOpen && (
                    <div className="ml-auto h-5 w-5 grid place-items-center rounded-md">
                      {caret(open)}
                    </div>
                  )}
                </NavLink>

                {!isOpen && (
                  <div className="pointer-events-none absolute left-[56px] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition">
                    <div className="px-2 py-1 rounded-md text-xs bg-zinc-900 text-white shadow-lg border border-zinc-800 whitespace-nowrap">
                      {item.label}
                    </div>
                  </div>
                )}
              </div>

              {/* Sub items */}
              <AnimatePresence initial={false}>
                {hasSubs && open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: "easeInOut" }}
                    className="mt-1 pl-[30px] space-y-1"
                  >
                    {item.subItems!.map((sub, sIdx) => (
                      <NavLink
                        key={`${idx}-${sIdx}`}
                        end
                        to={sub.path}
                        className={({ isActive }) =>
                          [
                            "relative flex items-center gap-2 px-3 rounded-md text-[13px] h-9 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6740]/40",
                            isActive
                              ? "bg-gradient-to-r from-[#ff512f]/15 via-[#ff6740]/15 to-[#ff9966]/15 text-[#ff6740] dark:text-[#ff9966] border border-[#ff6740]/40"
                              : "hover:bg-[#ff6740]/10 dark:hover:bg-[#ff6740]/20 text-zinc-700 dark:text-zinc-300",
                          ].join(" ")
                        }
                      >
                        <span className="leading-none before:mr-2 before:text-zinc-400 dark:before:text-zinc-500">
                          {sub.label}
                        </span>
                      </NavLink>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 mt-auto">
        {isOpen ? (
          <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
            © {new Date().getFullYear()} InkWave
          </div>
        ) : (
          <div className="h-2" />
        )}
      </div>
    </motion.aside>
  );
};

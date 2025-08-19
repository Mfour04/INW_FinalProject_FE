import React, { useState } from "react";
import Menu from "@mui/material/Menu";
import Grow from "@mui/material/Grow";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import Flag02Icon from "../../../assets/svg/CommentUser/flag-02-stroke-rounded.svg";
import BlockIcon from "../../../assets/svg/CommentUser/block.svg";
import MoreDots from "../../../assets/svg/CommentUser/more_horiz.svg";

export const MoreButton = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  return (
    <div className="flex-shrink-0">
      <button
        onClick={(e) => setAnchorEl(e.currentTarget)}
        aria-label="Mở menu tác vụ"
        className={[
          "inline-flex items-center justify-center",
          "h-6 w-6 rounded-[5px]",
          "border border-white/20 bg-white/[0.12]",
          "hover:bg-white/[0.18] hover:border-white/30",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
          "active:scale-95 transition-all shadow-sm",
          open ? "bg-white/[0.18] border-white/30" : "",
        ].join(" ")}
      >
        <img src={MoreDots} className="h-3.5 w-3.5 opacity-95 pointer-events-none" />
      </button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        TransitionComponent={Grow}
        PaperProps={{
          sx: {
            mt: 1.25, 
            bgcolor: "transparent",
            background: "rgba(18,20,26,0.96)",
            color: "#fff",
            borderRadius: 6,
            minWidth: 168,
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.55)",
            backdropFilter: "blur(8px)",
            overflow: "hidden",
            p: 0.5,
          },
        }}
        MenuListProps={{ disablePadding: true, sx: { p: 0, m: 0 } }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 0.5,
          }}
        >
          <Box
            component="button"
            type="button"
            onClick={() => {
              setAnchorEl(null);
              alert("Báo cáo người dùng");
            }}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.75,
              px: 0.75,
              py: 0.5,
              height: 28,
              borderRadius: 5,
              border: "1px solid transparent",
              backgroundColor: "transparent",
              color: "#fff",
              cursor: "pointer",
              transition: "all .15s ease",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.10)" },
              "&:active": { transform: "scale(0.98)" },
              "&:focus-visible": {
                outline: "none",
                borderColor: "rgba(255,255,255,0.25)",
              },
            }}
          >
            <img src={Flag02Icon} className="h-[14px] w-[14px]" />
            <Typography sx={{ fontSize: 12, color: "#fff", lineHeight: 1, whiteSpace: "nowrap" }}>
              Báo cáo
            </Typography>
          </Box>

          <Box
            component="button"
            type="button"
            onClick={() => {
              setAnchorEl(null);
              alert("Đã chặn người dùng");
            }}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.75,
              px: 0.75,
              py: 0.5,
              height: 28,
              borderRadius: 5,
              border: "1px solid transparent",
              backgroundColor: "transparent",
              color: "#fff",
              cursor: "pointer",
              transition: "all .15s ease",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.10)" },
              "&:active": { transform: "scale(0.98)" },
              "&:focus-visible": {
                outline: "none",
                borderColor: "rgba(255,255,255,0.25)",
              },
            }}
          >
            <img src={BlockIcon} className="h-[14px] w-[14px]" />
            <Typography sx={{ fontSize: 12, color: "#fff", lineHeight: 1, whiteSpace: "nowrap" }}>
              Chặn
            </Typography>
          </Box>
        </Box>
      </Menu>
    </div>
  );
};

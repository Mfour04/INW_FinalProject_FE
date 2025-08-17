import React, { useState } from "react";
import Menu from "@mui/material/Menu";
import Grow from "@mui/material/Grow";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import EditRounded from "@mui/icons-material/EditRounded";
import MoreDots from "../../../../assets/svg/CommentUser/more_horiz.svg";
import DeleteSvg from "../../../../assets/svg/CommentUser/delete.svg";

interface MoreUserProps {
  commentId: string;
  onEdit: () => void;
  onDelete: (id: string) => void;
}

export const MoreUser = ({ commentId, onEdit, onDelete }: MoreUserProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <div className="flex-shrink-0">
      <button
        onClick={(e) => setAnchorEl(e.currentTarget)}
        aria-label="Mở menu quản lý bình luận"
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
        <img
          src={MoreDots}
          className="h-3.5 w-3.5 opacity-95 pointer-events-none"
        />
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
              onEdit();
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
            <EditRounded fontSize="small" sx={{ color: "#fff" }} />
            <Typography
              sx={{
                fontSize: 12,
                color: "#fff",
                lineHeight: 1,
                whiteSpace: "nowrap",
              }}
            >
              Chỉnh sửa
            </Typography>
          </Box>

          <Box
            component="button"
            type="button"
            onClick={() => {
              setAnchorEl(null);
              setOpenDialog(true);
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
            <img src={DeleteSvg} className="h-[14px] w-[14px]" />
            <Typography
              sx={{
                fontSize: 12,
                color: "#fff",
                lineHeight: 1,
                whiteSpace: "nowrap",
              }}
            >
              Xoá
            </Typography>
          </Box>
        </Box>
      </Menu>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        TransitionComponent={Grow}
        PaperProps={{
          sx: {
            bgcolor: "transparent",
            background: "rgba(18,20,26,0.97)",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.10)",
            boxShadow: "0 12px 36px rgba(0,0,0,0.55)",
            backdropFilter: "blur(8px)",
          },
        }}
      >
        <DialogTitle sx={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>
          Xác nhận xoá
        </DialogTitle>
        <DialogContent
          sx={{ color: "rgba(255,255,255,0.9)", pt: 1.5, fontSize: 14 }}
        >
          Hành động này không thể hoàn tác. Bạn có chắc muốn xoá bình luận này?
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2, gap: 0.75 }}>
          <Button
            onClick={() => setOpenDialog(false)}
            sx={{
              textTransform: "none",
              px: 2,
              py: 0.9,
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.12)",
              backgroundColor: "rgba(255,255,255,0.06)",
              color: "#fff",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={() => {
              setOpenDialog(false);
              onDelete(commentId);
            }}
            sx={{
              textTransform: "none",
              px: 2,
              py: 0.9,
              borderRadius: 999,
              border: "1px solid rgba(255,120,120,0.45)",
              backgroundColor: "rgba(220,70,70,0.20)",
              color: "#fff",
              "&:hover": {
                backgroundColor: "rgba(220,70,70,0.30)",
                border: "1px solid rgba(255,120,120,0.6)",
              },
            }}
          >
            Xoá
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

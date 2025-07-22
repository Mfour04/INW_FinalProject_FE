import { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import more_horiz from "../../assets/svg/CommentUser/more_horiz.svg";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "../../assets/svg/CommentUser/delete.svg";

interface MoreUserProps {
    commentId: string;
    onEdit: () => void;
    onDelete: (id: string) => void;
}

export const MoreUser: React.FC<MoreUserProps> = ({ commentId, onEdit, onDelete }) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const openMenu = Boolean(anchorEl);

    const [openDialog, setOpenDialog] = useState(false);

    const handleMenuOpen = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleOpenDialog = () => {
        handleMenuClose();
        setOpenDialog(true);
    };

    const handleConfirmDelete = () => {
        onDelete(commentId);
        setOpenDialog(false);
    };

    return (
        <div className="mr-10">
            <div
                onClick={handleMenuOpen}
                className="cursor-pointer z-50 relative px-2 py-3 hover:bg-gray-700 rounded"
            >
                <img src={more_horiz} className="w-6 h-6" />
            </div>

            <Menu
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                slotProps={{
                    paper: {
                        sx: {
                            bgcolor: "#1f1f1f",
                            color: "#fff",
                            borderRadius: 2,
                            minWidth: 200,
                            boxShadow: 4,
                        },
                    },
                }}
            >
                <MenuItem
                    onClick={() => {
                        handleMenuClose();
                        onEdit();
                    }}
                    sx={{ fontSize: 14, display: "flex", alignItems: "center", gap: 1, "&:hover": { bgcolor: "#333" } }}
                >
                    <EditIcon className="w-6 h-6" />
                    Chỉnh sửa
                </MenuItem>

                <MenuItem
                    onClick={handleOpenDialog}
                    sx={{ fontSize: 14, display: "flex", alignItems: "center", gap: 1, "&:hover": { bgcolor: "#333" } }}
                >
                    <img src={DeleteIcon} className="w-6 h-6" />
                    Xóa
                </MenuItem>
            </Menu>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogContent>Bạn có chắc muốn xóa bình luận này?</DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error">
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

import { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import block from "../../assets/svg/CommentUser/block.svg";
import more_horiz from "../../assets/svg/CommentUser/more_horiz.svg";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from "../../assets/svg/CommentUser/delete.svg";

export const MoreUser = () => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const open = Boolean(anchorEl);

    const handleMenuOpen = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
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
                open={open}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}

                slotProps={{
                    paper: {
                        sx: {
                            bgcolor: '#1f1f1f',
                            color: '#fff',
                            borderRadius: 2,
                            minWidth: 200,
                            boxShadow: 4,
                        },
                    },
                }}
            >
                <MenuItem
                    onClick={() => alert('Báo cáo người dùng')}
                    sx={{ fontSize: 14, display: 'flex', alignItems: 'center', gap: 1, '&:hover': { bgcolor: '#333' } }}
                >
                    <EditIcon className="w-6 h-6" />
                    Chỉnh sửa
                </MenuItem>

                <MenuItem
                    onClick={() => alert('Đã chặn người dùng')}
                    sx={{ fontSize: 14, display: 'flex', alignItems: 'center', gap: 1, '&:hover': { bgcolor: '#333' } }}
                >
                    <img src={DeleteIcon} className="w-6 h-6" />
                    Xóa
                </MenuItem>
            </Menu>
        </div>
    );
};
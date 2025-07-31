import React, { useState } from "react";
import Typography from "../../components/TypographyComponent";
import Button from "../../components/ButtonComponent";
import { useAuth } from "../../hooks/useAuth";

type SettingTab = "display" | "interface" | "privacy" | "password";

export const Setting = () => {
    const [activeTab, setActiveTab] = useState<SettingTab>("display");
    const [displayName, setDisplayName] = useState("finn712");
    const [username, setUsername] = useState("iamfinn7");
    const [bio, setBio] = useState("");
    const [language, setLanguage] = useState("Tiếng Việt");
    const [theme, setTheme] = useState<"light" | "dark">("dark");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const { auth } = useAuth();

    const handlePasswordChange = () => {
        if (newPassword !== confirmPassword) {
            setPasswordError("Mật khẩu không khớp");
            return;
        }
        setPasswordError("");
        // TODO: Implement password change logic
        console.log("Changing password...");
    };

    const handleSaveDisplayInfo = () => {
        // TODO: Implement save display info logic
        console.log("Saving display info...");
    };

    const handleSaveInterfaceSettings = () => {
        // TODO: Implement save interface settings logic
        console.log("Saving interface settings...");
    };

    const renderDisplayInfo = () => (
        <div className="space-y-4 sm:space-y-6">
            {/* Profile Section */}
            <div className="relative">
                <div className="h-32 sm:h-48 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg relative">
                    <div className="absolute -bottom-8 sm:-bottom-12 left-4 sm:left-6">
                        <img
                            src={auth?.user?.avatarUrl || "/images/default-avatar.png"}
                            alt="Profile"
                            className="w-16 h-16 sm:w-24 sm:h-24 rounded-full border-4 border-white"
                        />
                    </div>
                </div>
                <div className="mt-12 sm:mt-16 ml-4 sm:ml-6">
                    <h2 className="text-lg sm:text-2xl font-bold text-white">{displayName}</h2>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-gray-400 text-sm sm:text-base">
                        <span>{username}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>Tham gia từ Tháng 5/2025</span>
                    </div>
                </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 sm:space-y-6">
                <div>
                    <label className="block text-sm font-medium text-white mb-2">
                        Tên hiển thị
                    </label>
                    <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#ff4500] text-sm sm:text-base"
                        placeholder="Nhập tên hiển thị"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-white mb-2">
                        Tên người dùng
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#ff4500] pr-12 text-sm sm:text-base"
                            placeholder="Nhập tên người dùng"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                            </div>
                        </div>
                    </div>
                    <p className="text-red-500 text-xs sm:text-sm mt-1">
                        Lưu ý: Tên người dùng chỉ có thể thay đổi mỗi 30 ngày
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-white mb-2">
                        Tiểu sử
                    </label>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#ff4500] resize-none text-sm sm:text-base"
                        rows={4}
                        placeholder="Viết tiểu sử của bạn..."
                        maxLength={200}
                    />
                    <div className="flex justify-end mt-2">
                        <span className="text-gray-400 text-xs sm:text-sm">
                            {bio.length}/200
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-white mb-2">
                            Ảnh đại diện
                        </label>
                        <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 sm:p-6 text-center hover:border-[#ff4500] transition-colors cursor-pointer h-32 sm:h-40">
                            <div className="text-2xl sm:text-4xl text-gray-400 mb-2">+</div>
                            <p className="text-gray-400 text-sm sm:text-base">Thêm tệp</p>
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-white mb-2">
                            Ảnh bìa
                        </label>
                        <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 sm:p-6 text-center hover:border-[#ff4500] transition-colors cursor-pointer h-32 sm:h-40">
                            <div className="text-2xl sm:text-4xl text-gray-400 mb-2">+</div>
                            <p className="text-gray-400 text-sm sm:text-base">Thêm tệp</p>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-white mb-2">
                        Huy hiệu
                    </label>
                    <p className="text-gray-400 text-xs sm:text-sm mb-4">
                        Chọn tối đa 3 huy hiệu để hiển thị cạnh tên của bạn. Kéo để sắp xếp lại thứ tự.
                    </p>
                    <button className="bg-gray-800 text-white px-3 sm:px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm sm:text-base">
                        <span className="text-lg sm:text-xl">+</span>
                        Thêm
                    </button>
                </div>
            </div>
            <div className="flex justify-end">
                <Button
                    onClick={handleSaveDisplayInfo}
                    className="bg-[#ff4500] hover:bg-[#e03d00] text-white px-4 sm:px-6 py-2 rounded-lg transition-colors text-sm sm:text-base"
                >
                    Lưu thông tin
                </Button>
            </div>
        </div>
    );

    const renderInterfaceSettings = () => (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-white mb-4">
                    Chọn màu giao diện
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-3">
                        <div className={`bg-white rounded-lg p-4 border-2 ${theme === "light" ? "border-[#ff4500]" : "border-gray-300"}`}>
                            <div className="space-y-2">
                                <div className="h-2 bg-gray-300 rounded"></div>
                                <div className="h-2 bg-gray-300 rounded w-3/4"></div>
                                <div className="h-2 bg-gray-300 rounded w-1/2"></div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="theme"
                                value="light"
                                checked={theme === "light"}
                                onChange={(e) => setTheme(e.target.value as "light" | "dark")}
                                className="text-orange-500 focus:ring-orange-500"
                            />
                            <span className={`${theme === "light" ? "text-[#ff4500]" : "text-white"}`}>Sáng</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className={`bg-gray-800 rounded-lg p-4 border-2 ${theme === "dark" ? "border-[#ff4500]" : "border-gray-600"}`}>
                            <div className="space-y-2">
                                <div className="h-2 bg-gray-600 rounded"></div>
                                <div className="h-2 bg-gray-600 rounded w-3/4"></div>
                                <div className="h-2 bg-gray-600 rounded w-1/2"></div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="theme"
                                value="dark"
                                checked={theme === "dark"}
                                onChange={(e) => setTheme(e.target.value as "light" | "dark")}
                                className="text-orange-500 focus:ring-orange-500"
                            />
                            <span className={`${theme === "dark" ? "text-[#ff4500]" : "text-white"}`}>Tối</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <Button
                    onClick={handleSaveInterfaceSettings}
                    className="bg-[#ff4500] hover:bg-[#e03d00] text-white px-4 sm:px-6 py-2 rounded-lg transition-colors text-sm sm:text-base"
                >
                    Lưu cài đặt
                </Button>
            </div>
        </div>
    );

    const renderPrivacySettings = () => (
        <div className="space-y-4 sm:space-y-6">
            <div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Danh sách chặn</h3>
                <p className="text-red-500 text-xs sm:text-sm mb-4">Bỏ chặn người dùng đã chọn</p>

                <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-3">
                        <input type="checkbox" className="text-orange-500 focus:ring-orange-500" />
                        <span className="text-white text-sm sm:text-base">Chọn tất cả</span>
                    </div>

                    {/* Blocked Users List */}
                    <div className="space-y-3">
                        {[
                            { name: "Nguyen Dinh", username: "@dinhvanbaonguyen", avatar: "/images/avatar1.png" },
                            { name: "Tài?", username: "@minhtai", avatar: "/images/avatar2.png" },
                            { name: "Nguyen Dinh", username: "@dinhvanbaonguyen", avatar: "/images/avatar3.png" }
                        ].map((user, index) => (
                            <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-800 rounded-lg gap-3">
                                <div className="flex items-center gap-3">
                                    <input type="checkbox" className="text-orange-500 focus:ring-orange-500" />
                                    <img src={user.avatar} alt={user.name} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full" />
                                    <div>
                                        <p className="text-white font-medium text-sm sm:text-base">{user.name}</p>
                                        <p className="text-gray-400 text-xs sm:text-sm">{user.username}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="text-gray-400 hover:text-white px-2 sm:px-3 py-1 rounded border border-gray-600 hover:border-gray-500 transition-colors text-xs sm:text-sm">
                                        Bỏ chặn
                                    </button>
                                    <button className="text-gray-400 hover:text-white">
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderPasswordSettings = () => (
        <div className="space-y-4 sm:space-y-6">
            <div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Đổi mật khẩu</h3>
                <p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6">
                    Mật khẩu của bạn phải có độ dài từ 8 đến 25 ký tự
                </p>
            </div>

            <div className="space-y-3 sm:space-y-4">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            Mật khẩu hiện tại
                        </label>
                        <div className="relative w-3/4">
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#ff4500] pr-10 text-sm sm:text-base"
                                placeholder="Nhập mật khẩu hiện tại"
                            />
                            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            Mật khẩu mới
                        </label>
                        <div className="relative w-3/4">
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#ff4500] pr-10 text-sm sm:text-base"
                                placeholder="Nhập mật khẩu mới"
                            />
                            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            Nhập lại mật khẩu mới
                        </label>
                        <div className="relative w-3/4">
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#ff4500] pr-10 text-sm sm:text-base"
                                placeholder="Nhập lại mật khẩu mới"
                            />
                            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </button>
                        </div>
                        {passwordError && (
                            <p className="text-red-500 text-xs sm:text-sm mt-1 ml-1">* {passwordError}</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <Button
                    onClick={handlePasswordChange}
                    className="bg-[#ff4500] hover:bg-[#e03d00] text-white px-4 sm:px-6 py-2 rounded-lg transition-colors text-sm sm:text-base"
                >
                    Đổi mật khẩu
                </Button>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case "display":
                return renderDisplayInfo();
            case "interface":
                return renderInterfaceSettings();
            case "privacy":
                return renderPrivacySettings();
            case "password":
                return renderPasswordSettings();
            default:
                return renderDisplayInfo();
        }
    };

    return (
        <div className="min-h-screen bg-[#0f0f11] text-white">
            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-4 lg:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-8">
                    {/* Left Sidebar */}
                    <div className="lg:col-span-1">
                        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-4 lg:mb-8">Cài đặt tài khoản</h1>

                        <div className="space-y-2 sm:space-y-4 lg:space-y-6">
                            <div>
                                <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-white mb-1 sm:mb-2 lg:mb-3">Chung</h3>
                                <div className="space-y-1 sm:space-y-2">
                                    <button
                                        onClick={() => setActiveTab("display")}
                                        className={`w-full text-left px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm lg:text-base ${activeTab === "display"
                                            ? "bg-[#ff4500] text-white"
                                            : "text-gray-300 hover:text-white hover:bg-gray-800"
                                            }`}
                                    >
                                        Thông tin hiển thị
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("interface")}
                                        className={`w-full text-left px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm lg:text-base ${activeTab === "interface"
                                            ? "bg-[#ff4500] text-white"
                                            : "text-gray-300 hover:text-white hover:bg-gray-800"
                                            }`}
                                    >
                                        Tùy chỉnh giao diện
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("privacy")}
                                        className={`w-full text-left px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm lg:text-base ${activeTab === "privacy"
                                            ? "bg-[#ff4500] text-white"
                                            : "text-gray-300 hover:text-white hover:bg-gray-800"
                                            }`}
                                    >
                                        Quyền riêng tư
                                    </button>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-white mb-1 sm:mb-2 lg:mb-3">Tài khoản</h3>
                                <div className="space-y-1 sm:space-y-2">
                                    <button
                                        onClick={() => setActiveTab("password")}
                                        className={`w-full text-left px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm lg:text-base ${activeTab === "password"
                                            ? "bg-[#ff4500] text-white"
                                            : "text-gray-300 hover:text-white hover:bg-gray-800"
                                            }`}
                                    >
                                        Mật khẩu
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <div className="bg-[#1c1c1f] rounded-lg p-2 sm:p-4 lg:p-6 xl:p-8">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

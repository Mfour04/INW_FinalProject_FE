import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Button from "../../components/ButtonComponent";
import { useAuth } from "../../hooks/useAuth";
import { useGetCurrentUserInfo, useUpdateUserProfile, useChangePassword } from "./useUserSettings";
import { useToast } from "../../context/ToastContext/toast-context";
import { useNavigate } from "react-router-dom";
import { blogFormatVietnamTimeFromTicks } from "../../utils/date_format";
import httpClient from "../../utils/http";
import type { ApiResponse } from "../../api/User/user-settings.type";
import type { LoginParams, LoginResponse } from "../../api/Auth/auth.type";
import TextFieldComponent from "../../components/TextFieldComponent";
import { useQueryClient } from "@tanstack/react-query";

type SettingTab = "display" | "interface" | "privacy" | "password";

export const Setting = () => {
    const [activeTab, setActiveTab] = useState<SettingTab>("display");
    const [displayName, setDisplayName] = useState("");
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [theme, setTheme] = useState<"light" | "dark">("dark");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
    const [selectedCover, setSelectedCover] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string>("");
    const [coverPreview, setCoverPreview] = useState<string>("");

    const [hasChanges, setHasChanges] = useState(false);
    const [originalData, setOriginalData] = useState({
        displayName: "",
        bio: "",
        avatarUrl: "",
        coverUrl: ""
    });

    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [errors, setErrors] = useState<{
        displayName?: string;
        bio?: string;
    }>({});

    const validateForm = () => {
        const newErrors: { displayName?: string; bio?: string } = {};

        if (!displayName || displayName.trim().length === 0) {
            newErrors.displayName = "Tên hiển thị không được để trống";
        } else if (displayName.trim().length < 2) {
            newErrors.displayName = "Tên hiển thị phải có ít nhất 2 ký tự";
        } else if (displayName.trim().length > 100) {
            newErrors.displayName = "Tên hiển thị không được quá 100 ký tự";
        }

        if (!bio || bio.trim().length === 0) {
            newErrors.bio = "Tiểu sử không được để trống";
        } else if (bio.trim().length > 500) {
            newErrors.bio = "Tiểu sử không được quá 500 ký tự";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const { auth, setAuth } = useAuth();
    const { data: userInfo, isLoading: isLoadingUser, refetch: refetchUserInfo } = useGetCurrentUserInfo();
    const updateProfileMutation = useUpdateUserProfile();
    const changePasswordMutation = useChangePassword();
    const queryClient = useQueryClient();

    useEffect(() => {
        queryClient.removeQueries({ queryKey: ["current-user-info"] });

        setTimeout(() => {
            refetchUserInfo();
        }, 100);
    }, [refetchUserInfo, queryClient]);

    useEffect(() => {
        let hasData = false;
        if (userInfo?.data?.Data || userInfo?.data?.data || userInfo?.data) {
            hasData = true;
        }

        if (!hasData) {
            try {
                const backupData = localStorage.getItem('userProfileBackup');
                if (backupData) {
                    const parsed = JSON.parse(backupData);

                    setDisplayName(parsed.displayName || "");
                    setBio(parsed.bio || "");
                    setOriginalData({
                        displayName: parsed.displayName || "",
                        bio: parsed.bio || "",
                        avatarUrl: parsed.avatarUrl || "",
                        coverUrl: parsed.coverUrl || ""
                    });
                } else {
                }
            } catch (error) {
            }
        }
    }, [userInfo?.data?.Data]);

    const [isCurrentPasswordValid, setIsCurrentPasswordValid] = useState<boolean | null>(null);
    const [isNewPasswordValid, setIsNewPasswordValid] = useState<boolean | null>(null);
    const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState<boolean | null>(null);

    const toast = useToast();
    const navigate = useNavigate();

    const avatarInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    const validatePassword = (password: string): boolean => {
        const hasMinLength = password.length >= 8;
        const hasMaxLength = password.length <= 32;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        return hasMinLength && hasMaxLength && hasUpperCase && hasNumber && hasSpecialChar;
    };

    const checkCurrentPassword = useCallback(async (password: string) => {
        if (!password || !auth?.user?.userId) {
            setIsCurrentPasswordValid(null);
            return;
        }
        try {
            const tempPassword = "Temp@123456789";
            const response = await httpClient.privateHttp.post<ApiResponse>("users/change-password", {
                UserId: auth.user.userId,
                OldPassword: password,
                NewPassword: tempPassword,
                ConfirmPassword: tempPassword
            });

            try {
                await httpClient.privateHttp.post<ApiResponse>("users/change-password", {
                    UserId: auth.user.userId,
                    OldPassword: tempPassword,
                    NewPassword: password,
                    ConfirmPassword: password
                })
                setIsCurrentPasswordValid(true);
            } catch (error) {
                setIsCurrentPasswordValid(true);
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "";
            if (errorMessage.includes("Mật khẩu cũ không đúng")) {
                setIsCurrentPasswordValid(false);
            }
        }
    }, [auth?.user?.userId]);

    const validateNewPassword = useCallback((password: string) => {
        if (!password) {
            setIsNewPasswordValid(null);
            return;
        }
        setIsNewPasswordValid(validatePassword(password));
    }, []);

    const validateConfirmPassword = useCallback((confirmPass: string, newPass: string) => {
        if (!confirmPass || !newPass) {
            setIsConfirmPasswordValid(null);
            return;
        }
        setIsConfirmPasswordValid(confirmPass === newPass);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (currentPassword) {
                checkCurrentPassword(currentPassword);
            } else {
                setIsCurrentPasswordValid(null);
            }
        }, 1000);
        return () => clearTimeout(timer);
    }, [currentPassword, checkCurrentPassword]);

    useEffect(() => {
        validateNewPassword(newPassword);
    }, [newPassword, validateNewPassword]);

    useEffect(() => {
        validateConfirmPassword(confirmPassword, newPassword);
    }, [confirmPassword, newPassword, validateConfirmPassword]);

    const isPasswordChangeEnabled = useMemo(() => {
        return isCurrentPasswordValid === true &&
            isNewPasswordValid === true &&
            isConfirmPasswordValid === true;
    }, [isCurrentPasswordValid, isNewPasswordValid, isConfirmPasswordValid]);

    const checkForChanges = useCallback(() => {
        const currentDisplayName = displayName || "";
        const currentBio = bio || "";
        const originalDisplayName = originalData.displayName || "";
        const originalBio = originalData.bio || "";

        const hasTextChanged =
            currentDisplayName !== originalDisplayName ||
            currentBio !== originalBio;

        const hasFileChanged = !!selectedAvatar || !!selectedCover;

        const hasAnyChanges = hasTextChanged || hasFileChanged;
        setHasChanges(hasAnyChanges);

        if (hasTextChanged) {
            setErrors({});
        }
    }, [displayName, bio, originalData, selectedAvatar, selectedCover]);

    useEffect(() => {
        checkForChanges();
    }, [displayName, bio]);

    useEffect(() => {
        checkForChanges();
    }, [selectedAvatar, selectedCover]);

    useEffect(() => {
        if (originalData.displayName !== "" || originalData.bio !== "") {
            checkForChanges();
        }
    }, [originalData.displayName, originalData.bio]);

    useEffect(() => {
        checkForChanges();
    }, []);

    useEffect(() => {
        let profileData = null;
        if (userInfo?.data?.Data) {
            profileData = userInfo.data.Data;
        } else if (userInfo?.data?.data) {
            profileData = userInfo.data.data;
        } else if (userInfo?.data) {
            profileData = userInfo.data;
        }

        if (profileData) {
            const apiData = {
                displayName: profileData.DisplayName || profileData.displayName || "",
                bio: profileData.Bio || profileData.bio || "",
                avatarUrl: profileData.AvatarUrl || profileData.avatarUrl || "",
                coverUrl: profileData.CoverUrl || profileData.coverUrl || ""
            };

            setDisplayName(apiData.displayName);
            setUsername(profileData.UserName || "");
            setBio(apiData.bio);
            setOriginalData(apiData);

            if (profileData.AvatarUrl) {
                setAvatarPreview("");
            }
            if (profileData.CoverUrl) {
                setCoverPreview("");
            }

            try {
                const backupData = {
                    displayName: apiData.displayName,
                    bio: apiData.bio,
                    avatarUrl: apiData.avatarUrl,
                    coverUrl: apiData.coverUrl,
                    timestamp: Date.now()
                };
                localStorage.setItem('userProfileBackup', JSON.stringify(backupData));
            } catch (error) {
            }

            setTimeout(() => {
                checkForChanges();
            }, 0);
        }
    }, [userInfo?.data?.Data]);

    useEffect(() => {
        let profileData = null;
        if (userInfo?.data?.Data) {
            profileData = userInfo.data.Data;
        } else if (userInfo?.data?.data) {
            profileData = userInfo.data.data;
        } else if (userInfo?.data) {
            profileData = userInfo.data;
        }

        if (profileData) {
            const updatedOriginalData = {
                displayName: profileData.DisplayName || profileData.displayName || "",
                bio: profileData.Bio || profileData.bio || "",
                avatarUrl: profileData.AvatarUrl || profileData.avatarUrl || "",
                coverUrl: profileData.CoverUrl || profileData.coverUrl || ""
            };

            setDisplayName(profileData.DisplayName || "");
            setBio(profileData.Bio || "");
            setOriginalData(updatedOriginalData);

            if (auth?.user && profileData) {
                const updatedUser = {
                    ...auth.user,
                    displayName: profileData.DisplayName || auth.user.displayName,
                    bio: profileData.Bio || auth.user.bio,
                    avatarUrl: profileData.AvatarUrl || auth.user.avatarUrl,
                    coverUrl: profileData.CoverUrl || auth.user.coverUrl,
                };

                const updatedAuth = {
                    ...auth,
                    user: updatedUser
                };

                if (JSON.stringify(auth.user) !== JSON.stringify(updatedUser)) {
                    setAuth(updatedAuth);
                }
            }

            try {
                const backupData = {
                    displayName: profileData.DisplayName || "",
                    bio: profileData.Bio || "",
                    avatarUrl: profileData.AvatarUrl || "",
                    coverUrl: profileData.CoverUrl || "",
                    timestamp: Date.now()
                };
                localStorage.setItem('userProfileBackup', JSON.stringify(backupData));
            } catch (error) {
            }
        }
    }, [userInfo?.data?.Data, auth?.user]);

    const handleFileSelect = (file: File, type: 'avatar' | 'cover') => {
        if (file) {
            if (!file.type.startsWith('image/')) {
                toast?.onOpen("Vui lòng chọn file ảnh (JPG, PNG, GIF, etc.)");
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                toast?.onOpen("File ảnh không được lớn hơn 5MB");
                return;
            }

            const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
            const fileExtension = file.name.split('.').pop()?.toLowerCase();
            if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
                toast?.onOpen("Chỉ chấp nhận file ảnh với định dạng: JPG, PNG, GIF, WEBP");
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                if (type === 'avatar') {
                    setSelectedAvatar(file);
                    setAvatarPreview(result);
                } else {
                    setSelectedCover(file);
                    setCoverPreview(result);
                }
            };
            reader.onerror = (error) => {
                console.error(`FileReader error for ${type}:`, error);
                toast?.onOpen(`Lỗi khi đọc file ${type}`);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
        const file = event.target.files?.[0];
        if (file) {
            handleFileSelect(file, type);
        }
        event.target.value = '';
    };

    const handleNavigation = (path: string) => {
        if (hasChanges) {
            setShowConfirmDialog(true);
            setPendingNavigation(path);
        } else {
            navigate(path);
        }
    };

    const confirmNavigation = () => {
        setShowConfirmDialog(false);
        if (pendingNavigation) {
            navigate(pendingNavigation);
        }
    };

    const cancelNavigation = () => {
        setShowConfirmDialog(false);
        setPendingNavigation(null);
    };

    const clearFileSelections = () => {
        setSelectedAvatar(null);
        setSelectedCover(null);
        setAvatarPreview("");
        setCoverPreview("");
        setDisplayName(originalData.displayName);
        setBio(originalData.bio);
        setHasChanges(false);
    };

    const handlePasswordChange = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordError("Vui lòng điền đầy đủ thông tin");
            return;
        }

        if (!isCurrentPasswordValid) {
            setPasswordError("Mật khẩu hiện tại không đúng");
            return;
        }

        if (!isNewPasswordValid) {
            setPasswordError("Mật khẩu mới không đáp ứng các yêu cầu");
            return;
        }

        if (!isConfirmPasswordValid) {
            setPasswordError("Mật khẩu xác nhận không khớp");
            return;
        }

        setPasswordError("");
        setIsLoading(true);

        try {
            if (!auth?.user?.userId) {
                toast?.onOpen("Không tìm thấy thông tin người dùng");
                return;
            }
            await changePasswordMutation.mutateAsync({
                UserId: auth.user.userId,
                OldPassword: currentPassword,
                NewPassword: newPassword,
                ConfirmPassword: confirmPassword
            });

            toast?.onOpen("Đổi mật khẩu thành công!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error: any) {
            console.error("Error changing password:", error);
            const errorMessage = error.response?.data?.message || "Có lỗi xảy ra khi đổi mật khẩu";
            toast?.onOpen(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveDisplayInfo = async () => {
        setIsLoading(true);
        setErrors({});

        if (!validateForm()) {
            setIsLoading(false);
            return;
        }

        try {
            const finalDisplayName = displayName.trim() || originalData.displayName;
            if (!finalDisplayName) {
                toast?.onOpen("Tên hiển thị không được để trống");
                setIsLoading(false);
                return;
            }

            let finalBio = bio?.trim() || originalData.bio || "";
            if (finalBio === "null" || finalBio === "") {
                finalBio = "Chưa có tiểu sử";
            }

            const formData = new FormData();
            formData.append("DisplayName", finalDisplayName);
            formData.append("Bio", finalBio);
            if (auth?.user?.userId) {
                formData.append("UserId", auth.user.userId.toString());
            } else {
                toast?.onOpen("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn");
                setIsLoading(false);
                return;
            }

            if (selectedAvatar) {
                formData.append("AvatarUrl", selectedAvatar);
            }

            if (selectedCover) {
                formData.append("CoverUrl", selectedCover);
            }

            for (let [key, value] of formData.entries()) {
            }

            const result = await updateProfileMutation.mutateAsync(formData);

            const isSuccess = result?.data?.success || result?.data?.Success;

            if (result && result.data && isSuccess) {
                toast?.onOpen("Cập nhật thông tin thành công!");

                Object.keys(result.data).forEach(key => {
                });

                let backendData = null;
                if (result.data.Data) {
                    backendData = result.data.Data;
                } else if (result.data.data) {
                    backendData = result.data.data;
                } else if (result.data) {
                    backendData = result.data;
                }

                if (backendData) {
                    const normalizedData = {
                        DisplayName: backendData.DisplayName || backendData.displayName,
                        Bio: backendData.Bio || backendData.bio,
                        AvatarUrl: backendData.AvatarUrl || backendData.avatarUrl,
                        CoverUrl: backendData.CoverUrl || backendData.coverUrl,
                        UserId: backendData.UserId || backendData.userId,
                        UserName: backendData.UserName || backendData.userName
                    };

                    backendData = normalizedData;
                }

                if (backendData) {
                    Object.keys(backendData).forEach(key => {
                    });
                } else {
                }

                setDisplayName(finalDisplayName);
                setBio(finalBio);

                setHasChanges(false);
                setSelectedAvatar(null);
                setSelectedCover(null);
                setAvatarPreview("");
                setCoverPreview("");

                if (refetchUserInfo) {
                    try {
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        const refetchResult = await refetchUserInfo();
                    } catch (refetchError) {
                        console.error("Failed to refetch user info:", refetchError);
                    }
                }

                if (backendData) {
                    const newDisplayName = backendData.DisplayName || finalDisplayName;
                    const newBio = backendData.Bio || finalBio;
                    const newAvatarUrl = backendData.AvatarUrl || backendData.avatarUrl || "";
                    const newCoverUrl = backendData.CoverUrl || backendData.coverUrl || "";

                    setDisplayName(newDisplayName);
                    setBio(newBio);

                    const updatedOriginalData = {
                        displayName: newDisplayName,
                        bio: newBio,
                        avatarUrl: newAvatarUrl,
                        coverUrl: newCoverUrl
                    };

                    setOriginalData(updatedOriginalData);

                    const currentUserInfo = userInfo?.data?.Data || {};
                    const updatedUserInfo = {
                        ...(userInfo || {}),
                        data: {
                            ...(userInfo?.data || {}),
                            Data: {
                                ...currentUserInfo,
                                DisplayName: newDisplayName,
                                Bio: newBio,
                                AvatarUrl: newAvatarUrl,
                                CoverUrl: newCoverUrl
                            }
                        }
                    };

                    queryClient.setQueryData(["current-user-info"], updatedUserInfo);
                    queryClient.invalidateQueries({ queryKey: ["auth"] });
                }

                if (backendData) {
                } else {
                }

                try {
                    const backupData = {
                        displayName: backendData?.DisplayName || finalDisplayName,
                        bio: backendData?.Bio || finalBio,
                        avatarUrl: backendData?.AvatarUrl || originalData.avatarUrl,
                        coverUrl: backendData?.CoverUrl || originalData.coverUrl,
                        timestamp: Date.now()
                    };

                    localStorage.setItem('userProfileBackup', JSON.stringify(backupData));

                    setOriginalData({
                        displayName: backupData.displayName,
                        bio: backupData.bio,
                        avatarUrl: backupData.avatarUrl,
                        coverUrl: backupData.coverUrl
                    });
                } catch (storageError) {
                    console.error("❌ Failed to store backup data:", storageError);
                }
            } else {
                const errorMessage = result.data?.message || result.data?.Message || "Cập nhật thông tin thất bại";
                toast?.onOpen(errorMessage);
            }
        } catch (mutationError: any) {
            console.error("Mutation error:", mutationError);
            console.error("Error response data:", mutationError.response?.data);
            console.error("Error status:", mutationError.response?.status);
            console.error("Error message:", mutationError.message);

            let errorMessage = "Có lỗi xảy ra khi cập nhật thông tin";

            if (mutationError.response?.data?.errors) {
                const errors = mutationError.response.data.errors;
                console.error("Validation errors:", errors);

                if (errors.DisplayName && errors.DisplayName.length > 0) {
                    errorMessage = `Tên hiển thị: ${errors.DisplayName[0]}`;
                } else if (errors.Bio && errors.Bio.length > 0) {
                    errorMessage = `Tiểu sử: ${errors.Bio[0]}`;
                } else if (errors.UserId && errors.UserId.length > 0) {
                    errorMessage = `Lỗi xác thực: ${errors.UserId[0]}`;
                } else if (errors.AvatarUrl && errors.AvatarUrl.length > 0) {
                    errorMessage = `Ảnh đại diện: ${errors.AvatarUrl[0]}`;
                } else if (errors.CoverUrl && errors.CoverUrl.length > 0) {
                    errorMessage = `Ảnh bìa: ${errors.CoverUrl[0]}`;
                } else {
                    const allErrors = Object.values(errors).flat().join(', ');
                    errorMessage = `Lỗi validation: ${allErrors}`;
                }
            }
            else if (mutationError.response?.data?.message) {
                errorMessage = mutationError.response.data.message;
            } else if (mutationError.response?.data?.Message) {
                errorMessage = mutationError.response.data.Message;
            } else if (mutationError.response?.data?.title) {
                errorMessage = mutationError.response.data.title;
            }

            toast?.onOpen(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveInterfaceSettings = () => {
    };

    if (isLoadingUser) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-white">Đang tải...</div>
            </div>
        );
    }

    const currentUser = auth?.user;

    let backendData = null;

    if (userInfo?.data?.Data) {
        backendData = userInfo.data.Data;
    } else if (userInfo?.data?.data) {
        backendData = userInfo.data.data;
    } else if (userInfo?.data) {
        backendData = userInfo.data;
    }

    const createdAt = backendData?.CreatedAt || backendData?.createdAt;
    const joinDate = createdAt ? blogFormatVietnamTimeFromTicks(createdAt) : "";

    const renderDisplayInfo = () => (
        <div className="space-y-4 sm:space-y-6">
            {/* Profile Section */}
            <div className="relative">
                <div className="h-32 sm:h-48 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg relative">
                    {(coverPreview || originalData.coverUrl || backendData?.CoverUrl || backendData?.coverUrl) && (
                        <img
                            src={coverPreview || originalData.coverUrl || backendData?.CoverUrl || backendData?.coverUrl}
                            alt="Cover"
                            className="w-full h-full object-cover rounded-lg"
                        />
                    )}
                    <div className="absolute -bottom-8 sm:-bottom-12 left-4 sm:left-6">
                        <img
                            src={avatarPreview || originalData.avatarUrl || backendData?.AvatarUrl || backendData?.avatarUrl || currentUser?.avatarUrl || "/images/default-avatar.png"}
                            alt="Profile"
                            className="w-16 h-16 sm:w-24 sm:h-24 rounded-full border-4 border-white object-cover"
                        />
                    </div>
                </div>
                <div className="mt-12 sm:mt-16 ml-4 sm:ml-6">
                    <h2 className="text-lg sm:text-2xl font-bold text-white">{displayName || backendData?.DisplayName || backendData?.displayName || currentUser?.displayName || "Chưa có tên hiển thị"}</h2>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-gray-400 text-sm sm:text-base">
                        <span>@{username || backendData?.UserName || backendData?.userName || currentUser?.userName || "username"}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>Tham gia từ {joinDate || "Tháng 3/2025"}</span>
                    </div>
                    {bio && (
                        <p className="text-gray-300 text-sm sm:text-base mt-2 max-w-md break-words overflow-hidden">
                            {bio}
                        </p>
                    )}
                </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 sm:space-y-6">
                <div>
                    <label className="block text-sm font-medium text-white mb-2">
                        Tên hiển thị
                    </label>
                    <TextFieldComponent
                        value={displayName}
                        onChange={(e) => {
                            setDisplayName(e.target.value);
                            if (errors.displayName) {
                                setErrors(prev => ({ ...prev, displayName: undefined }));
                            }
                        }}
                        placeholder="Nhập tên hiển thị"
                        className="w-full"
                    />
                    {errors.displayName && (
                        <div className="text-red-500 text-sm mt-1 ml-2">
                            {errors.displayName}
                        </div>
                    )}
                    <p className="text-gray-400 text-xs sm:text-sm mt-1">
                        Tên hiển thị có thể trùng lặp với người dùng khác
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-white mb-2">
                        Tên người dùng
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={username || backendData?.UserName || backendData?.userName || currentUser?.userName || ""}
                            disabled
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 placeholder-gray-400 pr-12 text-sm sm:text-base cursor-not-allowed"
                            placeholder="Nhập tên người dùng"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                            </div>
                        </div>
                    </div>
                    <p className="text-gray-400 text-xs sm:text-sm mt-1">
                        Tên người dùng không thể thay đổi
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-white mb-2">
                        Tiểu sử <span className="text-red-400">*</span>
                    </label>
                    <textarea
                        value={bio}
                        onChange={(e) => {
                            setBio(e.target.value);
                            if (errors.bio) {
                                setErrors(prev => ({ ...prev, bio: undefined }));
                            }
                        }}
                        placeholder="Nhập tiểu sử (bắt buộc)"
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#ff4500] text-sm sm:text-base resize-none"
                        rows={3}
                    />
                    {errors.bio && (
                        <div className="text-red-500 text-sm mt-1 ml-2">
                            {errors.bio}
                        </div>
                    )}
                    <div className="flex justify-end mt-2">
                        <span className={`text-xs sm:text-sm ${bio && bio.length > 450 ? 'text-orange-400' : 'text-gray-400'
                            }`}>
                            {bio?.length || 0}/500
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-white mb-2">
                            Ảnh đại diện
                        </label>
                        <input
                            type="file"
                            ref={avatarInputRef}
                            onChange={(e) => handleFileInputChange(e, 'avatar')}
                            accept="image/*"
                            className="hidden"
                        />
                        <div
                            onClick={() => avatarInputRef.current?.click()}
                            className="border-2 border-dashed border-gray-600 rounded-lg p-4 sm:p-6 text-center hover:border-[#ff4500] transition-colors cursor-pointer h-32 sm:h-40"
                        >
                            {avatarPreview ? (
                                <img
                                    src={avatarPreview}
                                    alt="Avatar preview"
                                    className="w-full h-full object-cover rounded"
                                />
                            ) : (originalData.avatarUrl || backendData?.AvatarUrl || backendData?.avatarUrl) ? (
                                <img
                                    src={originalData.avatarUrl || backendData?.AvatarUrl || backendData?.avatarUrl}
                                    alt="Current avatar"
                                    className="w-full h-full object-cover rounded"
                                />
                            ) : (
                                <>
                                    <div className="text-2xl sm:text-4xl text-gray-400 mb-2">+</div>
                                    <p className="text-gray-400 text-sm sm:text-base">Thêm tệp</p>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-white mb-2">
                            Ảnh bìa
                        </label>
                        <input
                            type="file"
                            ref={coverInputRef}
                            onChange={(e) => handleFileInputChange(e, 'cover')}
                            accept="image/*"
                            className="hidden"
                        />
                        <div
                            onClick={() => coverInputRef.current?.click()}
                            className="border-2 border-dashed border-gray-600 rounded-lg p-4 sm:p-6 text-center hover:border-[#ff4500] transition-colors cursor-pointer h-32 sm:h-40"
                        >
                            {coverPreview ? (
                                <img
                                    src={coverPreview}
                                    alt="Cover preview"
                                    className="w-full h-full object-cover rounded"
                                />
                            ) : (originalData.coverUrl || backendData?.CoverUrl || backendData?.coverUrl) ? (
                                <img
                                    src={originalData.coverUrl || backendData?.CoverUrl || backendData?.coverUrl}
                                    alt="Current cover"
                                    className="w-full h-full object-cover rounded"
                                />
                            ) : (
                                <>
                                    <div className="text-2xl sm:text-4xl text-gray-400 mb-2">+</div>
                                    <p className="text-gray-400 text-sm sm:text-base">Thêm tệp</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                    <Button
                        onClick={handleSaveDisplayInfo}
                        disabled={!hasChanges || isLoading || Object.keys(errors).length > 0}
                        className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${hasChanges && Object.keys(errors).length === 0
                            ? "bg-[#ff4500] hover:bg-[#e63900] text-white"
                            : "bg-gray-600 text-gray-400 cursor-not-allowed"
                            }`}
                    >
                        {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
                    </Button>
                </div>
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
                <div className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6 space-y-1">
                    <p>Mật khẩu của bạn phải đáp ứng các yêu cầu sau:</p>
                    <ul className="list-disc list-inside pl-2">
                        <li>Độ dài từ 8 đến 32 ký tự</li>
                        <li>Chứa ít nhất một chữ hoa</li>
                        <li>Chứa ít nhất một số</li>
                        <li>Chứa ít nhất một ký tự đặc biệt (!@#$%^&*(),.?":{ }|&lt;&gt;)</li>
                    </ul>
                </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            Mật khẩu hiện tại
                        </label>
                        <div className="relative w-3/4">
                            <input
                                type={showCurrentPassword ? "text" : "password"}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#ff4500] pr-10 text-sm sm:text-base"
                                placeholder="Nhập mật khẩu hiện tại"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                                {showCurrentPassword ? (
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {currentPassword && (
                            <span className={`text-sm mt-1 ${isCurrentPasswordValid ? 'text-green-500' : 'text-red-500'}`}>
                                {isCurrentPasswordValid ? '*Đúng' : '*Không đúng'}
                            </span>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            Mật khẩu mới
                        </label>
                        <div className="relative w-3/4">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#ff4500] pr-10 text-sm sm:text-base"
                                placeholder="Nhập mật khẩu mới"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                                {showNewPassword ? (
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {newPassword && (
                            <span className={`text-sm mt-1 ${isNewPasswordValid ? 'text-green-500' : 'text-red-500'}`}>
                                {isNewPasswordValid ? '*Hợp lệ' : '*Không hợp lệ'}
                            </span>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            Nhập lại mật khẩu mới
                        </label>
                        <div className="relative w-3/4">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#ff4500] pr-10 text-sm sm:text-base"
                                placeholder="Nhập lại mật khẩu mới"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                                {showConfirmPassword ? (
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {confirmPassword && (
                            <span className={`text-sm mt-1 ${isConfirmPasswordValid ? 'text-green-500' : 'text-red-500'}`}>
                                {isConfirmPasswordValid ? '*Trùng khớp với mật khẩu mới' : '*Không trùng khớp với mật khẩu mới'}
                            </span>
                        )}
                        {passwordError && (
                            <p className="text-red-500 text-xs sm:text-sm mt-1 ml-1">* {passwordError}</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <Button
                    onClick={handlePasswordChange}
                    disabled={!isPasswordChangeEnabled || isLoading}
                    className={`text-white px-4 sm:px-6 py-2 rounded-lg transition-colors text-sm sm:text-base ${isPasswordChangeEnabled ? 'bg-[#ff4500] hover:bg-[#e03d00]' : 'bg-gray-500 cursor-not-allowed'
                        }`}
                >
                    {isLoading ? "Đang đổi mật khẩu..." : "Đổi mật khẩu"}
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
                        <div className="flex items-center justify-between mb-2 sm:mb-4 lg:mb-8">
                            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold">Cài đặt tài khoản</h1>
                            <button
                                onClick={() => handleNavigation("/profile")}
                                className="text-gray-400 hover:text-white text-sm"
                            >
                                ← Quay lại
                            </button>
                        </div>

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

            {/* Confirm Dialog */}
            {showConfirmDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Bạn có chắc chắn muốn rời khỏi trang này không?</h3>
                        <p className="text-sm text-gray-600 mb-4">Bạn có những thay đổi chưa lưu. Nếu bạn rời khỏi, những thay đổi này sẽ bị mất.</p>
                        <div className="flex justify-end gap-2">
                            <Button onClick={confirmNavigation} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg">
                                Rời khỏi
                            </Button>
                            <Button onClick={cancelNavigation} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg">
                                Hủy
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

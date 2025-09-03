import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useAuth } from "../../hooks/useAuth";
import {
  useGetCurrentUserInfo,
  useUpdateUserProfile,
  useChangePassword,
} from "./useUserSettings";
import { useToast } from "../../context/ToastContext/toast-context";
import { useNavigate } from "react-router-dom";
import { blogFormatVietnamTimeFromTicks } from "../../utils/date_format";
import httpClient from "../../utils/http";
import type { ApiResponse } from "../../api/User/user-settings.type";
import { useQueryClient } from "@tanstack/react-query";

import { SectionCard } from "./components/SectionCard";
import { SidebarButton } from "./components/SidebarButton";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { DisplaySection } from "./sections/DisplaySection";
import { PasswordSection } from "./sections/PasswordSection";

import { ArrowLeft, UserRound, KeyRound } from "lucide-react";

type SettingTab = "display" | "interface" | "privacy" | "password";

export const Setting = () => {
  // ========= states & logic giữ nguyên =========
  const [activeTab, setActiveTab] = useState<SettingTab>("display");
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
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
    coverUrl: "",
  });

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(
    null
  );

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState<{ displayName?: string; bio?: string }>(
    {}
  );

  const validateForm = () => {
    const newErrors: { displayName?: string; bio?: string } = {};
    if (!displayName || displayName.trim().length === 0)
      newErrors.displayName = "Tên hiển thị không được để trống";
    else if (displayName.trim().length < 2)
      newErrors.displayName = "Tên hiển thị phải có ít nhất 2 ký tự";
    else if (displayName.trim().length > 100)
      newErrors.displayName = "Tên hiển thị không được quá 100 ký tự";
    if (!bio || bio.trim().length === 0)
      newErrors.bio = "Tiểu sử không được để trống";
    else if (bio.trim().length > 500)
      newErrors.bio = "Tiểu sử không được quá 500 ký tự";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { auth, setAuth } = useAuth();
  const {
    data: userInfo,
    isLoading: isLoadingUser,
    refetch: refetchUserInfo,
  } = useGetCurrentUserInfo();
  const updateProfileMutation = useUpdateUserProfile();
  const changePasswordMutation = useChangePassword();
  const queryClient = useQueryClient();
  // const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    queryClient.removeQueries({ queryKey: ["current-user-info"] });
    setTimeout(() => {
      refetchUserInfo();
    }, 100);
  }, [refetchUserInfo, queryClient]);

  useEffect(() => {
    let hasData = false;
    if (userInfo?.data?.Data || userInfo?.data?.data || userInfo?.data)
      hasData = true;
    if (!hasData) {
      try {
        const backupData = localStorage.getItem("userProfileBackup");
        if (backupData) {
          const parsed = JSON.parse(backupData);
          setDisplayName(parsed.displayName || "");
          setBio(parsed.bio || "");
          setOriginalData({
            displayName: parsed.displayName || "",
            bio: parsed.bio || "",
            avatarUrl: parsed.avatarUrl || "",
            coverUrl: parsed.coverUrl || "",
          });
        }
      } catch { }
    }
  }, [userInfo?.data?.Data]);

  const [isCurrentPasswordValid, setIsCurrentPasswordValid] = useState<
    boolean | null
  >(null);
  const [isNewPasswordValid, setIsNewPasswordValid] = useState<boolean | null>(
    null
  );
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState<
    boolean | null
  >(null);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const validatePassword = (password: string): boolean => {
    const hasMinLength = password.length >= 8;
    const hasMaxLength = password.length <= 32;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return (
      hasMinLength &&
      hasMaxLength &&
      hasUpperCase &&
      hasNumber &&
      hasSpecialChar
    );
  };

  const checkCurrentPassword = useCallback(
    async (password: string) => {
      if (!password || !auth?.user?.userId) {
        setIsCurrentPasswordValid(null);
        return;
      }
      try {
        const tempPassword = "Temp@123456789";
        await httpClient.privateHttp.post<ApiResponse>(
          "users/change-password",
          {
            UserId: auth.user.userId,
            OldPassword: password,
            NewPassword: tempPassword,
            ConfirmPassword: tempPassword,
          }
        );
        try {
          await httpClient.privateHttp.post<ApiResponse>(
            "users/change-password",
            {
              UserId: auth.user.userId,
              OldPassword: tempPassword,
              NewPassword: password,
              ConfirmPassword: password,
            }
          );
          setIsCurrentPasswordValid(true);
        } catch {
          setIsCurrentPasswordValid(true);
        }
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || "";
        if (errorMessage.includes("Mật khẩu cũ không đúng"))
          setIsCurrentPasswordValid(false);
      }
    },
    [auth?.user?.userId]
  );

  const validateNewPassword = useCallback((password: string) => {
    if (!password) {
      setIsNewPasswordValid(null);
      return;
    }
    setIsNewPasswordValid(validatePassword(password));
  }, []);

  const validateConfirmPassword = useCallback(
    (confirmPass: string, newPass: string) => {
      if (!confirmPass || !newPass) {
        setIsConfirmPasswordValid(null);
        return;
      }
      setIsConfirmPasswordValid(confirmPass === newPass);
    },
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPassword) checkCurrentPassword(currentPassword);
      else setIsCurrentPasswordValid(null);
    }, 1000);
    return () => clearTimeout(timer);
  }, [currentPassword, checkCurrentPassword]);

  useEffect(() => {
    validateNewPassword(newPassword);
  }, [newPassword, validateNewPassword]);

  useEffect(() => {
    validateConfirmPassword(confirmPassword, newPassword);
  }, [confirmPassword, newPassword, validateConfirmPassword]);

  const isPasswordChangeEnabled = useMemo(
    () =>
      isCurrentPasswordValid === true &&
      isNewPasswordValid === true &&
      isConfirmPasswordValid === true,
    [isCurrentPasswordValid, isNewPasswordValid, isConfirmPasswordValid]
  );

  const checkForChanges = useCallback(() => {
    const currentDisplayName = displayName || "";
    const currentBio = bio || "";
    const originalDisplayName = originalData.displayName || "";
    const originalBio = originalData.bio || "";

    const hasTextChanged =
      currentDisplayName !== originalDisplayName || currentBio !== originalBio;
    const hasFileChanged = !!selectedAvatar || !!selectedCover;
    const hasAnyChanges = hasTextChanged || hasFileChanged;

    setHasChanges(hasAnyChanges);
    if (hasTextChanged) setErrors({});
  }, [displayName, bio, originalData, selectedAvatar, selectedCover]);

  useEffect(() => {
    checkForChanges();
  }, [displayName, bio, selectedAvatar, selectedCover]);

  useEffect(() => {
    if (originalData.displayName !== "" || originalData.bio !== "")
      checkForChanges();
  }, [originalData.displayName, originalData.bio]);

  useEffect(() => {
    checkForChanges();
  }, []);

  // userInfo.data is directly the User object from the API
  const backendData = userInfo?.data;

  useEffect(() => {
    const profileData = userInfo?.data;

    if (profileData) {
      const apiData = {
        displayName: profileData.displayName || "",
        bio: profileData.bio || "",
        avatarUrl: profileData.avatarUrl || "",
        coverUrl: profileData.coverUrl || "",
      };

      setDisplayName(apiData.displayName);
      setUsername(profileData.userName || "");
      setBio(apiData.bio);
      setOriginalData(apiData);
      if (profileData.avatarUrl) setAvatarPreview("");
      if (profileData.coverUrl) setCoverPreview("");
      try {
        const backupData = { ...apiData, timestamp: Date.now() };
        localStorage.setItem("userProfileBackup", JSON.stringify(backupData));
      } catch { }
      setTimeout(() => checkForChanges(), 0);
    } else {
      if (auth?.user) {
        const fallbackData = {
          displayName: auth.user.displayName || "",
          bio: auth.user.bio || "",
          avatarUrl: auth.user.avatarUrl || "",
          coverUrl: auth.user.coverUrl || "",
        };
        setDisplayName(fallbackData.displayName);
        setBio(fallbackData.bio);
        setOriginalData(fallbackData);
      }
    }
  }, [userInfo?.data, auth?.user]);

  useEffect(() => {
    // userInfo.data is directly the User object from the API
    const profileData = userInfo?.data;

    if (profileData) {
      const updatedOriginalData = {
        displayName: profileData.displayName || "",
        bio: profileData.bio || "",
        avatarUrl: profileData.avatarUrl || "",
        coverUrl: profileData.coverUrl || "",
      };
      setDisplayName(profileData.displayName || "");
      setBio(profileData.bio || "");
      setOriginalData(updatedOriginalData);

      if (auth?.user && profileData) {
        const updatedUser = {
          ...auth.user,
          displayName: profileData.displayName || auth.user.displayName,
          bio: profileData.bio || auth.user.bio,
          avatarUrl: profileData.avatarUrl || auth.user.avatarUrl,
          coverUrl: profileData.coverUrl || auth.user.coverUrl,
        };
        const updatedAuth = { ...auth, user: updatedUser };
        if (JSON.stringify(auth.user) !== JSON.stringify(updatedUser))
          setAuth(updatedAuth);
      }

      try {
        const backupData = { ...updatedOriginalData, timestamp: Date.now() };
        localStorage.setItem("userProfileBackup", JSON.stringify(backupData));
      } catch { }
    }
  }, [userInfo?.data, auth?.user]);

  const toast = useToast();

  const handleFileSelect = (file: File, type: "avatar" | "cover") => {
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast?.onOpen("Vui lòng chọn file ảnh (JPG, PNG, GIF, etc.)");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast?.onOpen("File ảnh không được lớn hơn 5MB");
        return;
      }
      const allowedExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        toast?.onOpen(
          "Chỉ chấp nhận file ảnh với định dạng: JPG, PNG, GIF, WEBP"
        );
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (type === "avatar") {
          setSelectedAvatar(file);
          setAvatarPreview(result);
        } else {
          setSelectedCover(file);
          setCoverPreview(result);
        }
      };
      reader.onerror = () => {
        toast?.onOpen(`Lỗi khi đọc file ${type}`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "cover"
  ) => {
    const file = event.target.files?.[0];
    if (file) handleFileSelect(file, type);
    event.target.value = "";
  };

  const confirmNavigation = () => {
    setShowConfirmDialog(false);
    if (pendingNavigation) navigate(pendingNavigation);
  };
  const cancelNavigation = () => {
    setShowConfirmDialog(false);
    setPendingNavigation(null);
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
        ConfirmPassword: confirmPassword,
      });
      toast?.onOpen("Đổi mật khẩu thành công!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Có lỗi xảy ra khi đổi mật khẩu";
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
      if (finalBio === "null" || finalBio === "") finalBio = "Chưa có tiểu sử";

      const formData = new FormData();
      formData.append("DisplayName", finalDisplayName);
      formData.append("Bio", finalBio);
      if (auth?.user?.userId)
        formData.append("UserId", auth.user.userId.toString());
      else {
        toast?.onOpen("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn");
        setIsLoading(false);
        return;
      }
      if (selectedAvatar) formData.append("AvatarUrl", selectedAvatar);
      if (selectedCover) formData.append("CoverUrl", selectedCover);

      const result = await updateProfileMutation.mutateAsync(formData);
      const isSuccess = result?.data?.success || result?.data?.Success;

      if (result && result.data && isSuccess) {
        toast?.onOpen("Cập nhật thông tin thành công!");

        let backend = null;
        if (result.data.Data) backend = result.data.Data;
        else if (result.data.data) backend = result.data.data;
        else if (result.data) backend = result.data;

        if (backend) {
          backend = {
            DisplayName: backend.DisplayName || backend.displayName,
            Bio: backend.Bio || backend.bio,
            AvatarUrl: backend.AvatarUrl || backend.avatarUrl,
            CoverUrl: backend.CoverUrl || backend.coverUrl,
            UserId: backend.UserId || backend.userId,
            UserName: backend.UserName || backend.userName,
          };
        }

        setHasChanges(false);
        setSelectedAvatar(null);
        setSelectedCover(null);
        setAvatarPreview("");
        setCoverPreview("");

        if (refetchUserInfo) {
          try {
            await new Promise((r) => setTimeout(r, 1000));
            await refetchUserInfo();
          } catch { }
        }

        queryClient.invalidateQueries({ queryKey: ["userSearch"] });
        queryClient.invalidateQueries({ queryKey: ["otherUserProfile"] });

        const newDisplayName = backend?.DisplayName || finalDisplayName;
        const newBio = backend?.Bio || finalBio;
        const newAvatarUrl = backend?.AvatarUrl || originalData.avatarUrl;
        const newCoverUrl = backend?.CoverUrl || originalData.coverUrl;

        setDisplayName(newDisplayName);
        setBio(newBio);
        setOriginalData({
          displayName: newDisplayName,
          bio: newBio,
          avatarUrl: newAvatarUrl,
          coverUrl: newCoverUrl,
        });

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
              CoverUrl: newCoverUrl,
            },
          },
        };
        queryClient.setQueryData(["current-user-info"], updatedUserInfo);
        queryClient.invalidateQueries({ queryKey: ["auth"] });

        try {
          const backupData = {
            displayName: newDisplayName,
            bio: newBio,
            avatarUrl: newAvatarUrl,
            coverUrl: newCoverUrl,
            timestamp: Date.now(),
          };
          localStorage.setItem("userProfileBackup", JSON.stringify(backupData));
        } catch { }
      } else {
        const errorMessage =
          result.data?.message ||
          result.data?.Message ||
          "Cập nhật thông tin thất bại";
        toast?.onOpen(errorMessage);
      }
    } catch (mutationError: any) {
      let errorMessage = "Có lỗi xảy ra khi cập nhật thông tin";
      if (mutationError.response?.data?.errors) {
        const errs = mutationError.response.data.errors;
        if (errs.DisplayName?.[0])
          errorMessage = `Tên hiển thị: ${errs.DisplayName[0]}`;
        else if (errs.Bio?.[0]) errorMessage = `Tiểu sử: ${errs.Bio[0]}`;
        else if (errs.UserId?.[0])
          errorMessage = `Lỗi xác thực: ${errs.UserId[0]}`;
        else if (errs.AvatarUrl?.[0])
          errorMessage = `Ảnh đại diện: ${errs.AvatarUrl[0]}`;
        else if (errs.CoverUrl?.[0])
          errorMessage = `Ảnh bìa: ${errs.CoverUrl[0]}`;
        else
          errorMessage = `Lỗi validation: ${Object.values(errs)
            .flat()
            .join(", ")}`;
      } else if (mutationError.response?.data?.message)
        errorMessage = mutationError.response.data.message;
      else if (mutationError.response?.data?.Message)
        errorMessage = mutationError.response.data.Message;
      else if (mutationError.response?.data?.title)
        errorMessage = mutationError.response.data.title;
      toast?.onOpen(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-white text-zinc-900 dark:bg-[#0a0b0e] dark:text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#ff6740] mx-auto mb-4" />
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">
            Đang tải...
          </p>
        </div>
      </div>
    );
  }

  const currentUser = auth?.user;
  const createdAt = backendData?.lastLogin;
  const joinDate = createdAt ? blogFormatVietnamTimeFromTicks(createdAt) : "";

  const computedUserName =
    backendData?.userName ||
    currentUser?.userName ||
    "";
  const computedAvatarUrl =
    originalData.avatarUrl ||
    backendData?.avatarUrl ||
    currentUser?.avatarUrl ||
    "";
  const computedCoverUrl =
    originalData.coverUrl ||
    backendData?.coverUrl ||
    "";

  // ========= RENDER với nền light/dark chuẩn =========
  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-[#0a0b0e] dark:text-white relative">
      {/* Background layer: light & dark gradients tách bạch */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        {/* Light mode backdrop */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#fafafa_0%,#ffffff_40%)] dark:hidden" />
        {/* Dark mode backdrop */}
        <div
          className="hidden dark:block absolute inset-0"
          style={{
            background:
              "radial-gradient(900px 500px at 85% -10%, rgba(255,103,64,0.14), transparent 60%), radial-gradient(800px 500px at -10% 20%, rgba(120,170,255,0.10), transparent 60%)",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 py-4 sm:py-6 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-4 lg:gap-8">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-6 h-fit space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  if (hasChanges) {
                    setShowConfirmDialog(true);
                    setPendingNavigation("/profile");
                  } else {
                    navigate("/profile");
                  }
                }}
                className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 
                          text-[13px] font-medium transition-colors
                          text-zinc-600 hover:text-zinc-900
                          dark:text-zinc-400 dark:hover:text-white
                          bg-zinc-100/60 hover:bg-zinc-200/80
                          dark:bg-white/5 dark:hover:bg-white/10"
                aria-label="Quay lại trang hồ sơ"
                title="Quay lại"
              >
                <ArrowLeft className="h-4 w-4 shrink-0" />
                <span className="font-bold">Quay lại</span>
              </button>
              {/* <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold">Cài đặt tài khoản</h2>
              </div> */}
            </div>

            {/* Nav Card */}
            <SectionCard>
              {/* Group: Chung */}
              <div className="space-y-2">
                <p
                  className="text-[11px] uppercase tracking-[0.12em] font-semibold
                              text-zinc-500 dark:text-zinc-400 mb-1"
                >
                  Chung
                </p>

                <SidebarButton
                  active={activeTab === "display"}
                  onClick={() => setActiveTab("display")}
                >
                  <span className="flex items-center gap-2.5">
                    <span
                      className={[
                        "h-6 w-6 grid place-items-center rounded-md ring-1 transition",
                        activeTab === "display"
                          ? "bg-[#ff6740]/15 ring-[#ff6740]/30"
                          : "bg-zinc-100 ring-zinc-200 dark:bg-white/5 dark:ring-white/10",
                      ].join(" ")}
                    >
                      <UserRound
                        className={[
                          "h-3.5 w-3.5",
                          activeTab === "display"
                            ? "text-white"
                            : "text-zinc-600 dark:text-zinc-300",
                        ].join(" ")}
                      />
                    </span>
                    <span>Thông tin hiển thị</span>
                  </span>
                </SidebarButton>
              </div>

              {/* Group: Tài khoản */}
              <div className="mt-4 space-y-2">
                <p
                  className="text-[11px] uppercase tracking-[0.12em] font-semibold
                              text-zinc-500 dark:text-zinc-400 mb-1"
                >
                  Tài khoản
                </p>

                <SidebarButton
                  active={activeTab === "password"}
                  onClick={() => setActiveTab("password")}
                >
                  <span className="flex items-center gap-2.5">
                    <span
                      className={[
                        "h-6 w-6 grid place-items-center rounded-md ring-1 transition",
                        activeTab === "password"
                          ? "bg-[#ff6740]/15 ring-[#ff6740]/30"
                          : "bg-zinc-100 ring-zinc-200 dark:bg-white/5 dark:ring-white/10",
                      ].join(" ")}
                    >
                      <KeyRound
                        className={[
                          "h-3.5 w-3.5",
                          activeTab === "password"
                            ? "text-white"
                            : "text-zinc-600 dark:text-zinc-300",
                        ].join(" ")}
                      />
                    </span>
                    <span>Mật khẩu</span>
                  </span>
                </SidebarButton>

                {/* Bật khi cần */}
                {/* 
                <SidebarButton active={activeTab === "privacy"} onClick={() => setActiveTab("privacy")}>
                  <span className="flex items-center gap-2.5">
                    <span className={[
                      "h-6 w-6 grid place-items-center rounded-md ring-1 transition",
                      activeTab === "privacy"
                        ? "bg-[#ff6740]/15 ring-[#ff6740]/30"
                        : "bg-zinc-100 ring-zinc-200 dark:bg-white/5 dark:ring-white/10",
                    ].join(" ")}>
                      <Shield className={[
                        "h-3.5 w-3.5",
                        activeTab === "privacy" ? "text-[#ff6740]" : "text-zinc-600 dark:text-zinc-300",
                      ].join(" ")} />
                    </span>
                    <span>Quyền riêng tư</span>
                  </span>
                </SidebarButton>
                */}
              </div>
            </SectionCard>
          </aside>

          {/* Main */}
          <main className="space-y-6">
            {activeTab === "display" && (
              <DisplaySection
                displayName={displayName}
                username={username}
                bio={bio}
                errors={errors}
                joinDate={joinDate}
                currentUserName={computedUserName}
                avatarUrl={computedAvatarUrl}
                coverUrl={computedCoverUrl}
                avatarPreview={avatarPreview}
                coverPreview={coverPreview}
                setDisplayName={setDisplayName}
                setBio={setBio}
                onSelectFile={handleFileInputChange}
                avatarInputRef={avatarInputRef}
                coverInputRef={coverInputRef}
                onSave={handleSaveDisplayInfo}
                hasChanges={hasChanges}
                isLoading={isLoading}
              />
            )}

            {activeTab === "password" && (
              <PasswordSection
                currentPassword={currentPassword}
                newPassword={newPassword}
                confirmPassword={confirmPassword}
                setCurrentPassword={setCurrentPassword}
                setNewPassword={setNewPassword}
                setConfirmPassword={setConfirmPassword}
                showCurrentPassword={showCurrentPassword}
                showNewPassword={showNewPassword}
                showConfirmPassword={showConfirmPassword}
                setShowCurrentPassword={setShowCurrentPassword}
                setShowNewPassword={setShowNewPassword}
                setShowConfirmPassword={setShowConfirmPassword}
                isCurrentPasswordValid={isCurrentPasswordValid}
                isNewPasswordValid={isNewPasswordValid}
                isConfirmPasswordValid={isConfirmPasswordValid}
                passwordError={passwordError}
                isPasswordChangeEnabled={isPasswordChangeEnabled}
                isLoading={isLoading}
                onChangePassword={handlePasswordChange}
              />
            )}
          </main>
        </div>
      </div>

      <ConfirmDialog
        open={showConfirmDialog}
        onCancel={cancelNavigation}
        onConfirm={confirmNavigation}
      />
    </div>
  );
};

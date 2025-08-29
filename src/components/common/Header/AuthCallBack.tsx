// GoogleCallback.tsx
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginBEGoogle } from "../../../api/Auth/auth.api";
import { useToast } from "../../../context/ToastContext/toast-context";
import { useAuth } from "../../../hooks/useAuth";

export const AuthCallback = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { setAuth } = useAuth();

  const loginBEGoogleMutation = useMutation({
    mutationFn: (accessToken: string) => LoginBEGoogle(accessToken),
    onSuccess: (res) => {
      const tokenData = res?.data?.data;
      if (!tokenData) {
        toast?.onOpen("Đăng nhập Google thất bại: không có token");
        return;
      }

      const { accessToken, refreshToken, user } = tokenData;
      setAuth({ accessToken, refreshToken, user });
      toast?.onOpen("Đăng nhập Google thành công!");
      if (user.role === "Admin") navigate("/admin");
      else navigate("/");
    },
    onError: () => {
      toast?.onOpen("Đăng nhập Google thất bại");
    },
  });

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);

    const accessToken = params.get("access_token");

    if (accessToken) {
      loginBEGoogleMutation.mutate(accessToken);
    }

    window.history.replaceState(null, "", window.location.pathname);
    navigate("/");
  }, [navigate]);

  return <div>Đang đăng nhập với Google...</div>;
};

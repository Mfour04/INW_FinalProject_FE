import { useMutation } from "@tanstack/react-query";
import { useToast } from "../context/ToastContext/toast-context";
import type { ReportRequest } from "../api/Report/report.type";
import { Report } from "../api/Report/report.api";

export const useReport = () => {
  const toast = useToast();

  return useMutation({
    mutationFn: (request: ReportRequest) => Report(request),
    onSuccess: () => {
      toast?.onOpen(
        "Cảm ơn bạn đã báo cáo. Chúng tôi sẽ kiểm tra sớm nhất có thể!"
      );
    },
  });
};

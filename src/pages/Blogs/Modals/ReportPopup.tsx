interface ReportPopupProps {
  type: "post" | "comment";
  id: string;
  setReportId: React.Dispatch<React.SetStateAction<string | null>>;
}

const ReportPopup = ({ type, id, setReportId }: ReportPopupProps) => (
  <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.3)] backdrop-blur-sm flex items-center justify-center">
    <div className="bg-[#1e1e21] text-white rounded-lg p-6 w-[90%] max-w-md">
      <h3 className="text-lg font-bold mb-4">
        Báo cáo {type === "post" ? "bài viết" : "bình luận"}
      </h3>
      <p className="text-sm text-[#ccc] mb-4">Tính năng đang phát triển.</p>
      <div className="flex justify-end">
        <button
          onClick={() => setReportId(null)}
          className="px-4 py-2 bg-[#ff6740] hover:bg-[#e55a36] rounded"
        >
          Đóng
        </button>
      </div>
    </div>
  </div>
);

export default ReportPopup;

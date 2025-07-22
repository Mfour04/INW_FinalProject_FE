interface DeleteConfirmPopupProps {
  type: "post" | "comment";
  id: string;
  setConfirmDeleteId: React.Dispatch<React.SetStateAction<string | null>>;
}

const DeleteConfirmPopup: React.FC<DeleteConfirmPopupProps> = ({
  type,
  id,
  setConfirmDeleteId,
}) => (
  <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.3)] backdrop-blur-sm flex items-center justify-center">
    <div className="bg-[#1e1e21] text-white rounded-lg p-6 w-[90%] max-w-md">
      <h3 className="text-lg font-bold mb-4">
        Xác nhận xoá {type === "post" ? "bài viết" : "bình luận"}?
      </h3>
      <div className="flex justify-end gap-3">
        <button
          onClick={() => setConfirmDeleteId(null)}
          className="px-4 py-2 bg-gray-600 rounded"
        >
          Hủy
        </button>
        <button
          onClick={() => {
            console.log(`Deleting ${type}:`, id);
            setConfirmDeleteId(null);
          }}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
        >
          Xoá
        </button>
      </div>
    </div>
  </div>
);

export default DeleteConfirmPopup;

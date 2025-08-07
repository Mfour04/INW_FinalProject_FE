import Button from "../../../components/ButtonComponent";
interface ReportConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
}

const ReportConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
}: ReportConfirmDialogProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[#1a1a1c] p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-lg font-bold text-black dark:text-white mb-4">
          {title}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Bạn có chắc muốn thực hiện hành động này?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-[#2a2a2c] text-gray-600 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-[#3a3a3c]"
          >
            Hủy
          </button>
          <Button
            isLoading={false}
            onClick={onConfirm}
            className="px-4 py-2 bg-[#ff4d4f] text-white rounded hover:bg-[#e63939]"
          >
            Xác nhận
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportConfirmDialog;

import type { Bank } from "../../../entity/bank";

type BankSelectProps = {
  banks: Bank[];
  onSelect: (bank: Bank) => void;
  onClose: () => void;
};

export const BankSelectModal = ({
  banks,
  onSelect,
  onClose,
}: BankSelectProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 ">
      <div className="bg-[#2e2e2e] rounded-md shadow-md w-[800px] max-h-[70vh]">
        {/* Header: luôn hiện */}
        <div className="p-4 border-b border-gray-600 flex justify-between items-center">
          <h3 className="font-semibold text-lg text-white">Chọn ngân hàng</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(70vh-64px)] grid grid-cols-5 gap-4">
          {banks?.map((bank) => (
            <div
              key={bank.id}
              onClick={() => {
                onSelect(bank);
                onClose();
              }}
              className="flex flex-col items-center justify-center gap-2 cursor-pointer p-3  rounded hover:bg-gray-600"
            >
              {bank.logo && (
                <img
                  src={bank.logo}
                  alt={bank.name}
                  className="w-30 h-30 object-contain"
                />
              )}
              <span className="text-center text-sm ">{bank.shortName}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

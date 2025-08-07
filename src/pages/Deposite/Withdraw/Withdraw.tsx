import Coin20 from "../../../assets/img/Transaction/coin-20.png";
import Coin50 from "../../../assets/img/Transaction/coin-50.png";
import Coin100 from "../../../assets/img/Transaction/coin-100.png";
import Coin500 from "../../../assets/img/Transaction/coin-500.png";
import Coin1000 from "../../../assets/img/Transaction/coin-1000.png";
import Pen from "../../../assets/svg/Withdraw/pen-01-stroke-rounded.svg";
import TrashCan from "../../../assets/svg/Withdraw/delete-02-stroke-rounded.svg";
import { WithdrawCard, type Coin } from "./WithdrawCard";
import Button from "../../../components/ButtonComponent";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  CreateBank,
  DeleteBank,
  GetBanks,
  GetUserBanks,
  SetDefaultBank,
} from "../../../api/BankAccount/bank.api";
import { useEffect, useState } from "react";
import type { Bank } from "../../../entity/bank";
import { BankSelectModal } from "./BankSelectModal";
import type {
  CreateBankRequest,
  GetUserBanksRes,
} from "../../../api/BankAccount/bank.type";
import type { WithdrawRequest } from "../../../api/Transaction/transaction.type";
import { WithdrawCoin } from "../../../api/Transaction/transaction.api";
import { useToast } from "../../../context/ToastContext/toast-context";
import { ConfirmModal } from "../../../components/ConfirmModal/ConfirmModal";

const withdrawCoinOptions: Coin[] = [
  { amount: 9000, image: Coin20, price: 10 },
  { amount: 45000, image: Coin50, price: 50 },
  { amount: 90000, image: Coin100, price: 100 },
  { amount: 450000, image: Coin500, price: 500 },
  { amount: 900000, image: Coin1000, price: 1000 },
];

const initialBankForm: CreateBankRequest = {
  bankBin: 0,
  bankCode: "",
  bankShortName: "",
  bankAccountName: "",
  bankAccountNumber: "",
  isDefault: true,
};

export const Withdraw = () => {
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [bankForm, setBankForm] = useState<CreateBankRequest>(initialBankForm);
  const [confirmDefault, setConfirmDefault] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [selectedDefautBankId, setSelectedDefaultBankId] = useState<string>("");
  const [selectedRow, setSelectedRow] = useState<GetUserBanksRes | null>(null);
  const [selectedCoin, setSelectedCoin] = useState<Coin>({
    amount: 0,
    image: "",
    price: 0,
  });

  const toast = useToast();

  const { data: banksData, refetch: banksRefetch } = useQuery({
    queryKey: ["banks"],
    queryFn: () => GetBanks().then((res) => res.data.data),
  });

  const { data: userBanks, refetch: userBanksRefetch } = useQuery({
    queryKey: ["userBanks"],
    queryFn: () => GetUserBanks().then((res) => res.data.data),
  });

  const defaultAccountId =
    userBanks?.find((bank) => bank.isDefault)?.id ?? null;

  const CreateBankMutation = useMutation({
    mutationFn: (request: CreateBankRequest) => CreateBank(request),
    onSuccess: () => {
      banksRefetch();
    },
  });

  const WithdrawMutation = useMutation({
    mutationFn: (request: WithdrawRequest) => WithdrawCoin(request),
    onSuccess: (data) => {
      toast?.onOpen(data.data.message);
    },
  });

  const SetDefaultBankMutation = useMutation({
    mutationFn: (id: string) => SetDefaultBank(id),
    onSuccess: (data) => {
      toast?.onOpen(data.data.message);
      userBanksRefetch();
    },
  });

  const DeleteBankMutation = useMutation({
    mutationFn: (id: string) => DeleteBank(id),
    onSuccess: (data) => {
      toast?.onOpen(data.data.message);
      userBanksRefetch();
      setDeleteModal(false);
    },
  });

  const handleCreateBank = () => {
    CreateBankMutation.mutate(bankForm);
  };

  const handleWithdraw = () => {
    if (defaultAccountId && selectedCoin.amount > 0)
      WithdrawMutation.mutate({
        coinAmount: selectedCoin.price,
        bankAccountId: defaultAccountId,
      });
    else if (!defaultAccountId)
      toast?.onOpen("Bạn chưa đăng ký tài khoản rút tiền mặc định!");
    else if (selectedCoin.price <= 0)
      toast?.onOpen("Hãy chọn số lượng muốn rút!");
  };

  const handleSetDefault = (bankAccountId: string) => {
    setSelectedDefaultBankId(bankAccountId);
    setConfirmDefault(true);
  };

  const handleDeleteBankButtonClick = () => {
    if (!selectedRow) toast?.onOpen("Hãy chọn một tài khoản");
    else setDeleteModal(true);
  };

  const handleConfirmSetDefault = () => {
    if (selectedDefautBankId)
      SetDefaultBankMutation.mutate(selectedDefautBankId);
    setConfirmDefault(false);
  };

  const handleConfirmDeleteModal = () => {
    if (selectedRow) DeleteBankMutation.mutate(selectedRow.id);
  };

  useEffect(() => {
    if (selectedBank) {
      setBankForm((prev) => ({
        ...prev,
        bankBin: Number(selectedBank.bin),
        bankCode: selectedBank.code,
        bankShortName: selectedBank.shortName,
      }));
    }
  }, [selectedBank]);

  return (
    <div className="max-w">
      <div className="flex max-w gap-x-6 h-72">
        <div className="w-[65%] flex flex-col gap-2.5 mb-10">
          <div className="flex items-center justify-between">
            <div>Tài khoản ngân hàng của bạn</div>
            <div className="gap-10">
              <button className="h-7 w-7 rounded bg-[#2e2e2e] hover:bg-[#ff6740] text-black p-1 mr-2">
                <img src={Pen} alt="" />
              </button>
              <button
                onClick={handleDeleteBankButtonClick}
                className="h-7 w-7 rounded bg-[#2e2e2e] hover:bg-[#ff6740] text-black p-1"
              >
                <img src={TrashCan} alt="" />
              </button>
            </div>
          </div>
          <div className="overflow-y-auto max-h-[13.5rem] border rounded border-gray-600">
            <table className="w-full text-sm table-auto border-separate border-spacing-0">
              <thead className="sticky top-0 bg-[#1e1e1e] z-10">
                <tr className="text-left">
                  <th className="px-3 py-2 border-b border-gray-600">STT</th>
                  <th className="px-3 py-2 border-b border-gray-600">
                    NGÂN HÀNG
                  </th>
                  <th className="px-3 py-2 border-b border-gray-600">
                    SỐ TÀI KHOẢN
                  </th>
                  <th className="px-3 py-2 border-b border-gray-600">
                    CHỦ TÀI KHOẢN
                  </th>
                  <th className="px-3 py-2 border-b border-gray-600 text-center">
                    TRẠNG THÁI
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-600">
                {userBanks?.map((acc, index) => (
                  <tr
                    onClick={() => setSelectedRow(acc)}
                    key={index}
                    className={`hover:bg-[#2e2e2e] cursor-pointer ${
                      selectedRow === acc && `bg-gray-600`
                    }`}
                  >
                    <td className="px-3 py-2">{index + 1}</td>
                    <td className="px-3 py-2">{acc.bankShortName}</td>
                    <td className="px-3 py-2">{acc.bankAccountNumber}</td>
                    <td className="px-3 py-2">{acc.bankAccountName}</td>
                    <td className="px-3 py-2">
                      <span
                        onClick={
                          !acc.isDefault
                            ? () => handleSetDefault(acc.id)
                            : undefined
                        }
                        className={`${
                          acc.isDefault
                            ? `bg-green-500`
                            : `bg-gray-600 cursor-pointer`
                        } text-white text-xs text-center font-semibold px-2 h-5.5 py-1 rounded line-clamp-1`}
                      >
                        {acc.isDefault ? `Mặc định` : `Đặt làm mặc định`}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="w-[35%] flex flex-col gap-2.5 mb-10">
          <div>Thêm tài khoản ngân hàng</div>
          <div className="border border-gray-600 p-4 rounded">
            <div className="flex flex-col gap-4">
              <div className="flex h-10 items-center">
                <div className="w-[30%]">Ngân hàng</div>
                <div
                  onClick={() => setShowPopup(true)}
                  className="w-[70%] h-full border border-gray-600 rounded p-2  cursor-pointer line-clamp-1"
                >
                  {selectedBank ? (
                    selectedBank.name
                  ) : (
                    <span className="text-gray-400 ">Chọn ngân hàng</span>
                  )}
                </div>
              </div>
              <div className="flex h-10 items-center">
                <div className="w-[30%]">STK</div>
                <input
                  className="w-[70%] h-full border border-gray-600 rounded p-2"
                  type="text"
                  value={bankForm.bankAccountNumber}
                  onChange={(e) =>
                    setBankForm((prev) => ({
                      ...prev,
                      bankAccountNumber: e.target.value,
                    }))
                  }
                  placeholder="Số tài khoản"
                />
              </div>
              <div className="flex h-10 items-center">
                <div className="w-[30%] line-clamp-1">Chủ tài khoản</div>
                <input
                  className="w-[70%] h-full border border-gray-600 rounded p-2"
                  type="text"
                  value={bankForm.bankAccountName}
                  onChange={(e) =>
                    setBankForm((prev) => ({
                      ...prev,
                      bankAccountName: e.target.value,
                    }))
                  }
                  placeholder="Tên chủ tài khoản"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                className=" w-[70%] border-none bg-[#ff6740] hover:bg-orange-600"
                onClick={handleCreateBank}
                isLoading={CreateBankMutation.isPending}
              >
                Thêm tài khoản
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex gap-5">
          {withdrawCoinOptions.map((coin, index) => (
            <WithdrawCard
              key={index}
              coin={coin}
              selected={selectedCoin?.amount === coin.amount}
              onClick={() => setSelectedCoin(coin)}
            />
          ))}
        </div>
        <div className="mt-10 flex justify-end">
          <Button
            onClick={handleWithdraw}
            isLoading={WithdrawMutation.isPending}
            className="w-fit border-none bg-[#ff6740] hover:bg-orange-600 px-7 font-bold"
            size="lg"
          >
            Rút ngay
          </Button>
        </div>
      </div>

      {showPopup && (
        <BankSelectModal
          banks={banksData!}
          onSelect={(bank) => setSelectedBank(bank)}
          onClose={() => setShowPopup(false)}
        />
      )}

      <ConfirmModal
        isOpen={confirmDefault}
        title="Đặt làm tài khoản mặc định"
        message="Bạn có muốn đặt tài khoản này làm mặc định không?"
        onCancel={() => setConfirmDefault(false)}
        onConfirm={handleConfirmSetDefault}
      />

      <ConfirmModal
        isOpen={deleteModal}
        title="Xóa tài khoản"
        message="Xác nhận xóa tài khoản này ?"
        onCancel={() => setDeleteModal(false)}
        onConfirm={handleConfirmDeleteModal}
      />
    </div>
  );
};

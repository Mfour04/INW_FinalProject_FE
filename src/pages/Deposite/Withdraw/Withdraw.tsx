import Coin20 from "../../../assets/img/Transaction/coin-20.png";
import Coin50 from "../../../assets/img/Transaction/coin-50.png";
import Coin100 from "../../../assets/img/Transaction/coin-100.png";
import Coin500 from "../../../assets/img/Transaction/coin-500.png";
import Coin1000 from "../../../assets/img/Transaction/coin-1000.png";
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
import type {
  CreateBankRequest,
  GetUserBanksRes,
} from "../../../api/BankAccount/bank.type";
import type { WithdrawRequest } from "../../../api/Transaction/transaction.type";
import { WithdrawCoin } from "../../../api/Transaction/transaction.api";
import { useToast } from "../../../context/ToastContext/toast-context";
import { ConfirmModal } from "../../../components/ConfirmModal/ConfirmModal";
import { InlineBankSelect } from "./InlineBankSelect/InlineBankSelect";

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
    <section className="max-w-6xl mx-auto px-3">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-7">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 shadow-md">
            <div className="px-3 py-2 border-b border-zinc-800 flex items-center justify-between">
              <h2 className="text-white font-bold text-sm">
                Tài khoản ngân hàng
              </h2>
              <button
                onClick={handleDeleteBankButtonClick}
                className="h-7 w-7 grid place-items-center rounded-md bg-zinc-800 text-zinc-200 hover:bg-[#ff6740] hover:text-white transition"
                title="Xóa tài khoản"
              >
                <img src={TrashCan} alt="" className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[14rem] overflow-y-auto">
              <table className="w-full text-xs border-separate border-spacing-0">
                <thead className="sticky top-0 z-10 bg-zinc-900 border-b border-zinc-800">
                  <tr className="text-left text-zinc-300">
                    <th className="px-2 py-2">#</th>
                    <th className="px-2 py-2">Ngân hàng</th>
                    <th className="px-2 py-2">Số TK</th>
                    <th className="px-2 py-2">Chủ TK</th>
                    <th className="px-2 py-2 text-center">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {userBanks?.map((acc, index) => (
                    <tr
                      key={acc.id ?? index}
                      onClick={() => setSelectedRow(acc)}
                      className={`cursor-pointer transition hover:bg-zinc-800 ${
                        selectedRow?.id === acc.id ? "bg-zinc-800" : ""
                      }`}
                    >
                      <td className="px-2 py-1 text-zinc-300">{index + 1}</td>
                      <td className="px-2 py-1 text-white">
                        {acc.bankShortName}
                      </td>
                      <td className="px-2 py-1 text-white">
                        {acc.bankAccountNumber}
                      </td>
                      <td className="px-2 py-1 text-white">
                        {acc.bankAccountName}
                      </td>
                      <td className="px-2 py-1">
                        <span
                          onClick={
                            !acc.isDefault
                              ? () => handleSetDefault(acc.id)
                              : undefined
                          }
                          className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                            acc.isDefault
                              ? "bg-emerald-500 text-white"
                              : "bg-zinc-700 text-zinc-100 hover:bg-zinc-600"
                          }`}
                        >
                          {acc.isDefault ? "Mặc định" : "Đặt mặc định"}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {!userBanks?.length && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-2 py-6 text-center text-zinc-400"
                      >
                        Chưa có tài khoản ngân hàng
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 shadow-md">
            <div className="px-3 py-2 border-b border-zinc-800">
              <h3 className="text-white font-bold text-sm">Thêm tài khoản</h3>
            </div>

            <div className="p-3 space-y-3">
              <label className="flex items-center h-8">
                <span className="w-1/3 text-zinc-300 text-xs">Ngân hàng</span>
                <InlineBankSelect
                  value={
                    selectedBank
                      ? {
                          shortName: selectedBank.shortName,
                          logo: selectedBank.logo,
                          bin: selectedBank.bin,
                          code: selectedBank.code,
                        }
                      : null
                  }
                  onSelect={(b) => {
                    setSelectedBank((prev) =>
                      prev
                        ? ({
                            ...prev,
                            shortName: b.shortName,
                            logo: b.logo,
                            bin: b.bin,
                            code: b.code,
                          } as any)
                        : (b as any)
                    );
                  }}
                />
              </label>

              <label className="flex items-center h-8">
                <span className="w-1/3 text-zinc-300 text-xs">STK</span>
                <input
                  className="w-2/3 h-full px-2 rounded-md border border-zinc-700 bg-zinc-800 text-white text-xs placeholder-zinc-500 outline-none focus:border-[#ff6740] transition"
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
              </label>

              <label className="flex items-center h-8">
                <span className="w-1/3 text-zinc-300 text-xs truncate">
                  Chủ TK
                </span>
                <input
                  className="w-2/3 h-full px-2 rounded-md border border-zinc-700 bg-zinc-800 text-white text-xs placeholder-zinc-500 outline-none focus:border-[#ff6740] transition"
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
              </label>

              <div className="pt-1 flex justify-end">
                <Button
                  className="w-2/3 h-8 rounded-md border-none bg-[#ffffff] hover:!bg-[#f5f5f5] text-xs font-bold"
                  onClick={handleCreateBank}
                  isLoading={CreateBankMutation.isPending}
                >
                  Thêm tài khoản
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-8">
        <div className="flex justify-center gap-8">
          {withdrawCoinOptions.slice(0, 3).map((coin, index) => (
            <div key={`top-${index}`} className="w-[180px] sm:w-[200px]">
              <WithdrawCard
                coin={coin}
                selected={selectedCoin?.amount === coin.amount}
                onClick={() => setSelectedCoin(coin)}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-8">
          {withdrawCoinOptions.slice(3, 5).map((coin, index) => (
            <div key={`bottom-${index}`} className="w-[180px] sm:w-[200px]">
              <WithdrawCard
                coin={coin}
                selected={selectedCoin?.amount === coin.amount}
                onClick={() => setSelectedCoin(coin)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          onClick={handleWithdraw}
          isLoading={WithdrawMutation.isPending}
          className="h-9 px-6 text-base font-bold border-none bg-[#ffffff] hover:bg-[#f5f5f5] rounded-xl"
          size="sm"
        >
          Rút ngay
        </Button>
      </div>

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
        message="Xác nhận xóa tài khoản này?"
        onCancel={() => setDeleteModal(false)}
        onConfirm={handleConfirmDeleteModal}
      />
    </section>
  );
};

// src/pages/Transaction/Withdraw/Withdraw.tsx
import Coin20 from "../../../assets/img/Transaction/coin-20.png";
import Coin50 from "../../../assets/img/Transaction/coin-50.png";
import Coin100 from "../../../assets/img/Transaction/coin-100.png";
import { WithdrawCard, type Coin } from "./WithdrawCard";
import Button from "../../../components/ButtonComponent";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  CreateBank,
  DeleteBank,
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
import { WithdrawConfirmModal } from "../../../components/ConfirmModal/WithdrawConfirmModal";
import { Trash2 } from "lucide-react";

/* -------------------------------- utils -------------------------------- */
// Bỏ dấu tiếng Việt + UPPERCASE + chỉ giữ chữ cái/space
const sanitizeAccountName = (raw: string) => {
  const noDiacritics = raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
  const lettersSpaces = noDiacritics.replace(/[^a-zA-Z\s]/g, "");
  return lettersSpaces.toUpperCase();
};
// Chỉ số
const digitsOnly = (raw: string) => raw.replace(/\D+/g, "");

const withdrawCoinOptions: Coin[] = [
  { amount: 50000, image: Coin20, price: 65 },
  { amount: 100000, image: Coin50, price: 130 },
  { amount: 200000, image: Coin100, price: 260 },
  { amount: 500000, image: Coin100, price: 650 },
  { amount: 1000000, image: Coin100, price: 1300 },
  { amount: 2000000, image: Coin100, price: 2600 },
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

  // chọn gói rút + modal xác nhận rút
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [confirmWithdraw, setConfirmWithdraw] = useState(false);

  const toast = useToast();

  const { data: userBanks, refetch: userBanksRefetch } = useQuery({
    queryKey: ["userBanks"],
    queryFn: () => GetUserBanks().then((res) => res.data.data),
  });

  const defaultAccountId =
    userBanks?.find((bank) => bank.isDefault)?.id ?? null;

  const CreateBankMutation = useMutation({
    mutationFn: (request: CreateBankRequest) => CreateBank(request),
    onSuccess: () => {
      toast?.onOpen("Thêm tài khoản ngân hàng thành công");
      userBanksRefetch();
    },
  });

  const WithdrawMutation = useMutation({
    mutationFn: (request: WithdrawRequest) => WithdrawCoin(request),
    onSuccess: (data) => {
      toast?.onOpen(data.data.message);
      setConfirmWithdraw(false);
      setSelectedCoin(null);
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
    if (!selectedCoin) return;
    if (!defaultAccountId) {
      toast?.onOpen("Bạn chưa đăng ký tài khoản rút tiền mặc định!");
      return;
    }
    if (selectedCoin.price <= 0) {
      toast?.onOpen("Hãy chọn số lượng muốn rút!");
      return;
    }
    WithdrawMutation.mutate({
      coinAmount: selectedCoin.price,
      bankAccountId: defaultAccountId,
    });
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
    <div className="flex flex-col flex-1 px-4 md:px-6 py-4 bg-white text-gray-900 dark:bg-[#0b0d11] dark:text-white">
      <div className="max-w-[95rem] mx-auto w-full">
        <div className="grid grid-cols-12 gap-4">
          {/* Bảng tài khoản ngân hàng */}
          <div className="col-span-12 lg:col-span-7">
            <div className="rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="px-3 py-2 border-b border-zinc-200 flex items-center justify-between dark:border-zinc-800">
                <h2 className="text-gray-900 font-bold text-sm dark:text-white">
                  Tài khoản ngân hàng
                </h2>
                <button
                  onClick={handleDeleteBankButtonClick}
                  className={[
                    "h-7 w-7 grid place-items-center rounded-md transition",
                    "bg-zinc-50 text-zinc-600 hover:bg-red-50 hover:text-red-600",
                    "ring-1 ring-zinc-200 hover:ring-red-200",
                    "active:bg-red-100",
                    "dark:bg-zinc-800 dark:text-zinc-300 dark:ring-white/10",
                    "dark:hover:bg-red-500 dark:hover:text-white dark:hover:ring-red-500",
                  ].join(" ")}
                  title="Xóa tài khoản"
                >
                  <Trash2 size={16} strokeWidth={2} />
                </button>
              </div>

              <div className="max-h-[14rem] overflow-y-auto">
                <table className="w-full text-xs border-separate border-spacing-0">
                  <thead className="sticky top-0 z-10 bg-white border-b border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
                    <tr className="text-left text-zinc-600 dark:text-zinc-300">
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
                        className={[
                          "cursor-pointer transition",
                          "hover:bg-zinc-50 dark:hover:bg-zinc-800",
                          selectedRow?.id === acc.id
                            ? "bg-zinc-50 dark:bg-zinc-800"
                            : "",
                        ].join(" ")}
                      >
                        <td className="px-2 py-1 text-zinc-700 dark:text-zinc-300">
                          {index + 1}
                        </td>
                        <td className="px-2 py-1 text-gray-900 dark:text-white">
                          {acc.bankShortName}
                        </td>
                        <td className="px-2 py-1 text-gray-900 dark:text-white">
                          {acc.bankAccountNumber}
                        </td>
                        <td className="px-2 py-1 text-gray-900 dark:text-white">
                          {acc.bankAccountName}
                        </td>
                        <td className="px-2 py-1">
                          <span
                            onClick={
                              !acc.isDefault
                                ? () => handleSetDefault(acc.id)
                                : undefined
                            }
                            className={[
                              "inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[11px] font-medium cursor-pointer",
                              acc.isDefault
                                ? "bg-emerald-500 text-white"
                                : "bg-zinc-200 text-zinc-800 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-600",
                            ].join(" ")}
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
                          className="px-2 py-6 text-center text-zinc-500 dark:text-zinc-400"
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

          {/* Form thêm tài khoản */}
          <div className="col-span-12 lg:col-span-5">
            <div className="rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="px-3 py-2 border-b border-zinc-200 dark:border-zinc-800">
                <h3 className="text-gray-900 font-bold text-sm dark:text-white">
                  Thêm tài khoản
                </h3>
              </div>

              <div className="p-3 space-y-3">
                <label className="flex items-center h-8">
                  <span className="w-1/3 text-zinc-700 text-xs dark:text-zinc-300">
                    Ngân hàng
                  </span>
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
                  <span className="w-1/3 text-zinc-700 text-xs truncate dark:text-zinc-300">
                    STK
                  </span>
                  <input
                    className="w-2/3 h-full px-2 rounded-md border border-zinc-300 bg-white text-gray-900 text-xs placeholder-zinc-400 outline-none focus:border-[#ff6740] transition dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={bankForm.bankAccountNumber}
                    onChange={(e) =>
                      setBankForm((prev) => ({
                        ...prev,
                        bankAccountNumber: digitsOnly(e.target.value),
                      }))
                    }
                    onKeyDown={(e) => {
                      const allowed = [
                        "Backspace",
                        "Delete",
                        "ArrowLeft",
                        "ArrowRight",
                        "Home",
                        "End",
                        "Tab",
                        "Enter",
                      ];
                      if (allowed.includes(e.key)) return;
                      if (!/^\d$/.test(e.key)) e.preventDefault();
                    }}
                    placeholder="Số tài khoản"
                  />
                </label>

                <label className="flex items-center h-8">
                  <span className="w-1/3 text-zinc-700 text-xs truncate dark:text-zinc-300">
                    Chủ TK
                  </span>
                  <input
                    className="w-2/3 h-full px-2 rounded-md border border-zinc-300 bg-white text-gray-900 text-xs placeholder-zinc-400 outline-none focus:border-[#ff6740] transition dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
                    type="text"
                    value={bankForm.bankAccountName}
                    onChange={(e) =>
                      setBankForm((prev) => ({
                        ...prev,
                        bankAccountName: sanitizeAccountName(e.target.value),
                      }))
                    }
                    placeholder="TÊN CHỦ TÀI KHOẢN (KHÔNG DẤU)"
                  />
                </label>

                <div className="pt-1 flex justify-end">
                  <Button
                    className={[
                      "w-2/3 h-9 rounded-md border-none text-white text-xs font-bold",
                      "!bg-gradient-to-r from-[#ff512f] via-[#ff6740] to-[#ff9966]",
                      "hover:from-[#ff6a3d] hover:via-[#ff6740] hover:to-[#ffa177]",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff784f]/60",
                      "inline-flex items-center justify-center gap-2",
                    ].join(" ")}
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

        {/* Chọn gói rút (click = mở modal xác nhận) */}
        <div className="mt-8">
          {/* Grid giống bên Nạp xu: 1 → 2 → 3 → 5 cột, items-stretch để card cao đều */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-4 items-stretch">
            {withdrawCoinOptions.map((coin) => (
              <div key={coin.amount} className="w-full h-full">
                <WithdrawCard
                  coin={coin}
                  selected={selectedCoin?.amount === coin.amount}
                  isLoading={
                    WithdrawMutation.isPending &&
                    selectedCoin?.amount === coin.amount
                  }
                  onClick={() => {
                    if (!defaultAccountId) {
                      toast?.onOpen(
                        "Bạn chưa đăng ký tài khoản rút tiền mặc định!"
                      );
                      return;
                    }
                    setSelectedCoin(coin);
                    setConfirmWithdraw(true);
                  }}
                />
              </div>
            ))}
          </div>

          <p className="mt-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
            * Số xu sẽ bị trừ ngay sau khi yêu cầu rút được xác nhận.
          </p>
        </div>

        {/* Modal xác nhận rút xu */}
        <WithdrawConfirmModal
          isOpen={confirmWithdraw}
          coinAmount={selectedCoin?.price ?? 0}
          vndAmount={selectedCoin?.amount ?? 0}
          onCancel={() => setConfirmWithdraw(false)}
          onConfirm={handleWithdraw}
          loading={WithdrawMutation.isPending}
        />

        {/* Các modal quản lý tài khoản ngân hàng */}
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
      </div>
    </div>
  );
};

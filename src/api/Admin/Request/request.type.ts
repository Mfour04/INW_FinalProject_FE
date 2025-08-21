export const PaymentType = {
  TopUp: 0,
  WithdrawCoin: 1,
  BuyNovel: 2,
  BuyChapter: 3,
} as const;

export type PaymentType = (typeof PaymentType)[keyof typeof PaymentType];

export const PaymentStatus = {
  Pending: 0,
  Completed: 1,
  Cancelled: 2,
  Failed: 3,
  Rejected: 4,
} as const;

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export interface BankInfo {
  bankBin: number;
  bankAccountNumber: number;
  bankAccountName: string;
}

export interface WithdrawRequest {
  id: string;
  requesterId: string;
  bankInfo: BankInfo | null;
  actionById: string | null;
  actionType: "approve" | "reject" | null;
  message: string | null;
  paymentMethod: string;
  type: PaymentType;
  amount: number;
  status: PaymentStatus;
  createdAt: number;
  updatedAt: number;
  completedAt: number;
}

export interface UpdateWithdrawRequestStatusRequest {
  isApproved: boolean;
  message: string;
}

export interface GenerateQRCodeRequest {
  accountNo: number;
  accountName: string;
  acqId: number;
  amount: number;
  addInfo: string;
}

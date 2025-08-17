export type VietQrBank = {
  id: number;
  name: string;
  shortName: string;
  code: string;
  bin: string;
  logo: string;
  transferSupported: number;
};

export type UiBank = {
  shortName: string;
  logo: string;
};

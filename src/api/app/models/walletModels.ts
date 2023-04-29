export interface WalletInfo {
  wallet_id: String;
  user_id: String;
  balance: String;
  state: String;
}

export interface WalletListQuery {
  wallet_id?: String;
  user_id?: String;
  balance?: String;
  state?: String;
  order_by?: String;
  order?: String;
  page?: Number;
  limit?: Number;
}

export interface WalletList {
  wallets: Array<WalletInfo>;
  count: number;
  page: number;
}

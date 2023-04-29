import { request } from '@/utils/request';

import { WalletInfo, WalletList, WalletListQuery } from './models/walletModels';

export function getWalletList(query: WalletListQuery) {
  return request.get<WalletList>({
    url: '/wallets',
    params: query,
  });
}

export function getWalletInfo(walletId: String) {
  return request.get<WalletInfo>({
    url: `/wallets/${walletId}`,
  });
}

export function changeWalletState(walletId: string, state: string) {
  return request.patch({
    url: `/wallets/${walletId}`,
    data: { state },
  });
}

export function withdrawWallet(walletId: string, amount: number) {
  return request.delete({
    url: `/wallets/${walletId}`,
    data: { amount },
  });
}

export function chargeWallet(walletId: string, amount: number) {
  return request.put({
    url: `/wallets/${walletId}`,
    data: { amount },
  });
}

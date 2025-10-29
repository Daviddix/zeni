import { atom } from "jotai";

export const userInfoAtom = atom<userDetailsType | null>(null)
export const showAddTransactionModalAtom = atom<boolean>(false)
import type { CardScheme } from '@/types'

export const ACCEPTED_ISSUERS: { name: string; icon: string }[] = [
  { name: 'ING Bank', icon: 'ING' },
  { name: 'Raiffeisen Bank', icon: 'RIF' },
  { name: 'CEC Bank', icon: 'CEC' },
  { name: 'BRD', icon: 'BRD' },
  { name: 'Banca Transilvania', icon: 'BT' },
  { name: 'BCR', icon: 'BCR' },
  { name: 'Revolut', icon: 'REV' },
]

export const CARD_SCHEMES: CardScheme[] = [
  {
    name: 'American Express',
    pattern: /^3[47]\d{13}$/,
    lengths: [15],
    cvvLengths: [4],
    luhn: true,
  },
  {
    name: 'Mastercard',
    pattern: /^(?:5[1-5]\d{14}|2(?:2[2-9]|[3-6]\d|7[01])\d{12}|2720\d{12})$/,
    lengths: [16],
    cvvLengths: [3],
    luhn: true,
  },
  {
    name: 'Visa',
    pattern: /^4\d{12}(?:\d{3})?(?:\d{3})?$/,
    lengths: [13, 16, 19],
    cvvLengths: [3],
    luhn: true,
  },
  {
    name: 'Discover',
    pattern: /^6(?:011\d{12}|5\d{14}|4[4-9]\d{13}|22(?:1[2-9]|[2-8]\d|9[01]|92[0-5])\d{10})$/,
    lengths: [16],
    cvvLengths: [3],
    luhn: true,
  },
  {
    name: 'Diners Club',
    pattern: /^3(?:0[0-5]|[68]\d)\d{11}$/,
    lengths: [14],
    cvvLengths: [3],
    luhn: true,
  },
  {
    name: 'JCB',
    pattern: /^(?:2131|1800|35\d{3})\d{11}$/,
    lengths: [15, 16],
    cvvLengths: [3],
    luhn: true,
  },
  { name: 'MIR', pattern: /^220[0-4]\d{12}$/, lengths: [16], cvvLengths: [3], luhn: true },
  {
    name: 'UnionPay',
    pattern: /^62\d{14,17}$/,
    lengths: [16, 17, 18, 19],
    cvvLengths: [3],
    luhn: false,
  },
  {
    name: 'Maestro',
    pattern: /^(?:50\d{10,17}|5[6-9]\d{10,17}|6\d{11,18})$/,
    lengths: [12, 13, 14, 15, 16, 17, 18, 19],
    cvvLengths: [3],
    luhn: true,
  },
]

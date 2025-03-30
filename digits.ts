import type { ToNumber, MapNums, Split, Last } from "./utils.ts";

export type NumLike = number | bigint | string;

export type Digits<T extends NumLike> = MapNums<Split<`${T}`>>;
type DigitsExample = Digits<289328>;
//   ^?
type DigitsExampleString = Digits<"12345">;
//   ^?
type DigitsExampleBigInt = Digits<123456789n>;
//   ^?

type TupleLengthN<
  N extends number,
  T extends never[] = []
> = N extends T["length"] ? T : TupleLengthN<N, [...T, never]>;

export type AddDigits<M extends number, N extends number> = [
  ...TupleLengthN<M>,
  ...TupleLengthN<N>
]["length"] &
  number;
type AddDigitsExample = AddDigits<999, 990>;
//     ^?

export type GetCarry<T extends number> =
  `${T}` extends `${infer C}${infer _}${infer _}` ? ToNumber<C> : 0;
type GetCarryExample1 = GetCarry<12>;
//   ^?
type GetCarryExample2 = GetCarry<9>;
//   ^?

export type GetDigit<T extends number> = ToNumber<Last<Split<`${T}`>>>;
type GetDigitExample1 = GetDigit<12>;
//   ^?
type GetDigitExample2 = GetDigit<9>;
//   ^?

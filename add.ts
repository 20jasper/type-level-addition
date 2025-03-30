import type {
  ToNumber,
  MapNums,
  Split,
  Last,
  Pop,
  Join,
  And,
} from "./utils.ts";

namespace Digits {
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
}

type IsZero<T extends number> = T extends 0 ? true : false;
type End<
  Num1 extends number[],
  Num2 extends number[],
  Carry extends 0 | 1 = 0
> = And<And<IsZero<Num1["length"]>, IsZero<Num2["length"]>>, IsZero<Carry>>;

type Adder<
  Num1 extends number[],
  Num2 extends number[],
  Carry extends 0 | 1 = 0,
  Sum extends number = Digits.AddDigits<
    Carry,
    Digits.AddDigits<Last<Num1>, Last<Num2>>
  >
> = End<Num1, Num2, Carry> extends true
  ? []
  : [
      ...Adder<Pop<Num1>, Pop<Num2>, Digits.GetCarry<Sum>>,
      Digits.GetDigit<Sum>
    ];
type AdderExample = Adder<[9, 2, 3, 4], [5, 4, 3, 2]>;
//   ^?

type NumLike = number | bigint | string;

export type Add<M extends NumLike, N extends NumLike> = Adder<
  Digits.Digits<M>,
  Digits.Digits<N>
> extends infer R extends number[]
  ? ToNumber<Join<R>>
  : never;

type AddExample1 = Add<234239, 234230004>;
//    ^?
type AddExample2 = Add<9, 12>;
//    ^?
type AddExample3 = Add<990n, "12">;
//    ^?

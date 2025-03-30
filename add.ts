namespace Utils {
  export type ToNumber<S extends string> = S extends `${infer N extends number}`
    ? N
    : never;
  type ToNumberExample = ToNumber<"123">;
  //   ^?

  export type Last<T extends unknown[], Default = 0> = T extends [
    ...infer _,
    infer L
  ]
    ? L
    : Default;
  type LastExample = Last<[1, 2, 3, 4]>;
  //   ^?
  type LastExampleEmpty = Last<[], 42>;
  //   ^?

  export type Pop<T extends unknown[]> = T extends [...infer Head, infer _]
    ? Head
    : [];
  type PopExample = Pop<[1, 2, 3, 4]>;
  //   ^?
  type PopExampleEmpty = Pop<[]>;
  //   ^?

  type MapNums<T extends [...string[]]> = {
    [K in keyof T]: Utils.ToNumber<T[K]>;
  };
  type MapNumsExample = MapNums<["1", "2", "3"]>;
  //   ^?

  export type Split<S extends string> = S extends `${infer Head}${infer Rest}`
    ? [Head, ...Split<Rest>]
    : [];
  type SplitExample = Split<"12345">;
  //   ^?
  type SplitExampleEmpty = Split<"">;
  //   ^?

  export type Digits<T extends NumLike> = MapNums<Split<`${T}`>>;
  type DigitsExample = Digits<289328>;
  //   ^?
  type DigitsExampleString = Digits<"12345">;
  //   ^?
  type DigitsExampleBigInt = Digits<123456789n>;
  //   ^?

  export type Join<T extends number[]> = T extends [
    infer Head extends number,
    ...infer Rest extends number[]
  ]
    ? `${Head}${Join<Rest>}`
    : "";
  type JoinExample = Join<[1, 2, 3, 4]>;
  //   ^?

  export type And<T, U> = T extends true
    ? U extends true
      ? true
      : false
    : false;
  type AndExampleTrue = And<true, true>;
  //   ^?
  type AndExampleFalse = And<true, false>;
  //   ^?
  type AndExampleBothFalse = And<false, false>;
  //   ^?
}

namespace Digits {
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
    `${T}` extends `${infer C}${infer _}${infer _}` ? Utils.ToNumber<C> : 0;
  type GetCarryExample1 = GetCarry<12>;
  //   ^?
  type GetCarryExample2 = GetCarry<9>;
  //   ^?

  export type GetDigit<T extends number> = Utils.ToNumber<
    Utils.Last<Utils.Split<`${T}`>>
  >;
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
> = Utils.And<
  Utils.And<IsZero<Num1["length"]>, IsZero<Num2["length"]>>,
  IsZero<Carry>
>;

type Adder<
  Num1 extends number[],
  Num2 extends number[],
  Carry extends 0 | 1 = 0,
  Sum extends number = Digits.AddDigits<
    Carry,
    Digits.AddDigits<Utils.Last<Num1>, Utils.Last<Num2>>
  >
> = End<Num1, Num2, Carry> extends true
  ? []
  : [
      ...Adder<Utils.Pop<Num1>, Utils.Pop<Num2>, Digits.GetCarry<Sum>>,
      Digits.GetDigit<Sum>
    ];
type AdderExample = Adder<[9, 2, 3, 4], [5, 4, 3, 2]>;
//   ^?

type NumLike = number | bigint | string;

export type Add<M extends NumLike, N extends NumLike> = Adder<
  Utils.Digits<M>,
  Utils.Digits<N>
> extends infer R extends number[]
  ? Utils.ToNumber<Utils.Join<R>>
  : never;

type AddExample1 = Add<234239, 234230004>;
//    ^?
type AddExample2 = Add<9, 12>;
//    ^?
type AddExample3 = Add<990n, "12">;
//    ^?

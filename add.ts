namespace AddDigits {
  type TupleLengthN<
    N extends number,
    T extends never[] = []
  > = N extends T["length"] ? T : TupleLengthN<N, [...T, never]>;

  export type AddDigits<M extends number, N extends number> = [
    ...TupleLengthN<M>,
    ...TupleLengthN<N>
  ]["length"];

  type example = AddDigits<999, 990>;
  //     ^?
}

namespace Utils {
  export type ToNumber<S extends string> = S extends `${infer N extends number}`
    ? N
    : never;

  export type Last<T extends unknown[], Default = 0> = T extends [
    ...infer _,
    infer L
  ]
    ? L
    : Default;

  export type Pop<T extends unknown[]> = T extends [...infer Head, infer _]
    ? Head
    : [];

  export type MapNums<T extends [...string[]]> = {
    [K in keyof T]: Utils.ToNumber<T[K]>;
  };

  export type Digits<T extends NumLike> = MapNums<Split<`${T}`>>;
  type xxxxx = Digits<289328>;
  //   ^?

  export type Join<T extends number[]> = T extends [
    infer Head extends number,
    ...infer Rest extends number[]
  ]
    ? `${Head}${Join<Rest>}`
    : "";

  export type Split<S extends string> = S extends `${infer Head}${infer Rest}`
    ? [Head, ...Split<Rest>]
    : [];

  export type And<T, U> = T extends true
    ? U extends true
      ? true
      : false
    : false;
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
  Sum extends number = AddDigits.AddDigits<
    Carry,
    AddDigits.AddDigits<Utils.Last<Num1>, Utils.Last<Num2>> & number
  > &
    number
> = End<Num1, Num2, Carry> extends true
  ? []
  : [...Adder<Utils.Pop<Num1>, Utils.Pop<Num2>, GetCarry<Sum>>, GetDigit<Sum>];

type GetCarry<T extends number> =
  `${T}` extends `${infer C}${infer _}${infer _}` ? Utils.ToNumber<C> : 0;
type GetDigit<T extends number> = Utils.ToNumber<
  Utils.Last<Utils.Split<`${T}`>>
>;

type NumLike = number | bigint | string;

export type Add<M extends NumLike, N extends NumLike> = Adder<
  Utils.Digits<M>,
  Utils.Digits<N>
> extends infer R extends number[]
  ? Utils.ToNumber<Utils.Join<R>>
  : never;

type zzzzzz = Add<234239, 234230004>;
//    ^?
type aaaaaa = Add<9, 12>;
//    ^?
type bbbbbb = Add<990, 12>;
//    ^?

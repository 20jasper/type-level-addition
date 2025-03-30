import { AddDigits, Digits, GetCarry, GetDigit, NumLike } from "./digits.ts";
import type { ToNumber, Last, Pop, Join, And } from "./utils.ts";

type IsZero<T extends number> = T extends 0 ? true : false;

type Adder<
  Num1 extends number[],
  Num2 extends number[],
  Carry extends 0 | 1 = 0,
  Sum extends number = AddDigits<Carry, AddDigits<Last<Num1>, Last<Num2>>>
> = And<
  And<IsZero<Num1["length"]>, IsZero<Num2["length"]>>,
  IsZero<Carry>
> extends true
  ? []
  : [...Adder<Pop<Num1>, Pop<Num2>, GetCarry<Sum>>, GetDigit<Sum>];
type AdderExample = Adder<[9, 2, 3, 4], [5, 4, 3, 2]>;
//   ^?

export type Add<M extends NumLike, N extends NumLike> = Adder<
  Digits<M>,
  Digits<N>
> extends infer R extends number[]
  ? ToNumber<Join<R>>
  : never;

type AddExample1 = Add<234239, 234230004>;
//    ^?
type AddExample2 = Add<9, 12>;
//    ^?
type AddExample3 = Add<990n, "12">;
//    ^?

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

export type MapNums<T extends [...string[]]> = {
  [K in keyof T]: ToNumber<T[K]>;
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

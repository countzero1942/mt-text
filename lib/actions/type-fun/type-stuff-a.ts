export type IsStuff<T> = T extends 1 ? 1 : 1;

type IsDateOrBigInt<T> = T extends Date
	? true
	: T extends BigInt
	? true
	: false;

const x1 = new Date();
const x2 = 1000n;
const x3 = "string";
const x4 = true;
const x5 = undefined;
const x6 = null;

type DateOrBigInt = Date | BigInt;

type T1 = IsDateOrBigInt<Date>;
type T2 = IsDateOrBigInt<BigInt>;

type T3 = IsDateOrBigInt<typeof x1>;
type T4 = IsDateOrBigInt<typeof x2>;
type T5 = IsDateOrBigInt<typeof x3>;
type T6 = IsDateOrBigInt<typeof x4>;
type T7 = IsDateOrBigInt<typeof x5>;
type T8 = IsDateOrBigInt<typeof x6>;
type T9 = IsDateOrBigInt<"string">;
type TA = IsDateOrBigInt<DateOrBigInt>;

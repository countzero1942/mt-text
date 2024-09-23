export type IsStuff<T> = T extends 1 ? 1 : 1;

type MyPick<TObj, TKey extends keyof TObj> = {
	[TCurrentKey in TKey]: TObj[TCurrentKey];
};

{
	type X = { a: number; b: boolean; c: string; d: Date };

	type Y = MyPick<X, "b" | "c">;
}

type MyReadonly<TObj> = {
	readonly [TCurrentKey in keyof TObj]: TObj[TCurrentKey];
};

{
	type X = { a: number; b: boolean; readonly c: string; d: Date };

	type Y = MyReadonly<X>;
}

type MyMutable<TObj> = {
	-readonly [TCurrentKey in keyof TObj]: TObj[TCurrentKey];
};

{
	type X = {
		readonly a: number;
		readonly b: boolean;
		readonly c: string;
		d: Date;
	};

	type Y = MyMutable<X>;
}

type MyDeepReadonly<TObj> = {
	readonly [TCurrentKey in keyof TObj]: TObj[TCurrentKey] extends object
		? MyDeepReadonly<TObj[TCurrentKey]>
		: TObj[TCurrentKey];
};

{
	type X = {
		a: number;
		b: boolean;
		c: {
			x: number;
			y: boolean;
			z: {
				foo: string;
				bar: string;
			};
		};
		d: Date;
	};

	type Y = MyDeepReadonly<X>;
}

type ResultA = true extends boolean ? 1 : 0;
//   ?^
type ResultB = boolean extends true ? 1 : 0;

type IsBool<T> = T extends boolean ? true : false;

{
	type T1 = IsBool<true>;
	type T2 = IsBool<false>;
	type T3 = IsBool<0>;
	type T4 = IsBool<1>;
	const fn = (x: number): boolean => {
		return true;
	};
	type T5 = IsBool<ReturnType<typeof fn>>;
}

type IsDate<T> = T extends Date ? true : false;
{
	type T1 = IsDate<Date>;
	type T2 = IsDate<true>;
	type T3 = IsDate<1>;
	type T4 = IsDate<"string">;
}

type IsDateOrBigInt<T> = T extends Date
	? true
	: T extends BigInt
	? true
	: false;

{
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
}

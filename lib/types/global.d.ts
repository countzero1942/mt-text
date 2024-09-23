type Prettify<T> = {
	[K in keyof T]: T[K];
} & {};

type BreakDown<T> = {
	[K in keyof T]: T[K];
} & {};

type Simplify<T> = {
	[K in keyof T]: T[K];
} & {};

type OnlyValueTypesOf<T> = {
	[key: string]: T;
};

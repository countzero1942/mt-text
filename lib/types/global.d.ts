import { log } from "console";

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

interface Generator<T = unknown, TReturn = any, TNext = unknown>
	extends Iterator<T, TReturn, TNext> {
	idSeq<T>(): T;
}

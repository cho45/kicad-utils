/// <reference path="globals/core-js/index.d.ts" />
/// <reference path="globals/node/index.d.ts" />

interface Array<T> {
	find(predicate: (search: T) => boolean) : T;
}

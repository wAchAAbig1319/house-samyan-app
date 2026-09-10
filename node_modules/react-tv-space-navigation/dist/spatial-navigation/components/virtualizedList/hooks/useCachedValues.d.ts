/**
 * Basically a useMemo for an array that creates elements on the go (not all at the beginning).
 *
 * The input & output might seem similar -> the difference is that
 * - input `nthElementConstructor` always returns a new instance of the Nth element
 * - output`getNthMemoizedElement` always return the same instance of the Nth element (memoized).
 *
 * @warning nthElementConstructor should never change
 *
 * @param nthElementConstructor a callback that returns what we want the Nth element to be.
 * @returns a callback to get the Nth memoized element.
 */
export declare const useCachedValues: <T>(nthElementConstructor: (n: number) => T) => (n: number) => T;

import { ScrollBehavior } from '../VirtualizedList';
/**
 * This function precomputes all scroll offsets
 * It won't move until data moves or the itemSize changes
 */
export declare const computeAllScrollOffsets: <T>({ itemSize, nbMaxOfItems, numberOfItemsVisibleOnScreen, scrollBehavior, data, listSizeInPx, maxPossibleLeftAlignedIndex, maxPossibleRightAlignedIndex, }: {
    itemSize: number | ((item: T) => number);
    nbMaxOfItems: number;
    numberOfItemsVisibleOnScreen: number;
    scrollBehavior: ScrollBehavior;
    data: T[];
    listSizeInPx: number;
    maxPossibleLeftAlignedIndex: number;
    maxPossibleRightAlignedIndex: number;
}) => number[];

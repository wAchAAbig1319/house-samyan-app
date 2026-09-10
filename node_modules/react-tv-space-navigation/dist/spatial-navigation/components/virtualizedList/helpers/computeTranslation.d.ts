import { ScrollBehavior } from '../VirtualizedList';
export declare const computeTranslation: <T>({ currentlyFocusedItemIndex, itemSizeInPx, nbMaxOfItems, numberOfItemsVisibleOnScreen, scrollBehavior, data, listSizeInPx, maxPossibleLeftAlignedIndex, maxPossibleRightAlignedIndex, }: {
    currentlyFocusedItemIndex: number;
    itemSizeInPx: number | ((item: T) => number);
    nbMaxOfItems: number;
    numberOfItemsVisibleOnScreen: number;
    scrollBehavior: ScrollBehavior;
    data: T[];
    listSizeInPx: number;
    maxPossibleLeftAlignedIndex: number;
    maxPossibleRightAlignedIndex: number;
}) => number;

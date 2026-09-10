/// <reference types="react" />
import { ViewStyle } from 'react-native';
import { ItemWithIndex } from '../virtualizedList/VirtualizedList';
import { PointerScrollProps, SpatialNavigationVirtualizedListWithScrollProps } from '../virtualizedList/SpatialNavigationVirtualizedListWithScroll';
type SpatialNavigationVirtualizedGridProps<T extends ItemWithIndex> = Pick<SpatialNavigationVirtualizedListWithScrollProps<T>, 'data' | 'renderItem' | 'onEndReached' | 'style' | 'nbMaxOfItems' | 'scrollBehavior' | 'scrollDuration' | 'testID'> & PointerScrollProps & {
    itemHeight: number;
    header?: JSX.Element;
    headerSize?: number;
    /** How many rows are RENDERED (virtualization size) */
    numberOfRenderedRows: number;
    /** How many rows are visible on screen (helps with knowing how to slice our data and to stop the scroll at the end of the list) */
    numberOfRowsVisibleOnScreen: number;
    /** Number of rows left to display before triggering onEndReached */
    onEndReachedThresholdRowsNumber?: number;
    /** Number of columns in the grid OR number of items per rows */
    numberOfColumns: number;
    /** Used to modify every row style */
    rowContainerStyle?: ViewStyle;
};
export type GridRowType<T extends ItemWithIndex> = {
    items: T[];
    index: number;
};
/**
 * Use this component to render spatially navigable grids of items.
 * Grids only support vertical orientation (vertically scrollable),
 * but you can navigate between elements in any direction.
 *
 * A grid is a series of horizontal rows rendering 'numberOfColumns' items.
 *
 * ```
 * ┌───────────────────────────────────────────────────┐
 * │                  Screen                           │
 * │                                                   │
 * │ ┌───────────────────────────────────────────────┐ │
 * │ │ Row1                                          │ │
 * │ │                                               │ │
 * │ │ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │ │
 * │ │ │      │ │      │ │      │ │      │ │      │  │ │
 * │ │ │  A   │ │  B   │ │  C   │ │  D   │ │   E  │  │ │
 * │ │ │      │ │      │ │      │ │      │ │      │  │ │
 * │ │ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘  │ │
 * │ │                                               │ │
 * │ └───────────────────────────────────────────────┘ │
 * │                                                   │
 * │ ┌───────────────────────────────────────────────┐ │
 * │ │ Row2                                          │ │
 * │ │                                               │ │
 * │ │ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │ │
 * │ │ │      │ │      │ │      │ │      │ │      │  │ │
 * │ │ │   A  │ │  B   │ │  C   │ │  D   │ │  E   │  │ │
 * │ │ │      │ │      │ │      │ │      │ │      │  │ │
 * │ │ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘  │ │
 * │ │                                               │ │
 * │ └───────────────────────────────────────────────┘ │
 * │                                                   │
 * └───────────────────────────────────────────────────┘
 *   ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
 *     Row3                                          │
 *   │
 *     ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │
 *   │ │      │ │      │ │      │ │      │ │      │
 *     │   A  │ │  B   │ │  C   │ │  D   │ │  E   │  │
 *   │ │      │ │      │ │      │ │      │ │      │
 *     └──────┘ └──────┘ └──────┘ └──────┘ └──────┘  │
 *   │
 *   └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
 * ```
 * The row framed in dotted lines corresponds to a virtualized component.
 * There is no virtualization inside rows.
 */
export declare const SpatialNavigationVirtualizedGrid: (<T extends ItemWithIndex>({ renderItem, data, numberOfColumns, itemHeight, header, headerSize, numberOfRenderedRows, numberOfRowsVisibleOnScreen, onEndReachedThresholdRowsNumber, nbMaxOfItems, rowContainerStyle, ...props }: SpatialNavigationVirtualizedGridProps<T>) => import("react/jsx-runtime").JSX.Element) & {
    displayName?: string | undefined;
};
export {};

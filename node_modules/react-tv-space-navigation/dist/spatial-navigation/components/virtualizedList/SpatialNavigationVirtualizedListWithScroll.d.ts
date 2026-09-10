import { ItemWithIndex } from './VirtualizedList';
import { SpatialNavigationVirtualizedListWithVirtualNodesProps } from './SpatialNavigationVirtualizedListWithVirtualNodes';
import { ViewStyle } from 'react-native';
import React from 'react';
import { SpatialNavigationVirtualizedListRef } from '../../types/SpatialNavigationVirtualizedListRef';
export type SpatialNavigationVirtualizedListWithScrollProps<T> = Omit<SpatialNavigationVirtualizedListWithVirtualNodesProps<T>, 'currentlyFocusedItemIndex'>;
export type PointerScrollProps = {
    descendingArrow?: React.ReactElement;
    descendingArrowContainerStyle?: ViewStyle;
    ascendingArrow?: React.ReactElement;
    ascendingArrowContainerStyle?: ViewStyle;
    scrollInterval?: number;
};
/**
 * This component wraps every item of a virtualizedList in a scroll handling context.
 */
export declare const SpatialNavigationVirtualizedListWithScroll: (<T extends ItemWithIndex>(props: SpatialNavigationVirtualizedListWithScrollProps<T> & PointerScrollProps & React.RefAttributes<SpatialNavigationVirtualizedListRef>) => React.ReactElement<any, string | React.JSXElementConstructor<any>> | null) & {
    displayName?: string | undefined;
};

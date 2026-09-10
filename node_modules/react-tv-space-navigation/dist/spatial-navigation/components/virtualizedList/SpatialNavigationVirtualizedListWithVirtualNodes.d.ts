import { VirtualizedListProps, ItemWithIndex } from './VirtualizedList';
export type SpatialNavigationVirtualizedListWithVirtualNodesProps<T> = Omit<VirtualizedListProps<T>, 'listSizeInPx'> & {
    isGrid?: boolean;
};
export type SpatialNavigationVirtualizedListWithVirtualNodesRef = {
    getNthVirtualNodeID: (index: number) => string;
};
/**
 * This component wraps every item of the VirtualizedList inside a Virtual Node.
 *
 * Virtual Nodes make the list more resilient to data changes.
 *
 * If the data changes, virtual nodes always wrap each elements for the spatial navigator to never lose track of the elements.
 * The strategy is to have as many virtual LRUD nodes as the amount data. For a N length array, we have N virtualized nodes. Even after pagination.
 * These virtual nodes are really helpful to never lose track of the navigation, especially if there is a refresh of the data and the array is shuffled.
 * ```
 *                       ┌───────────────────────────────────────┐
 *                       │                Screen                 │
 *                       │                                       │
 *                       │                                       │
 * ┌─────┐  ┌─────┐  ┌───┼─┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐ │┌─────┐  ┌─────┐
 * │  1  │  │  2  │  │  3│ │  │  4  │  │  5  │  │  6  │  │  7  │ ││  8  │  │  9  │
 * │     │  │┌───┐│  │┌──┼┐│  │┌───┐│  │┌───┐│  │┌───┐│  │┌───┐│ ││┌───┐│  │     │
 * │  A  │  ││ B ││  ││ C│││  ││ D ││  ││ E ││  ││ F ││  ││ G ││ │││ H ││  │  I  │
 * │     │  │└───┘│  │└──┼┘│  │└───┘│  │└───┘│  │└───┘│  │└───┘│ ││└───┘│  │     │
 * └─────┘  └─────┘  └───┼─┘  └─────┘  └─────┘  └─────┘  └─────┘ │└─────┘  └─────┘
 *                       │                                       │
 *                       └───────────────────────────────────────┘
 * ```
 * Framed letters correspond to rendered components.
 */
export declare const SpatialNavigationVirtualizedListWithVirtualNodes: (<T extends ItemWithIndex>(props: Omit<VirtualizedListProps<T>, "listSizeInPx"> & {
    isGrid?: boolean | undefined;
} & {
    getNodeIdRef: React.Ref<SpatialNavigationVirtualizedListWithVirtualNodesRef>;
}) => import("react/jsx-runtime").JSX.Element) & {
    displayName?: string | undefined;
};

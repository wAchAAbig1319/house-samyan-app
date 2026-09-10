import { ItemWithIndex, VirtualizedListProps } from './VirtualizedList';
/**
 * This component has for only purpose to give to the VirtualizedList its actual
 * width and height. It is used to avoid the VirtualizedList to render with a width
 * or height not defined (as it is used later for computing offsets for example).
 * The size is computed only once and then the VirtualizedList is rendered. This
 * doesn't support dynamic size changes.
 */
export declare const VirtualizedListWithSize: (<T extends ItemWithIndex>(props: Omit<VirtualizedListProps<T>, "listSizeInPx">) => import("react/jsx-runtime").JSX.Element) & {
    displayName?: string | undefined;
};

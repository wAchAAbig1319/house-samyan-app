import { GridRowType } from '../SpatialNavigationVirtualizedGrid';
import { ItemWithIndex } from '../../virtualizedList/VirtualizedList';
import { NodeOrientation } from '../../../types/orientation';
export declare const convertToGrid: <T extends ItemWithIndex>(data: T[], numberOfColumns: number, header?: JSX.Element) => GridRowType<T>[];
export declare const invertOrientation: (orientation: NodeOrientation) => NodeOrientation;

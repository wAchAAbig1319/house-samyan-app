/// <reference types="react" />
import { ViewStyle } from 'react-native';
import { SpatialNavigationNodeRef } from '../types/SpatialNavigationNodeRef';
type Props = {
    children: React.ReactNode;
    style?: ViewStyle;
    direction: 'horizontal' | 'vertical';
    alignInGrid?: boolean;
};
export declare const SpatialNavigationView: import("react").ForwardRefExoticComponent<Props & import("react").RefAttributes<SpatialNavigationNodeRef>>;
export {};

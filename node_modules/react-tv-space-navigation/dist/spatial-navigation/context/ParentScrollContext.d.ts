import { RefObject } from 'react';
import { View } from 'react-native';
export type ScrollToNodeCallback = (ref: RefObject<View>, additionalOffset?: number) => void;
export declare const SpatialNavigatorParentScrollContext: import("react").Context<ScrollToNodeCallback>;
export declare const useSpatialNavigatorParentScroll: () => {
    scrollToNodeIfNeeded: ScrollToNodeCallback;
};

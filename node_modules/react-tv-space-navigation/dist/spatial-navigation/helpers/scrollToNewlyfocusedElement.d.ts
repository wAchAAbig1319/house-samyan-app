import { RefObject } from 'react';
import { ScrollView } from 'react-native';
export type Props = {
    newlyFocusedElementDistanceToLeftRelativeToLayout: number;
    newlyFocusedElementDistanceToTopRelativeToLayout: number;
    horizontal?: boolean;
    offsetFromStart: number;
    scrollViewRef: RefObject<ScrollView>;
};
export declare const scrollToNewlyFocusedElement: ({ newlyFocusedElementDistanceToLeftRelativeToLayout, newlyFocusedElementDistanceToTopRelativeToLayout, horizontal, offsetFromStart, scrollViewRef, }: Props) => void;

/// <reference types="react" />
import SpatialNavigator, { OnDirectionHandledWithoutMovement } from '../SpatialNavigator';
type SpatialNavigatorHookParams = {
    onDirectionHandledWithoutMovementRef: React.MutableRefObject<OnDirectionHandledWithoutMovement>;
};
export declare const useCreateSpatialNavigator: ({ onDirectionHandledWithoutMovementRef, }: SpatialNavigatorHookParams) => SpatialNavigator;
export {};

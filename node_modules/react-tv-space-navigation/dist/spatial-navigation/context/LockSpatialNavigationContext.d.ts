/// <reference types="react" />
export declare const useIsLocked: () => {
    isLocked: boolean;
    lockActions: {
        lock: () => void;
        unlock: () => void;
    };
};
export declare const LockSpatialNavigationContext: import("react").Context<{
    lock: () => void;
    unlock: () => void;
}>;
export declare const useLockSpatialNavigation: () => {
    lock: () => void;
    unlock: () => void;
};

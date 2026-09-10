import { ReactNode } from 'react';
import { OnDirectionHandledWithoutMovement } from '../SpatialNavigator';
type Props = {
    /**
     * Determines if the spatial navigation is active.
     * If false, the spatial navigation will be locked, and no nodes can be focused.
     * This is useful to handle a multi page app: you can disable the non-focused pages' spatial navigation roots.
     *
     * Note: this is a little redundant with the lock system, but it's useful to have a way to disable the spatial navigation from above AND from below.
     */
    isActive?: boolean;
    /**
     * Called when you're reaching a border of the navigator.
     * A use case for this would be the implementation of a side menu
     * that's shared between pages. You can have a separate navigator
     * for your side menu, which would be common across pages, and you'd
     * make this menu active when you reach the left side of your page navigator.
     */
    onDirectionHandledWithoutMovement?: OnDirectionHandledWithoutMovement;
    children: ReactNode;
};
export declare const SpatialNavigationRoot: ({ isActive, onDirectionHandledWithoutMovement, children, }: Props) => import("react/jsx-runtime").JSX.Element;
export {};

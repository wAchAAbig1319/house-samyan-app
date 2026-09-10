/**
 * This function is used to compute the index of the last item that allows the end of the list to fully fit in the screen.
 * It is used when scrolling on stick-to-start mode.
 *
 * ```
 *      ┌───────────────────────────────────────┐
 *      │                Screen                 │
 *      │                                       │
 *      │                                       │
 *  ┌───┼─┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐ │
 *  │  3│ │  │  4  │  │  5  │  │  6  │  │  7  │ │
 *  │┌──┼┐│  │┌───┐│  │┌───┐│  │┌───┐│  │┌───┐│ │
 *  ││ C│││  ││ D ││  ││ E ││  ││ F ││  ││ G ││ │
 *  │└──┼┘│  │└───┘│  │└───┘│  │└───┘│  │└───┘│ │
 *  └───┼─┘  └─────┘  └─────┘  └─────┘  └─────┘ │
 *      │                                       │
 *      └───────────────────────────────────────┘
 * ```
 *
 * In this case the last item that allows the end of the list to fully fit in the screen is item 4, so the
 * scroll in stick-to-start mode will be stopped after item 4, to keep
 * item 4 to 7 in the screen.
 *
 */
export declare const getLastLeftItemIndex: <T>(data: T[], itemSizeInPx: number | ((item: T) => number), listSizeInPx: number) => number;
/**
 *
 * This function is used to compute the index of the last item that fits in the screen when at the beginning of a list.
 * It is used when scrolling on stick-to-end mode to know when to start or stop scrolling
 *
 * ```
 *  ┌───────────────────────────────────────┐
 *  │                Screen                 │
 *  │                                       │
 *  │                                       │
 *  │ ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─┼───┐
 *  │ │  1  │  │  2  │  │  3  │  │  4  │  │ │5  │
 *  │ │┌───┐│  │┌───┐│  │┌───┐│  │┌───┐│  │┌┼──┐│
 *  │ ││ A ││  ││ B ││  ││ C ││  ││ D ││  │││E ││
 *  │ │└───┘│  │└───┘│  │└───┘│  │└───┘│  │└┼──┘│
 *  │ └─────┘  └─────┘  └─────┘  └─────┘  └─┼───┘
 *  │                                       │
 *  └───────────────────────────────────────┘
 * ```
 *
 * In this case the last item that fits in the screen is item 4, so the
 * scroll in stick-to-end mode will be computed after item 4, to keep
 * item 5 (and the followings) on the right of the screen.
 *
 */
export declare const getLastRightItemIndex: <T>(data: T[], itemSizeInPx: number | ((item: T) => number), listSizeInPx: number) => number;

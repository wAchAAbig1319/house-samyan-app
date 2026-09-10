export declare enum SupportedKeys {
    Up = "Up",
    Down = "Down",
    Left = "Left",
    Right = "Right",
    Enter = "Enter",
    Back = "Back"
}
declare class TestRemoteControlManager {
    private eventEmitter;
    handleUp: () => void;
    handleDown: () => void;
    handleLeft: () => void;
    handleRight: () => void;
    handleEnter: () => void;
    handleBackSpace: () => void;
    addKeydownListener: (listener: (event: SupportedKeys) => void) => (event: SupportedKeys) => void;
    removeKeydownListener: (listener: (event: SupportedKeys) => void) => void;
}
declare const _default: TestRemoteControlManager;
export default _default;

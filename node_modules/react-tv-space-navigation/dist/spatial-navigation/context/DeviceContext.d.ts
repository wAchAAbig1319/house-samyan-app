/// <reference types="react" />
/// <reference types="node" />
type Device = 'remoteKeys' | 'remotePointer';
interface DeviceContextProps {
    /** Use `deviceType` only if you need a render, otherwise use `deviceTypeRef` */
    deviceType: Device;
    /** Use `deviceTypeRef` for user events or if you don't need render, otherwise use `deviceType` */
    deviceTypeRef: React.MutableRefObject<Device>;
    setDeviceType: (deviceType: Device) => void;
    getScrollingIntervalId: () => NodeJS.Timer | null;
    setScrollingIntervalId: (scrollingId: NodeJS.Timer | null) => void;
}
export declare const DeviceContext: import("react").Context<DeviceContextProps>;
interface DeviceProviderProps {
    children: React.ReactNode;
}
export declare const SpatialNavigationDeviceTypeProvider: ({ children }: DeviceProviderProps) => import("react/jsx-runtime").JSX.Element;
export declare const useSpatialNavigationDeviceType: () => DeviceContextProps;
export {};

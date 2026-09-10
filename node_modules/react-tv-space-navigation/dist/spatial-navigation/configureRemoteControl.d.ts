import { Direction } from '@bam.tech/lrud';
type SubscriberType = any;
export interface RemoteControlConfiguration {
    remoteControlSubscriber: (lrudCallback: (direction: Direction | null) => void) => SubscriberType;
    remoteControlUnsubscriber: (subscriber: SubscriberType) => void;
}
export declare let remoteControlSubscriber: RemoteControlConfiguration['remoteControlSubscriber'] | undefined;
export declare let remoteControlUnsubscriber: RemoteControlConfiguration['remoteControlUnsubscriber'] | undefined;
export declare const configureRemoteControl: (options: RemoteControlConfiguration) => void;
export {};

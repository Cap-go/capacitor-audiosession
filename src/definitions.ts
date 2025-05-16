import type { PluginListenerHandle } from '@capacitor/core';

export enum RouteChangeReasons {
  NEW_DEVICE_AVAILABLE = 'new-device-available',
  OLD_DEVICE_UNAVAILABLE = 'old-device-unavailable',
  CATEGORY_CHANGE = 'category-change',
  OVERRIDE = 'override',
  WAKE_FROM_SLEEP = 'wake-from-sleep',
  NO_SUITABLE_ROUTE_FOR_CATEGORY = 'no-suitable-route-for-category',
  ROUTE_CONFIGURATION_CHANGE = 'route-config-change',
  UNKNOWN = 'unknown',
}

export enum InterruptionTypes {
  BEGAN = 'began',
  ENDED = 'ended',
}

export enum AudioSessionPorts {
  AIR_PLAY = 'airplay',
  BLUETOOTH_LE = 'bluetooth-le',
  BLUETOOTH_HFP = 'bluetooth-hfp',
  BLUETOOTH_A2DP = 'bluetooth-a2dp',
  BUILT_IN_SPEAKER = 'builtin-speaker',
  BUILT_IN_RECEIVER = 'builtin-receiver',
  HDMI = 'hdmi',
  HEADPHONES = 'headphones',
  LINE_OUT = 'line-out',
}

export type OverrideResult = {
  success: boolean;
  message: string;
};

export type OutputOverrideType = 'default' | 'speaker';

export type RouteChangeListener = (reason: RouteChangeReasons) => void;
export type InterruptionListener = (type: InterruptionTypes) => void;
export interface AudioSessionPlugin {
  currentOutputs(): Promise<AudioSessionPorts[]>;
  overrideOutput(type: OutputOverrideType): Promise<OverrideResult>;
  addListener(
    eventName: 'routeChanged',
    listenerFunc: RouteChangeListener,
  ): Promise<PluginListenerHandle>;
  addListener(
    eventName: 'interruption',
    listenerFunc: InterruptionListener,
  ): Promise<PluginListenerHandle>;
}

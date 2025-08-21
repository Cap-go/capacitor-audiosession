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

/**
 * Available audio output routes on iOS.
 */
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

/**
 * Result of an output override request.
 */
export type OverrideResult = {
  success: boolean;
  message: string;
};

/**
 * Output override type.
 * - `default`: Use the system-selected route.
 * - `speaker`: Force playback through the built-in speaker.
 */
export type OutputOverrideType = 'default' | 'speaker';

/**
 * Listener called when the audio route changes.
 */
export type RouteChangeListener = (reason: RouteChangeReasons) => void;
/**
 * Listener called when the audio session is interrupted or ends.
 */
export type InterruptionListener = (type: InterruptionTypes) => void;
/**
 * iOS-only plugin to query and control the audio session output and listen to
 * route changes and interruptions.
 */
export interface AudioSessionPlugin {
  /**
   * Get the current active audio output routes.
   *
   * On web and non-iOS platforms, this resolves to an empty array.
   */
  currentOutputs(): Promise<AudioSessionPorts[]>;
  /**
   * Override the current audio output route.
   *
   * Use `speaker` to force playback through the built-in speaker, or
   * `default` to restore the system-selected route.
   *
   * @param type The desired output override type.
   */
  overrideOutput(type: OutputOverrideType): Promise<OverrideResult>;
  /**
   * Listen for audio route changes (e.g. headset connected/disconnected).
   *
   * @param eventName The route change event name.
   * @param listenerFunc Callback invoked with the route change reason.
   */
  addListener(
    eventName: 'routeChanged',
    listenerFunc: RouteChangeListener,
  ): Promise<PluginListenerHandle>;
  /**
   * Listen for audio session interruptions (e.g. incoming call) and their end.
   *
   * @param eventName The interruption event name.
   * @param listenerFunc Callback invoked with the interruption type.
   */
  addListener(
    eventName: 'interruption',
    listenerFunc: InterruptionListener,
  ): Promise<PluginListenerHandle>;
}

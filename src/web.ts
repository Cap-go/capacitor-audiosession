import { WebPlugin } from '@capacitor/core';

import type { AudioSessionPlugin, AudioSessionPorts, OutputOverrideType, OverrideResult } from './definitions';

export class AudioSessionWeb extends WebPlugin implements AudioSessionPlugin {
  async currentOutputs(): Promise<AudioSessionPorts[]> {
    console.log('AudioSessionPlugin.currentOutputs()', 'only available on a iOS device.');

    return [];
  }

  async overrideOutput(type: OutputOverrideType): Promise<OverrideResult> {
    console.log(`AudioSessionPlugin.currentOutputs(${type})`, 'only available on a iOS device.');

    return {
      success: false,
      message: '',
    };
  }

  async getPluginVersion(): Promise<{ version: string }> {
    return { version: 'web' };
  }
}

import { CapacitorUpdater } from '@capgo/capacitor-updater';
import { Capacitor, type PluginListenerHandle } from '@capacitor/core';
import {
  AudioSession,
  type InterruptionTypes,
  type RouteChangeReasons,
} from '@capgo/capacitor-audio-session';

import './style.css';

const platformChip = document.getElementById('platform-chip');
const supportChip = document.getElementById('support-chip');
const unsupportedPanel = document.getElementById('unsupported-panel');
const iosPanel = document.getElementById('ios-panel');
const outputsList = document.getElementById('outputs-list');
const refreshOutputsButton = document.getElementById('refresh-outputs');
const overrideSpeakerButton = document.getElementById('override-speaker');
const overrideDefaultButton = document.getElementById('override-default');
const getVersionButton = document.getElementById('get-version');
const eventLog = document.getElementById('event-log');
const pluginOutput = document.getElementById('plugin-output');
const listenerStatus = document.getElementById('listener-status');
const clearLogButton = document.getElementById('clear-log');

const isIosNative = Capacitor.getPlatform() === 'ios';

let routeListener: PluginListenerHandle | undefined;
let interruptionListener: PluginListenerHandle | undefined;

const formatPlatformLabel = (): string => {
  const platform = Capacitor.getPlatform();
  if (Capacitor.isNativePlatform()) {
    return `Native ${platform}`;
  }
  return `Web (${platform})`;
};

const setOutput = (value: unknown): void => {
  if (!pluginOutput) {
    return;
  }
  pluginOutput.textContent = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
};

const appendLog = (line: string): void => {
  if (!eventLog) {
    return;
  }
  const stamp = new Date().toLocaleTimeString();
  const prefix = eventLog.textContent?.startsWith('Waiting') ? '' : `${eventLog.textContent}\n`;
  eventLog.textContent = `${prefix}[${stamp}] ${line}`;
  eventLog.scrollTop = eventLog.scrollHeight;
};

const renderOutputs = (ports: string[]): void => {
  if (!outputsList) {
    return;
  }
  outputsList.replaceChildren();
  if (!ports.length) {
    const item = document.createElement('li');
    item.className = 'muted';
    item.textContent = 'No active routes reported (empty array).';
    outputsList.append(item);
    return;
  }
  for (const port of ports) {
    const item = document.createElement('li');
    item.textContent = port;
    outputsList.append(item);
  }
};

const setListenerBadge = (active: boolean): void => {
  if (!listenerStatus) {
    return;
  }
  listenerStatus.textContent = active ? 'Listeners active' : 'Listeners idle';
  listenerStatus.dataset.active = String(active);
};

const refreshOutputs = async (): Promise<void> => {
  try {
    const outputs = await AudioSession.currentOutputs();
    renderOutputs(outputs);
    setOutput({ currentOutputs: outputs });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    setOutput(`Error: ${message}`);
  }
};

const overrideOutput = async (type: 'speaker' | 'default'): Promise<void> => {
  try {
    const result = await AudioSession.overrideOutput(type);
    setOutput({ overrideOutput: type, result });
    await refreshOutputs();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    setOutput(`Error: ${message}`);
  }
};

const fetchVersion = async (): Promise<void> => {
  try {
    const result = await AudioSession.getPluginVersion();
    setOutput(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    setOutput(`Error: ${message}`);
  }
};

const startListeners = async (): Promise<void> => {
  if (!isIosNative || routeListener || interruptionListener) {
    return;
  }
  try {
    routeListener = await AudioSession.addListener('routeChanged', (reason: RouteChangeReasons) => {
      appendLog(`routeChanged: ${reason}`);
    });
    interruptionListener = await AudioSession.addListener('interruption', (type: InterruptionTypes) => {
      appendLog(`interruption: ${type}`);
    });
    setListenerBadge(true);
    appendLog('Subscribed to routeChanged and interruption.');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    appendLog(`Listener error: ${message}`);
  }
};

const applyPlatformUi = (): void => {
  if (platformChip) {
    platformChip.textContent = formatPlatformLabel();
  }
  if (supportChip) {
    supportChip.textContent = isIosNative ? 'iOS APIs enabled' : 'iOS only plugin';
    supportChip.classList.toggle('chip-ok', isIosNative);
    supportChip.classList.toggle('chip-muted', !isIosNative);
  }
  if (unsupportedPanel) {
    unsupportedPanel.classList.toggle('hidden', isIosNative);
  }
  if (iosPanel) {
    iosPanel.classList.toggle('dimmed', !isIosNative);
  }
  const iosOnlyButtons = [refreshOutputsButton, overrideSpeakerButton, overrideDefaultButton];
  for (const button of iosOnlyButtons) {
    if (button instanceof HTMLButtonElement) {
      button.disabled = !isIosNative;
    }
  }
};

applyPlatformUi();

refreshOutputsButton?.addEventListener('click', () => {
  void refreshOutputs();
});

overrideSpeakerButton?.addEventListener('click', () => {
  void overrideOutput('speaker');
});

overrideDefaultButton?.addEventListener('click', () => {
  void overrideOutput('default');
});

getVersionButton?.addEventListener('click', () => {
  void fetchVersion();
});

clearLogButton?.addEventListener('click', () => {
  if (eventLog) {
    eventLog.textContent = 'Log cleared.';
  }
});

if (isIosNative) {
  void startListeners();
  void refreshOutputs();
} else {
  void fetchVersion();
}

if (Capacitor.isNativePlatform()) {
  CapacitorUpdater.notifyAppReady().catch((error) => {
    console.error('Capgo notifyAppReady failed', error);
  });
}

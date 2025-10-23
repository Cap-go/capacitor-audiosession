# @capgo/capacitor-plugin-audiosession
 <a href="https://capgo.app/"><img src='https://raw.githubusercontent.com/Cap-go/capgo/main/assets/capgo_banner.png' alt='Capgo - Instant updates for capacitor'/></a>

<div align="center">
  <h2><a href="https://capgo.app/?ref=plugin"> ➡️ Get Instant updates for your App with Capgo</a></h2>
  <h2><a href="https://capgo.app/consulting/?ref=plugin"> Missing a feature? We’ll build the plugin for you 💪</a></h2>
</div>


**This plugin works on iOS only.**

This plugin is a port of <https://github.com/saghul/cordova-plugin-audioroute> and allows iOS applications to get notified about audio session interruptions and route changes (for example when a headset is connected). To query and override the audio device in use is also supported.

## Install

```bash
npm install @capgo/capacitor-plugin-audiosession
npx cap sync
```

For now this plugin works only in Capacitor 4.0+.

## API

<docgen-index>

* [`currentOutputs()`](#currentoutputs)
* [`overrideOutput(...)`](#overrideoutput)
* [`addListener('routeChanged', ...)`](#addlistenerroutechanged-)
* [`addListener('interruption', ...)`](#addlistenerinterruption-)
* [`getPluginVersion()`](#getpluginversion)
* [Interfaces](#interfaces)
* [Type Aliases](#type-aliases)
* [Enums](#enums)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

iOS-only plugin to query and control the audio session output and listen to
route changes and interruptions.

### currentOutputs()

```typescript
currentOutputs() => Promise<AudioSessionPorts[]>
```

Get the current active audio output routes.

On web and non-iOS platforms, this resolves to an empty array.

**Returns:** <code>Promise&lt;AudioSessionPorts[]&gt;</code>

--------------------


### overrideOutput(...)

```typescript
overrideOutput(type: OutputOverrideType) => Promise<OverrideResult>
```

Override the current audio output route.

Use `speaker` to force playback through the built-in speaker, or
`default` to restore the system-selected route.

| Param      | Type                                                              | Description                       |
| ---------- | ----------------------------------------------------------------- | --------------------------------- |
| **`type`** | <code><a href="#outputoverridetype">OutputOverrideType</a></code> | The desired output override type. |

**Returns:** <code>Promise&lt;<a href="#overrideresult">OverrideResult</a>&gt;</code>

--------------------


### addListener('routeChanged', ...)

```typescript
addListener(eventName: 'routeChanged', listenerFunc: RouteChangeListener) => Promise<PluginListenerHandle>
```

Listen for audio route changes (e.g. headset connected/disconnected).

| Param              | Type                                                                | Description                                    |
| ------------------ | ------------------------------------------------------------------- | ---------------------------------------------- |
| **`eventName`**    | <code>'routeChanged'</code>                                         | The route change event name.                   |
| **`listenerFunc`** | <code><a href="#routechangelistener">RouteChangeListener</a></code> | Callback invoked with the route change reason. |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

--------------------


### addListener('interruption', ...)

```typescript
addListener(eventName: 'interruption', listenerFunc: InterruptionListener) => Promise<PluginListenerHandle>
```

Listen for audio session interruptions (e.g. incoming call) and their end.

| Param              | Type                                                                  | Description                                  |
| ------------------ | --------------------------------------------------------------------- | -------------------------------------------- |
| **`eventName`**    | <code>'interruption'</code>                                           | The interruption event name.                 |
| **`listenerFunc`** | <code><a href="#interruptionlistener">InterruptionListener</a></code> | Callback invoked with the interruption type. |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

--------------------


### getPluginVersion()

```typescript
getPluginVersion() => Promise<{ version: string; }>
```

Get the native Capacitor plugin version

**Returns:** <code>Promise&lt;{ version: string; }&gt;</code>

--------------------


### Interfaces


#### PluginListenerHandle

| Prop         | Type                                      |
| ------------ | ----------------------------------------- |
| **`remove`** | <code>() =&gt; Promise&lt;void&gt;</code> |


### Type Aliases


#### OverrideResult

Result of an output override request.

<code>{ success: boolean; message: string; }</code>


#### OutputOverrideType

Output override type.
- `default`: Use the system-selected route.
- `speaker`: Force playback through the built-in speaker.

<code>'default' | 'speaker'</code>


#### RouteChangeListener

Listener called when the audio route changes.

<code>(reason: <a href="#routechangereasons">RouteChangeReasons</a>): void</code>


#### InterruptionListener

Listener called when the audio session is interrupted or ends.

<code>(type: <a href="#interruptiontypes">InterruptionTypes</a>): void</code>


### Enums


#### AudioSessionPorts

| Members                 | Value                           |
| ----------------------- | ------------------------------- |
| **`AIR_PLAY`**          | <code>'airplay'</code>          |
| **`BLUETOOTH_LE`**      | <code>'bluetooth-le'</code>     |
| **`BLUETOOTH_HFP`**     | <code>'bluetooth-hfp'</code>    |
| **`BLUETOOTH_A2DP`**    | <code>'bluetooth-a2dp'</code>   |
| **`BUILT_IN_SPEAKER`**  | <code>'builtin-speaker'</code>  |
| **`BUILT_IN_RECEIVER`** | <code>'builtin-receiver'</code> |
| **`HDMI`**              | <code>'hdmi'</code>             |
| **`HEADPHONES`**        | <code>'headphones'</code>       |
| **`LINE_OUT`**          | <code>'line-out'</code>         |


#### RouteChangeReasons

| Members                              | Value                                         |
| ------------------------------------ | --------------------------------------------- |
| **`NEW_DEVICE_AVAILABLE`**           | <code>'new-device-available'</code>           |
| **`OLD_DEVICE_UNAVAILABLE`**         | <code>'old-device-unavailable'</code>         |
| **`CATEGORY_CHANGE`**                | <code>'category-change'</code>                |
| **`OVERRIDE`**                       | <code>'override'</code>                       |
| **`WAKE_FROM_SLEEP`**                | <code>'wake-from-sleep'</code>                |
| **`NO_SUITABLE_ROUTE_FOR_CATEGORY`** | <code>'no-suitable-route-for-category'</code> |
| **`ROUTE_CONFIGURATION_CHANGE`**     | <code>'route-config-change'</code>            |
| **`UNKNOWN`**                        | <code>'unknown'</code>                        |


#### InterruptionTypes

| Members     | Value                |
| ----------- | -------------------- |
| **`BEGAN`** | <code>'began'</code> |
| **`ENDED`** | <code>'ended'</code> |

</docgen-api>

## License

MIT


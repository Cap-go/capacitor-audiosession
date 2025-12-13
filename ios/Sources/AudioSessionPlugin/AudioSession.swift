import Foundation
import Capacitor
import AVKit

var audioSessionOverrideTypes: [AVAudioSession.PortOverride: String] = [
    .none: "none",
    .speaker: "speaker"
]

var audioSessionRouteChangeReasons: [AVAudioSession.RouteChangeReason: String] = [
    .newDeviceAvailable: "new-device-available",
    .oldDeviceUnavailable: "old-device-unavailable",
    .categoryChange: "category-change",
    .override: "override",
    .wakeFromSleep: "wake-from-sleep",
    .noSuitableRouteForCategory: "no-suitable-route-for-category",
    .routeConfigurationChange: "route-config-change",
    .unknown: "unknown"
]

var audioSessionInterruptionTypes: [AVAudioSession.InterruptionType: String] = [
    .began: "began",
    .ended: "ended"
]

var audioSessionPorts: [AVAudioSession.Port: String] = [
    .airPlay: "airplay",
    .bluetoothLE: "bluetooth-le",
    .bluetoothHFP: "bluetooth-hfp",
    .bluetoothA2DP: "bluetooth-a2dp",
    .builtInSpeaker: "builtin-speaker",
    .builtInReceiver: "builtin-receiver",
    .HDMI: "hdmi",
    .headphones: "headphones",
    .lineOut: "line-out"
]

public typealias AudioSessionRouteChangeObserver = (String) -> Void
public typealias AudioSessionInterruptionObserver = (String) -> Void
public typealias AudioSessionOverrideCallback = (Bool, String?, Bool?) -> Void

public class AudioSession: NSObject {

    var routeChangeObserver: AudioSessionRouteChangeObserver?
    var interruptionObserver: AudioSessionInterruptionObserver?

    var currentOverride: String?

    public func load() {
        let notificationCenter = NotificationCenter.default

        notificationCenter.addObserver(self,
                       selector: #selector(self.handleRouteChange),
                       name: AVAudioSession.routeChangeNotification,
                       object: nil)

        notificationCenter.addObserver(self,
                       selector: #selector(self.handleInterruption),
                       name: AVAudioSession.interruptionNotification,
                       object: AVAudioSession.sharedInstance)
    }

    // EVENTS

    @objc func handleRouteChange(notification: Notification) {
        guard let userInfo = notification.userInfo,
              let reasonValue = userInfo[AVAudioSessionRouteChangeReasonKey] as? UInt,
              let reasonType = AVAudioSession.RouteChangeReason(rawValue: reasonValue) else { return }
        let readableReason = audioSessionRouteChangeReasons[reasonType] ?? "unknown"

        CAPLog.print("AudioSession.handleRouteChange() changed to \(readableReason)")

        self.routeChangeObserver?(readableReason)
    }

    @objc func handleInterruption(notification: Notification) {
        guard let userInfo = notification.userInfo,
              let interruptValue = userInfo[AVAudioSessionInterruptionTypeKey] as? UInt,
              let interruptType = AVAudioSession.InterruptionType(rawValue: interruptValue) else { return }
        let readableInterrupt = audioSessionInterruptionTypes[interruptType] ?? "unknown"

        CAPLog.print("AudioSession.handleInterruption() interrupted status to \(readableInterrupt)")

        self.interruptionObserver?(readableInterrupt)
    }

    // METHODS

    public func currentOutputs() -> [String?] {
        let outputs = AVAudioSession.sharedInstance().currentRoute.outputs.map({audioSessionPorts[$0.portType]})

        return outputs
    }

    public func overrideOutput(output: String, callback: @escaping AudioSessionOverrideCallback) {
        if output == "unknown" {
            return callback(false, "No valid output provided...", nil)
        }

        if self.currentOverride == output {
            return callback(true, nil, nil)
        }

        // make it async, cause in latest IOS it started to take ~1 sec and produce UI thread blocking issues
        DispatchQueue.global(qos: .utility).async {
            let session = AVAudioSession.sharedInstance()

            // make sure the AVAudioSession is properly configured
            do {
                try session.setActive(true)
                try session.setCategory(AVAudioSession.Category.playAndRecord, options: AVAudioSession.CategoryOptions.duckOthers)
            } catch {
                CAPLog.print("AudioSession.overrideOutput() error setting sessions settings.")
                callback(false, "Error setting sessions settings.", true)
                return
            }

            do {
                if output == "speaker" {
                    try session.overrideOutputAudioPort(.speaker)
                } else {
                    try session.overrideOutputAudioPort(.none)
                }

                self.currentOverride = output

                CAPLog.print("currentOverride: " + (self.currentOverride ?? "") + " - " + output)

                callback(true, nil, nil)
            } catch {
                CAPLog.print("AudioSession.overrideOutput() could not override output port.")
                callback(false, "Could not override output port.", true)
            }
        }
    }
}

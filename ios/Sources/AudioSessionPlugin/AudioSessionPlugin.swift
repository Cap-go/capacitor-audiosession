import Foundation
import Capacitor

@objc(AudioSessionPlugin)
public class AudioSessionPlugin: CAPPlugin {
    private let implementation = AudioSession()

    override public func load() {

        implementation.load()

        implementation.interruptionObserver = { [weak self] interrupt in
            self?.notifyListeners("interruption", data: [
                "type": interrupt
            ])
        }

        implementation.routeChangeObserver = { [weak self] reason in
            self?.notifyListeners("routeChanged", data: [
                "reason": reason
            ])
        }
    }

    @objc func currentOutputs(_ call: CAPPluginCall) {
        let outputs = implementation.currentOutputs()

        call.resolve([
            "outputs": outputs
        ])
    }

    @objc func overrideOutput(_ call: CAPPluginCall) {
        let output = call.getString("type") ?? "unknown"

        implementation.overrideOutput(_output: output) { (success, message, error) -> Void in
            if error == true {
                call.reject(message ?? "")
            } else {
                call.resolve([
                    "success": success,
                    "message": message ?? ""
                ])
            }
        }
    }
}

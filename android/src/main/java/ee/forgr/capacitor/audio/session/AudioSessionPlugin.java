package ee.forgr.capacitor.audio.session;

import android.content.Intent;
import android.os.Build;
import android.util.Log;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.util.HashMap;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

@CapacitorPlugin(name = "AudioSession")
public class AudioSessionPlugin extends Plugin {
    private final String PLUGIN_VERSION = "7.1.3";

    public static String LOG_TAG = "CapgoAudioSession";

    @PluginMethod
    public void currentOutputs(PluginCall call) {
        call.resolve();
    }

    @PluginMethod
    public void overrideOutput(PluginCall call) {
        call.resolve();
    }


    @PluginMethod
    public void getPluginVersion(final PluginCall call) {
        try {
            final JSObject ret = new JSObject();
            ret.put("version", this.PLUGIN_VERSION);
            call.resolve(ret);
        } catch (final Exception e) {
            call.reject("Could not get plugin version", e);
        }
    }

}

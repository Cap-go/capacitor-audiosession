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

    public static String LOG_TAG = "CapgoAudioSession";

    @PluginMethod
    public void currentOutputs(PluginCall call) {
        call.resolve();
    }

    @PluginMethod
    public void overrideOutput(PluginCall call) {
        call.resolve();
    }

}

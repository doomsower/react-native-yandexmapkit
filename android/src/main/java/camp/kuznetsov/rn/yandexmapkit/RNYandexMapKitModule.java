
package camp.kuznetsov.rn.yandexmapkit;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class RNYandexMapKitModule extends ReactContextBaseJavaModule {

    private String mApiKey;

    public RNYandexMapKitModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "RNYandexMapKit";
    }

    @ReactMethod
    public void setApiKey(String apiKey) {
        this.mApiKey = apiKey;
    }

    public String getApiKey() {
        return mApiKey;
    }

}
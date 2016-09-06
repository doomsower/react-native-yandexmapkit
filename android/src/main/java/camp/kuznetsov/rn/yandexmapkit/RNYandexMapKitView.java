package camp.kuznetsov.rn.yandexmapkit;

import android.content.Context;
import android.util.AttributeSet;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import ru.yandex.yandexmapkit.MapController;
import ru.yandex.yandexmapkit.MapView;
import ru.yandex.yandexmapkit.map.GeoCode;
import ru.yandex.yandexmapkit.map.GeoCodeListener;
import ru.yandex.yandexmapkit.map.MapEvent;
import ru.yandex.yandexmapkit.map.OnMapListener;
import ru.yandex.yandexmapkit.utils.GeoPoint;

public class RNYandexMapKitView extends MapView implements OnMapListener, GeoCodeListener {

    public static final String MAP_EVENT = "onMapEvent";
    public static final String GEOCODING_EVENT = "onGeocodingEvent";
    private Boolean mGeocodingEnabled = false;

    public RNYandexMapKitView(Context context, String s) {
        super(context, s);
        this.getMapController().addMapListener(this);
    }

    public RNYandexMapKitView(Context context, AttributeSet attributeSet) {
        super(context, attributeSet);
    }

    @Override
    public void onMapActionEvent(MapEvent mapEvent) {
        MapController controller = getMapController();
        GeoPoint mapCenter = controller.getMapCenter();
        WritableMap payload = Arguments.createMap();
        int msg = mapEvent.getMsg();
        payload.putInt("type", msg);
        payload.putDouble("lat", mapCenter.getLat());
        payload.putDouble("lon", mapCenter.getLon());
        payload.putDouble("zoom", controller.getZoomCurrent());
        ReactContext reactContext = (ReactContext) getContext();
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(this.getId(), MAP_EVENT, payload);

        if (mGeocodingEnabled && msg == MapEvent.MSG_SCALE_END || msg == MapEvent.MSG_SCROLL_END || msg == MapEvent.MSG_ZOOM_END){
            controller.getDownloader().getGeoCode(this, mapCenter);
        }
    }

    public void setGeocodingEnabled(Boolean geocodingEnabled) {
        this.mGeocodingEnabled = geocodingEnabled;
    }

    @Override
    public boolean onFinishGeoCode(GeoCode geoCode) {
        WritableMap payload = Arguments.createMap();
        payload.putString("displayName", geoCode.getDisplayName());
        payload.putString("kind", geoCode.getKind());
        payload.putString("title", geoCode.getTitle());
        payload.putString("subtitle", geoCode.getSubtitle());
        WritableMap point = Arguments.createMap();
        GeoPoint geoPoint = geoCode.getGeoPoint();
        point.putDouble("lat", geoPoint.getLat());
        point.putDouble("lon", geoPoint.getLon());
        payload.putMap("point", point);

        ReactContext reactContext = (ReactContext) getContext();
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(this.getId(), GEOCODING_EVENT, payload);
        return true;
    }
}
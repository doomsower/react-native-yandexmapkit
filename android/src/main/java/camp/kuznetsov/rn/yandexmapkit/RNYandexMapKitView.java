package camp.kuznetsov.rn.yandexmapkit;

import android.content.Context;
import android.graphics.Rect;
import android.util.AttributeSet;
import android.util.Log;

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
import ru.yandex.yandexmapkit.utils.ScreenPoint;

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
        int msg = mapEvent.getMsg();

        if (mGeocodingEnabled && msg == MapEvent.MSG_SCALE_END || msg == MapEvent.MSG_SCROLL_END || msg == MapEvent.MSG_ZOOM_END){
            controller.getDownloader().getGeoCode(this, mapCenter);
        }

        Rect viewport = controller.getViewport();
        if (viewport.width() == 0 || viewport.height() == 0)
            return;

        GeoPoint topLeft = controller.getGeoPoint(new ScreenPoint(viewport.left, viewport.top));
        GeoPoint bottomRight = controller.getGeoPoint(new ScreenPoint(viewport.right, viewport.bottom));
        double latDelta = Math.abs(bottomRight.getLat() - topLeft.getLat());
        double lonDelta = Math.abs(bottomRight.getLon() - topLeft.getLon());

        WritableMap payload = Arguments.createMap();
        payload.putInt("type", msg);
        payload.putDouble("latitude",  mapCenter.getLat());
        payload.putDouble("longitude", mapCenter.getLon());
        payload.putDouble("latitudeDelta", latDelta);
        payload.putDouble("longitudeDelta", lonDelta);
        ReactContext reactContext = (ReactContext) getContext();
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(this.getId(), MAP_EVENT, payload);

    }

    public void setGeocodingEnabled(Boolean geocodingEnabled) {
        this.mGeocodingEnabled = geocodingEnabled;
    }

    @Override
    public boolean onFinishGeoCode(GeoCode geoCode) {
        if (geoCode != null) {
            WritableMap payload = Arguments.createMap();
            payload.putString("displayName", geoCode.getDisplayName());
            payload.putString("kind", geoCode.getKind());
            payload.putString("title", geoCode.getTitle());
            payload.putString("subtitle", geoCode.getSubtitle());
            WritableMap point = Arguments.createMap();
            GeoPoint geoPoint = geoCode.getGeoPoint();
            point.putDouble("latitude", geoPoint.getLat());
            point.putDouble("longitude", geoPoint.getLon());
            payload.putMap("point", point);

            ReactContext reactContext = (ReactContext) getContext();
            reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(this.getId(), GEOCODING_EVENT, payload);
        }
        return true;
    }
}
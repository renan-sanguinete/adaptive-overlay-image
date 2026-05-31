package com.adaptiveoverlayimage;

import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class AmbientLightSensorModule extends ReactContextBaseJavaModule implements SensorEventListener {

    private static final String MODULE_NAME = "AmbientLightSensor";
    private static final String EVENT_NAME = "AmbientLightSensorChanged";

    private final ReactApplicationContext reactContext;
    private final SensorManager sensorManager;
    private final Sensor lightSensor;

    private boolean isObserving = false;
    private int listenerCount = 0;

    public AmbientLightSensorModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.sensorManager = (SensorManager) reactContext.getSystemService(Context.SENSOR_SERVICE);
        this.lightSensor = sensorManager != null ? sensorManager.getDefaultSensor(Sensor.TYPE_LIGHT) : null;
    }

    @NonNull
    @Override
    public String getName() {
        return MODULE_NAME;
    }

    @ReactMethod
    public void start() {
        if (sensorManager == null || lightSensor == null || isObserving) return;

        sensorManager.registerListener(this, lightSensor, SensorManager.SENSOR_DELAY_NORMAL);
        isObserving = true;
    }

    @ReactMethod
    public void stop() {
        if (sensorManager == null || !isObserving) return;

        sensorManager.unregisterListener(this);
        isObserving = false;
    }

    @ReactMethod
    public void addListener(String eventName) {
        listenerCount += 1;
    }

    @ReactMethod
    public void removeListeners(double count) {
        listenerCount -= (int) count;

        if (listenerCount <= 0) {
            listenerCount = 0;
            stop();
        }
    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        if (event == null || event.values == null || event.values.length == 0) return;

        WritableMap payload = Arguments.createMap();
        payload.putDouble("illuminance", event.values[0]);

        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(EVENT_NAME, payload);
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {
        // No-op.
    }

    @Override
    public void invalidate() {
        stop();
        super.invalidate();
    }
}

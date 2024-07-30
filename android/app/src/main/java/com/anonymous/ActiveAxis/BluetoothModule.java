package com.anonymous.ActiveAxis;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;

import java.util.Set;

public class BluetoothModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public BluetoothModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "BluetoothModule";
    }

    @ReactMethod
    public void getPairedDevices(Promise promise) {
        BluetoothAdapter bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        if (bluetoothAdapter == null) {
            promise.reject("BLUETOOTH_NOT_SUPPORTED", "Bluetooth is not supported on this device");
            return;
        }

        Set<BluetoothDevice> pairedDevices = bluetoothAdapter.getBondedDevices();
        WritableArray deviceArray = new WritableNativeArray();

        for (BluetoothDevice device : pairedDevices) {
            WritableNativeMap deviceMap = new WritableNativeMap();
            deviceMap.putString("name", device.getName());
            deviceMap.putString("address", device.getAddress());
            deviceArray.pushMap(deviceMap);
        }

        promise.resolve(deviceArray);
    }
}

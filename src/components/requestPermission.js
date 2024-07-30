import { PermissionsAndroid } from 'react-native';

export async function requestPermissions() {
  try {
    const coarseLocationGranted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION, {
        title: 'Location Permission',
        message: 'This app requires location permission to scan for Bluetooth devices.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );

    console.log('coarseLocationGranted');
    console.log(coarseLocationGranted);

    const fineLocationGranted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
        title: 'Location Permission',
        message: 'This app requires location permission to scan for Bluetooth devices.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );

    console.log('fineLocationGranted');
    console.log(fineLocationGranted);


    const bluetoothConnectGranted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT, {
        title: 'Bluetooth Connect Permission',
        message: 'This app requires Bluetooth connect permission to connect to devices.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );

    console.log('bluetoothConnectGranted');
    console.log(bluetoothConnectGranted);

    const bluetoothScanGranted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN, {
        title: 'Bluetooth Scan Permission',
        message: 'This app requires Bluetooth scan permission to scan for devices.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );

    console.log('bluetoothScanGranted');
    console.log(bluetoothScanGranted);

    // <uses-permission android:name="android.permission.BODY_SENSORS" />

    const bodySensorsGranted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BODY_SENSORS, {
        title: 'Body Sensors Permission',
        message: 'This app requires body sensors permission to access wearable devices.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );

    console.log('bodySensorsGranted');
    console.log(bodySensorsGranted);

    if (
      coarseLocationGranted === PermissionsAndroid.RESULTS.GRANTED &&
      fineLocationGranted === PermissionsAndroid.RESULTS.GRANTED &&
      bluetoothConnectGranted === PermissionsAndroid.RESULTS.GRANTED &&
      bluetoothScanGranted === PermissionsAndroid.RESULTS.GRANTED &&
      bodySensorsGranted === PermissionsAndroid.RESULTS.GRANTED
    ) {
      console.log('All permissions granted');
      return true;
    } else {
      console.log('Some permissions were not granted');
      return false;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
}

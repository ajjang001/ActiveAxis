
import { View, Text, Button, FlatList, PermissionsAndroid, Platform, ToastAndroid, ActivityIndicator, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { scale } from "../../components/scale";
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

const SmartWearablePage = () => {

  return(
    <View style={styles.container}>
      <Text>Smart Wearable Page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      
    },
    device: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    scannedDataView:{
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    }
  });

export default SmartWearablePage;


// import { View, Text, Button, FlatList, PermissionsAndroid, Platform, ToastAndroid, ActivityIndicator, StyleSheet, TouchableOpacity, Alert } from 'react-native';
// import { scale } from "../../components/scale";
// import { requestPermissions } from "../../components/requestPermission";
// import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
// import { useIsFocused } from '@react-navigation/native';
// import { BleManager } from 'react-native-ble-plx';
// import { LoadingDialog, MessageDialog } from "../../components/Modal";




// const SmartWearablePage = ({route, navigation}) => {
//     // initialize BleManager
//     const manager = new BleManager();

//     const scannedDevices = useMemo(() => [], []);
//     const [isScanning, setIsScanning] = useState(false);

//     const checkBluetooth = useCallback(async () => {
//       try{
//         // Check if Bluetooth is enabled
//         const isEnabled = await manager.state();
//         if (isEnabled !== 'PoweredOn') {
//           Alert.alert('Bluetooth is not enabled');
//           return false;
//         }
//         return true;
//       }catch(error){
//         console.log(error);
//         return false;
//       }
//     }, []);
    
//     const startDeviceScanning = useCallback(async () =>{
//       try{
//         // Check if Bluetooth is enabled
//         const isEnabled = await checkBluetooth();

//         if (!isEnabled) {
//           return;
//         }

//         // Request permission to access location on Android
//         const permission = requestPermissions();
//         // console.log(permission);
//         if (!permission) {
//           return;
//         }


//       setIsScanning(true);

//       // set scanned Devices to empty array
//       scannedDevices.length = 0;
//       manager.startDeviceScan(null,null, (error, scannedDevice) =>{
//         if (error) {
//           console.error(error);
//           return;
//         }
  
//         if (!scannedDevice.name || !scannedDevice) {
//           return;
//         }

//         // console.log('Device found: ' + scannedDevice.name);
  
        
  
//         if (!scannedDevices.find((storedDevice) => scannedDevice.id === storedDevice.id)){
//             // console.log('Device found: ' + scannedDevice.name);
//             console.log(scannedDevice.name);
//             // get device uid
//             console.log(scannedDevice.id);
//             // console.log(scannedDevice.name.toLowerCase().includes('watch'));
//             scannedDevices.push(scannedDevice);
//             console.log('\n');
//         }
//     });
  
//     setTimeout(()=>{
//         manager.stopDeviceScan();
//         setIsScanning(false);
//     }, 20000);
//   }catch(error){
//     console.log(error);
//   }
  
//     }, [scannedDevices]);


  
//     const actionOnTap = async (item) => {
//       console.log('Connecting to device: ' + item.name);
//       let device;
//       try {
//         device = await manager.connectToDevice(item.id);
//         console.log("Connected to device: " + item.id);
//         console.log("status connected: " + device.isConnected());

//         await device.discoverAllServicesAndCharacteristics();
//         const services = await device.services();

//         console.log(services);
    
//         services.forEach((service) => {
//           console.log("Service UUID:", service.uuid);
//         });
//       } catch (error) {
//         // Handle error
//         console.log(error);
        
//       }finally {
//         // Disconnect from the device

//         // wait for 20 seconds
//         setTimeout(async () => {
//           if(device){
//             try {
//               await manager.cancelDeviceConnection(item.id);
//               console.log("Disconnected from device:", item.id);
//             } catch (error) {
//               console.log("Error disconnecting:", error);
//             }
//           }
//         }, 20000);

//         // if (device) {
//         //   try {
//         //     await manager.cancelDeviceConnection(item.id);
//         //     console.log("Disconnected from device:", item.id);
//         //   } catch (error) {
//         //     console.log("Error disconnecting:", error);
//         //   }
//         // }
//       }
//     };

  
//     return (
//       <View style={styles.container}>
//         <View style = {styles.scannedDataView}>
//           <Text>Scanned Devices</Text>
//         </View>
//         <Button title="Scan for Devices" onPress={startDeviceScanning} />
//         {isScanning && <ActivityIndicator size="large" color="#0000ff" />}
//         <FlatList
//           data={scannedDevices}
//           keyExtractor={(item) => item.id}
//           renderItem={({ item }) => (
//             <TouchableOpacity style={styles.device} onPress={() => actionOnTap(item)}>
//               <Text>{item.name}</Text>
//               <Text>{item.id}</Text>
//             </TouchableOpacity>
//           )}
//         />
//       </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       padding: 20,
      
//     },
//     device: {
//       padding: 10,
//       borderBottomWidth: 1,
//       borderBottomColor: '#ccc',
//     },
//     scannedDataView:{
//       alignItems: 'center',
//       justifyContent: 'center',
//       width: '100%',
//     }
//   });

// export default SmartWearablePage;
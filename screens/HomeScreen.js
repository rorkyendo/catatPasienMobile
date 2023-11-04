// screens/HomeScreen.js
import React, { useEffect } from 'react';
import { View, Text, Pressable, Image, BackHandler } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as FileSystem from 'expo-file-system';
import XLSX from 'xlsx';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../firebaseConfig';
import * as Sharing from 'expo-sharing';

const HomeScreen = ({ navigation }) => {

  const fetchDataFromFirestore = async () => {
    const db = getFirestore(app);
    const dataRef = collection(db, 'dataPasien'); // Replace 'data' with your Firestore collection name
    const querySnapshot = await getDocs(dataRef);
    const data = querySnapshot.docs.map((doc) => doc.data());
    return data;
  };

  const exportToExcel = async () => {
    const dataFromFirestore = await fetchDataFromFirestore();
  
    // Define the order of keys for the exported data
    const orderedKeys = [
      'nik',
      'nama',
      'tempat_lahir',
      'tgl_lahir',
      'goldar',
      'pekerjaan',
      'jenkel',
      'alamat',
      'kelurahan',
      'kecamatan',
      'agama',
      'fileKtp',
      'createdAt',
    ];
  
    // Map the data to a new array of objects with ordered keys
    const wsData = dataFromFirestore.map(item => {
      const orderedItem = {};
      orderedKeys.forEach(key => {
        orderedItem[key] = item[key];
      });
      return orderedItem;
    });
  
    const ws = XLSX.utils.json_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
    const wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      type: 'base64',
    });
  
    const uri = FileSystem.cacheDirectory + 'data.xlsx';
  
    await FileSystem.writeAsStringAsync(uri, wbout, {
      encoding: FileSystem.EncodingType.Base64,
    });
  
    await Sharing.shareAsync(uri, { mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', dialogTitle: 'Share this file' });
  };

  return (
    <SafeAreaProvider>
      <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor:"#008B8B", width:"100%",height:"30%",borderBottomEndRadius:60,borderBottomLeftRadius:60}}>
        <Text style={{color:"white", alignItems: 'center',fontSize:18,fontWeight:'bold'}}>PENCATATAN PERSERTA VAKSINASI</Text>
        <Text style={{color:"white", alignItems: 'center',fontSize:18,fontWeight:'bold'}}>COVID-19 PUSKESMAS PUJIDADI</Text>
      </View>
      <View style={{flexDirection:"row",margin:30,paddingTop:140,position:"absolute"}}>
        <Pressable style={{marginRight:10}}
            onPress={()=>{
              navigation.navigate("Catat Peserta");
            }}
          >
          <View style={{backgroundColor:"white",width:160,height:160,borderRadius:30,justifyContent: 'center', alignItems: 'center'}}>
            <Image source={require("../assets/add.png")}/>
            <Text style={{color:"black",fontWeight:"bold"}}>Catat Peserta</Text>
          </View>
        </Pressable>
        <Pressable style={{marginLeft:10}}
            onPress={()=>{
              navigation.navigate("Daftar Peserta");
            }}
          >
          <View style={{backgroundColor:"white",width:160,height:160,borderRadius:30,justifyContent: 'center', alignItems: 'center'}}>
            <Image source={require("../assets/daftar.png")}/>
            <Text style={{color:"black",fontWeight:"bold"}}>Daftar Peserta</Text>
          </View>
        </Pressable>
      </View>
      <View style={{flexDirection:"row",margin:30,paddingTop:340,position:"absolute"}}>
        <Pressable style={{marginRight:10}} onPress={exportToExcel}>
          <View style={{backgroundColor:"white",width:160,height:160,borderRadius:30,justifyContent: 'center', alignItems: 'center'}}>
            <Image source={require("../assets/ekspor.png")}/>
            <Text style={{color:"black",fontWeight:"bold"}}>Eksport Data</Text>
          </View>
        </Pressable>
        <Pressable style={{marginLeft:10}}
          onPress={()=>{
            navigation.navigate("Cara Penggunaan");
          }}
        >
          <View style={{backgroundColor:"white",width:160,height:160,borderRadius:30,justifyContent: 'center', alignItems: 'center'}}>
            <Image source={require("../assets/penggunaan.png")}/>
            <Text style={{color:"black",fontWeight:"bold"}}>Cara Penggunaan</Text>
          </View>
        </Pressable>
      </View>
      <View style={{flexDirection:"row",margin:30,paddingTop:540,position:"absolute"}}>
        <Pressable style={{marginRight:10}}
          onPress={()=>{
            navigation.navigate("Tentang");
          }}
        >
          <View style={{backgroundColor:"white",width:160,height:160,borderRadius:30,justifyContent: 'center', alignItems: 'center'}}>
            <Image source={require("../assets/tentang.png")}/>
            <Text style={{color:"black",fontWeight:"bold"}}>Tentang</Text>
          </View>
        </Pressable>
        <Pressable style={{marginLeft:10}}
          onPress={()=>{
            BackHandler.exitApp();
          }}
        >
          <View style={{backgroundColor:"white",width:160,height:160,borderRadius:30,justifyContent: 'center', alignItems: 'center'}}>
            <Image source={require("../assets/exit.png")}/>
            <Text style={{color:"black"}}>Keluar</Text>
          </View>
        </Pressable>
      </View>
    </SafeAreaProvider>
  );
};

export default HomeScreen;

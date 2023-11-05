// screens/HomeScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Button, TextInput, Pressable, ActivityIndicator } from 'react-native'; // Tambahkan ActivityIndicator
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {app} from '../firebaseConfig';
import { getFirestore, collection, query, where, getDocs} from "firebase/firestore";
import { ScrollView } from 'react-native-gesture-handler';
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function DaftarPesertaScreen({navigation}) {
  const db = getFirestore(app);
  const [nama,setNama] = useState(null);
  const dataPasien = collection(db, "dataPasien");
  const [querySnapshot, setSnapShot] = useState([]);
  const [tglDibuat, setTglDibuat] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // State untuk mengontrol indikator loading

  async function getData(q) {
    setIsLoading(true);
    try {
      const data = await getDocs(q);
      var arrayData = [];
      var i = 0;
      data.forEach((docs) => {
        let setData = {};
        // Konversi data dari Firebase
        setData['nama'] = docs.data().nama;
        setData['nik'] = docs.data().nik;
        setData['pekerjaan'] = docs.data().pekerjaan;
        setData['tempat_lahir'] = docs.data().tempat_lahir;
        setData['agama'] = docs.data().agama;
        setData['alamat'] = docs.data().alamat;
        setData['goldar'] = docs.data().goldar;
        setData['jenkel'] = docs.data().jenkel;
        setData['kecamatan'] = docs.data().kecamatan;
        setData['kelurahan'] = docs.data().kelurahan;
        setData['createdAt'] = docs.data().createdAt;
  
        // Filter data berdasarkan pencarian nama dan tanggal pembuatan
        const searchName = nama;
        const searchDate = tglDibuat;
        if(searchName && searchDate){
          if(setData['nama'].includes(searchName) && searchDate == setData['createdAt']){
            arrayData[i] = setData;
            i++;
          }else{
            alert("Data tidak ditemukan")
          }  
        }else if(searchDate){
          if(searchDate == setData['createdAt']){
            arrayData[i] = setData;
            i++;
          }else{
            alert("Data tidak ditemukan")
          }  
        }else if(searchName){
          if(setData['nama'].includes(searchName)){
            arrayData[i] = setData;
            i++;
          }else{
            alert("Data tidak ditemukan")
          }  
        }else{
          arrayData[i] = setData;
          i++;
        }
      });
      setSnapShot(arrayData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setIsLoading(false);
    }
  }
  
  useEffect(() => {
    const q = query(collection(db, "dataPasien"));
    getData(q);
  }, [nama, tglDibuat]);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    if(date.getDate() < 10){
      var tgl = "0"+date.getDate()
    }else{
      var tgl = date.getDate()
    }
    setTglDibuat(date.getFullYear()+"-"+Number(date.getMonth()+1)+"-"+tgl);
    hideDatePicker();
  };
  
  return (
    <SafeAreaProvider>
      <View style={{
        flexDirection: "row", 
        backgroundColor: "white", 
        margin: 10, 
        padding: 10, 
        borderColor: 'black', 
        borderRadius: 5,
        elevation: 5, // Properti elevation untuk platform Android
        shadowColor: 'black', // Warna bayangan untuk platform iOS
        shadowOffset: { width: 0, height: 2 }, // Offset bayangan (x, y)
        shadowOpacity: 0.2, // Opasitas bayangan
        shadowRadius: 4, // Radius bayangan
        width: 'auto'
      }}>
        <View style={{flex:1}}>
          <TextInput
            placeholder="Cari berdasarkan nama"
            value={nama}
            onChangeText={(text) => setNama(text)}
            style={styles.input}
          />
          <Text style={styles.input}>{tglDibuat}</Text>
          <Button title="Pilih Tanggal Masuk" onPress={showDatePicker} />
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
        </View>
      </View>
      <ScrollView>
          {isLoading && (
            <View style={{
              flexDirection: "row", 
              backgroundColor: "white", 
              margin: 10, 
              padding: 10, 
              borderColor: 'black', 
              borderRadius: 5,
              elevation: 5, // Properti elevation untuk platform Android
              shadowColor: 'black', // Warna bayangan untuk platform iOS
              shadowOffset: { width: 0, height: 2 }, // Offset bayangan (x, y)
              shadowOpacity: 0.2, // Opasitas bayangan
              shadowRadius: 4, // Radius bayangan
            }}>
              <ActivityIndicator style={styles.loadingIndicator} />
              <Text>Loading...</Text>
            </View>
          )}
          {querySnapshot.map((key, index) => (
            <View key={index} style={{ 
              flexDirection: "row", 
              backgroundColor: "white", 
              margin: 10, 
              padding: 10, 
              borderColor: 'black', 
              borderRadius: 5,
              elevation: 5, // Properti elevation untuk platform Android
              shadowColor: 'black', // Warna bayangan untuk platform iOS
              shadowOffset: { width: 0, height: 2 }, // Offset bayangan (x, y)
              shadowOpacity: 0.2, // Opasitas bayangan
              shadowRadius: 4, // Radius bayangan
            }}>
                <View style={{ flexDirection: 'column' }}>
                  <Text style={{ color: "black", fontWeight: "bold" }}>Nama: {key.nama}</Text>
                  <Text style={{ color: "black", fontWeight: "bold" }}>NIK: {key.nik}</Text>
                  <Text style={{ color: "black", fontWeight: "bold" }}>Dibuat Pada: {key.createdAt}</Text>
                </View>
                <View style={{ marginLeft:300,marginTop:20,position:'absolute',border:1,backgroundColor:'black',elevation: 5}}>
                  <Pressable
                    onPress={()=>{
                      navigation.navigate("Detail Informasi Peserta",{idPeserta: key.nik});
                    }}
                  >
                  <Text style={{margin:10,color:'white'}}>Detail</Text>
                </Pressable>
              </View>
            </View>
          ))}
      </ScrollView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 4,
    marginTop: 10,
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  closeButton: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#008B8B',
    padding: 10,
    textAlign: 'center',
  },
});
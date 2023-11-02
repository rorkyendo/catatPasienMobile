// screens/HomeScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {app} from '../firebaseConfig';
import { getFirestore, collection, query, where, getDocs} from "firebase/firestore";
import { ScrollView } from 'react-native-gesture-handler';

export default function DetailPesertaScreen() {
  const db = getFirestore(app);
  const dataPasien = collection(db, "dataPasien");
  const [querySnapshot, setSnapShot] = useState([]);

  useEffect(() => {
    const q = query(dataPasien);
    getData(q)
  }, []);

  async function getData(q){
    const data = await getDocs(q)
    var arrayData = []
    var i = 0;
    data.forEach((docs) => {
      let setData = {}
      setData['nama'] = docs.data().nama
      setData['nik'] = docs.data().nik
      setData['pekerjaan'] = docs.data().pekerjaan
      setData['tempat_lahir'] = docs.data().tempat_lahir
      setData['agama'] = docs.data().agama
      setData['alamat'] = docs.data().alamat
      setData['goldar'] = docs.data().goldar
      setData['jenkel'] = docs.data().jenkel
      setData['kecamatan'] = docs.data().kecamatan
      setData['kelurahan'] = docs.data().kelurahan
      arrayData[i] = setData;
      i++
    });
    setSnapShot(arrayData)
  }

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setTglLahir(date.getFullYear()+"/"+date.getMonth()+"/"+date.getDate());
    hideDatePicker();
  };
  
  return (
    <SafeAreaProvider>
      <ScrollView>
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
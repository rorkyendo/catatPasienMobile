import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native'; // Tambahkan TouchableOpacity
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { getFirestore, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore/lite';
import { getStorage, ref, deleteObject } from 'firebase/storage';
import { useRoute } from '@react-navigation/native';
import { app } from '../firebaseConfig';
import { ScrollView } from 'react-native-gesture-handler';

export default function DetailPesertaScreen({navigation}) {
  const route = useRoute();
  const { idPeserta } = route.params; // Dapatkan NIK dari parameter navigasi
  const db = getFirestore(app);
  const dataPasien = collection(db, 'dataPasien');
  const [detailData, setDetailData] = useState(null);

  useEffect(() => {
    fetchData(); // Panggil fungsi fetchData saat komponen dirender pertama kali
  }, [idPeserta]);

  const fetchData = async () => {
    const q = query(dataPasien, where('nik', '==', idPeserta));
    const data = await getDocs(q);
    if (!data.empty) {
      const details = data.docs.map((doc) => doc.data());
      console.log(details)
      setDetailData(details[0]); // Ambil data pertama (seharusnya hanya ada satu dokumen dengan NIK yang cocok)
    }
  };


  if (!detailData) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  function cleanGenderData(inputGender) {
    const lowerCaseGender = inputGender.toLowerCase();
    if (lowerCaseGender.includes('laki')) {
      return 'LAKI-LAKI';
    } else if (lowerCaseGender.includes('perempuan')) {
      return 'PEREMPUAN';
    } else {
      // Jika input tidak sesuai dengan format standar, kembalikan nilai kosong atau sesuai kebutuhan
      return 'UNKNOWN'; // Atau return nilai default, misalnya 'UNKNOWN'
    }
  }

  const handleDelete = async (detailData) => {
    Alert.alert(
      'Konfirmasi Hapus',
      'Apakah Anda yakin ingin menghapus data ini?',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Hapus',
          onPress: async () => {
            try {
              const q = query(dataPasien, where('nik', '==', detailData.nik));
              const querySnapshot = await getDocs(q);
  
              if (!querySnapshot.empty) {
                const docRef = querySnapshot.docs[0].ref; // Dapatkan referensi dokumen dari hasil query
                await deleteDoc(docRef); // Hapus dokumen dari Firestore  
                const storage = getStorage(app);
                const storageRef = ref(storage, detailData.nama_file);
                await deleteObject(storageRef);
  
                navigation.goBack();
              } else {
                Alert.alert('Error', 'Data tidak ditemukan.');
              }
            } catch (error) {
              console.error('Error deleting data: ', error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <SafeAreaProvider>
      <ScrollView>
        <View style={styles.container}>
            <View style={{flex:1,flexDirection:'column'}}>
              <View style={{alignContent:"center"}}>
                <Text style={{textAlign:"center",fontSize:18,fontWeight:'bold'}}>FOTO KTP</Text>
                <Image
                  source={{ uri: detailData.fileKtp }}
                  style={{
                    width: "auto", // Width of the bounding box
                    height: 240, // Height of the bounding box
                    resizeMode: 'cover', // Make sure the image fills the specified dimensions
                  }}
                />
                <Text style={{textAlign:"center",fontSize:18,fontWeight:'bold',marginTop:5}}>Data Peserta</Text>
              </View>
              <View style={{flexDirection:'row'}}>
                  <View>
                    <Text style={{textAlign:"center",fontSize:18,fontWeight:'bold',marginTop:5}}>Pas Foto</Text>
                    <Image
                      source={{ uri: detailData.fileFoto }}
                      style={{
                        width: 150, // Width of the bounding box
                        height: 150, // Height of the bounding box
                        resizeMode: 'cover', // Make sure the image fills the specified dimensions
                      }}
                    />
                  </View>
                  <View style={{marginLeft:50}}>
                    <Text style={{textAlign:"center",fontSize:18,fontWeight:'bold',marginTop:5}}>TTD</Text>
                    <Image
                      source={{ uri: detailData.fileSign }}
                      style={{
                        width: 150, // Width of the bounding box
                        height: 150, // Height of the bounding box
                        resizeMode: 'cover', // Make sure the image fills the specified dimensions
                      }}
                    />
                  </View>
              </View>
              <View style={{margin:5}}>
                <Text style={{fontWeight:'bold'}}>NIK :</Text>
                <Text>{detailData.nik}</Text>
              </View>
              <View style={{margin:5}}>
                <Text style={{fontWeight:'bold'}}>Nama :</Text>
                <Text>{detailData.nama}</Text>
              </View>
              <View style={{margin:5}}>
                <Text style={{fontWeight:'bold'}}>Tempat / Tgl Lahir :</Text>
                <Text>{detailData.tempat_lahir} / {detailData.tgl_lahir.replaceAll('/','-')}</Text>
              </View>
              <View style={{margin:5}}>
                <Text style={{fontWeight:'bold'}}>Jenis Kelamin :</Text>
                <Text>{cleanGenderData(detailData.jenkel)}</Text>
              </View>
              <View style={{margin:5}}>
                <Text style={{fontWeight:'bold'}}>Golongan Darah :</Text>
                <Text>{detailData.goldar}</Text>
              </View>
              <View style={{margin:5}}>
                <Text style={{fontWeight:'bold'}}>Alamat :</Text>
                <Text>{detailData.alamat}</Text>
              </View>
              <View style={{margin:5}}>
                <Text style={{fontWeight:'bold'}}>Provinsi :</Text>
                <Text>{detailData.provinsi}</Text>
              </View>
              <View style={{margin:5}}>
                <Text style={{fontWeight:'bold'}}>Kabupaten :</Text>
                <Text>{detailData.kabupaten}</Text>
              </View>
              <View style={{margin:5}}>
                <Text style={{fontWeight:'bold'}}>Kelurahan/Desa :</Text>
                <Text>{detailData.kelurahan}</Text>
              </View>
              <View style={{margin:5}}>
                <Text style={{fontWeight:'bold'}}>Kecamatan :</Text>
                <Text>{detailData.kecamatan}</Text>
              </View>
              <View style={{margin:5}}>
                <Text style={{fontWeight:'bold'}}>RT/RW :</Text>
                <Text>{detailData.rtrw}</Text>
              </View>
              <View style={{margin:5}}>
                <Text style={{fontWeight:'bold'}}>Agama :</Text>
                <Text>{detailData.agama}</Text>
              </View>
              <View style={{margin:5}}>
                <Text style={{fontWeight:'bold'}}>Pekerjaan :</Text>
                <Text>{detailData.pekerjaan}</Text>
              </View>
              <View style={{margin:5}}>
                <Text style={{fontWeight:'bold'}}>Status Kawin :</Text>
                <Text>{detailData.statusKawin}</Text>
              </View>
              <View style={{margin:5}}>
                <Text style={{fontWeight:'bold'}}>Kewarganegaraan :</Text>
                <Text>{detailData.kewargaNegaraan}</Text>
              </View>
              <View style={{margin:5}}>
                <Text style={{fontWeight:'bold'}}>Berlaku :</Text>
                <Text>{detailData.berlaku}</Text>
              </View>
              <View style={{margin:5}}>
                <Text style={{fontWeight:'bold'}}>Tgl KTP :</Text>
                <Text>{detailData.tglKtp}</Text>
              </View>
              <View style={{margin:10}}>
                <TouchableOpacity style={styles.deleteButton}
                  onPress={() => handleDelete(detailData)}
                >
                  <Text style={{ color: 'white' }}>Hapus Data</Text>
                </TouchableOpacity>
              </View>
            </View>
          {/* Tampilkan data lainnya sesuai kebutuhan */}
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
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
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 20,
  },
});

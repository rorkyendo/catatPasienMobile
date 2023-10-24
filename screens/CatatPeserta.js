import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Modal,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Camera } from 'expo-camera';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// import * as ImageManipulator from 'expo-image-manipulator'; // Import ImageManipulator for cropping
import { Dimensions } from 'react-native';
import {app} from '../firebaseConfig';
import { addDoc, getFirestore, collection, getDocs } from 'firebase/firestore/lite';
// import { , collection } from "firebase/firestore"; 

export default function CatatPeserta() {
  const [nik, setNIK] = useState('');
  const [nama, setNama] = useState('');
  const [tempatLahir, setTempatLahir] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState('LAKI-LAKI');
  const [golonganDarah, setGolonganDarah] = useState('');
  const [alamat, setAlamat] = useState('');
  const [kelurahan, setKelurahan] = useState('');
  const [kecamatan, setKecamatan] = useState('');
  const [agama, setAgama] = useState('Islam');
  const [pekerjaan, setPekerjaan] = useState('');
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [isCameraModalVisible, setCameraModalVisible] = useState(false); // State for camera modal visibility
  const [ktpImage, setKtpImage] = useState(null);
  const db = getFirestore(app);

useEffect(() => {
  (async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  })();
}, []);

  // Function to toggle the camera modal's visibility
  const toggleCameraModal = () => {
    setCameraModalVisible(!isCameraModalVisible);
  };

  const takePicture = async () => {
    if (cameraRef) {
      const options = { quality: 1, base64: true };
      const data = await cameraRef.takePictureAsync(options);
      // const data2 = await cameraRef.takePictureAsync();
      // console.log(data2)

      setKtpImage(data.uri);
      toggleCameraModal();
    }
  };

  async function simpanData(){
    const data = {
      nik: nik,
      nama: nama,
      tempat_lahir: tempatLahir,
      goldar: golonganDarah,
      pekerjaan: pekerjaan,
      jenkel: jenisKelamin,
      alamat: alamat,
      kelurahan: kelurahan,
      kecamatan: kecamatan,
      agama: agama
    };

    try {
      const docRef = await addDoc(collection(db, "dataPasien"), data);
      console.log("Document written with ID: ", docRef.id);
      alert('Data berhasil disimpan');
    } catch (e) {
      console.error("Error adding document: ", e);
    }

  }

  return (
    <SafeAreaProvider>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#008B8B',
              width: '100%',
              height: '15%',
              borderBottomEndRadius: 60,
              borderBottomLeftRadius: 60,
            }}
          >
            <Text
              style={{
                color: 'white',
                fontSize: 18,
                fontWeight: 'bold',
                paddingVertical: 10,
              }}
            >
              PENCATATAN PERSERTA VAKSINASI
            </Text>
            <Text
              style={{
                color: 'white',
                fontSize: 18,
                fontWeight: 'bold',
                paddingBottom: 10,
              }}
            >
              COVID-19 PUSKESMAS PUJIDADI
            </Text>
          </View>
          <View style={{ padding: 20, paddingBottom:35 }}>
          <View style={{ flex: 1 }}>
              {ktpImage && (
                <Image
                source={{ uri: ktpImage }}
                style={{
                  width: "auto", // Width of the bounding box
                  height: 280, // Height of the bounding box
                  resizeMode: 'cover', // Make sure the image fills the specified dimensions
                }}
              />
              )}
              <TouchableOpacity
                style={{
                  backgroundColor: '#008B8B',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 50,
                }}
                onPress={toggleCameraModal}
              >
                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
                  Ambil Gambar KTP dengan Frame
                </Text>
              </TouchableOpacity>
              {/* Render the camera view inside a modal */}
              <Modal
                visible={isCameraModalVisible}
                transparent={true}
                animationType="slide" // You can adjust the animation type as needed
              >
                <View style={styles.modalContainer}>
                  <View style={{ flex: 1}}>
                    <Camera
                      ref={(ref) => setCameraRef(ref)}
                      style={{ flex: 1 }}
                      type={Camera.Constants.Type.back}
                    >
                      <View
                        style={{
                          flex: 1,
                          backgroundColor: 'transparent',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <View
                          style={{
                            width: 320,
                            height: 280,
                            borderColor: '#008B8B',
                            borderWidth: 2,
                            position: 'absolute',
                            left: (Dimensions.get('window').width - 320) / 2,
                            top: (Dimensions.get('window').height - 280) / 2,
                          }}
                        ></View>
                      </View>
                    </Camera>
                  </View>
                  <TouchableOpacity onPress={takePicture}>
                    <Text style={styles.closeButton}>Ambil Gambar</Text>
                  </TouchableOpacity>
                </View>
              </Modal>
            </View>
            <TextInput
              placeholder="NIK"
              value={nik}
              onChangeText={(text) => setNIK(text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Nama"
              value={nama}
              onChangeText={(text) => setNama(text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Tempat Lahir"
              value={tempatLahir}
              onChangeText={(text) => setTempatLahir(text)}
              style={styles.input}
            />
            <Picker
              selectedValue={jenisKelamin}
              onValueChange={(itemValue) => setJenisKelamin(itemValue)}
              style={styles.input}
            >
              <Picker.Item label="LAKI-LAKI" value="LAKI-LAKI" />
              <Picker.Item label="PEREMPUAN" value="PEREMPUAN" />
            </Picker>
            <TextInput
              placeholder="Golongan Darah"
              value={golonganDarah}
              onChangeText={(text) => setGolonganDarah(text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Alamat"
              value={alamat}
              onChangeText={(text) => setAlamat(text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Kelurahan"
              value={kelurahan}
              onChangeText={(text) => setKelurahan(text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Kecamatan"
              value={kecamatan}
              onChangeText={(text) => setKecamatan(text)}
              style={styles.input}
            />
            <Picker
              selectedValue={agama}
              onValueChange={(itemValue) => setAgama(itemValue)}
              style={styles.input}
            >
              <Picker.Item label="Islam" value="Islam" />
              <Picker.Item label="Kristen" value="Kristen" />
              <Picker.Item label="Hindu" value="Hindu" />
              <Picker.Item label="Buddha" value="Buddha" />
              {/* Tambahkan opsi agama lainnya sesuai kebutuhan */}
            </Picker>
            <TextInput
              placeholder="Pekerjaan"
              value={pekerjaan}
              onChangeText={(text) => setPekerjaan(text)}
              style={styles.input}
            />
            <TouchableOpacity
              style={{
                backgroundColor: '#008B8B',
                justifyContent: 'center',
                alignItems: 'center',
                height: 50,
                marginTop: 20,
                marginBottom: 100
              }}
              onPress={simpanData}
            >
            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
              Simpan Data
            </Text>
          </TouchableOpacity>
          </View>
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
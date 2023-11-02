import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Button,
  SafeAreaView,
  ScrollView,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Camera } from 'expo-camera';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Dimensions } from 'react-native';
import {app} from '../firebaseConfig';
import { addDoc, getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native';

export default function CatatPeserta({ navigation }) {
  const [nik, setNIK] = useState('');
  const [nama, setNama] = useState('');
  const [tempatLahir, setTempatLahir] = useState('');
  
  const [tglLahir, setTglLahir] = useState('yyyy/mm/dd');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [jenisKelamin, setJenisKelamin] = useState('LAKI-LAKI');
  const [golonganDarah, setGolonganDarah] = useState('');
  const [alamat, setAlamat] = useState('');
  const [alamatFile, setAlamatFile] = useState('');
  const [kelurahan, setKelurahan] = useState('');
  const [kecamatan, setKecamatan] = useState('');
  const [agama, setAgama] = useState('ISLAM');
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
      setKtpImage(data.uri);
      uploadGambar(data.uri);

      const options2 = { quality: 0.4, base64: true };
      const data2 = await cameraRef.takePictureAsync(options2);

      // Convert the resized image URI to base64
      const base64Image = await localImageUrlToBase64(data2.uri);
      // Set the base64 image to state or use it directly as needed
      setAlamatFile(base64Image);
      toggleCameraModal();
    }
  };

  const localImageUrlToBase64 = async (localImageUrl) => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(localImageUrl);
      if (fileInfo.exists) {
        const base64 = await FileSystem.readAsStringAsync(localImageUrl, {
          encoding: FileSystem.EncodingType.Base64,
        });
        return base64;
      } else {
        throw new Error('File not found');
      }
    } catch (error) {
      console.error('Error converting local image URL to base64:', error);
      throw error;
    }
  };
  
  function uploadGambar(ktp) {
    let body = new FormData();
    
    alert("Loading.. Gambar sedang diupload dan diproses..")

    body.append('filename', {
      uri: ktp,
      type: 'image/jpeg', // Ganti dengan tipe media yang sesuai jika perlu (contoh: image/png)
      name: 'ktp.jpg', // Ganti dengan nama berkas yang sesuai jika perlu
    });
  
    fetch('https://091c-182-2-167-24.ngrok-free.app/scan', {
      method: 'POST',
      body: body,
      headers: {
        'Content-Type': 'multipart/form-data',
        // Jika diperlukan, Anda dapat menambahkan header lain di sini
      },
    })
      .then(response => response.json())
      .then(resp => {
        setTimeout(() => {
          alert("Gambar selesai di proses")
        }, 100);
        // Handle response dari API jika perlu
        console.log('Response dari API:', resp);
        setNama(resp.data.nama)
        const nikNumbersOnly = resp.data.nik.replace(/\D/g, '');
        setNIK(nikNumbersOnly)
        tglLahirPasien(nikNumbersOnly)
        cleanTempatLahir(resp.data.tempat_tanggal_lahir)
        cleanedJenkel(resp.data.jenis_kelamin)
        cleanedGolDar(resp.data.golongan_darah)
        setAgama(resp.data.agama)
        setAlamat(resp.data.alamat)
        setKecamatan(resp.data.kecamatan)
        setKelurahan(resp.data.kelurahan_atau_desa)
        setPekerjaan(resp.data.pekerjaan)
      })
      .catch(error => {
        // Handle kesalahan jika terjadi
        console.error('Error:', error);
      });
  }

  function tglLahirPasien(nik){
    const tgl = nik.substr(6, 2); // Mengambil karakter ke-1 dan ke-2 untuk tanggal
    const bln = nik.substr(8, 2); // Mengambil karakter ke-3 dan ke-4 untuk bulan
    // Mengambil dua digit terakhir tahun dan mengonversinya ke format tahun yang benar
    const duaDigitTahun = nik.substr(10, 2);
    const tahun = duaDigitTahun < 21 ? `20${duaDigitTahun}` : `19${duaDigitTahun}`;
    const formattedDate = `${tahun}/${bln}/${tgl}`;
    setTglLahir(formattedDate);
  }

  function cleanedJenkel(jenkel){
      if (jenkel.includes("LAKI")) {
        const hasil = jenkel.replace("LAKI", "LAKI-LAKI");
        setJenisKelamin(hasil);
      } else if (data.jenis_kelamin.includes("PEREM")) {
        const hasil = jenkel.replace("PEREM", "PEREMPUAN");
        setJenisKelamin(hasil);
      }
  }

  function cleanTempatLahir(ttl){
      setTempatLahir(ttl);
      const data = ttl.split("r");
    if(data){
      const cleanedData = data[1].split(",");
      setTempatLahir(cleanedData[0].replace(":",""));
    }
  }

  function cleanedGolDar(goldar){
    setGolonganDarah(goldar);
    const data = goldar.split("h");
    if(data){
      const cleanedData = data[1].split(",");
      setGolonganDarah(cleanedData[0].replace(":",""));
    }
  }
    
  async function simpanData(){
    let today = new Date().toISOString().slice(0, 10);
    const data = {
      nik: nik,
      nama: nama,
      tempat_lahir: tempatLahir,
      tgl_lahir: tglLahir,
      goldar: golonganDarah,
      pekerjaan: pekerjaan,
      jenkel: jenisKelamin,
      alamat: alamat,
      kelurahan: kelurahan,
      kecamatan: kecamatan,
      agama: agama,
      fileKtp: alamatFile,
      createdAt: today
    };

    try {
      alert("Loading.. Data sedang disimpan..")
      const docRef = await addDoc(collection(db, "dataPasien"), data);
      console.log("Document written with ID: ", docRef.id);
      alert('Data berhasil disimpan');
      navigation.navigate('Home');
    } catch (e) {
      console.error("Error adding document: ", e);
    }

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
                  height: 180, // Height of the bounding box
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

            <View style={{marginTop:10}}>
              <Text style={styles.input}>{tglLahir}</Text>
              <Button title="Pilih Tanggal lahir" onPress={showDatePicker} />
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              />
            </View>

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
              <Picker.Item label="ISLAM" value="ISLAM" />
              <Picker.Item label="KRISTEN" value="KRISTEN" />
              <Picker.Item label="HINDU" value="HINDU" />
              <Picker.Item label="BUDDHA" value="BUDDHA" />
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
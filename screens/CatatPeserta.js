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
import { collection, getFirestore, query, where, getDocs, addDoc } from 'firebase/firestore/lite';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as ImagePicker from 'expo-image-picker';
import * as FaceDetector from 'expo-face-detector';
import { ImageManipulator, manipulateAsync } from 'expo-image-manipulator';

export default function CatatPeserta({ navigation }) {
  const [nik, setNIK] = useState('');
  const [nama, setNama] = useState('');
  const [tempatLahir, setTempatLahir] = useState('');
  
  const [tglLahir, setTglLahir] = useState('yyyy/mm/dd');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDatePickerVisible2, setDatePickerVisibility2] = useState(false);

  const [jenisKelamin, setJenisKelamin] = useState('LAKI-LAKI');
  const [golonganDarah, setGolonganDarah] = useState('');
  const [alamat, setAlamat] = useState('');

  const [uploading, setUploading] = useState(false)

  const [kelurahan, setKelurahan] = useState('');
  const [kecamatan, setKecamatan] = useState('');
  const [agama, setAgama] = useState('ISLAM');
  const [pekerjaan, setPekerjaan] = useState('');
  const [hasPermission, setHasPermission] = useState(null);
  const [ktpImage, setKtpImage] = useState(null);
  const [faceImage, setFaceImage] = useState(null);
  const [signatureImage, setSignatureImage] = useState(null);
  const [namaFile, setNamaFile] = useState('');
  const [alamatFile, setAlamatFile] = useState('');
  const [namaFileFoto, setNamaFileFoto] = useState('');
  const [alamatFileFoto, setAlamatFileFoto] = useState('');
  const [namaFileSign, setNamaFileSign] = useState('');
  const [alamatFileSign, setAlamatFileSign] = useState('');
  const [rtrw, setRtrw] = useState('');
  const [provinsi, setProvinsi] = useState('');
  const [statusKawin, setStatusKawin] = useState('');
  const [tglKtp, setTglKtp] = useState('');
  const [berlaku, setBerlaku] = useState('SEUMUR HIDUP');
  const [kewargaNegaraan, setKewargaNegaraan] = useState('WNI');
  const [kabupaten, setKabupaten] = useState('');

  const db = getFirestore(app);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const pickImage = async () => {
      let result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4,3],
          quality: 1
      });
      const source = {uri: result.assets[0].uri}
      setKtpImage(source.uri)
      uploadGambar()
      detectAndCropFace(source.uri)
  };

  const pickImageGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4,3],
        quality: 1
    });
    const source = {uri: result.assets[0].uri}
    setKtpImage(source.uri)
    uploadGambar()
    detectAndCropFace(source.uri)
};

  const detectAndCropFace = async (ktpImage) => {
    try {
      const faces = await FaceDetector.detectFacesAsync(ktpImage, {
        mode: FaceDetector.FaceDetectorMode.accurate,
        detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
        runClassifications: FaceDetector.FaceDetectorClassifications.all,
        minDetectionInterval: 1000, // Sesuaikan sesuai kebutuhan
        tracking: true,
      });

      if (faces.faces.length > 0) {
        const face = faces.faces[0];
        const x = face.bounds.origin.x;
        const y = face.bounds.origin.y;
        const width = face.bounds.size.width;
        const height = face.bounds.size.height;

        console.log('face',face)
        console.log('x',x)
        console.log('y',y)
        console.log('width',width)
        console.log('height',height)

        // // Crop the image
        const croppedImage = await manipulateAsync(
          ktpImage,
          [{ crop: { originX: x, originY: y, width, height } }],
          { compress: 1, format: 'jpeg', base64: false }
        ).catch((error) => {
          console.error('Error during image manipulation:', error);
          // Handle the error appropriately, e.g., show an error message to the user
        });

        console.log('croppedImage',croppedImage)
        // Get the bottom coordinate of the detected face
        const faceBottomY = y + height;

        // Calculate the new originY for the signature crop (set it to half of the face's bottom)
        const offsetY = faceBottomY + (height / 2);
        const addWith = width + 130;
        // // Crop the signature
        const croppedSignature = await manipulateAsync(
          ktpImage,
          [{ crop: { originX: x-30, originY: offsetY, width:addWith, height } }],
          { compress: 1, format: 'jpeg', base64: false }
        ).catch((error) => {
          console.error('Error during image manipulation:', error);
          // Handle the error appropriately, e.g., show an error message to the user
        });
        
        console.log('croppedSignature',croppedSignature);


        // Set the cropped image to the state
        setFaceImage(croppedImage.uri);

        // Set the cropped image to the state
        setSignatureImage(croppedSignature.uri);

      } else {
        alert('Wajah pada ktp tidak terdeteksi');
      }
    } catch (error) {
      console.error('Error detecting and cropping face:', error);
      // Handle the error appropriately, e.g., show an error message to the user
    }
  };

  const resendImage = async () => {
    uploadGambar()
    detectAndCropFace(ktpImage) 
  }
  
  const uriToBlob = (uri) => {
    return new Promise((resolve, reject) => {
       const xhr = new XMLHttpRequest()
       xhr.onload = function () {
         // return the blob
         resolve(xhr.response)
       }
       xhr.onerror = function () {
         reject(new Error('uriToBlob failed'))
       }
       xhr.responseType = 'blob'
       xhr.open('GET', uri, true)
   
       xhr.send(null)})
  }

  function uploadGambar() {
    let body = new FormData();
    
    alert("Sistem sedang melakukan pengecekan KTP..")

    try {
      body.append('filename', {
        uri: ktpImage,
        type: 'image/jpeg', // Ganti dengan tipe media yang sesuai jika perlu (contoh: image/png)
        name: 'ktp.jpg', // Ganti dengan nama berkas yang sesuai jika perlu
      });
  
      fetch('http://ktpdet.my.id:8082/scan', {
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
          console.log('Response dari API:', resp.data);
          // console.log('Response dari API:', test);
          
          setNama(resp.data["1"])
          const nikNumbersOnly = resp.data["0"].replace(/\D/g, '');
          setNIK(nikNumbersOnly)
          tglLahirPasien(nikNumbersOnly)
          cleanTempatLahir(resp.data["2"])
          cleanedJenkel(resp.data["3"])
          setGolonganDarah(resp.data["4"])
          cleanedAgama(resp.data["8"])
          setAlamat(resp.data["5"])
          setKecamatan(resp.data["7"])
          setKelurahan(resp.data["6"])
          setPekerjaan(resp.data["9"])
          setProvinsi(resp.data["10"])
          setKabupaten(resp.data["11"])
          setRtrw(resp.data["12"])
          setTglKtp(resp.data["16"])
          setStatusKawin(resp.data["13"])
        })
        .catch(error => {
          // Handle kesalahan jika terjadi
          console.error('Error:', error);
        });
    } catch (error) {
      console.log('Error:', error);
    }
  }

  function tglLahirPasien(nik){
    try {
      var tgl = nik.substr(6, 2); // Mengambil karakter ke-1 dan ke-2 untuk tanggal
      const bln = nik.substr(8, 2); // Mengambil karakter ke-3 dan ke-4 untuk bulan
      if (tgl >= 31) {
        tgl = tgl.substr(1,2);
      }
      // Mengambil dua digit terakhir tahun dan mengonversinya ke format tahun yang benar
      const duaDigitTahun = nik.substr(10, 2);
      const tahun = duaDigitTahun < 21 ? `20${duaDigitTahun}` : `19${duaDigitTahun}`;
      const formattedDate = `${tahun}/${bln}/${tgl}`;
      setTglLahir(formattedDate);
    } catch (error) {
      console.log(error);
    }
  }

  function cleanedJenkel(jenkel) {
    if (jenkel.includes("LAKI")) {
        const hasil = "LAKI-LAKI";
        setJenisKelamin(hasil);
    } else if (jenkel.includes("PEREM")) {
        const hasil = "PEREMPUAN";
        setJenisKelamin(hasil);
    }
  }

  function cleanedAgama(agama) {
    if (agama.includes("ISLAM")) {
        const hasil = "ISLAM";
        setAgama(hasil);
    } else if (agama.includes("KR")) {
        const hasil = "KRISTEN";
        setAgama(hasil);
    } else if (agama.includes("NDU")) {
      const hasil = "HINDU";
      setAgama(hasil);
    } else if (agama.includes("DHA")) {
      const hasil = "BUDDHA";
      setAgama(hasil);
    } else if (agama.includes("THO")) {
      const hasil = "KATHOLIK";
      setAgama(hasil);
    }
  }


  function cleanTempatLahir(ttl){
      try {
        const data = ttl.split("r");
        if(Array.isArray(data) === 'true'){
          const cleanedData = data[1].split(",");
          if (Array.isArray(cleanedData) === 'true') {
            setTempatLahir(cleanedData[0].replace(":",""));
          }
        }else{
          const cek = ttl.split(",");
          if(cek.length > 0){
            setTempatLahir(cek[0]);
          }else{
            setTempatLahir(ttl);
          }
        }
      } catch (error) {
        setTempatLahir(ttl);
      }
  }

  function cleanedGolDar(goldar){
    try {
      const data = goldar.split("ra");
      if(Array.isArray(data) === 'true'){
        const cleanedData = data[1].split(",");
        if (Array.isArray(cleanedData) === 'true') {
          setGolonganDarah(cleanedData[0].replace(":",""));
        }
      }
    } catch (error) {
      setGolonganDarah(goldar);
    }
  }
    
  async function simpanData(){
    await uploadToFirebase();
  }

  async function simpanDataToFirebase() {
    try {
      // Wait for the uploads to complete
      if (alamatFile && alamatFileFoto && alamatFileSign) {
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
          kabupaten:kabupaten,
          provinsi:provinsi,
          rtrw:rtrw,
          agama: agama,
          kewargaNegaraan: kewargaNegaraan,
          berlaku: berlaku,
          statusKawin:statusKawin,
          tglKtp:tglKtp,
          fileKtp: alamatFile,
          fileFoto: alamatFileFoto,
          fileSign: alamatFileSign,
          nama_file: namaFile,
          nama_file_foto: namaFileFoto,
          nama_file_sign: namaFileSign,
          createdAt: today,
        };
  
        const dataPasienRef = collection(db, 'dataPasien');
        const q = query(dataPasienRef, where('nik', '==', nik));
  
        try {
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            // Jika terdapat data dengan NIK yang sama, tampilkan pesan kesalahan
            alert('Data dengan NIK ini sudah ada di database. Tidak dapat menyimpan data duplikat.');
          } else {
            // Jika tidak ada data dengan NIK yang sama, simpan data ke database
            alert('Loading.. Data sedang disimpan..');
            const docRef = await addDoc(dataPasienRef, data);
            console.log('Document written with ID: ', docRef.id);
            alert('Data berhasil disimpan');
            navigation.navigate('Home');
          }
        } catch (e) {
          console.error('Error checking document: ', e);
          // Tampilkan pesan kesalahan jika terjadi error saat pengecekan data
          alert('Terjadi kesalahan saat memeriksa data. Silakan coba lagi.');
        }
      } else {
        alert('Foto belum tersimpan');
      }
    } catch (error) {
      console.error('Error uploading to Firebase:', error);
      // Handle error during upload
      alert('Error', 'Gagal mengupload file. Silakan coba lagi.');
    }
  }
  
  const uploadToFirebase = async () => {
    console.log('Starting upload to Firebase...');
    setUploading(true);
    const storage = getStorage();
    const localTime = new Date().getTime();
    const storageRef = ref(storage, 'fotoKTP/ktp' + localTime);
    const storageRefFoto = ref(storage, 'fotoKTP/foto' + localTime);
    const storageRefSign = ref(storage, 'fotoKTP/sign' + localTime);
  
    try {
      const blobFile = await uriToBlob(ktpImage);
      const blobFoto = await uriToBlob(faceImage);
      const blobSign = await uriToBlob(signatureImage);
  
      const uploadTask = uploadBytesResumable(storageRef, blobFile);
      const uploadTaskFoto = uploadBytesResumable(storageRefFoto, blobFoto);
      const uploadTaskSign = uploadBytesResumable(storageRefSign, blobSign);
  
      // Promises to track completion of each upload task
      const promises = [];
  
      // Handle main upload task (ktpImage)
      promises.push(
        new Promise((resolve) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload ktp is ' + progress.toFixed(2) + '% done');
            },
            (error) => {
              console.error('Error uploading to Firebase:', error);
              setUploading(false);
              alert('Error', 'Gagal mengupload file ktp. Silakan coba lagi.');
              resolve(false);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                console.log('Download URL received:', downloadURL);
                setAlamatFile(downloadURL);
                console.log('Alamat File set to:', downloadURL);
                if (downloadURL) {
                  const namaFile = 'fotoKTP/ktp' + localTime;
                  setNamaFile(namaFile);
                  // Only call setUploading(false) once
                  setUploading(false);
                  resolve(true);
                } else {
                  console.log('Alamat File KTP is not set correctly. Aborting.');
                  alert('Error', 'Gagal mengatur alamat file KTP. Silakan coba lagi.');
                  resolve(false);
                }
              });
            }
          );
        })
      );
  
      // Handle upload task foto
      promises.push(
        new Promise((resolve) => {
          uploadTaskFoto.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload Foto is ' + progress.toFixed(2) + '% done');
            },
            (error) => {
              console.error('Error uploading Foto to Firebase:', error);
              setUploading(false);
              alert('Error', 'Gagal mengupload Foto. Silakan coba lagi.');
              resolve(false);
            },
            () => {
              getDownloadURL(uploadTaskFoto.snapshot.ref).then((downloadURL) => {
                console.log('Download URL for Foto received:', downloadURL);
                setAlamatFileFoto(downloadURL);
                // Only call setUploading(false) once
                setUploading(false);
                // Handle success for Foto upload
                if (downloadURL) {
                  const namaFile = 'fotoKTP/foto' + localTime;
                  setNamaFileFoto(namaFile);
                  resolve(true);
                } else {
                  console.log('Alamat File KTP is not set correctly. Aborting.');
                  alert('Error', 'Gagal mengatur alamat file Foto. Silakan coba lagi.');
                  resolve(false);
                }
              });
            }
          );
        })
      );
  
      // Handle signature upload task
      promises.push(
        new Promise((resolve) => {
          uploadTaskSign.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload signature is ' + progress.toFixed(2) + '% done');
            },
            (error) => {
              console.error('Error uploading signature to Firebase:', error);
              setUploading(false);
              alert('Error', 'Gagal mengupload tanda tangan. Silakan coba lagi.');
              resolve(false);
            },
            () => {
              getDownloadURL(uploadTaskSign.snapshot.ref).then((downloadURL) => {
                console.log('Download URL for signature received:', downloadURL);
                setAlamatFileSign(downloadURL);
                // Only call setUploading(false) once
                setUploading(false);
                // Handle success for Signature upload
                if (downloadURL) {
                  const namaFile = 'fotoKTP/sign' + localTime;
                  setNamaFileSign(namaFile);
                  resolve(true);
                } else {
                  console.log('Alamat File Sign is not set correctly. Aborting.');
                  alert('Error', 'Gagal mengatur alamat file Sign. Silakan coba lagi.');
                  resolve(false);
                }
              });
            }
          );
        })
      );
  
      // Wait for all promises to resolve
      await Promise.all(promises);
      simpanDataToFirebase();
      
    } catch (error) {
      console.error('Fetch error:', error);
      setUploading(false);
      throw error; // Propagate the error to the calling function
    }
  };  

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const showDatePicker2 = () => {
    setDatePickerVisibility2(true);
  };

  const hideDatePicker2 = () => {
    setDatePickerVisibility2(false);
  };


  const handleConfirm = (date) => {
    const tgl = Number(date.getMonth()+1)
    setTglLahir(date.getFullYear()+"/"+tgl+"/"+date.getDate());
    hideDatePicker();
  };

  const handleConfirm2 = (date) => {
    const tgl = Number(date.getMonth()+1)
    setTglLahir(date.getFullYear()+"/"+tgl+"/"+date.getDate());
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
              height: '10%',
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
              <Text style={{fontSize:12,fontWeight:'bold'}}>FOTO KTP : </Text>
              {ktpImage && (
                <Image
                  source={{ uri: ktpImage }}
                  style={{
                    width: "auto", // Width of the bounding box
                    height: 240, // Height of the bounding box
                    resizeMode: 'cover', // Make sure the image fills the specified dimensions
                  }}
                />            
              )}

              <View style={{flexDirection:'row'}}>
                <View style={{flex:2,marginLeft:20,marginTop:10,marginBottom:10}}>
                  <Text style={{fontSize:12,fontWeight:'bold'}}>PAS FOTO : </Text>
                  {faceImage && (
                    <Image
                    source={{ uri: faceImage }}
                    style={{
                      width: 100, // Width of the bounding box
                      height: 100, // Height of the bounding box
                      resizeMode: 'cover', // Make sure the image fills the specified dimensions
                    }}
                  />            
                  )}
                </View>
                <View style={{flex:2,marginLeft:90,marginTop:10,marginBottom:10}}>
                  <Text style={{fontSize:12,fontWeight:'bold'}}>TTD : </Text>
                  {signatureImage && (
                    <Image
                    source={{ uri: signatureImage }}
                    style={{
                      width: 100, // Width of the bounding box
                      height: 100, // Height of the bounding box
                      resizeMode: 'cover', // Make sure the image fills the specified dimensions
                    }}
                  />            
                  )}
                </View>
              </View>
            <View style={{flexDirection:'row'}}>
                <View style={{flex:1,marginRight:35}}>
                    <TouchableOpacity
                    style={{
                      backgroundColor: '#008B8B',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: 50,
                    }}
                    onPress={() => pickImage()}
                  >
                    <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
                      Buka Kamera
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={{flex:1,marginRight:0}}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: '#008B8B',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 50,
                      }}
                      onPress={() => pickImageGallery()}
                    >
                      <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
                        Buka Gallery
                      </Text>
                    </TouchableOpacity>
                </View>
            </View>
              {ktpImage && (
                <TouchableOpacity
                style={{
                  backgroundColor: 'orange',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 50,
                }}
                onPress={() => resendImage()}
              >
                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
                  Proses KTP
                </Text>
              </TouchableOpacity>
              )}
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
              {tglLahir ? (
                <Text style={styles.input}>{tglLahir}</Text>
              ):(
                <Text style={[styles.input,{color:'rgba(0, 0, 0, 0.5)'}]}>Masukkan Tgl Lahir</Text>
              )}
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
              placeholder="Provinsi"
              value={provinsi}
              onChangeText={(text) => setProvinsi(text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Kabupaten / Kota"
              value={kabupaten}
              onChangeText={(text) => setKabupaten(text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Kecamatan"
              value={kecamatan}
              onChangeText={(text) => setKecamatan(text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Kelurahan"
              value={kelurahan}
              onChangeText={(text) => setKelurahan(text)}
              style={styles.input}
            />
            <TextInput
              placeholder="RT/RW"
              value={rtrw}
              onChangeText={(text) => setRtrw(text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Kewarganegaraan"
              value={kewargaNegaraan}
              onChangeText={(text) => setKewargaNegaraan(text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Berlaku Hingga"
              value={berlaku}
              onChangeText={(text) => setBerlaku(text)}
              style={styles.input}
            />
            <Picker
              selectedValue={agama}
              onValueChange={(itemValue) => setAgama(itemValue)}
              style={styles.input}
            >
              <Picker.Item label="ISLAM" value="ISLAM" />
              <Picker.Item label="KRISTEN" value="KRISTEN" />
              <Picker.Item label="KATHOLIK" value="KATHOLIK" />
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
            <TextInput
              placeholder="Status Perkawinan"
              value={statusKawin}
              onChangeText={(text) => setStatusKawin(text)}
              style={styles.input}
            />
            <View style={{marginTop:10}}>
              {tglKtp ?  (
                <Text style={styles.input}>{tglKtp}</Text>
              ):(
                <Text style={[styles.input,{color:'rgba(0, 0, 0, 0.5)'}]}>Masukkan Tgl KTP</Text>
              )}
              <Button title="Pilih Tanggal KTP" onPress={showDatePicker2} />
              <DateTimePickerModal
                isVisible={isDatePickerVisible2}
                mode="date"
                onConfirm={handleConfirm2}
                onCancel={hideDatePicker2}
              />
            </View>
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
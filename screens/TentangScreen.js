// screens/HomeScreen.js
import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const TentangScreen = () => {
  return (
    <SafeAreaProvider>
      <View style={{backgroundColor:"white",height:"100%"}}>
          <Image source={require("../assets/rs.png")}/>
          <View style={{justifyContent:"center",alignItems:"center",margin:25}}>
            <Text>
              Aplikasi Pencatatan Peserta Vaksinasi COVID-19 Puskesmas Pujidadi dibuat oleh mahasiswa Teknologi Informasi USU untuk membantu dan sebagai digitalisasi proses pendataan para peserta vaksinasi di lingkungan Pusat Kesehatan Masyarakat (Puskesmas) Kelurahan Pujidadi, Kecamatan Binjai Selatan, Kotamadya Binjai, Sumatera Utara.
              {"\n"}
              {"\n"}
               Hal ini dilakukan dikarenakan proses input data pasien masih dilakukan secara manual yang memerlukan waktu ditengah antusias para peserta vaksinasi COVID-19 yang sangat banyak saat itu yang mengakibatkan tempat puskesmas tidak mampu menampung jumlah peserta. 
              {"\n"}
              {"\n"}
               Adapun beberapa fitur yang dimiliki antara lain :
              {"\n"}
              {"\t"}• Ekstraksi Data KTP Peserta
              {"\n"}
              {"\t"}• Edit dan Perbaharui Data Peserta
              {"\n"}
              {"\t"}• Export Data Peserta Berupa csv/excel
              {"\n"}
              {"\t"}• Cara Penggunaan Aplikasi
              {"\n"}
              {"\n"}
              Dengan adanya aplikasi ini diharapkan dapat memberikan cara terbaik dan memudahkan petugas kesehatan puskesmas dalam mengelola data pasien. 
            </Text>
          </View>
      </View>
    </SafeAreaProvider>
  );
};

export default TentangScreen;

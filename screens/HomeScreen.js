// screens/HomeScreen.js
import React from 'react';
import { View, Text, Pressable, Image, BackHandler } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const HomeScreen = ({navigation}) => {
  return (
    <SafeAreaProvider>
      <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor:"#008B8B", width:"100%",height:"30%",borderBottomEndRadius:60,borderBottomLeftRadius:60}}>
        <Text style={{color:"white", alignItems: 'center',fontSize:18,fontWeight:'bold'}}>PENCATATAN PERSERTA VAKSINASI</Text>
        <Text style={{color:"white", alignItems: 'center',fontSize:18,fontWeight:'bold'}}>COVID-19 PUSKESMAS PUJIDADI</Text>
      </View>
      <View style={{flexDirection:"row",margin:30,paddingTop:140,position:"absolute"}}>
        <Pressable style={{marginRight:10}}>
          <View style={{backgroundColor:"white",width:160,height:160,borderRadius:30,justifyContent: 'center', alignItems: 'center'}}>
            <Image source={require("../assets/add.png")}/>
            <Text style={{color:"black",fontWeight:"bold"}}>Catat Peserta</Text>
          </View>
        </Pressable>
        <Pressable style={{marginLeft:10}}>
          <View style={{backgroundColor:"white",width:160,height:160,borderRadius:30,justifyContent: 'center', alignItems: 'center'}}>
            <Image source={require("../assets/daftar.png")}/>
            <Text style={{color:"black",fontWeight:"bold"}}>Daftar Peserta</Text>
          </View>
        </Pressable>
      </View>
      <View style={{flexDirection:"row",margin:30,paddingTop:340,position:"absolute"}}>
        <Pressable style={{marginRight:10}}>
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

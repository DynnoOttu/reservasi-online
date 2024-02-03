import { Alert, Image, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import Button from '../components/Button';
import axios from 'axios';

const JadwalDokter = ({route, navigation}) => {
    const { post } = route.params;
    const [tanggal, setTanggal] = useState(post.tanggal)
    const [jam, setJam] = useState(post.jam)
    const dokterId = post._id

    const handleJadwal = async () => {
        try {
            const response = await axios.patch(`http://10.10.172.27:3000/update-dokter/${dokterId}`, {
              tanggal,
              jam
            });
      
            // Handle the response, e.g., show a success message
            Alert.alert('Success', 'Buat Jadwal Dokter Success');
            // You may navigate back to the previous screen or perform any other action
            navigation.navigate('Home');
            console.log('secces jadwal dokter')
          } catch (error) {
            // Handle error, e.g., show an error message
            Alert.alert('Error', 'An error occurred while updating the Dokter');
            console.log("error buat jadwal dokter", error)
          }
    } 

  return (
    <View style={styles.page}>
    <View style={styles.container}>
      <View>
        <Image source={{ uri: post.photo }} style={styles.imageDokter} />
      </View>
      <View style={styles.titleDokter}>
        <Text
          style={{
            fontSize: 22,
            color: "black",
            fontWeight: "bold",
            marginTop: 10,
          }}
        >
          {post.name}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#bfc2c7",
            fontWeight: "regular",
            marginTop: 0,
          }}
        >
          {post.spesialis} | {post.Klinik}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#bfc2c7",
            fontWeight: "regular",
            marginTop: 0,
          }}
        >
          {post.tanggal} | {post.jam}
        </Text>
      </View>
    </View>
    <View>
        <View style={{ marginTop: 20 }}></View>
      <Text style={styles.label}>Masukan Jam</Text>
      <TextInput style={styles.input} placeholder="Input Jam"  onChangeText={setJam}/>
      <View style={{ marginTop: 10 }}></View>
      <Text style={styles.label}>Masukan Tanggal</Text>
      <TextInput style={styles.input} placeholder="Input Tanggal" onChangeText={ setTanggal}/>
    </View>
    <Button text="Buat Jadwal" onPress={handleJadwal}/>
  </View>
  )
}

export default JadwalDokter

const styles = StyleSheet.create({
    imageDokter: {
        height: 240,
        width: "auto",
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
      },
      page: {
        flex: 1,
        backgroundColor: "white",
        padding: 20,
      },
      container: {
        backgroundColor: "white",
        borderRadius: 8,
        shadowColor: "black",
        shadowOffset: { width: 8, height: 7 },
        shadowOpacity: 8.5,
        shadowRadius: 10,
        elevation: 14,
        borderRadius: 8,
        overflow: "hidden",
      },
      titleDokter: {
        padding: 10,
      },
      label: { fontSize: 14, color: "#020202", marginBottom: 6, marginTop: 10 },
      input: { borderWidth: 1, borderColor: "green", borderRadius: 8, padding: 10 },
      ButomDate: {
        backgroundColor: "#e3e5e6",
        padding: 12,
        borderRadius: 8,
        marginTop: 10,
      },
})
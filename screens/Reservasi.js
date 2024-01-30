import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Alert } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { UserType } from "../UserContext";
import axios from "axios";
import Button from "../components/Button";

const Reservasi = ({ route }) => {
  const { post } = route.params;
  const [user, setUser] = useState("");
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `http://10.10.172.27:3000/profile/${userId}`
        );
        const { user } = response.data;
        setUser(user);
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchProfile();
  }, []);

  const ajukan = () =>
  Alert.alert('Success', 'Silahkan Melakukan Pembayaran \nBRI 0920384940 \n\n *note: membawa bukti transfer saat datang ke Klinik',[
    {text: 'OK', onPress: () => console.log('OK Pressed')},
  ]);

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
        </View>
      </View>
      <View>
        <View style={{ marginTop: 40 }}></View>
        <Text style={styles.label}>Nama Pasien</Text>
        <TextInput style={styles.input} value={user.name} editable={false} />
        <View style={{ marginTop: 10 }}></View>
        <Text style={styles.label}>Masukan Jam</Text>
        <TextInput style={styles.input} placeholder="Input Jam" />
        <View style={{ marginTop: 10 }}></View>
        <Text style={styles.label}>Masukan Tanggal</Text>
        <TextInput style={styles.input} placeholder="Input Tanggal" />
      </View>
      <Button text="Ajukan" onPress={ajukan}/>
    </View>
  );
};

export default Reservasi;

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
    backgroundColor: '#e3e5e6',
    padding: 12,
    borderRadius: 8,
    marginTop: 10
  },

});

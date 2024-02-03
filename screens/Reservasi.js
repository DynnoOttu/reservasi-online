import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { UserType } from "../UserContext";
import axios from "axios";
import Button from "../components/Button";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Reservasi = ({ route, navigation }) => {
  const { post } = route.params;
  const { userId, setUserId } = useContext(UserType);
  const [dokterId, setDokterId] = useState(post._id);
  const [tanggal, setTanggal] = useState(post.tanggal);
  const [jam, setJam] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [status, setStatus] = useState("Pending");


  const showToast = () => {
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Reservation submission was successful'
    });
  }

  const showToastError = () => {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: 'Reservation error'
    });
  }


  const handleReservasi = () => {
    const data = {
      userId,
      dokterId,
      tanggal,
      jam,
      keterangan,
      status,
    };

    axios
      .post("http://10.10.172.27:3000/create-reservation", data)
      .then((response) => {
        console.log('Success reservasion'.response);
        showToast()

        setTimeout(() => {
          logout()
        }, 2000);
        setJam("");
        setKeterangan("");
      })
      .catch((error) => {
        showToastError()
        console.log("error", error);
      });
  };

  const logout = () => {
    clearAuthToken();
  };
  const clearAuthToken = async () => {
    await AsyncStorage.removeItem("authToken");
    console.log("Cleared auth token");
    navigation.replace("Login");
  };

  return (
    <View style={styles.page}>
      <ScrollView showsVerticalScrollIndicator={false}>
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
            <TouchableOpacity
              onPress={() => navigation.navigate("JadwalDokter", { post })}
            >
              <Text style={{ marginTop: 10, color: "blue" }}>
                Buat Jadwal Dokter
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <View style={{ marginTop: 20 }}></View>
          <Text style={styles.label}>Masukan Jam</Text>
          <TextInput
            style={styles.input}
            placeholder="Input Jam Untuk Pengajuan Reservasi"
            value={jam}
              onChangeText={(text) => setJam(text)}
          />
          <View style={{ marginTop: 10 }}></View>
        </View>
        <View>
          <View style={{ marginTop: -5 }}></View>
          <Text style={styles.label}>Masukan Keterangan</Text>
          <TextInput
            style={styles.input}
            placeholder="Input Keterangan Tambahan"
            value={keterangan}
              onChangeText={(text) => setKeterangan(text)}
          />
          <View style={{ marginTop: 10 }}></View>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={{
              uri: "https://buatlogoonline.com/wp-content/uploads/2022/10/Logo-Bank-BRI.png",
            }}
            style={{ width: 60, height: 60, resizeMode: "contain" }}
          />
          <Text style={{ fontSize: 16, marginLeft: 10 }}>8732939438</Text>
        </View>
        <Text style={{ color: "red" }}>Note: </Text>
        <Text>
          Harap membawa bukti pembayaran saat ingin melakukan pemeriksaan
        </Text>
        <Text style={{ marginTop: 5 }}>
          10 menit sebelum jadwal reservasi pasien sudah harus berada di klinik
        </Text>
        <Button text="Ajukan" onPress={handleReservasi} />
      </ScrollView>
      <View style={{ marginBottom: 25 }}></View>
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
    shadowOffset: { width: 8, height: 4 },
    shadowOpacity: 8.5,
    shadowRadius: 8,
    elevation: 10,
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
});

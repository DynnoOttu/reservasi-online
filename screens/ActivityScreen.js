import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserType } from "../UserContext";
import { AntDesign } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { Empty } from "../assets";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ActivityScreen = () => {
  const [selectedButton, setSelctedButton] = useState("riwayat");
  const [content, setContent] = useState("People Content");
  const [users, setUsers] = useState([]);
  const { userId, setUserId } = useContext(UserType);
  const [reservasi, setReservasi] = useState([]);
  const [pemeriksaan, setPemeriksaan] = useState([]);

  const handleButtonClick = (buttonName) => {
    setSelctedButton(buttonName);
  };
  useEffect(() => {
    const fetchReserfasi = async () => {
      try {
        const response = await axios.get(
          `http://10.10.172.27:3000/get-reservation/${userId}`
        );
        setReservasi(response.data);
        console.log("data reservasi", response.data);
      } catch (error) {
        console.log("error fetching posts", error);
      }
    };

    fetchReserfasi();

    const fetchPemeriksaan = async () => {
      try {
        const response = await axios.get(
          `http://10.10.172.27:3000/get-pemeriksaan/${userId}`
        );
        setPemeriksaan(response.data);
        console.log("data reservasi", response.data);
      } catch (error) {
        console.log("error fetching posts", error);
      }
    };

    fetchPemeriksaan();
  }, []);

  return (
    <ScrollView style={{ marginTop: 50 }}>
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Activity</Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            marginTop: 12,
          }}
        >
          <TouchableOpacity
            onPress={() => handleButtonClick("riwayat")}
            style={[
              {
                flex: 1,
                paddingVertical: 10,
                paddingHorizontal: 20,
                backgroundColor: "white",
                borderColor: "#D0D0D0",
                borderRadius: 6,
                borderWidth: 0.7,
              },
              selectedButton === "riwayat"
                ? { backgroundColor: "black" }
                : null,
            ]}
          >
            <Text
              style={[
                { textAlign: "center", fontWeight: "bold" },
                selectedButton === "riwayat"
                  ? { color: "white" }
                  : { color: "black" },
              ]}
            >
              {" "}
              Reservasi
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleButtonClick("jadwaldokter")}
            style={[
              {
                flex: 1,
                paddingVertical: 10,
                paddingHorizontal: 20,
                backgroundColor: "white",
                borderColor: "#D0D0D0",
                borderRadius: 6,
                borderWidth: 0.7,
              },
              selectedButton === "jadwaldokter"
                ? { backgroundColor: "black" }
                : null,
            ]}
          >
            <Text
              style={[
                { textAlign: "center", fontWeight: "bold" },
                selectedButton === "jadwaldokter"
                  ? { color: "white" }
                  : { color: "black" },
              ]}
            >
              Riwayat Pemeriksaan
            </Text>
          </TouchableOpacity>
        </View>

        {/* Riwayat reservasi */}
        <View>
          {selectedButton === "riwayat" && (
            <View style={{ marginTop: 20 }}>
              {reservasi && reservasi.length > 0 ? (
                <View>
                  {reservasi?.map((item) => (
                    <View
                      style={{
                        backgroundColor: "white",
                        paddingVertical: 20,
                        borderRadius: 10,
                        marginTop: 20
                      }}
                      key={item._id}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "flex-start",
                          paddingHorizontal: 20,
                          alignItems: "center",
                          marginBottom: 20,
                        }}
                      >
                        <AntDesign
                          name="medicinebox"
                          size={40}
                          color="#08a0ff"
                        />
                        <Text
                          style={{
                            marginLeft: 20,
                            fontSize: 16,
                            fontWeight: "bold",
                          }}
                        >
                          Riwayat Reservasi Online
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          paddingHorizontal: 20,
                        }}
                      >
                        <Text style={{ fontSize: 14 }}>Nama Pasien</Text>
                        <Text style={{ fontSize: 14, color: "green" }}>
                          {item.user.name}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          paddingHorizontal: 20,
                          marginTop: 5,
                        }}
                      >
                        <Text style={{ fontSize: 14 }}>Nama Dokter</Text>
                        <Text style={{ fontSize: 14, color: "green" }}>
                          {item.dokter.name}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          paddingHorizontal: 20,
                          marginTop: 5,
                        }}
                      >
                        <Text style={{ fontSize: 14 }}>Poli</Text>
                        <Text style={{ fontSize: 14, color: "green" }}>
                          {item.dokter.spesialis}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          paddingHorizontal: 20,
                          marginTop: 5,
                        }}
                      >
                        <Text style={{ fontSize: 14 }}>Nama Klinik</Text>
                        <Text style={{ fontSize: 14, color: "green" }}>
                          {item.dokter.Klinik}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          paddingHorizontal: 20,
                          marginTop: 5,
                        }}
                      >
                        <Text style={{ fontSize: 14 }}>Tanggal</Text>
                        <Text style={{ fontSize: 14, color: "green" }}>
                          {item.tanggal}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          paddingHorizontal: 20,
                          marginTop: 5,
                        }}
                      >
                        <Text style={{ fontSize: 14 }}>Jam</Text>
                        <Text style={{ fontSize: 14, color: "green" }}>
                          {item.jam}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          paddingHorizontal: 20,
                          marginTop: 5,
                        }}
                      >
                        <Text style={{ fontSize: 14, color: 'red' }}>Status Pembayaran</Text>
                        <Text style={{ fontSize: 14, color: "red" }}>
                          {item.status}
                        </Text>
                      </View>
                      <View
                        style={{
                          justifyContent: "space-between",
                          paddingHorizontal: 20,
                          marginTop: 5,
                        }}
                      >
                        <Text style={{ fontSize: 14, marginTop: 20 }}>
                          Keterangan
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            color: "#bfc2c7",
                            width: "50%",
                          }}
                        >
                          {item.keterangan}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    flex: 1,
                    marginTop: 20,
                  }}
                >
                  <Image source={Empty} />
                  <Text style={{ fontSize: 26, textAlign: "center" }}>
                    Anda tidak data Reservasi
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Riwayat pemeriksaan */}

        <View>
          {selectedButton === "jadwaldokter" && (
            <View style={{ marginTop: 20 }}>
              {pemeriksaan && pemeriksaan.length > 0 ? (
                <View>
                  {pemeriksaan?.map((item) => (
                    <View
                      style={{
                        backgroundColor: "white",
                        paddingVertical: 20,
                        borderRadius: 10,
                        marginTop: 20
                      }}
                      key={item._id}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "flex-start",
                          paddingHorizontal: 20,
                          alignItems: "center",
                          marginBottom: 20,
                        }}
                      >
                        <AntDesign
                          name="medicinebox"
                          size={40}
                          color="#08a0ff"
                        />
                        <Text
                          style={{
                            marginLeft: 20,
                            fontSize: 16,
                            fontWeight: "bold",
                          }}
                        >
                          Riwayat Pemeriksaan
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          paddingHorizontal: 20,
                        }}
                      >
                        <Text style={{ fontSize: 14 }}>Nama Pasien</Text>
                        <Text style={{ fontSize: 14, color: "green" }}>
                          {item.user.name}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          paddingHorizontal: 20,
                          marginTop: 5,
                        }}
                      >
                        <Text style={{ fontSize: 14 }}>Nama Dokter</Text>
                        <Text style={{ fontSize: 14, color: "green" }}>
                          {item.dokter.name}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          paddingHorizontal: 20,
                          marginTop: 5,
                        }}
                      >
                        <Text style={{ fontSize: 14 }}>Poli</Text>
                        <Text style={{ fontSize: 14, color: "green" }}>
                          {item.dokter.spesialis}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          paddingHorizontal: 20,
                          marginTop: 5,
                        }}
                      >
                        <Text style={{ fontSize: 14 }}>Nama Klinik</Text>
                        <Text style={{ fontSize: 14, color: "green" }}>
                          {item.dokter.Klinik}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          paddingHorizontal: 20,
                          marginTop: 5,
                        }}
                      >
                        <Text style={{ fontSize: 14 }}>Tanggal</Text>
                        <Text style={{ fontSize: 14, color: "green" }}>
                          {item.tanggal}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          paddingHorizontal: 20,
                          marginTop: 5,
                        }}
                      >
                        <Text style={{ fontSize: 14 }}>Jam</Text>
                        <Text style={{ fontSize: 14, color: "green" }}>
                          {item.jam}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          paddingHorizontal: 20,
                          marginTop: 5,
                        }}
                      >
                        <Text style={{ fontSize: 14 }}>Status</Text>
                        <Text style={{ fontSize: 14, color: "green" }}>
                          {item.status}
                        </Text>
                      </View>
                      <View
                        style={{
                          justifyContent: "space-between",
                          paddingHorizontal: 20,
                          marginTop: 5,
                        }}
                      >
                        <Text style={{ fontSize: 14, marginTop: 20 }}>
                          Keterangan
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            color: "#bfc2c7",
                            width: "50%",
                          }}
                        >
                          {item.keterangan}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    flex: 1,
                    marginTop: 20,
                  }}
                >
                  <Image source={Empty} />
                  <Text style={{ fontSize: 26, textAlign: "center" }}>
                    Anda tidak memiliki Riwayat Pemeriksaan
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default ActivityScreen;

const styles = StyleSheet.create({});

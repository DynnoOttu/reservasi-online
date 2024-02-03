import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useContext, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import { UserType } from "../UserContext";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import { ImgMain } from "../assets";

const HomeScreen = ({navigation}) => {
  const { userId, setUserId } = useContext(UserType);
  const [dokter, setDokter] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
    };

    fetchUsers();
  }, []);
  useEffect(() => {
    fetchDokter();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchDokter();
    }, [])
  );

  const fetchDokter = async () => {
    try {
      const response = await axios.get("http://10.10.172.27:3000/get-dokter/");
      setDokter(response.data);
    } catch (error) {
      console.log("error fetching posts", error);
    }
  };
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
      <View>
        <Image source={ImgMain} style={styles.image} />
      </View>
      <View style={{ alignItems: "center", marginTop: 20 }}>
        <Text style={{ fontSize: 26, fontWeight: "bold", color: "green" }}>
          List Dokter
        </Text>
        <Text style={{ fontSize: 12, fontWeight: "light", color: '#bfc2c7'}}>Silahkan memilih Dokter untuk melakukan reservasi</Text>
      </View>
      <View style={{ marginTop: 20 }}>
        {dokter?.map((post) => (
          <TouchableOpacity onPress={() => navigation.navigate('Reservasi', {post})}>
          <View
            style={{
              padding: 15,
              flexDirection: "row",
              gap: 10,
              marginVertical: 10,
            }}
            key={post._id}
          >
            <View>
              <Image
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 10
                }}
                source={{
                  uri: `${post.photo}`,
                }}
              />
            </View>

            <View>
              <Text
                style={{
                  fontSize: 20,
                  marginBottom: 4,
                  fontWeight: "bold",
                }}
              >
                {post.name}
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  marginBottom: 4,
                }}
              >
                {post.spesialis}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  marginBottom: 4,
                  color: '#bfc2c7'
                }}
              >
                {post.Klinik}
              </Text>
            </View>
          </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  image: {
    height: 320,
    width: 410,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 50,
  },
});

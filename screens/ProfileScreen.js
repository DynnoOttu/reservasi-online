import { StyleSheet, Text, View, Image, Pressable, TextInput, Button } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserType } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";

const ProfileScreen = () => {
  const [user, setUser] = useState("");
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);


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

  const showToast = () => {
    Toast.show({
      type: 'success',
      text1: 'Update Success',
      text2: 'Anda telah berhasil melakukan update profile'
    });
  }

 
  const handleUpdateProfile = async () => {
    try {
      const update = await axios.put(`http://10.10.172.27:3000/profile/${userId}`, {
        name,
        email,
      });

      if (update.status === 200) {
        console.log('Profile updated successfully', update.data);
        showToast()

        setTimeout(() => {
          logout()
        }, 2000);
          
        // Redirect atau lakukan tindakan lain setelah pembaruan berhasil
      } else {
        console.error('Failed to update profile', update.data);
        // Handle kesalahan atau beri tahu pengguna
      }
    } catch (error) {
      if (error.response) {
        console.error('Error updating profile', error.response.status, error.response.data);
      } else {
        console.error('Error updating profile', error.message);
      }
    }
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
    <View style={{ marginTop: 55, padding: 15 }}>
      <View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <View
            style={{
              paddingHorizontal: 7,
              paddingVertical: 5,
              borderRadius: 8,
              backgroundColor: "#D0D0D0",
            }}
          ></View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 20,
            marginTop: 15,
          }}
        >
          <View>
            <Image
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                resizeMode: "contain",
              }}
              source={{
                uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
              }}
            />
          </View>

          <View>
            <Text style={{ fontSize: 15, fontWeight: "400" }}>
              {user.email}
            </Text>
            <Text style={{ fontSize: 15, fontWeight: "400" }}>{user.name}</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            marginTop: 20,
          }}
        >
          <Pressable
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              borderRadius: 5,
            }}
          >
            <Text>Edit Profile</Text>
          </Pressable>

          <Pressable
            onPress={logout}
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              borderRadius: 5,
            }}
          >
            <Text>Logout</Text>
          </Pressable>
        </View>
      </View>

      <View style={{ marginTop: 60 }}>
        <View style={{ borderWidth: 1, borderColor: 'green' }}>
        <TextInput
        placeholder="Name"
        value={name}
        onChangeText={(text) => setName(text)}
        style={{ padding: 10 }}
      />
        </View>

        <View style={{ borderWidth: 1, borderColor: 'green', marginTop: 10, marginBottom: 30 }}>
        <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={{ padding: 10 }}
      />
        </View>
      <Button title="Update Profile" onPress={handleUpdateProfile} style={{ padding: 20 }}/>
    </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({});

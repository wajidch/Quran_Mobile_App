import React from "react";
import {
  View,
  SafeAreaView,
  Dimensions,
  Text,
  ScrollView,
  Pressable,
} from "react-native";

import { Headline, Surface } from "react-native-paper";
import { INavigation } from "../interfaces/navigationInterface";
import { surahList } from "../sample-data/dataList";
import { styles } from "../stylings/homeScreenStyles";
import { FlatList } from "react-native-gesture-handler";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

function HomeScreen({ navigation }: INavigation) {
  const Item = ({ title }: any) => (
    <Pressable
      onPress={() => navigation.navigate("Surah", { id: title.index })}
    >
      <View style={styles.item}>
        <Text style={styles.title}>
          {title.index} {title.title}
        </Text>
      </View>
    </Pressable>
  );
  const renderItem = ({ item }: any) => {
    return <Item title={item} key={item.index} />;
  };
  return (
    <Surface style={styles.container}>
      <Headline style={styles.headingText}>Select Surah</Headline>
        <View style={styles.safeContainerStyle}>
          <FlatList
            data={surahList}
            renderItem={renderItem}
            keyExtractor={(item) => item.index}
          />
        </View>
    </Surface>
  );
}

export default HomeScreen;

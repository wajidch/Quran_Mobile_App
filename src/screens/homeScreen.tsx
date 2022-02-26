import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Text,
  ScrollView,
  Pressable,
  FlatList,
} from "react-native";
import Voice from "@react-native-voice/voice";
import axios from "axios";

import {
  ActivityIndicator,
  Avatar,
  Button,
  Card,
  Headline,
  Paragraph,
  Surface,
  Title,
} from "react-native-paper";
import { INavigation } from "../interfaces/navigationInterface";
import DropDown from "react-native-paper-dropdown";
import { useSelector } from "react-redux";
import { RecognitionMode } from "../interfaces/recognitionModeEnum";
import AsyncStorage from "@react-native-async-storage/async-storage";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

interface IApiSurah {
  ayah: string;
  ayahNumber: number;
}
function HomeScreen({ navigation }: INavigation) {
  const [result, setResult] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isMemorize, setIsMemorize] = useState(false);
  const recognitionMode = useSelector((state: any) => state.recognitionMode);
  const [showDropDown, setShowDropDown] = useState(false);
  const [thershold, setThershold] = useState<string>("");
  const [showModelDropDown, setShowModelDropDown] = useState(false);
  const [model, setModel] = useState<string>("");
  const [showSurahDropDown, setShowSurahDropDown] = useState(false);
  const [surah, setSurah] = useState<number>();
  const [surahLoading, setSurahLoading] = useState(false);
  const [isRecording, setisRecording] = useState(true);
  const [apiSurah, setApiSurah] = useState<IApiSurah[]>([]);
  const [errorMesage, setErrorMessage] = useState("");
  const thersholdList = [
    { label: "1", value: 1 },
    { label: "2", value: 2 },
    { label: "3", value: 3 },
    { label: "4", value: 4 },
  ];
  const modelList = [
    { label: "Model 1", value: 1 },
    { label: "Model 2", value: 2 },
    { label: "Model 3", value: 3 },
    { label: "Model 4", value: 4 },
  ];
  const surahList = [
    { label: "Select Surah", value: 0 },
    { label: "1", value: 1 },
    { label: "2", value: 2 },
    { label: "3", value: 3 },
    { label: "4", value: 4 },
    { label: "5", value: 5 },
    { label: "6", value: 6 },
    { label: "7", value: 7 },
    { label: "8", value: 8 },
    { label: "9", value: 9 },
    { label: "10", value: 10 },
    { label: "11", value: 11 },
    { label: "12", value: 12 },
    { label: "13", value: 13 },
    { label: "14", value: 14 },
    { label: "15", value: 15 },
    { label: "16", value: 16 },
    { label: "17", value: 17 },
    { label: "18", value: 18 },
    { label: "19", value: 19 },
    { label: "20", value: 20 },
    { label: "21", value: 21 },
    { label: "22", value: 22 },
    { label: "23", value: 23 },
    { label: "24", value: 24 },
  ];

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStartHandler;
    Voice.onSpeechEnd = onSpeechEndHandler;
    Voice.onSpeechResults = onSpeechResultsHandler;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);
  React.useEffect(() => {
    const call = async () => {
      if (surah && surah != 0) {
        setisRecording(false);
        setErrorMessage("");
        setSurahLoading(true);
        const storageSurah = await getData(`@surah_${surah}`);
        if (storageSurah.length < 1) {
          axios
            .get(
              `https://j3meoo7m7l.execute-api.us-east-2.amazonaws.com/dev/quran_data/${surah}`
            )
            .then(async function (response) {
              setisRecording(false);
              const apiSurah: IApiSurah[] =
                response.data.result[0]?.surah_details?.map((sur: any) => {
                  return { ayah: sur.ayah, ayahNumber: sur.n_ayah };
                });
              await saveToStorage(`@surah_${surah}`, JSON.stringify(apiSurah));
              setSurahLoading(false);
              setApiSurah(apiSurah);
            })
            .catch(function (error) {
              setSurahLoading(false);
              setErrorMessage("Something went wrong. Please try again.");
              setApiSurah([]);
              console.log(error);
            });
        } else {
          setApiSurah(storageSurah);
          setSurahLoading(false);
        }
      }
    };
    call();
  }, [surah]);
  const saveToStorage = async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      console.log(e);
    }
  };
  const getData = async (key: string): Promise<IApiSurah[]> => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      return [];
    }
  };
  const onSpeechStartHandler = (e: any) => {
    console.log("start handler==>>>", e);
  };
  const onSpeechEndHandler = (e: any) => {
    setLoading(false);
    console.log("stop handler", e);
  };

  const onSpeechResultsHandler = (e: any) => {
    let text = e.value[0];
    setResult(text);
    setisRecording(true);
    setApiSurah([]);
    console.log("speech result handler", e);
  };

  const startRecording = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      await Voice.start("ar-EG");
    } catch (error) {
      console.log("Start error raised", error);
    }
  };

  const stopRecording = async () => {
    setLoading(false);
    try {
      await Voice.stop();
    } catch (error) {
      console.log("Stop error raised", error);
    }
  };
  const pickDocument = async () => {
    // let result = await DocumentPicker.getDocumentAsync({});
    console.log(result);
  };
  const onMemorizeClick = () => {
    setIsMemorize(!isMemorize);
  };
  return (
    <Surface style={styles.container}>
      <ScrollView>
        <Headline style={styles.headingText}>Voice Recognition</Headline>

        <SafeAreaView style={styles.safeContainerStyle}>
          <View style={[styles.flexRow]}>
            <View style={styles.flexOne}>
              <DropDown
                label={"Thershold"}
                mode={"flat"}
                visible={showDropDown}
                showDropDown={() => setShowDropDown(true)}
                onDismiss={() => setShowDropDown(false)}
                value={thershold}
                setValue={setThershold}
                list={thersholdList}
              />
            </View>
            <View style={styles.spacerHorizontalStyle} />
            <View style={styles.flexOne}>
              <DropDown
                label={"Model"}
                mode={"flat"}
                visible={showModelDropDown}
                showDropDown={() => setShowModelDropDown(true)}
                onDismiss={() => setShowModelDropDown(false)}
                value={model}
                setValue={setModel}
                list={modelList}
              />
            </View>
          </View>
          <View style={styles.spacerStyle} />
          {recognitionMode === RecognitionMode.Recording ? (
            <View>
              <View style={[styles.flexRow]}>
                <View style={styles.flexOne}>
                  <DropDown
                    label={"Surah"}
                    mode={"flat"}
                    visible={showSurahDropDown}
                    showDropDown={() => setShowSurahDropDown(true)}
                    onDismiss={() => setShowSurahDropDown(false)}
                    value={surah}
                    setValue={setSurah}
                    list={surahList}
                  />
                </View>
              </View>
              <View style={styles.spacerStyle} />
              <View style={[styles.flexRow, styles.buttoneSection]}>
                {isLoading ? (
                  <Button
                    icon="stop-circle"
                    disabled={!isLoading}
                    mode="contained"
                    onPress={stopRecording}
                    color="red"
                  >
                    Stop
                  </Button>
                ) : (
                  <Button
                    icon="microphone"
                    mode="contained"
                    onPress={startRecording}
                    loading={isLoading}
                    disabled={isLoading}
                  >
                    Record
                  </Button>
                )}
                <Button mode="contained" onPress={onMemorizeClick}>
                  Memorize
                </Button>
              </View>
            </View>
          ) : (
            <View style={styles.uploadFileView}>
              <Button icon="file" color="black" onPress={pickDocument}>
                Upload your file
              </Button>
            </View>
          )}
          <View style={styles.spacerStyle} />
          <View>
            <Pressable>
              <Card>
                <Card.Content>
                  <Title>{isRecording ? "Translation" : "Surah"}</Title>
                  <View>
                    {isRecording ? (
                      surahLoading ? (
                        <ActivityIndicator size="large" />
                      ) : (
                        <Paragraph style={isMemorize ? [styles.blurView] : []}>
                          {result || "Please Record"}
                        </Paragraph>
                      )
                    ) : surahLoading ? (
                      <ActivityIndicator size="large" />
                    ) : (
                      <View>
                        {apiSurah.map((sur, index) => {
                          return (
                            <View key={index} style={styles.list}>
                              <Text
                                style={
                                  isMemorize
                                    ? [styles.blurView]
                                    : [styles.noBlurView]
                                }
                                key={index}
                              >
                                {sur.ayah}{" "}
                                <Avatar.Icon
                                  size={18}
                                  icon="checkbox-blank-circle-outline"
                                />
                              </Text>
                            </View>
                          );
                        })}
                        <Paragraph style={styles.errorMessage}>{errorMesage}</Paragraph>
                      </View>
                    )}
                  </View>
                </Card.Content>
              </Card>
            </Pressable>
          </View>
        </SafeAreaView>
      </ScrollView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headingText: {
    alignSelf: "center",
  },
  buttoneSection: {
    justifyContent: "space-between",
  },
  flexOne: {
    flex: 1,
  },
  flexRow: {
    flexDirection: "row",
  },
  uploadFileView: {
    borderColor: "black",
    borderWidth: 0.9,
  },
  blurView: {
    backgroundColor: "rgba(192,192,192,0.6)",
    color: "rgba(192,192,192,0.3)",
    fontSize: 18,
  },
  noBlurView: {
    backgroundColor: "white",
    color: "black",
    fontSize: 18,
  },
  errorMessage: {
    color: "red",
  },
  list: {
    marginTop: 30,
  },
  spacerStyle: {
    marginBottom: 15,
  },
  spacerHorizontalStyle: {
    marginLeft: 5,
    marginRight: 5,
  },
  safeContainerStyle: {
    flex: 1,
    margin: 20,
  },
});

export default HomeScreen;

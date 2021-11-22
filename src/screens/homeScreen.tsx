import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Text,
  ScrollView,
  Pressable,
} from "react-native";
import { BlurView } from "expo-blur";
import Voice from "@react-native-voice/voice";
import axios from "axios";

import {
  ActivityIndicator,
  Button,
  Card,
  Headline,
  Paragraph,
  Surface,
  Title,
} from "react-native-paper";
import { INavigation } from "../interfaces/navigationInterface";
import DropDown from "react-native-paper-dropdown";
import { Audio } from "expo-av";
import { useSelector } from "react-redux";
import { RecognitionMode } from "../interfaces/recognitionModeEnum";
import * as DocumentPicker from "expo-document-picker";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

interface IApiSurah {
  ayah: string;
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
  ];
  // const slectedSurah = apiSurah?.map((sur, index) => {
  //   return (

  //   );
  // });
  // const [permission, askPermission, getPermission] = usePermissions(Permissions.AUDIO_RECORDING, { ask: true });
  useEffect(() => {
    Voice.onSpeechStart = onSpeechStartHandler;
    Voice.onSpeechEnd = onSpeechEndHandler;
    Voice.onSpeechResults = onSpeechResultsHandler;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);
  React.useEffect(() => {
    if (surah && surah != 0) {
      setSurahLoading(true);
      axios
        .get(
          `https://j3meoo7m7l.execute-api.us-east-2.amazonaws.com/dev/quran_data/${surah}`
        )
        .then(function (response) {
          setisRecording(false);
          const apiSurah: IApiSurah[] =
            response.data.result[0]?.surah_details?.map((sur: any) => {
              return { ayah: sur.ayah };
            });
          setSurahLoading(false);
          setApiSurah(apiSurah);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, [surah]);

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
    await Audio.requestPermissionsAsync();
    // await Audio.setAudioModeAsync({
    //   allowsRecordingIOS: true,
    //   playsInSilentModeIOS: true,
    // });
    console.log("Starting... recording..");
    try {
      await Voice.start("ar-EG");
    } catch (error) {
      console.log("Start error raised", error);
    }
  };

  const stopRecording = async () => {
    console.log("stopping..");
    setLoading(false);
    try {
      await Voice.stop();
    } catch (error) {
      console.log("Stop error raised", error);
    }
  };
  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
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
                  <Title>Translation</Title>
                  <View>
                    {isRecording ? (
                      <Paragraph style={isMemorize ? [styles.blurView] : []}>
                        {result || "Please Record"}
                      </Paragraph>
                    ) : surahLoading ? (
                      <ActivityIndicator size="large" />
                    ) : (
                      apiSurah.map((sur, index) => {
                        return (
                          <Text
                            style={
                              isMemorize
                                ? [styles.blurView]
                                : [styles.noBlurView]
                            }
                            key={index}
                          >
                            {sur.ayah}
                          </Text>
                        );
                      })
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

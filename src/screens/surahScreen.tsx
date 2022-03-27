import React from "react";
import {
  View,
  SafeAreaView,
  Text,
  ScrollView,
  PermissionsAndroid,
} from "react-native";
import Voice from "@react-native-voice/voice";
import axios from "axios";

import {
  ActivityIndicator,
  Avatar,
  Button,
  Paragraph,
  Surface,
} from "react-native-paper";
import { INavigation } from "../interfaces/navigationInterface";
import { useSelector } from "react-redux";
import { saveToStorage, getData } from "../utils/localStorage";
import { IApiSurah, IItem, ISurahList } from "../interfaces/allInterfaces";
import { styles } from "../stylings/surahScreenStyles";

function SurahScreen({ route, navigation }: INavigation) {
  const [result, setResult] = React.useState("");
  const [isLoading, setLoading] = React.useState(false);
  const [isMemorize, setIsMemorize] = React.useState(false);
  const recognitionMode = useSelector((state: any) => state.recognitionMode);
  const [surah, setSurah] = React.useState<number>(route.params.id);
  const [surahLoading, setSurahLoading] = React.useState(false);
  const [isRecording, setisRecording] = React.useState(true);
  const [apiSurah, setApiSurah] = React.useState<IApiSurah[]>([]);
  const [errorMesage, setErrorMessage] = React.useState("");
  React.useEffect(() => {
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
  }, []);

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
    // setApiSurah([]);
    console.log("speech result handler", e);
  };
  const startRecording = async () => {
    console.log("Starting recording");
    try {
      setLoading(true);
      setErrorMessage("");
      await Voice.start("ar-EG");
    } catch (err) {
      console.warn(err);
    }
  };
  const stopRecording = async () => {
    console.log("stoping recording");
    setLoading(false);
    try {
      await Voice.stop();
    } catch (error) {
      console.log("Stop error raised", error);
    }
  };
  const onMemorizeClick = () => {
    setIsMemorize(!isMemorize);
  };
  return (
    <Surface style={styles.container}>
      <View style={styles.surahContainer}>
        {surahLoading ? (
          <ActivityIndicator size="large" />
        ) : (
          <ScrollView>
            <View>
              <Text
                style={[
                  styles.flexRow,
                  isMemorize ? [styles.blurView] : [styles.noBlurView],
                ]}
              >
                {apiSurah.map((sur, index) => {
                  return (
                    <>
                      {sur.ayah}
                      <Avatar.Icon
                        key={index}
                        size={18}
                        icon="checkbox-blank-circle-outline"
                      />
                    </>
                  );
                })}
              </Text>
              <Paragraph style={styles.errorMessage}>{errorMesage}</Paragraph>
            </View>
          </ScrollView>
        )}
      </View>
      <SafeAreaView style={styles.buttonContainer}>
        <View>
          <View style={[styles.flexRow, styles.buttonSection]}>
            <Button mode="contained" onPress={onMemorizeClick}>
              Memorize
            </Button>
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
          </View>
        </View>
      </SafeAreaView>
    </Surface>
  );
}

export default SurahScreen;

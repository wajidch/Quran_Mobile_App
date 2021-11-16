import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import Voice from "@react-native-voice/voice";
import {
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

function HomeScreen({ navigation }: INavigation) {
  const [result, setResult] = useState("");
  const [isLoading, setLoading] = useState(false);

  const [showDropDown, setShowDropDown] = useState(false);
  const [thershold, setThershold] = useState<string>("");
  const thersholdList = [
    { label: "1", value: 1 },
    { label: "2", value: 2 },
    { label: "3", value: 3 },
    { label: "4", value: 4 },
  ];
  // const [permission, askPermission, getPermission] = usePermissions(Permissions.AUDIO_RECORDING, { ask: true });
  useEffect(() => {
    Voice.onSpeechStart = onSpeechStartHandler;
    Voice.onSpeechEnd = onSpeechEndHandler;
    Voice.onSpeechResults = onSpeechResultsHandler;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
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
  return (
    <Surface style={styles.container}>
      <Headline style={styles.headingText}>Voice Recognition</Headline>
      <SafeAreaView style={styles.safeContainerStyle}>
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
        <View style={styles.spacerStyle} />
        <View style={styles.buttonsSection}>
          <Button
            icon="microphone"
            mode="contained"
            onPress={startRecording}
            loading={isLoading}
            disabled={isLoading}
          >
            Record
          </Button>
          <View style={styles.spacerHorizontalStyle} />
          <Button
            icon="stop-circle"
            disabled={!isLoading}
            mode="contained"
            onPress={stopRecording}
            color="red"
          >
            Stop
          </Button>
          <View style={styles.spacerHorizontalStyle} />
          <Button icon="check" mode="contained">
            Analyze
          </Button>
        </View>
        <View style={styles.spacerStyle} />
        <View>
          <Card>
            <Card.Content>
              <Title>Translation</Title>
              <Paragraph>{result || "Please Record"}</Paragraph>
            </Card.Content>
          </Card>
        </View>
      </SafeAreaView>
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
  textInputStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    minHeight: 48,
    borderRadius: 10,
    paddingHorizontal: 16,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
    shadowOpacity: 0.4,
  },
  buttonsSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    // marginTop: '1%'
  },
  thersholdSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  thersholdText: {
    justifyContent: "center",
    alignItems: "center",
  },
  thersholdDropdown: {
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
  },
  stopButton: {
    backgroundColor: "red",
    padding: 8,
    borderRadius: 4,
    width: "20%",
    justifyContent: "center",
    alignItems: "center",
  },
  recordButton: {
    backgroundColor: "blue",
    padding: 8,
    borderRadius: 4,
    width: "20%",
    justifyContent: "center",
    alignItems: "center",
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

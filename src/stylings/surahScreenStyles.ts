import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding:20,
    },
    buttonSection: {
      justifyContent: "space-between",
    },
    flexOne: {
      flex: 1,
    },
    flexRow: {
      flexDirection: "row",
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
    surahContainer: {
      flex: 0.9,
      justifyContent:'flex-start'
    },
    buttonContainer: {
      flex: 0.1,
      flexDirection:'column-reverse'
    }
  });
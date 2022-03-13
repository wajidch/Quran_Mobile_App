import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
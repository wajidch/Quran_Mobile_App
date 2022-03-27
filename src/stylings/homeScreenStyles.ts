import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    headingText: {
      alignSelf: "center",
    },
    flexOne: {
      flex: 1,
    },
    flexRow: {
      flexDirection: "row",
    },
    spacerStyle: {
      marginBottom: 15,
    },
    safeContainerStyle: {
      flex: 1,
      margin: 20,
    },
    item: {
      borderBottomWidth: 0.3,
      borderBottomColor: "black",
      padding: 5,
      marginVertical: 4,
      elevation: 0.2
    },
    title: {
      fontSize: 18,
      color: "black",
    }
  });
import { Appbar, IconButton, Menu } from "react-native-paper";
import React from "react";
import { INavigation } from "../interfaces/navigationInterface";
import { useDispatch, useSelector } from "react-redux";
import { StyleSheet } from "react-native";

function CustomNavigationBar({ navigation, back }: INavigation) {
  return (
    <Appbar.Header>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title="Hafiz Speech Recognition Platform" />
    </Appbar.Header>
  );
}
const styles = StyleSheet.create({
  headerDropDown: {
    backgroundColor: "#e7e7e7",
  }
});
export default CustomNavigationBar;

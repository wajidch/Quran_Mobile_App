import { Appbar, IconButton, Menu } from "react-native-paper";
import React from "react";
import { INavigation } from "../interfaces/navigationInterface";
import { useDispatch, useSelector } from "react-redux";
import { StyleSheet } from "react-native";

function CustomNavigationBar({ navigation, back }: INavigation) {
  const recognitionMode = useSelector((state: any) => state.recognitionMode);
  const dispatch = useDispatch();
  const RecognitionMode = [
    { label: "Recording", value: 1 },
    { label: "File Upload", value: 2 },
  ];

  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const onPickerSelect = (value: number) => {
    dispatch({ type: "RECOGNITION_MODE", payload: value });
    closeMenu();
  };
  const pickerList = RecognitionMode.map((reco, index) => {
    return (
      <Menu.Item
        disabled={recognitionMode === reco.value}
        key={index}
        onPress={() => onPickerSelect(reco.value)}
        title={reco.label}
      />
    );
  });
  return (
    <Appbar.Header>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title="Hafiz Speech Recognition Platform" />
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <IconButton
            icon="chevron-down"
            style={styles.headerDropDown}
            onPress={openMenu}
          />
        }
      >
        {pickerList}
      </Menu>
    </Appbar.Header>
  );
}
const styles = StyleSheet.create({
  headerDropDown: {
    backgroundColor: "#e7e7e7",
  }
});
export default CustomNavigationBar;

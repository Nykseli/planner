import React from 'react';
import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import { Alert, Button, StyleSheet, Modal, Platform, Pressable, TextInput } from 'react-native';
import DateTimePicker, { AndroidNativeProps, Event } from '@react-native-community/datetimepicker';

import Colors from '@/constants/Colors';
import { Text, View } from './Themed';
import Layout from '@/constants/Layout';

type VisibiltyCb = (bool?: boolean) => void;

interface ITaskItemModal {
  children: React.ReactChild | React.ReactChild[] | React.ReactChildren
}

interface IFullScreenModalView {
  children: React.ReactChild | React.ReactChild[] | React.ReactChildren,
  visible: boolean,
  visibilityCb: VisibiltyCb,
}

const FullScreenModalView = (props: IFullScreenModalView) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.visible}
      onRequestClose={() => {
        props.visibilityCb(!props.visible);
      }}>
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          {props.children}
        </View>
      </View>
    </Modal>
  );
}

const EditControlButtons = ({ visibilityCb }: { visibilityCb: VisibiltyCb }) => {
  return (
    <View style={styles.controlButtons}>
      <View style={styles.controlLeftButtons}>
        <Pressable
          style={styles.controlButton}
          onPress={() => visibilityCb(false)} >
          <AntDesign name="close" size={34} />
        </Pressable>
      </View>
      <View style={styles.controlRightButtons}>
        <Pressable
          style={styles.controlButton}
          /* TODO: actually update the task onPress={() => save()} */>
          <MaterialIcons name="done" size={34} />
        </Pressable>
      </View>
    </View>
  );
}

const EditFields = () => {
  const [title, onChangeTitle] = React.useState<string>("Title lorem");
  const [description, onChangeDescription] = React.useState<string>("Description...");
  const [date, setDate] = React.useState<Date>(new Date());
  // Both AndroidNativeProps and IOSNativeProps modes contain "date" and "time"
  const [pickerMode, setPickerMode] = React.useState<AndroidNativeProps['mode']>('date');
  const [showPicker, setShowPicker] = React.useState<boolean>(false);

  const onDateChange = (event: Event, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === 'ios');
    setDate(currentDate);
  }

  const showMode = (currentMode: AndroidNativeProps['mode']) => {
    setShowPicker(true);
    setPickerMode(currentMode);
  }

  const showDatepicker = () => {
    showMode('date');
  }

  const showTimepicker = () => {
    showMode('time');
  }

  return (
    <View style={styles.editForm}>
      <View style={styles.editInputView}>
        <TextInput
          style={styles.editTextInput}
          onChangeText={onChangeTitle}
          value={title}
        />
      </View>
      <View style={styles.editInputView}>
        {/* TODO: How do we edit the description */}
        <TextInput
          style={styles.editTextInput}
          onChangeText={onChangeDescription}
          value={description}
        />
      </View>
      <Pressable onPress={showDatepicker}>
        <View style={styles.editDateView}>
          <Feather name="edit-3" size={25} />
          {/* TODO: date range? */}
          <Text style={styles.editDateText}>21.04.2021</Text>
        </View>
      </Pressable>
      <Pressable onPress={showTimepicker}>
        <View style={styles.editDateView}>
          <Feather name="edit-3" size={25} />
          <Text style={styles.editDateText}>17.00 - 18.00</Text>
        </View>
      </Pressable>
      {showPicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={pickerMode}
          is24Hour={true}
          display="default"
          onChange={onDateChange}
        />
      )}
    </View>
  );
}

const ModalControlButtons = ({ visibilityCb }: { visibilityCb: VisibiltyCb }) => {
  const [editVisible, setEditVisible] = React.useState<boolean>(false);

  const changeEditVisiblity = (b?: boolean) => {
    if (b === undefined) {
      setEditVisible(!editVisible);
    } else {
      setEditVisible(Boolean(b));
    }
  }

  return (
    <View style={styles.controlButtons}>
      <FullScreenModalView visible={editVisible} visibilityCb={changeEditVisiblity}>
        <EditControlButtons visibilityCb={changeEditVisiblity} />
        <EditFields />
      </FullScreenModalView>
      <View style={styles.controlLeftButtons}>
        <Pressable
          style={styles.controlButton}
          onPress={() => visibilityCb(false)} >
          <AntDesign name="close" size={34} />
        </Pressable>
      </View>
      <View style={styles.controlRightButtons}>
        <Pressable
          style={styles.controlButton}
          onPress={() => changeEditVisiblity(true)} >
          <Feather name="edit-3" size={34} />
        </Pressable>
        <Pressable
          style={styles.controlButton}
          onPress={() => Alert.alert(
            "Delete task?",
            "This deletion cannot be reversed",
            [
              // TODO: onPress functionality
              // TODO: Should delete text be bold and red?
              { text: "Delete" },
              { text: "Cancel" }
            ]
          )}>
          <AntDesign name="delete" size={34} />
        </Pressable>
      </View>
    </View>
  );
}

const TaskItemInfo = () => {
  // TODO: max info text lenght. 255? the current lorem ipsum is 475
  // TODO: picture preview. clicking the thumbnail
  //       will open the picture into new full screen modal
  return (
    <View style={styles.itemInfo}>
      <Text style={styles.itemInfoTitle}>Item title</Text>
      <Text style={styles.itemInfoDate}>22.04.2021 17.00 - 18.00</Text>
      <Text style={styles.itemInfoText}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque congue
        tortor ligula, sit amet eleifend erat bibendum sed. Donec aliquam gravida
        diam, vitae luctus orci vulputate ac. Fusce scelerisque, lectus vel
        maximus luctus, risus augue blandit diam, vel pharetra nisl urna sit
        amet est. Integer nec libero id dui ullamcorper posuere id ut risus.
        Suspendisse porta, tortor at auctor fringilla, nulla magna bibendum diam,
        eu commodo mauris ligula eu nibh. In vel ante mi.
      </Text>
    </View>
  );
}

// TODO: use reducer to show the information?
const TaskItemModal = (props: ITaskItemModal) => {
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);

  const changeVisiblity = (b?: boolean) => {
    if (b === undefined) {
      setModalVisible(!modalVisible);
    } else {
      setModalVisible(Boolean(b));
    }
  }

  return (
    <View style={styles.centeredView}>
      <FullScreenModalView visibilityCb={changeVisiblity} visible={modalVisible}>
        <ModalControlButtons visibilityCb={changeVisiblity} />
        <TaskItemInfo />
      </FullScreenModalView>
      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => changeVisiblity(true)}
      >
        {props.children}
      </Pressable>
    </View>
  );

}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.seeThrough
  },
  controlButton: {
    backgroundColor: Colors.seeThrough,
    paddingRight: 15,
  },
  controlButtons: {
    flexDirection: 'row'
  },
  controlLeftButtons: {
    flex: 1,
    flexDirection: 'row'
  },
  controlRightButtons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  editForm: {
    paddingTop: 30,
  },
  editDateView: {
    paddingBottom: 15,
    flexDirection: 'row'
  },
  editDateText: {
    paddingLeft: 10,
    fontSize: 16,
  },
  editInputView: {
    paddingBottom: 15
  },
  editTextInput: {
    borderBottomWidth: 1,
    fontSize: 16,
  },
  itemInfo: {
    paddingTop: 30,
    paddingRight: 10,
  },
  itemInfoDate: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingTop: 5,
  },
  itemInfoTitle: {
    fontSize: 30,
    fontWeight: 'bold'
  },
  itemInfoText: {
    paddingTop: 15,
    fontSize: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: Layout.screen.width,
    height: Layout.screen.height,
    backgroundColor: Colors.seeThrough,
    // TODO: fix position workaround
    // We have to set modalContainer's position as absolute, since the keyboard
    // pushes the text fields out of the view otherwise.
    // This is seems to be a problem specificly with Modal view.
    // "softwareKeyboardLayoutMode": "pan" in app.json fixes it in other views.
    position: 'absolute'
  },
  modalView: {
    width: Layout.screen.width,
    height: Layout.screen.height,
    backgroundColor: "white",
    // TODO: make sure that all the items are visible with safe views etc
    paddingTop: 20,
    paddingLeft: 15,
    paddingRight: 10,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: Colors.seeThrough
  },
  buttonOpen: {
    // TODO: color that fits the overall style
    backgroundColor: "#F194FF",
  }
});


export default TaskItemModal;

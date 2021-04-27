import React from 'react';
import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import { Alert, StyleSheet, Modal, Platform, Pressable, TextInput } from 'react-native';
import DateTimePicker, { AndroidNativeProps, Event } from '@react-native-community/datetimepicker';

import Colors from '@/constants/Colors';
import { Text, View } from './Themed';
import Layout from '@/constants/Layout';
import { DailyTask, DateInfo, IDailyTask } from '@/data/dataObjects';
import { timeDateFmt } from '@/util/datetime';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { addNewDailyTask } from '@/data/redux/reducers/dailyTasks';

type VisibiltyCb = (bool?: boolean) => void;
type TaskEditCb = (task: IDailyTask) => void;

interface ITaskItemModal {
  children: React.ReactChild | React.ReactChild[] | React.ReactChildren
}

interface IEditTaskItemModal {
  visible: boolean;
  visibilityCb: VisibiltyCb;
  // If editable is set, TaskItemModal edits existing daily task.
  // If not set, new one is created on save.
  editable?: IDailyTask;
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

/**
 * If the task is new, it will be added to databse.
 * If not, it will be updated.
 */
const EditControlButtons = ({ task, isNew, visibilityCb }:
  { task: IDailyTask, isNew: boolean, visibilityCb: VisibiltyCb }) => {

  const dispatch = useAppDispatch();

  const updateDailyTask = () => {
    if (isNew)
      dispatch(addNewDailyTask(task));

    // TODO: update if not new
  }

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
          onPress={() => updateDailyTask()}>
          <MaterialIcons name="done" size={34} />
        </Pressable>
      </View>
    </View >
  );
}

const EditFields = ({ editable, editCb }:
  { editable: IDailyTask, editCb: TaskEditCb }) => {
  const [date, setDate] = React.useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = React.useState<boolean>(false);
  const [showEndTimePicker, setShowEndTimePicker] = React.useState<boolean>(false);
  const [showStartTimePicker, setShowStartTimePicker] = React.useState<boolean>(false);

  const onChangeTitle = (text: string) => {
    editCb({ ...editable, title: text });
  }

  const onChangeDescription = (text: string) => {
    editCb({ ...editable, description: text });
  }

  const onDateChange = (event: Event, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
    const newDate = DateInfo.fromDate(currentDate).serialize();
    editCb({ ...editable, date: newDate });
  }

  const onStartTimeChange = (event: Event, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowStartTimePicker(Platform.OS === 'ios');
    setDate(currentDate);
    // TODO: make sure this is before end time and alert user on the error
    editCb({ ...editable, startHour: currentDate.getHours(), startMinute: currentDate.getMinutes() });
  }

  const onEndTimeChange = (event: Event, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowEndTimePicker(Platform.OS === 'ios');
    setDate(currentDate);
    // TODO: make sure this is after start time and alert user on the error
    editCb({ ...editable, endHour: currentDate.getHours(), endMinute: currentDate.getMinutes() });
  }

  const showDatepicker = () => {
    setShowDatePicker(true);
  }

  const showTimepicker = (endTime: boolean) => {
    if (endTime)
      setShowEndTimePicker(true);
    else
      setShowStartTimePicker(true);
  }

  return (
    <View style={styles.editForm}>
      <View style={styles.editInputView}>
        <TextInput
          style={styles.editTextInput}
          onChangeText={onChangeTitle}
          value={editable.title}
        />
      </View>
      <View style={styles.editInputView}>
        {/* TODO: How do we edit the description */}
        <TextInput
          style={styles.editTextInput}
          onChangeText={onChangeDescription}
          value={editable.description}
        />
      </View>
      <Pressable onPress={showDatepicker}>
        <View style={styles.editDateView}>
          <Feather name="edit-3" size={25} />
          {/* TODO: date range? */}
          <Text style={styles.editDateText}>
            {DateInfo.toString(editable.date)}
          </Text>
        </View>
      </Pressable>
      <Pressable onPress={() => showTimepicker(false)}>
        <View style={styles.editDateView}>
          <Feather name="edit-3" size={25} />
          <Text style={styles.editDateText}>
            Start time: {timeDateFmt(editable.startHour)}.{timeDateFmt(editable.startMinute)}
          </Text>
        </View>
      </Pressable>
      <Pressable onPress={() => showTimepicker(true)}>
        <View style={styles.editDateView}>
          <Feather name="edit-3" size={25} />
          <Text style={styles.editDateText}>
            End time: {timeDateFmt(editable.endHour)}.{timeDateFmt(editable.endMinute)}
          </Text>
        </View>
      </Pressable>
      {showDatePicker && (
        <DateTimePicker
          testID="datePicker"
          value={date}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onDateChange}
        />
      )}
      {showStartTimePicker && (
        <DateTimePicker
          testID="startTimePicker"
          value={date}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onStartTimeChange}
        />
      )}
      {showEndTimePicker && (
        <DateTimePicker
          testID="endTimePicker"
          value={date}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onEndTimeChange}
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
      <EditTaskItemModal visible={editVisible} visibilityCb={changeEditVisiblity} />
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

const EditTaskItemModal = (props: IEditTaskItemModal) => {
  const isNew = props.editable === undefined;
  const [editTask, setEditTask] = React.useState<IDailyTask>(
    props.editable || DailyTask.new().serialize()
  );

  const updateEditTask = (task: IDailyTask) => {
    setEditTask(task);
  }

  return (
    <FullScreenModalView visible={props.visible} visibilityCb={props.visibilityCb}>
      <EditControlButtons task={editTask} isNew={isNew} visibilityCb={props.visibilityCb} />
      <EditFields editable={editTask} editCb={updateEditTask} />
    </FullScreenModalView>
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


export { TaskItemModal, EditTaskItemModal };

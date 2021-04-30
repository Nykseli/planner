import React from 'react';
import { Alert, StyleSheet, Modal, Platform, Pressable } from 'react-native';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker';

import Colors from '@/constants/Colors';
import { Text, View, TextInput, AntDesign, Feather, MaterialIcons } from './Themed';
import Layout from '@/constants/Layout';
import { DailyTask, DateInfo, IDailyTask } from '@/data/dataObjects';
import { timeDateFmt, timeDiffString } from '@/util/datetime';
import { useAppDispatch } from '@/hooks/reduxHooks';
import {
  addNewDailyTask,
  editExistingDailyTask,
  removeExistingDailyTask,
} from '@/data/redux/reducers/currentDate';
import { PropChildren } from '@/types';
import { showUserAlert } from '@/data/redux/reducers/userAlert';

type VisibiltyCb = (bool?: boolean) => void;
type TaskEditCb = (task: IDailyTask, startDate: Date) => void;

interface ITaskItemModal {
  children: PropChildren;
  task: IDailyTask;
}

interface IEditTaskItemModal {
  visible: boolean;
  visibilityCb: VisibiltyCb;
  // If editable is set, TaskItemModal edits existing daily task.
  // If not set, new one is created on save.
  editable?: IDailyTask;
}

interface IFullScreenModalView {
  children: PropChildren;
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
const EditControlButtons = ({ task, startDate, isNew, visibilityCb }:
  { task: IDailyTask, startDate: Date, isNew: boolean, visibilityCb: VisibiltyCb }) => {

  const dispatch = useAppDispatch();

  const updateDailyTask = () => {
    if (isNew) {
      dispatch(addNewDailyTask(task, {
        onSuccess: () => {
          visibilityCb(false);
          dispatch(showUserAlert({
            message: `Tasks starts in: ${timeDiffString(new Date(), startDate)}`,
            displayTime: 'short',
            color: 'info'
          }));
        },
        onFail: () => {
          dispatch(showUserAlert({
            message: "Couldn't add new task",
            displayTime: 'short',
            color: 'error'
          }));
        }
      }));
    } else {
      dispatch(editExistingDailyTask(task, {
        onSuccess: () => {
          visibilityCb(false);
          dispatch(showUserAlert({
            message: `Tasks starts in: ${timeDiffString(new Date(), startDate)}`,
            displayTime: 'short',
            color: 'info'
          }));
        },
        onFail: () => {
          dispatch(showUserAlert({
            message: "Couldn't add edit task",
            displayTime: 'short',
            color: 'error'
          }));
        }
      }));
    }
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
    editCb({ ...editable, title: text }, date);
  }

  const onChangeDescription = (text: string) => {
    editCb({ ...editable, description: text }, date);
  }

  const onDateChange = (event: Event, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
    const newDate = DateInfo.fromDate(currentDate).serialize();
    editCb({ ...editable, date: newDate }, currentDate);
  }

  const onStartTimeChange = (event: Event, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowStartTimePicker(Platform.OS === 'ios');
    setDate(currentDate);
    // TODO: make sure this is before end time and alert user on the error
    editCb({ ...editable, startHour: currentDate.getHours(), startMinute: currentDate.getMinutes() }, currentDate);
  }

  const onEndTimeChange = (event: Event, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowEndTimePicker(Platform.OS === 'ios');
    setDate(currentDate);
    // TODO: make sure this is after start time and alert user on the error
    editCb({ ...editable, endHour: currentDate.getHours(), endMinute: currentDate.getMinutes() }, currentDate);
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

const ModalControlButtons = ({ task, visibilityCb }:
  { task: IDailyTask, visibilityCb: VisibiltyCb }) => {
  const [editVisible, setEditVisible] = React.useState<boolean>(false);

  const dispatch = useAppDispatch();

  const deleteTask = () => {
    dispatch(removeExistingDailyTask(task, {
      onSuccess: () => {
        visibilityCb(false);
        dispatch(showUserAlert({
          message: 'Daily task removed',
          displayTime: 'short',
          color: 'info'
        }));
      },
      onFail: () => {
        dispatch(showUserAlert({
          message: "Couldn't remove task",
          displayTime: 'short',
          color: 'error'
        }));
      }
    }));
  }

  const changeEditVisiblity = (b?: boolean) => {
    if (b === undefined) {
      setEditVisible(!editVisible);
    } else {
      setEditVisible(Boolean(b));
    }
  }

  return (
    <View style={styles.controlButtons}>
      <EditTaskItemModal editable={task} visible={editVisible} visibilityCb={changeEditVisiblity} />
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
              {
                text: "Delete",
                onPress: () => deleteTask()
              },
              { text: "Cancel" }
            ]
          )}>
          <AntDesign name="delete" size={34} />
        </Pressable>
      </View>
    </View>
  );
}

const TaskItemInfo = ({ task }: { task: IDailyTask }) => {
  // TODO: max info text lenght. 255? the current lorem ipsum is 475
  // TODO: picture preview. clicking the thumbnail
  //       will open the picture into new full screen modal

  // Helper function to make formatting more readable
  const tf = (n: number): string => {
    return `${timeDateFmt(n)}`;
  }

  const timeString = (): string => {
    return `${tf(task.startHour)}.${tf(task.startMinute)} - ${tf(task.endHour)}.${tf(task.endMinute)}`
  }

  const timeDateString = (): string => {
    return `${DateInfo.toString(task.date)} ${timeString()}`
  }

  return (
    <View style={styles.itemInfo}>
      <Text style={styles.itemInfoTitle}>{task.title}</Text>
      <Text style={styles.itemInfoDate}>{timeDateString()}</Text>
      <Text style={styles.itemInfoText}>
        {task.description}
      </Text>
    </View>
  );
}

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
        <ModalControlButtons task={props.task} visibilityCb={changeVisiblity} />
        <TaskItemInfo task={props.task} />
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
  // Start date refers to the date when the task starts
  // so editable date + startHour and startMinute
  const [startDate, setStartDate] = React.useState<Date>(new Date());
  const [editTask, setEditTask] = React.useState<IDailyTask>(
    props.editable || DailyTask.new().serialize()
  );

  const updateEditTask = (task: IDailyTask, startDate: Date) => {
    setEditTask(task);
    setStartDate(startDate);
  }

  // Reset the ediTask everytime the visibilty changes
  // this way we always have a "clean slate" when creating a new task
  React.useEffect(() => {
    if (isNew) {
      const newTask = DailyTask.new().serialize();
      setStartDate(DateInfo.toDate(newTask.date, newTask.startHour, newTask.startMinute));
      setEditTask(DailyTask.new().serialize());
    } else {
      // Tell compiler that the editable cannot be undefined at this point
      const ed = props.editable as IDailyTask;
      setStartDate(DateInfo.toDate(ed.date, ed.startHour, ed.startMinute));
      setEditTask(ed);
    }
  }, [props.visible]);

  return (
    <FullScreenModalView visible={props.visible} visibilityCb={props.visibilityCb}>
      <EditControlButtons task={editTask} startDate={startDate} isNew={isNew} visibilityCb={props.visibilityCb} />
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

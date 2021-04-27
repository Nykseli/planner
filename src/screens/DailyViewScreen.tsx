import * as React from 'react';
import { StyleSheet, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Text, View } from '@/components/Themed';
import { TaskItemModal } from '@/components/TaskItemModal'
import AddItemButton from '@/components/AddItemButton';
import Layout from '@/constants/Layout';
import Colors from '@/constants/Colors';
import { DateInfo, IDailyTask } from '@/data/dataObjects';
import { timeDateFmt } from '@/util/datetime';
import { useAppSelector, useAppDispatch } from '@/hooks/reduxHooks';
import { selectDate, nextDateWithTasks, previousDateWithTasks } from '@/data/redux/reducers/currentDate';
import { fetchDailyTasksAsync, selectDailyTask } from '@/data/redux/reducers/dailyTasks';

const singleBoxHeight = 80;
const dailyHours = Array.from({ length: 24 }, (_v, k) => k);

const ScrollHours = () => {
  return (
    <View>
      {dailyHours.map(
        (hour) =>
          <View style={styles.hourTextBlock} key={hour}>
            <Text key={hour}>
              {timeDateFmt(hour)}
            </Text>
          </View>
      )}
    </View>
  );

}

const ScrollBoxItem = ({ task }: { task: IDailyTask }) => {
  const position = task.startHour * singleBoxHeight + (singleBoxHeight * (task.startMinute / 60));

  return (
    <View style={{ marginTop: position, ...styles.scrollBoxItem }}>
      <TaskItemModal task={task}>
        <Text>{task.title}</Text>
      </TaskItemModal>
    </View>
  );
}

const ScrollBoxes = ({ tasks }: { tasks: IDailyTask[] }) => {
  return (
    <View style={styles.scrollBoxesContainer}>
      {dailyHours.map(
        (hour) =>
          <View style={styles.hourBoxBlock} key={hour}>
          </View>
      )}
      {tasks.map((task, i) =>
        <ScrollBoxItem key={i} task={task} />)
      }
    </View>
  );
}

const ScrollItems = ({ tasks }: { tasks: IDailyTask[] }) => {

  return (
    <View style={styles.scrollItemContainer}>
      <ScrollHours />
      <ScrollBoxes tasks={tasks} />
    </View>
  );
}

const DailyViewScreen = () => {
  const currentDate = useAppSelector(selectDate);
  const dailyTasks = useAppSelector(selectDailyTask);
  const dispatch = useAppDispatch();

  let taskList: IDailyTask[] = [];

  // Load initial task data here.
  // Task loading after this is handled by currentDate reducer
  if (dailyTasks.status === 'unitinitalized') {
    dispatch(fetchDailyTasksAsync(currentDate));
  } else if (dailyTasks.status === 'idle') {
    // When status is idle, nothing is happening, meaning that
    // we can use the data
    taskList = dailyTasks.tasks;
  }

  return (
    <View style={styles.container}>
      <View style={styles.dateNavigation}>
        <Pressable onPress={() => dispatch(previousDateWithTasks())}>
          <MaterialIcons name="navigate-before" size={35} color="black" />
        </Pressable>
        <Text style={styles.title}>{DateInfo.toString(currentDate)}</Text>
        <Pressable onPress={() => dispatch(nextDateWithTasks())}>
          <MaterialIcons name="navigate-next" size={35} color="black" />
        </Pressable>
      </View>
      <SafeAreaView style={styles.scrollContainer}>
        <ScrollView style={styles.scrollView}>
          <ScrollItems tasks={taskList} />
        </ScrollView>
      </SafeAreaView>
      <AddItemButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  dateNavigation: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  scrollContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  scrollItemContainer: {
    flex: 1,
    flexDirection: 'row',
    width: Layout.window.width,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  hourBoxBlock: {
    flex: 1,
    borderTopColor: '#3d3d3de0',
    borderTopWidth: 1,
    height: singleBoxHeight,
    width: Layout.window.width,
  },
  hourTextBlock: {
    paddingEnd: 10,
    paddingStart: 10,
    height: singleBoxHeight,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  scrollView: {
  },
  scrollBoxesContainer: {
    flex: 1,
    paddingTop: 10,
    alignContent: 'center',
  },
  scrollBoxItem: {
    height: 28,
    backgroundColor: Colors.seeThrough,
    // backgroundColor: '#d3d3ffd0',
    position: 'absolute',
    width: Layout.window.width * 0.8,
    alignContent: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 42,
  },
});

export default DailyViewScreen;

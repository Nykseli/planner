import * as React from 'react';
import { StyleSheet, SafeAreaView, ScrollView } from 'react-native';

import { Text, View } from '@/components/Themed';
import { TaskItemModal } from '@/components/TaskItemModal'
import AddItemButton from '@/components/AddItemButton';
import Layout from '@/constants/Layout';
import Colors from '@/constants/Colors';
import { CurrentDateInfo, timeDateFmt } from '@/util/datetime';

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

const ScrollBoxItem = ({ hour, minute }: { hour: number, minute: number }) => {
  const position = hour * singleBoxHeight + (singleBoxHeight * (minute / 60));

  return (
    <View style={{ marginTop: position, ...styles.scrollBoxItem }}>
      <TaskItemModal>
        <Text>{`Here is the title of ${timeDateFmt(hour)}:${timeDateFmt(minute)} appointment`}</Text>
      </TaskItemModal>
    </View>
  );
}

const ScrollBoxes = () => {
  return (
    <View style={styles.scrollBoxesContainer}>
      {dailyHours.map(
        (hour) =>
          <View style={styles.hourBoxBlock} key={hour}>
          </View>
      )}
      <ScrollBoxItem hour={15} minute={30} />
      <ScrollBoxItem hour={0} minute={15} />
      <ScrollBoxItem hour={2} minute={30} />
      <ScrollBoxItem hour={1} minute={0} />
    </View>
  );
}

const ScrollItems = () => {

  return (
    <View style={styles.scrollItemContainer}>
      <ScrollHours />
      <ScrollBoxes />
    </View>
  );
}

const DailyViewScreen = () => {
  const cdi = new CurrentDateInfo();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{cdi.currentDateString()}</Text>
      <SafeAreaView style={styles.scrollContainer}>
        <ScrollView style={styles.scrollView}>
          <ScrollItems />
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

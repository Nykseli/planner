import * as React from 'react';
import { StyleSheet, Pressable } from 'react-native';

import { Text, View, MaterialIcons } from '@/components/Themed';
import AddItemButton from '@/components/AddItemButton';
import Layout from '@/constants/Layout'
import { DateInfo, MonthInfo } from '@/data/dataObjects';
import Colors from '@/constants/Colors';
import { useAppSelector, useAppDispatch } from '@/hooks/reduxHooks';
import { DateNum, timeDateFmt } from '@/util/datetime';
import {
  selectMonth,
  nextMonthWithTasks,
  previousMonthWithTasks,
  fetchTasksAsync,
  selectMonthlyTask,
  MonthTaskList
} from '@/data/redux/reducers/currentMonth';
import { fetchDailyTasksAsync, fromDateInfo } from '@/data/redux/reducers/currentDate';
import { MVNavigation } from '@/types';
import { showUserAlert } from '@/data/redux/reducers/userAlert';

type NavigationLoad = (date: DateNum) => void;

const squareWidth = Layout.window.width / 7;
const borderWidth = 3;

const PaddingSquare = ({ front, last }: { front: boolean, last?: boolean }) => {
  let _style = styles.dateSquare;

  if (front)
    _style = { ..._style, borderTopWidth: borderWidth };
  else if (last)
    _style = { ..._style, borderRightWidth: borderWidth };

  return (
    <View style={_style}></View>
  );
}

const DaySquare = ({ navLoad, cdi, cmi, date, taskCount }:
  { navLoad: NavigationLoad, cdi: DateInfo, cmi: MonthInfo, date: DateNum, taskCount: number }) => {
  let _style = styles.dateSquare;

  if (cmi.isSunday(date))
    _style = { ..._style, borderRightWidth: borderWidth }

  if (cmi.isInFirstWeek(date))
    _style = { ..._style, borderTopWidth: borderWidth }

  if (cmi.isToday(date, cdi))
    _style = { ..._style, backgroundColor: "#d3d3d3ff" }

  return (
    <Pressable onPress={() => navLoad(date)}>
      <View style={_style}>
        <Text style={styles.title}>{date}</Text>
        {taskCount > 0 &&
          <View style={styles.dayTaskCount}>
            <View style={styles.dayTaskCenter}>
              <Text style={styles.dayTaskCountText}>{taskCount}</Text>
            </View>
          </View>
        }
      </View>
    </Pressable>
  );
}

const DateSquares = ({ nav, cdi, cmi, tasks }:
  { nav: MVNavigation, cdi: DateInfo, cmi: MonthInfo, tasks: MonthTaskList }) => {

  const dispatch = useAppDispatch();

  // TODO: should paddings show info from previous and next month?
  const frontPaddingList = Array.from(
    { length: cmi.startWeekday - 1 }, (_v, k) => <PaddingSquare front={true} key={k} />
  );

  const endPaddingList = Array.from(
    { length: 7 - cmi.endWeekday }, (_v, k) =>
    <PaddingSquare front={false} last={k === 7 - cmi.endWeekday - 1} key={k} />
  );

  /**
   * Load certain date info and navigate to it.
   */
  const navigateDay = (date: DateNum) => {
    const targetDate = DateInfo.fromMonth(cmi, date).serialize();
    dispatch(fetchDailyTasksAsync(targetDate));
    dispatch(fromDateInfo(targetDate));
    nav.navigate('DailyView');
  }

  return (
    <View style={styles.squaresContainer}>
      {frontPaddingList}
      {cmi.dateList().map((date, idx) => {
        const taskCount = tasks[idx]?.taskCount || 0;

        return <DaySquare
          key={date}
          date={date}
          cmi={cmi}
          cdi={cdi}
          navLoad={navigateDay}
          taskCount={taskCount} />
      })}
      {endPaddingList}
    </View>
  );
}

const DayNames = () => {
  // TODO: i18n
  const names = ['ma', 'ti', 'ke', 'to', 'pe', 'la', 'su'];

  return (
    <View style={styles.squaresContainer}>
      {names.map((dName) => <Text key={dName} style={styles.dayText}>{dName}</Text>)}
    </View>
  );
}

const DateInfoView = ({ cdi, cmi }: { cdi: DateInfo, cmi: MonthInfo }) => {
  // TODO: i18n
  const days = ['Maanantai', 'Tiistai', 'Keskiviikko', 'Torstai', 'Perjantai', 'Lauantai', 'Sunnuntai'];
  const months = ['Tammi', 'Helmi', 'Maalis', 'Huhti', 'Touko', 'Kesä', 'Heinä', 'Elo', 'Syys', 'Loka', 'Marras', 'Joulu'];
  let dateNums;
  let dateStr;

  if (cdi.month === cmi.month && cdi.year === cmi.year) {
    dateNums = `${timeDateFmt(cdi.date)}.${timeDateFmt(cdi.month)}.${cdi.year}`;
    dateStr = `${days[cdi.weekday - 1]}, ${months[cdi.month - 1]}kuu`;
  } else {
    dateNums = `${timeDateFmt(cmi.month)}.${cmi.year}`;
    dateStr = `${months[cmi.month - 1]}kuu`;
  }

  return (
    <View style={styles.monthInfoContainer}>
      <Text style={styles.monthInfoText}>{dateNums}</Text>
      <Text style={styles.monthInfoText}>{dateStr}</Text>
    </View>
  );
}

const MonthlyViewScreen = ({ navigation }: { navigation: MVNavigation }) => {
  const selectedMonth = useAppSelector(selectMonth);
  const montlyTasks = useAppSelector(selectMonthlyTask);
  const cmi = MonthInfo.deSerialize(selectedMonth);
  const cdi = DateInfo.today();
  const dispatch = useAppDispatch();

  let taskList: MonthTaskList = [];

  // Load initial task data here.
  // Task loading after this is handled by currentMonth reducer
  if (montlyTasks.status === 'unitinitalized') {
    dispatch(fetchTasksAsync(selectedMonth));
  } else if (montlyTasks.status === 'idle') {
    // When status is idle, nothing is happening, meaning that
    // we can use the data
    taskList = montlyTasks.tasks;
  } else {
    taskList = [];
  }

  // showUseAlert changes the contents of UserAlert module
  // so we need to dispatch it in useEffect
  // other dispatches should be here too, but this way we have
  // the most interactive renders
  React.useEffect(() => {
    if (montlyTasks.status === 'failed') {
      dispatch(showUserAlert({
        message: "Couldn't fetch monthly tasks",
        color: 'error',
        displayTime: 'short'
      }));
    }
  }, [montlyTasks]);

  return (
    <View style={styles.monthContainer}>
      <View style={styles.dateInfoContainer}>
        <DateInfoView cdi={cdi} cmi={cmi} />
      </View>
      <View style={styles.dateNavigation}>
        <Pressable onPress={() => dispatch(previousMonthWithTasks())}>
          <MaterialIcons name="navigate-before" size={35} color="black" />
        </Pressable>
        <Pressable onPress={() => dispatch(nextMonthWithTasks())}>
          <MaterialIcons name="navigate-next" size={35} color="black" />
        </Pressable>
      </View>
      <View style={styles.dateSquareContainer}>
        <DayNames />
        <DateSquares nav={navigation} cdi={cdi} cmi={cmi} tasks={taskList} />
      </View>
      <AddItemButton />
    </View>
  );
}

const styles = StyleSheet.create({
  dayTaskCount: {
    backgroundColor: Colors.seeThrough,
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  dayTaskCenter: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 20,
    backgroundColor: '#87ceeb',
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayTaskCountText: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  dayText: {
    width: squareWidth,
    textAlign: 'center',
    fontSize: 20,
    paddingBottom: 7
  },
  dateNavigation: {
    flex: 0.1,
    width: Layout.window.width,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  dateSquare: {
    borderWidth: borderWidth,
    width: squareWidth,
    height: squareWidth,
    borderColor: "lightblue",
    borderStyle: "solid",
    backgroundColor: Colors.seeThrough,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  dateInfoContainer: {
    flex: 1.0,
    alignContent: 'center',
    flexDirection: 'column',
    flexWrap: 'wrap'
  },
  dateSquareContainer: {
    flex: 3.0,
    flexDirection: 'column'
  },
  monthContainer: {
    flex: 1,
    alignItems: 'flex-start',
    alignContent: 'center',
    flexDirection: 'column',
    flexWrap: 'wrap'
  },
  monthInfoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  monthInfoText: {
    textAlign: 'center',
    fontSize: Layout.window.width * 0.08
  },
  squaresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});

export default MonthlyViewScreen;

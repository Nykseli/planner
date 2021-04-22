import * as React from 'react';
import { StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import Layout from '@/constants/Layout'
import { CurrentMonthInfo, CurrentDateInfo } from '@/util/datetime'

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

const DaySquare = ({ date, isSunday, isToday, isInFirstWeek }:
  { date: number, isSunday: boolean, isToday: boolean, isInFirstWeek: boolean }) => {
  let _style = styles.dateSquare;

  if (isSunday)
    _style = { ..._style, borderRightWidth: borderWidth }

  if (isInFirstWeek)
    _style = { ..._style, borderTopWidth: borderWidth }

  if (isToday)
    _style = { ..._style, backgroundColor: "#d3d3d3ff" }


  return (
    <View style={_style}>
      <Text style={styles.title}>{date}</Text>
    </View>
  );
}

const DateSquares = () => {
  const cdi = new CurrentDateInfo();
  const cmi = new CurrentMonthInfo();

  // TODO: should paddings show info from previous and next month?
  const frontPaddingList = Array.from(
    { length: cmi.startWeekday - 1 }, (_v, k) => <PaddingSquare front={true} key={k} />
  );

  const endPaddingList = Array.from(
    { length: 7 - cmi.endWeekday }, (_v, k) =>
    <PaddingSquare front={false} last={k === 7 - cmi.endWeekday - 1} key={k} />
  );

  return (
    <View style={styles.squaresContainer}>
      {frontPaddingList}
      {cmi.dateList().map((date) => {
        return <DaySquare
          key={date}
          date={date}
          isToday={cmi.isToday(date, cdi)}
          isSunday={cmi.isSunday(date)}
          isInFirstWeek={cmi.isInFirstWeek(date)} />
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
      {names.map((dName) => <Text style={styles.dayText}>{dName}</Text>)}
    </View>
  );
}

const MonthlyViewScreen = () => {
  return (
    <View style={styles.monthContainer}>
      <DayNames />
      <DateSquares />
    </View>
  );
}

const styles = StyleSheet.create({
  dayText: {
    width: squareWidth,
    textAlign: 'center',
    fontSize: 20,
    paddingBottom: 7
  },
  dateSquare: {
    borderWidth: borderWidth,
    width: squareWidth,
    height: squareWidth,
    borderColor: "lightblue",
    borderStyle: "solid",
    backgroundColor: "#00000000",
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  monthContainer: {
    flex: 1,
    alignItems: 'flex-start',
    alignContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap'
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

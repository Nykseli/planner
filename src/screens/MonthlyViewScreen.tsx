import * as React from 'react';
import { StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import AddItemButton from '@/components/AddItemButton';
import Layout from '@/constants/Layout'
import { CurrentMonthInfo, CurrentDateInfo } from '@/util/datetime'
import Colors from '@/constants/Colors';

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

const DateSquares = ({ cdi, cmi }: { cdi: CurrentDateInfo, cmi: CurrentMonthInfo }) => {

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
      {names.map((dName) => <Text key={dName} style={styles.dayText}>{dName}</Text>)}
    </View>
  );
}

const DateInfo = ({ cdi }: { cdi: CurrentDateInfo }) => {
  // TODO: i18n
  const days = ['Maanantai', 'Tiistai', 'Keskiviikko', 'Torstai', 'Perjantai', 'Lauantai', 'Sunnuntai'];
  const months = ['Tammi', 'Helmi', 'Maalis', 'Huhti', 'Touko', 'Kesä', 'Heinä', 'Elo', 'Syys', 'Loka', 'Marras', 'Joulu'];
  const dateNums = `${cdi.date}.${cdi.month}.${cdi.year}`;
  const dateStr = `${days[cdi.weekday - 1]}, ${months[cdi.month - 1]}kuu`;

  return (
    <View style={styles.monthInfoContainer}>
      <Text style={styles.monthInfoText}>{dateNums}</Text>
      <Text style={styles.monthInfoText}>{dateStr}</Text>
    </View>
  );
}

const MonthlyViewScreen = () => {
  const cdi = new CurrentDateInfo();
  const cmi = new CurrentMonthInfo();

  return (
    <View style={styles.monthContainer}>
      <View style={styles.dateInfoContainer}>
        <DateInfo cdi={cdi} />
      </View>
      <View style={styles.dateSquareContainer}>
        <DayNames />
        <DateSquares cdi={cdi} cmi={cmi} />
      </View>
      <AddItemButton />
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
    backgroundColor: Colors.seeThrough,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  dateInfoContainer: {
    flex: 1.2,
    alignContent: 'center',
    flexDirection: 'column',
    flexWrap: 'wrap'
  },
  dateSquareContainer: {
    flex: 2.5,
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

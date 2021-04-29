/**
 * Show alerts / info to user.
 * This is controllerd with userAlert reducer
 */
import React from 'react';
import { StyleSheet, Modal } from 'react-native';

import { PropChildren } from '@/types';
import { Text, View } from './Themed';
import Layout from '@/constants/Layout'
import Colors from '@/constants/Colors'
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { DisplayTime, selectAlertState, hideUserAlert } from '@/data/redux/reducers/userAlert';

const translateDisplayTime = (time: DisplayTime): number => {
  if (typeof time === 'string') {
    if (time === 'short')
      return 2000;

    if (time === 'long')
      return 5000;
  }

  return time as number;
}

// TODO: nicer colors
const translateColor = (color: string): string => {
  if (color === 'info')
    return 'lightblue';

  if (color === 'warn')
    return 'orange';

  return 'red';
}

const ModalAlert = () => {
  const dispatch = useAppDispatch();
  const alertState = useAppSelector(selectAlertState);

  if (alertState.display === 'show') {
    setTimeout(() => {
      dispatch(hideUserAlert());
    }, translateDisplayTime(alertState.displayTime));
  }

  // TODO: how to show modal from top? it now comes from bottom to top
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={alertState.display === 'show'}
      style={styles.modal}>
      <View style={styles.modalContainer}>
        <View style={{ ...styles.modalView, backgroundColor: translateColor(alertState.color) }}>
          <Text>{alertState.message}</Text>
        </View>
      </View>
    </Modal >
  );
}

const UserAlert = ({ children }: { children: PropChildren }) => {
  // When when modal alert is always at the botton of the stack
  // the modal will alawys be shown on top. Even top of other modals.
  return (
    <>
      {children}
      <ModalAlert />
    </>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: '100%',
    height: Layout.screen.height,
    backgroundColor: Colors.seeThrough
  },
  modalView: {
    width: '95%',
    height: Layout.screen.height / 15,
    borderRadius: 20,
    backgroundColor: "red",
    // TODO: make sure that all the items are visible with safe views etc
    paddingTop: 20,
    paddingLeft: 15,
    paddingRight: 10,
    position: 'absolute',
    // TODO: optionaly use top when you can animate this from top to bottom
    //top: 20
    bottom: 20,
  },
  modal: {
    width: Layout.screen.width,
    height: Layout.screen.height,
    position: 'absolute',
    top: 0,
    left: 10,
    right: 10,
    backgroundColor: Colors.seeThrough
  }
});

export default UserAlert;

import React from 'react';
import { AntDesign, Feather } from '@expo/vector-icons';
import { Alert, StyleSheet, Modal, Pressable, Platform } from 'react-native';

import Colors from '@/constants/Colors';
import { MonoText } from './StyledText';
import { Text, View } from './Themed';
import Layout from '@/constants/Layout';

interface ITaskItemModal {
  children: React.ReactChild | React.ReactChildren
}

type VisibiltyCb = (bool?: boolean) => void;


const ModalControlButtons = ({ visibilityCb }: { visibilityCb: VisibiltyCb }) => {
  return (
    <View style={styles.controlButtons}>
      <View style={styles.controlLeftButtons}>
        <Pressable
          style={styles.controlButton}
          onPress={() => visibilityCb()} >
          <AntDesign name="close" size={34} />
        </Pressable>
      </View>
      <View style={styles.controlRightButtons}>
        <Pressable
          style={styles.controlButton}
          /* TODO: edit modal onPress={() => visibilityCb()} */ >
          <Feather name="edit-3" size={34} />
        </Pressable>
        <Pressable
          style={styles.controlButton}
          /* TODO: confirm delete onPress={() => visibilityCb()} */ >
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

const ItemModalView = ({ visibilityCb }: { visibilityCb: VisibiltyCb }) => {
  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalView}>
        <ModalControlButtons visibilityCb={visibilityCb} />
        <TaskItemInfo />
      </View>
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          changeVisiblity(!modalVisible);
        }}
      >
        <ItemModalView visibilityCb={changeVisiblity} />
      </Modal>
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
    width: Layout.window.width,
    height: Layout.window.height,
    backgroundColor: Colors.seeThrough
  },
  modalView: {
    width: Layout.window.width,
    height: Layout.window.height,
    backgroundColor: "white",
    borderRadius: 20,
    // TODO: make sure that all the items are visible with safe views etc
    paddingTop: 35,
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

import * as React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import Colors from '@/constants/Colors'
import { Ionicons } from '@/components/Themed';
import { EditTaskItemModal } from '@/components/TaskItemModal'

const AddItemButton = () => {
  const [editVisible, setEditVisible] = React.useState<boolean>(false);

  const changeEditVisiblity = (b?: boolean) => {
    if (b === undefined) {
      setEditVisible(!editVisible);
    } else {
      setEditVisible(Boolean(b));
    }
  }

  return (
    <Pressable onPress={() => changeEditVisiblity()} style={styles.floatingButton}>
      <Ionicons name="add" size={30} color="#333" />
      <EditTaskItemModal visible={editVisible} visibilityCb={changeEditVisiblity} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    position: 'absolute',
    bottom: 15,
    right: 20,
    height: 70,
    backgroundColor: Colors.light.tabIconSelected,
    borderRadius: 100,
  }
});

export default AddItemButton;

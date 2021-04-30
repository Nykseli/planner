import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Pressable } from 'react-native';

import { Text, View } from './Themed';

// TODO: load current day/month depending on the view
const NavigationHeader = ({ text }: { text: string }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerTextContainer}>
        <Text style={styles.headerText}>
          {text}
        </Text>
      </View>
      <View style={styles.headerMenuContainer}>
        <Pressable onPress={() => {
          navigation.navigate('Settings');
        }}>
          <Ionicons name="settings-outline" size={28} color="black" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: "center",
  },
  headerMenuContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  headerTextContainer: {
    flex: 1,
  }
});

export default NavigationHeader;

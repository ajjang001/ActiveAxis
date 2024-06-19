import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

const data = [
  {
    image: require('../../assets/activeaxislogo.png'),
    text: 'This is the description for the ActiveAxis logo.',
  },
  {
    image: require('../../assets/doublecircle.png'),
    text: 'This is the description for a double circle.',
  },
  {
    image: require('../../assets/favicon.png'),
    text: 'This is the description for favicon.',
  },
  {
    image: require('../../assets/icon.png'),
    text: 'This is the description for an icon.',
  },
  {
    image: require('../../assets/pen.png'),
    text: 'This is the description for a pen.',
  },
  {
    image: require('../../assets/fist.png'),
    text: 'This is the description for a fist.',
  },
];

const View3 = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Functions & Features</Text>
      {data.map((item, index) => (
        <View key={index} style={styles.row}>
          <View style={styles.imageContainer}>
            <Image source={item.image} style={styles.image} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.text}>{item.text}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#FBF5F3',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  imageContainer: {
    width: 50,
    height: 50,
    backgroundColor: '#D3D3D3',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 40,
    height: 40,
  },
  textContainer: {
    flex: 1,
    backgroundColor: '#D3D3D3',
    padding: 10,
  },
  text: {
    fontSize: 14,
  },
});

export default View3;

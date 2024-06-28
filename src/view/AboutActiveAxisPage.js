import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import DisplayAboutActiveAxisPresenter from '../presenter/DisplayAboutActiveAxisPresenter';

const AboutActiveAxisPage = () => {
  const [about, setAbout] = useState([]);
  const [logoURL, setLogoURL] = useState('');

  useEffect(() => {
    const presenter = new DisplayAboutActiveAxisPresenter({ changeAbout, changeLogoURL });
    presenter.displayAboutActiveAxis();
    presenter.displayLogoURL();
  }, []);

  const changeAbout = (aboutData) => {
    setAbout(aboutData);
  };

  const changeLogoURL = (url) => {
    setLogoURL(url);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>About ActiveAxis</Text>
      {logoURL ? <Image source={{ uri: logoURL }} style={styles.logo} /> : null}
      <View style={styles.divider} />
      {about.map((paragraph, index) => (
        <Text key={index} style={styles.paragraph}>{paragraph.trim()}</Text>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: -20,
    backgroundColor: '#FBF5F3',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  divider: {
    width: '90%',
    height: 5,
    backgroundColor: '#C42847',
    marginVertical: 20,
  },
  paragraph: {
    fontSize: 16,
    textAlign: 'left',
    marginBottom: 10,
  },
});

export default AboutActiveAxisPage;

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const FeedbackCard = ({ avatar, name, rating, feedback }) => {
  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Icon
          key={i}
          name="star"
          size={20}
          color={i < rating ? '#FFD700' : '#D3D3D3'}
        />
      );
    }
    return stars;
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {avatar ?
        <Image source={{ uri: avatar }} style={styles.avatar} />
        :
        <View style={styles.avatar} />
        }
        <View style={styles.headerText}>
          <Text style={styles.name}>{name}</Text>
          <View style={styles.stars}>{renderStars()}</View>
        </View>
      </View>
      <View style={styles.feedbackContainer}>
        <Text style={styles.feedbackText}>{feedback}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FA8B00',
    borderRadius: 50,
    marginBottom: 20,
    padding: 15,
    width: '90%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: 'white',
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  stars: {
    flexDirection: 'row',
  },
  feedbackContainer: {
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  feedbackText: {
    fontSize: 14,
    color: '#333',
  },
});

export default FeedbackCard;

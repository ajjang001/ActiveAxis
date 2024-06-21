import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import FeedbackCard from '../components/FeedbackCard';
import { db } from '../../.expo/api/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

const AppFeedbacks = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const storage = getStorage(); // Get the storage instance

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const feedbacksCollection = collection(db, 'feedbacks');
        const feedbackSnapshot = await getDocs(feedbacksCollection);
        const feedbackList = await Promise.all(feedbackSnapshot.docs.map(async (doc) => {
          const data = doc.data();
          const avatarRef = ref(storage, data.avatar); // Reference to the image in storage
          data.avatar = await getDownloadURL(avatarRef); // Get the download URL
          return data;
        }));
        setFeedbackData(feedbackList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching feedbacks: ", error);
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000FF" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>App Feedbacks</Text>
      {feedbackData.map((item, index) => (
        <FeedbackCard
          key={index}
          avatar={item.avatar}
          name={item.name}
          rating={item.rating}
          feedback={item.feedback}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 20,
    backgroundColor: '#FBF5F3',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppFeedbacks;

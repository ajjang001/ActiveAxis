import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

const AboutActiveAxis = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>About ActiveAxis</Text>
      <Image source={require('../../assets/activeaxislogo.png')} style={styles.logo} />
      <View style={styles.divider} />
      <Text style={styles.paragraph}>
        ActiveAxis is a mobile fitness application designed to simplify the management of fitness routines but also enhance 
        the user's engagement through social features and gamification elements. The primary aim is to create a motivating 
        and interactive environment that integrates with wearable technology for real-time data tracking, offering fitness 
       planning and dietary tracking. 
      </Text>
      <Text style={styles.paragraph}>
        The domain of ActiveAxis is digital health technology, specifically focusing on fitness and wellness applications. 
        It lies at the intersection of software development, health informatics, and user experience design, utilizing 
        advanced algorithms for personalized health recommendations and integrating seamlessly with wearable devices for 
        enhanced data accuracy. 
      </Text>
      <Text style={styles.paragraph}>
        The application's algorithm adapts to the individual's performance and preferences, recommending workouts and dietary 
        tracking that evolve as the user progresses. Additionally, ActiveAxis includes a virtual coaching system that offers 
        expert advice and encouragement, mimicking the support of a personal trainer.
      </Text>
      <Text style={styles.paragraph}>
        With a focus on accessibility, ActiveAxis is designed to cater to a wide range of fitness levels and health goals, 
        making it suitable for beginners and seasoned athletes alike. This inclusivity not only broadens our user base but 
        also fosters a diverse community where users can share experiences, challenges, and successes. On top of that, 
        the integration of ActiveAxis with a range of wearable devices facilitates the seamless synchronization of real-time 
        data, thereby enabling users to receive precise feedback regarding their physical activities.
      </Text>
      <Text style={styles.paragraph}>
        In summary, ActiveAxis is poised to become a leader in the digital fitness space, offering a holistic, adaptive, and 
        user-friendly solution to health and wellness that encourages consistent and sustainable engagement with fitness goals.
        Our vision is to empower individuals to take control of their health in a more connected and personalized way.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default AboutActiveAxis;
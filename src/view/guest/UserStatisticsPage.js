import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LineChart } from 'react-native-chart-kit';
import { Card } from 'react-native-elements';
import { Dimensions } from 'react-native';
import { scale } from '../../components/scale';
import DisplayUserStatisticsPresenter from '../../presenter/DisplayUserStatisticsPresenter';

const screenWidth = Dimensions.get('window').width;

const UserStatisticsPage = () => {
  const [totalFeedback, setTotalFeedback] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [previousDays, setPreviousDays] = useState([]);
  const [userCount, setUserCount] = useState([]);
  
  // function buat panggil controller
  const loadData = async () => {
    try{
      await new DisplayUserStatisticsPresenter({changeTotalFeedback: setTotalFeedback}).displayTotalAppFeedback();
      await new DisplayUserStatisticsPresenter({changeAvgRating: setAvgRating}).displayAvgRatings();
      await new DisplayUserStatisticsPresenter({changePreviousDays: setPreviousDays, changeDataStats: setUserCount}).displayDaysAndUsers();
      
    } catch (e){
      console.log(e.message);
    }
  }

  useEffect(()=>{
    loadData();
  },[]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>User Statistics</Text>
      <Card containerStyle={styles.card}>
        <Text style={styles.cardTitle}>Total Active Users</Text>
        <LineChart
          data={{
            labels: previousDays || ['June 10', '11', '12', '13', '14', '15', '16'],
            datasets: [
              {
                data: userCount.length === 0 ? [30000, 32000, 34000, 36000, 38000, 40000, 42000]: userCount,
              },
            ],  
          }}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#FFFFFF',
            backgroundGradientFrom: '#FFFFFF',
            backgroundGradientTo: '#FFFFFF',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '5',
              strokeWidth: '2',
              stroke: '#FFA726',
            },
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </Card>
      <Card containerStyle={styles.card}>
        <Text style={styles.cardTitle}>Average Rating</Text>
        
        <View style={{alignItems: "center", flexDirection: "row", gap:scale(5)}}>
          <Text style={styles.cardValue}>{avgRating.toFixed(1)}</Text>
          <Icon
          name="star"
          size={scale(33)}
          color={'#FFD700'}
        />
        </View>

      </Card>
      <Card containerStyle={styles.card}>
        <Text style={styles.cardTitle}>Total Reviews</Text>
        <Text style={styles.cardValue}>{totalFeedback}</Text>
        <Text style={styles.cardSubtitle}>Number of Reviews</Text>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBF5F3',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  card: {
    borderRadius: 16,
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardValue: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#999',
  },
});

export default UserStatisticsPage;

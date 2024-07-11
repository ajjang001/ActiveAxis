import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Card } from 'react-native-elements';
import { Dimensions } from 'react-native';
import DisplayUserStatisticsPresenter from '../../presenter/DisplayUserStatisticsPresenter';

const screenWidth = Dimensions.get('window').width;

const UserStatisticsPage = () => {
  const [totalFeedback, setTotalFeedback] = useState(0);
  
  // function buat panggil controller
  const loadData = async () => {
    try{
      await new DisplayUserStatisticsPresenter({changeTotalFeedback: setTotalFeedback}).displayTotalAppFeedback();
    } catch (e){
      console.log(e.message);
    }
  }

  useEffect(()=>{
    loadData();
  },[]);
  // tmpt simpen total reviews

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>User Statistics</Text>
      <Card containerStyle={styles.card}>
        <Text style={styles.cardTitle}>Total Active Users</Text>
        <LineChart
          data={{
            labels: ['June 10', '11', '12', '13', '14', '15', '16', '17', '18', '19'],
            datasets: [
              {
                data: [30000, 32000, 34000, 36000, 38000, 40000, 42000, 44000, 46000, 50000],
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
        <Text style={styles.cardTitle}>Total Downloads</Text>
        <Text style={styles.cardValue}>0</Text>
        <Text style={styles.cardSubtitle}>Number of Downloads</Text>
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

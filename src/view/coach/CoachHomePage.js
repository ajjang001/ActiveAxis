// src/view/coach/CoachHomePage.js
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, StyleSheet, ImageBackground } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { scale } from '../../components/scale';


import { LoadingDialog } from '../../components/Modal';
import { app, auth, db, storage } from '../../firebase/firebaseConfig';
import { TouchableOpacity } from 'react-native-gesture-handler';

const CoachHomePage = ({ route }) => {
    
    const { coach } = route.params;
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isLeftArrowDisabled, setIsLeftArrowDisabled] = useState(currentDate <= new Date(minDate));
    const [isRightArrowDisabled, setIsRightArrowDisabled] = useState(currentDate >= new Date(maxDate));
    
    const getCurrentDate = () => {
        const date = new Date();
        return date.toISOString().split('T')[0];
    };
      
    const minDate = '1900-01-01';
    const maxDate = '2024-12-31';

    const onMonthChange = (month) => {
        setCurrentDate(new Date(month.dateString));
        console.log('month changed', month);
    };


    const renderHeader = (date) => {
        const headerDate = new Date(date);
        const month = headerDate.toLocaleString('default', { month: 'long' });
        const year = headerDate.getFullYear();
        return (
            <View style={styles.calendarHeaderView}>
            <Text style={styles.calendarHeaderText}>{`${month} ${year}`}</Text>
            </View>
        );
    };

    useEffect(() => {
        setIsLeftArrowDisabled(currentDate <= new Date(minDate).setMonth(new Date(minDate).getMonth() + 1));
        setIsRightArrowDisabled(currentDate >= new Date(maxDate).setMonth(new Date(maxDate).getMonth() - 1));
    },[currentDate]);

    

    return (
        <View style={styles.pageContainer}>
            <View style = {styles.titleView}>
                <Text style = {styles.homeTitle}>Welcome Back,</Text>
                <Text style = {styles.homeTitle}>{coach.fullName ? coach.fullName : 'Coach Name'}</Text>
            </View>

            <View style = {styles.calendarView}>
                <Calendar
                    style = {styles.calendar}
                    current={getCurrentDate()}
                    minDate={minDate}
                    maxDate={maxDate}
                    onDayPress={(day) => {
                        console.log('selected day', day);
                    }}
                    monthFormat={'MMMM yyyy'}
                    onMonthChange={onMonthChange}
                    hideExtraDays={true}
                    disableMonthChange={false}
                    renderArrow={(direction) => (
                        <Icon
                            name={direction === 'left' ? 'chevron-left' : 'chevron-right'}
                            size={24}
                            color="white"
                        />
                    )}
                    disableArrowLeft={isLeftArrowDisabled}
                    disableArrowRight={isRightArrowDisabled}
                    disableAllTouchEventsForDisabledDays={true}
                    renderHeader={renderHeader}
                    enableSwipeMonths={true}
                    theme={{
                        calendarBackground: '#E2E2E2',
                        textSectionTitleColor: '#E28413',

                        textSectionTitleDisabledColor: 'red',
                        selectedDayBackgroundColor: 'orange',
                        selectedDayTextColor: 'yellow',
                        todayTextColor: '#83242D',
                        dayTextColor: 'black',
                        arrowColor: 'white',
                        disabledArrowColor: 'gray',
                        monthTextColor: 'green',
                        indicatorColor: 'blue',
                        textDayFontWeight: 'bold',
                        textMonthFontWeight: 'bold',
                        textDayHeaderFontWeight: '300',
                        textDayFontSize: scale(16),
                        textMonthFontSize: scale(16),
                        textDayHeaderFontSize: scale(16),

                      }}
                />
            </View>
            <View style = {styles.planDirectView}>

                <TouchableOpacity style = {styles.planDirectButton}>
                    <ImageBackground resizeMode="contain" source={require('../../../assets/plan_button_img.png')} >
                        <Text style={styles.planDirectButtonText}>Plan Direct</Text>      
                    </ImageBackground>
                </TouchableOpacity>

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        paddingTop: scale(70),
        backgroundColor: '#FBF5F3',
    },
    titleView:{
        marginHorizontal: scale(20)
    },
    homeTitle:{
        fontSize: scale(20),
        fontFamily: 'Poppins-SemiBold',
    },
    calendarView:{
        width: '100%',
        backgroundColor: '#C42847',
        marginTop: scale(20),
        alignItems: 'center',
        maxHeight: scale(415),
        paddingVertical: scale(10)
        
    },
    calendarHeaderView:{
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingHorizontal: scale(10)
    },
    calendarHeaderText:{
        fontSize: scale(18), 
        fontWeight: 'bold', 
        color:'white'
    },
    calendar:{
        width: scale(450),
        backgroundColor: '#C42847',
        
        

    },
    planDirectView:{
        backgroundColor: 'yellow',
        width: '100%',
        height: scale(150),
    },
    planDirectButton:{
        margin: scale(10),
    },
    planDirectButtonText:{
        borderRadius: scale(10),
        height:scale(100)
    }
});

export default CoachHomePage;

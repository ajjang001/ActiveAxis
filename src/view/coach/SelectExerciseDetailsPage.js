import React, {useState, useEffect, useRef} from 'react';

import {Text, View, StyleSheet, TextInput, Image, ScrollView, TouchableOpacity, Modal} from 'react-native';
import { LoadingDialog, MessageDialog, ActionDialog } from "../../components/Modal";
import { scale } from '../../components/scale';
import { useRefresh } from '../../components/RefreshContext';

import CreateFitnessPlanPresenter from '../../presenter/CreateFitnessPlanPresenter';


const SelectExerciseDetailsPage = ({route, navigation}) =>{
    const {exercise, routine, onGoBack } = route.params;
    const {refreshData} = useRefresh();
    
    

    const modifyText = (text)=>{
        text = text.replace(/_/g, ' ');
        const words = text.split(' ');

        if (words.length > 1){
            return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        }else{
            return text.charAt(0).toUpperCase() + text.slice(1);
        }

    }

    const goBackWithRefresh = ()=>{
        if (onGoBack){
            onGoBack();
        }else{
            refreshData();
        }
        navigation.pop(2);
    }

    const handleAdd = ()=>{
        new CreateFitnessPlanPresenter({workoutRoutine: routine}).addExerciseToList(exercise);
        //navigation.navigate('CoachCreateFitnessPlanPage2', {refresh:true});
        goBackWithRefresh();
    }

    return(
        <View style = {styles.container}>
            <Text style = {styles.exerciseNameText}>{exercise.exerciseName.toUpperCase()}</Text>
            
            
            <ScrollView style = {{padding: scale(10)}}>
                <Text style = {styles.textTitle}>EXERCISE TYPE</Text>
                <Text style = {styles.textContent}>{modifyText(exercise.exerciseType)}</Text>
                <Text style = {styles.textTitle}>TARGET MUSCLE</Text>
                <Text style = {styles.textContent}>{modifyText(exercise.muscle)}</Text>
                <Text style = {styles.textTitle}>EQUIPMENT</Text>
                <Text style = {styles.textContent}>{modifyText(exercise.equipment)}</Text>
                <Text style = {styles.textTitle}>DIFFICULTY</Text>
                <Text style = {styles.textContent}>{modifyText(exercise.difficulty)}</Text>
                <Text style = {styles.textTitle}>INSTRUCTIONS</Text>
                <Text style = {styles.textContent}>{exercise.instructions}</Text>

                
            </ScrollView>
            
            <TouchableOpacity style = {styles.addButton} onPress = {handleAdd}>
                <Text style = {styles.addButtonText}>ADD EXERCISE</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#FBF5F3',
        
    },
    exerciseNameText:{
        fontSize: scale(30),
        fontWeight: 'bold',
        textAlign: 'center',
        padding: scale(16),
        marginBottom: scale(16),
        backgroundColor: '#E28413',
    },
    textTitle:{
        fontSize: scale(20),
        fontWeight: 'bold',
        paddingHorizontal: scale(10),
        marginBottom: scale(5),
    },
    textContent:{
        fontSize: scale(16),
        paddingHorizontal: scale(10),
        marginBottom: scale(36),
        fontFamily: 'Inter',
    },
    addButton:{
        backgroundColor: '#E28413',
        padding: scale(10),
        borderRadius: scale(10),
        width: '50%',
        alignSelf: 'center',
        alignItems: 'center',
        marginVertical: scale(20),
    },
    addButtonText:{
        fontSize: scale(16),
        fontFamily: 'Inter-SemiBold',
        color: 'white',

    }
})

export default SelectExerciseDetailsPage;
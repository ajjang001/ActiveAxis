import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { scale } from './scale';


const ExerciseCard = (props) => {
    const routine = props.routine !== undefined ? props.routine : null;
    const e = props.exercise !== undefined ? props.exercise : null;
    const index = props.index !== undefined ? props.index : 0;

    return(
        <View style = {styles.exerciseCard} key = {index}>
            <View style = {{flexDirection:'row', gap: scale(15), alignItems:'center'}}>
                <View style = {{width:scale(50), height:scale(50), backgroundColor:'#D9D9D9', borderRadius:scale(25)}} />

                <View>
                    <Text style = {{fontSize:scale(16), fontFamily:'Poppins-Medium', maxWidth:scale(200)}}>{e.exercise.exerciseName.toUpperCase()}</Text>
                    <View style = {{flexDirection:'row', alignItems:'center', gap: scale(5)}}>
                        <Image source={require('../../assets/clock_icon.png')} style={{width:scale(20), height:scale(20)}} />
                        <Text style={{fontSize:scale(16), fontFamily:'Inter-Medium',}}>{e.duration}</Text>
                    </View>
                </View>
            </View>

            <View style = {{flexDirection:'row', alignItems:'center', gap:scale(5)}}>
                <View style={{marginRight:scale(10)}}>
                    <Text style = {{fontSize:scale(16), color:'#7B4D4D', fontFamily:'Poppins-Medium', textAlign:'center'}}>Repetition</Text>
                    <Text style = {{fontSize:scale(16), color:'#7B4D4D', fontFamily:'Poppins-Medium', textAlign:'center'}}>{e.repetition}x</Text>
                </View>
                <View>
                    <TouchableOpacity onPress = {() => props.onDelete( index, routine)}>
                        <Image source={require('../../assets/trash_icon.png')} style={{width:scale(25), height:scale(25)}} />
                    </TouchableOpacity>
                </View>
            </View>

            
        </View>
    );



};

const styles = StyleSheet.create({
    exerciseCard:{
        backgroundColor: 'white',
        borderRadius: scale(36),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        
        padding: scale(15),
        width: '90%',
        marginVertical: scale(5),
        
    },
});

export default ExerciseCard;
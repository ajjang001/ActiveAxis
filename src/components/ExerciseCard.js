import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { scale } from './scale';


const ExerciseCard = (props) => {
    const e = props.exercise !== undefined ? props.exercise : null;
    const index = props.index !== undefined ? props.index : 0;

    return(
        <View style = {styles.exerciseCard} key = {index}>
            <View style = {{flexDirection:'row', gap: scale(15),}}>
                <View style = {{width:scale(50), height:scale(50), backgroundColor:'#D9D9D9', borderRadius:scale(25)}} />

                <View>
                    <Text style = {{fontSize:scale(16), fontFamily:'Poppins-Medium', maxWidth:scale(200)}}>{e.exercise.exerciseName.toUpperCase()}</Text>
                    <View style = {{flexDirection:'row', alignItems:'center', gap: scale(5)}}>
                        <Image source={require('../../assets/clock_icon.png')} style={{width:scale(20), height:scale(20)}} />
                        <Text style={{fontSize:scale(16), fontFamily:'Inter-Medium',}}>{e.duration}</Text>
                    </View>
                </View>
            </View>

            <View style={{marginRight:scale(10)}}>
                <Text style = {{fontSize:scale(16), color:'#7B4D4D', fontFamily:'Poppins-Medium', textAlign:'center'}}>Repetition</Text>
                <Text style = {{fontSize:scale(16), color:'#7B4D4D', fontFamily:'Poppins-Medium', textAlign:'center'}}>{e.repetition}x</Text>
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
        width: '80%',
        marginVertical: scale(5),
        
    },
});

export default ExerciseCard;
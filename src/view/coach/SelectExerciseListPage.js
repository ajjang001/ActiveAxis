import React, {useState, useEffect, useRef} from 'react';
import {Text, View, StyleSheet, TextInput, Image, ScrollView, TouchableOpacity, Modal} from 'react-native';
import { LoadingDialog, MessageDialog, ActionDialog } from "../../components/Modal";
import { scale } from '../../components/scale';
import { Dropdown } from 'react-native-element-dropdown';

import CreateFitnessPlanPresenter from '../../presenter/CreateFitnessPlanPresenter';


const SelectExerciseListPage = ({route, navigation}) => {
    const {routineIndex, routines, planInfo, isEditing, fitnessPlan} = route.params; 

    const [exercises, setExercises] = useState([]);

    const [exerciseType, setExerciseType] = useState('');
    const [targetMuscle, setTargetMuscle] = useState('');
    const [search, setSearch] = useState("");
    
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMsg, setModalMsg] = useState('');
    const [confirmationVisible, setConfirmationVisible] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState('');


     // change popup/modal visible
     const changeConfirmVisible = (b, m)=>{
        setConfirmMessage(m);
        setConfirmationVisible(b);
    }

    // change popup/modal visible
    const changeModalVisible = (b, m)=>{
        setModalMsg(m);
        setModalVisible(b);
    }

    // change popup/modal visible
    const changeLoadingVisible = (b)=>{
        setIsLoading(b);
    }

    const modifyText = (text)=>{
        text = text.replace(/_/g, ' ');
        const words = text.split(' ');

        if (words.length > 1){
            return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        }else{
            return text.charAt(0).toUpperCase() + text.slice(1);
        }

    }

    const searchHandler = async()=>{
        try{
            changeLoadingVisible(true);
            setExercises([]);
            
            await new CreateFitnessPlanPresenter({updateExerciseList: setExercises}).searchExercises(search, exerciseType, targetMuscle);
        }catch(e){
            changeModalVisible(true, e.message);
        }finally{
            changeLoadingVisible(false);
        }
    }

    
    // to close dropdown
    const dropdownTypeRef = useRef(null);
    // Dropdown - exercise type
    const dropdownTypeOpt = [
        {label: 'Any', value:''},
        {label: 'Cardio', value:'cardio'},
        {label: 'Olympic Weightlifting', value:'olympic_weightlifting'},
        {label: 'Plyometrics', value:'plyometrics'},
        {label: 'Powerlifting', value:'powerlifting'},
        {label: 'Strength', value:'strength'},
        {label: 'Stretching', value:'stretching'},
        {label: 'Strongman', value:'strongman'},
    ]
    // Render Dropdown options
    const renderTypeItem=(item)=>{
        return(
            <TouchableOpacity activeOpacity={.7} style={styles.item}
            onPress={()=>{
                setExerciseType(item.value);
                dropdownTypeRef.current.close();
            }}
            >
                <Text style={styles.itemText}>{item.label}</Text>
            </TouchableOpacity> 
        );
    };

    // to close dropdown
    const dropdownMuscleRef = useRef(null);
    // Dropdown - muscle group
    const dropdownMuscleOpt = [
        {label: 'Any', value:''},
        {label: 'Abdominals', value:'abdominals'},
        {label: 'Abductors', value:'abductors'},
        {label: 'Adductors', value:'adductors'},
        {label: 'Biceps', value:'biceps'},
        {label: 'Calves', value:'calves'},
        {label: 'Chest', value:'chest'},
        {label: 'Forearms', value:'forearms'},
        {label: 'Glutes', value:'glutes'},
        {label: 'Hamstrings', value:'hamstrings'},
        {label: 'Lats', value:'lats'},
        {label: 'Lower Back', value:'lower_back'},
        {label: 'Middle Back', value:'middle_back'},
        {label: 'Neck', value:'neck'},
        {label: 'Quadriceps', value:'quadriceps'},
        {label: 'Traps', value:'traps'},
        {label: 'Triceps', value:'triceps'},   
    ]
    // Render Dropdown options
    const renderMuscleItem=(item)=>{
        return(
            <TouchableOpacity activeOpacity={.7} style={styles.item}
            onPress={()=>{
                setTargetMuscle(item.value);
                dropdownMuscleRef.current.close();
            }}
            >
                <Text style={styles.itemText}>{item.label}</Text>
            </TouchableOpacity> 
        );
    };


    useEffect(()=>{
        searchHandler();

    },[]);



    return(
        <View style={styles.container}>

            <View style = {styles.filterContainer}>
                <View style = {styles.dropdownViewContainer}>
                    <Text style = {styles.filterTitleText}>Exercise Type</Text>
                    <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        data={dropdownTypeOpt}
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder="Select Exercise Type"
                        value={exerciseType}
                        onChange={type => {
                            setExerciseType(type);
                        }}
                        renderItem={renderTypeItem}
                        ref={dropdownTypeRef}
                    />
                </View>

                <View style = {styles.dropdownViewContainer}>
                    <Text style = {styles.filterTitleText}>Target Muscle</Text>
                    <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        data={dropdownMuscleOpt}
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder="Select Target Muscle"
                        value={targetMuscle}
                        onChange={muscle => {
                            setTargetMuscle(muscle);
                        }}
                        renderItem={renderMuscleItem}
                        ref={dropdownMuscleRef}
                    />
                </View>
            </View>

            <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={()=>changeLoadingVisible(false)}>
                <LoadingDialog />
            </Modal>
            <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={()=>changeModalVisible(false)}>
                <MessageDialog message = {modalMsg} changeModalVisible = {changeModalVisible} />
            </Modal>
            
            <View style = {styles.topContentContainer}>
                <TextInput style = {styles.searchBarContainer} onChangeText={setSearch} value = {search} placeholder = 'Search Exercise' /> 
                
                <TouchableOpacity onPress = {searchHandler} style = {styles.searchButton}>
                    <Image style = {styles.searchLogo} source={require('../../../assets/search_icon.png')} />    
                </TouchableOpacity>
            </View>

            <ScrollView style = {styles.listContainer}>
                {exercises.length == 0 ? 
                    <Text style = {styles.noAvailText}>{`No Exercise\nAvailable`}</Text>
                 :
                    exercises.map((exercise, index)=>{
                        return(
                            <TouchableOpacity key={index} onPress = {()=>{navigation.navigate('SelectExerciseDetailsPage', {exercise, routineIndex, routines, planInfo, isEditing, fitnessPlan})}} style = {styles.exerciseItemButton}>
                                <Text style = {styles.exerciseItemTitle}>{exercise.exerciseName.toUpperCase()}</Text>
                                <Text style = {styles.exerciseItemSubTitle}>{`${modifyText(exercise.equipment)} - ${modifyText(exercise.difficulty)}`}</Text>
                            </TouchableOpacity>
                        );
                    })
                }
                
            </ScrollView>

            <View style = {{height: scale(50)}}></View>


        </View>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E28413',
    },
    filterContainer:{
        padding: scale(10),
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        gap: scale(10),
    },
    dropdownViewContainer:{
        width: '50%',
    },
    filterTitleText:{
        fontSize: scale(16),
        fontFamily:'Poppins-Medium',
        color: 'black',
        marginTop: scale(5),
    },
    dropdown: {
        height: scale(35),
        width: '90%',
        margin:scale(5),
        padding:scale(10),
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
        backgroundColor: 'white',
        borderRadius:8
    },
    placeholderStyle: {
        fontSize: scale(14),
    },
    selectedTextStyle: {
        fontSize: scale(14),
        height:scale(18)
    },
    item: {
        paddingLeft: scale(5),
        height:scale(25),
        borderWidth:1,
        borderColor: 'lightgrey',
    },
    itemText: {
        fontSize: scale(12),
        fontFamily:'Poppins-Medium'
    },

    topContentContainer:{
        width: '100%',
        marginVertical: scale(20),
        
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'row',

        
        
    
    },
    searchBarContainer:{
        width: '75%',
        paddingVertical: scale(5),
        paddingHorizontal: scale(10),
        borderRadius: scale(10),
        
        display:'flex',
        alignItems:'center',
        flexDirection:'row',
        gap:scale(5),

        backgroundColor: 'white'
    },

    searchButton:{
        backgroundColor: '#D9D9D9',
        padding: scale(8),
        borderRadius: scale(20),
    },

    searchLogo:{
        width:scale(20),
        height: scale(20)
    },
    listContainer:{
        backgroundColor: '#FBF5F3',
    },
    noAvailText:{
        fontSize: scale(32),
        fontFamily: 'Poppins-Medium',
        paddingVertical: scale(10),
        marginVertical: scale(100),
        textAlign: 'center',
    },
    exerciseItemButton:{
        borderWidth: 1,
        borderColor: '#D9D9D9',
        padding: scale(10),
    },
    exerciseItemTitle:{
        fontSize: scale(18),
        fontFamily: 'Poppins-Medium'
    },
    exerciseItemSubTitle:{
        fontSize: scale(16),
        fontFamily: 'Poppins'
    
    }
});

export default SelectExerciseListPage;
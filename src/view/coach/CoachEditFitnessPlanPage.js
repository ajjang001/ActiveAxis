import React, {useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Modal, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Dropdown } from 'react-native-element-dropdown';
import { CheckBox } from '@rneui/themed';
import { LoadingDialog, MessageDialog, ActionDialog } from '../../components/Modal';

import { scale } from '../../components/scale';

import EditFitnessPlanPresenter from '../../presenter/EditFitnessPlanPresenter';


const CoachEditFitnessPlanPage = ({navigation, route}) => {

    const {fitnessPlan} = route.params;

    const [coach, setCoach] = useState(route.params.coach);
    const [photo, setPhoto] = useState(fitnessPlan !== null && fitnessPlan !== undefined ? fitnessPlan.fitnessPlanPicture : null);
    const [goalType, setGoalType] = useState(0);
    const [description, setDescription] = useState(fitnessPlan !== null && fitnessPlan !== undefined ? fitnessPlan.fitnessPlanDescription : '');
    
    const [name, setName] = useState(fitnessPlan !== null && fitnessPlan !== undefined ? fitnessPlan.fitnessPlanName : '' );
    const [medicalCheck, setmedicalCheck] = useState(fitnessPlan !== null && fitnessPlan !== undefined ? fitnessPlan.isMedicalCheck : false);

    const [tempOriginalRoutines, setTempOriginalRoutines] = useState(fitnessPlan !== null && fitnessPlan !== undefined ? [...fitnessPlan.routinesList] : []);
    const [routines, setRoutines] = useState(()=>{
        return new EditFitnessPlanPresenter().deepCopy(tempOriginalRoutines);
    });
    
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMsg, setModalMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [confirmationVisible, setConfirmationVisible] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState('');

    const [dropdownOpt, setDropdownOpt] = useState([]);
  
    // to close dropdown
    const dropdownRef = useRef(null);

    // change popup/modal visible
    const changeLoadingVisible = (b)=>{
        setIsLoading(b);
    }

    // change popup/modal visible
    const changeModalVisible = (b, m)=>{
        setModalMsg(m);
        setModalVisible(b);
    }

    // change popup/modal visible
    const changeConfirmVisible = (b, m)=>{
        setConfirmMessage(m);
        setConfirmationVisible(b);
    }

    // Render Dropdown options
    const renderItem=(item)=>{
        return(
            <TouchableOpacity activeOpacity={.7} style={styles.item}
            onPress={()=>{
                setGoalType(item.id);
        
                dropdownRef.current.close();
            }}
            >
                    <Text style={styles.itemText}>{item.name}</Text>
            </TouchableOpacity> 
        );
    };

    const saveHandler = async () => {
        try{
            changeLoadingVisible(true);
            await new EditFitnessPlanPresenter({fitnessPlan: fitnessPlan}).saveFitnessPlan(coach, (photo === fitnessPlan.fitnessPlanPicture? null : photo), goalType, description.trim(), name.trim(), medicalCheck, routines);

            // remove goback 2 pages
            navigation.pop(2);

            Alert.alert('Success', 'Fitness Plan saved successfully');
        }catch(error){
            changeModalVisible(true, error.message.replace('Error: ', ''));
        }finally{
            changeLoadingVisible(false);
        }
    }

    const loadGoalType = async () =>{
        try{
            changeLoadingVisible(true);
            await new EditFitnessPlanPresenter({updateGoals: setDropdownOpt}).getGoals();
            
        }catch(error){
            changeModalVisible(true, error.message.replace('Error: ', ''));
        }finally{
            changeLoadingVisible(false);
        }
    }

    const loadInitGoal = async()=>{
        try{
            const goalID = await new EditFitnessPlanPresenter().getGoalID(fitnessPlan.planGoal);
            setGoalType(goalID);
        }catch(error){
            changeModalVisible(true, error.message.replace('Error: ', ''));
        }finally{
            changeLoadingVisible(false);
        }
    }

    

    // handle select photo
    const handleSelectPhoto = () => {
        launchImageLibrary({ mediaType: 'photo' }, (response) => {
        if (response.didCancel) {
            console.log('User cancelled image picker');
        } else if (response.errorCode) {
            console.log('ImagePicker Error: ', response.errorMessage);
        } else {
            const asset = response.assets[0];
            const uri = asset.uri;
            const name = asset.fileName || uri.split('/').pop();
            
            setPhoto({ uri, name });
        }
        });
    };

    useEffect(() => {
        loadInitGoal();
        loadGoalType();
    },[]);

    useEffect(() => {
        if(route.params?.refresh){
            setCoach(route.params.coach);
            setName(route.params.name);
            setPhoto(route.params.photo);
            setGoalType(route.params.goalType);
            setDescription(route.params.description);
            setmedicalCheck(route.params.medicalCheck);
            setRoutines(route.params.routines);
            route.params.refresh = false;
        }
    },[route.params?.refresh]);
    

    return(
        <View style = {styles.container}>
            <View style = {styles.topButtonView}>
                <TouchableOpacity style = {styles.topButtons} onPress = {() => changeConfirmVisible( true, 'Are you sure you want to discard these changes?')} >
                    <Text style = {styles.topButtonText}>BACK</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {styles.topButtons} onPress = {saveHandler}>
                    <Text style = {styles.topButtonText}>SAVE</Text>
                </TouchableOpacity>
            </View>

            <View style = {styles.planPicContainer}>
                    <TouchableOpacity style={styles.imagePlaceholder} onPress={handleSelectPhoto}>
                    {
                        photo ? 
                        (
                            <Image source={{uri:photo.uri || photo}} style={{width: '100%', height: '100%', borderRadius: scale(18)}} />
                        )
                        :
                        (
                            
                            <Image source={require('../../../assets/upload_icon.png')} style={{width: scale(150), height: scale(150)}} />
                            
                        )

                    }
                    </TouchableOpacity>
                </View>


                <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={()=>changeLoadingVisible(false)}>
                    <LoadingDialog />
                </Modal>
                <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={()=>changeModalVisible(false)}>
                    <MessageDialog message = {modalMsg} changeModalVisible = {changeModalVisible} />
                </Modal>
                <Modal transparent={true} animationType='fade' visible={confirmationVisible} nRequestClose={()=>changeModalVisible(false)}>
                    <ActionDialog
                        message = {confirmMessage}
                        changeModalVisible = {changeConfirmVisible}
                        action = {() => navigation.goBack()}
                    />
                </Modal>


                <View style = {styles.statisticsView}>
                    <View style = {styles.stat}>
                        <Image source={require('../../../assets/clock_icon.png')} style={styles.icon} />
                        <Text style = {styles.iconText}>{`${routines.length || 0}`} Days</Text>
                    </View>
                    <View style = {styles.stat}>
                        <Image source={require('../../../assets/fire_icon.png')} style={styles.icon} />
                        <Text style = {styles.iconText}>{`${Math.ceil(routines.map (routine => routine.estCaloriesBurned).reduce((acc, cal) => acc + cal, 0)) || 0}`} kcal</Text>
                    </View>
                </View>

                <View style = {styles.descriptionView}>
                    <Text style={styles.descriptionTitle}>Fitness Plan Name:</Text>
                    <TextInput
                        style={styles.descriptionInput}
                        placeholder="Enter fitness plan name here..."
                        value={name}
                        onChangeText={(text) => setName(text)}
                        maxLength={32}
                    />

                    <Text style={styles.descriptionTitle}>Goal Type:</Text>
                    <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        data={dropdownOpt}
                        maxHeight={300}
                        labelField="name"
                        valueField="id"
                        placeholder="Select Plan Goal"
                        value={goalType}
                        onChange={type => {
                            setGoalType(type);
                        }}
                        renderItem={renderItem}
                        ref={dropdownRef}
                    />

                    <Text style={styles.descriptionTitle}>Description:</Text>
                    <TextInput
                        style={styles.descriptionInput}
                        placeholder='Enter description here...'
                        value={description}
                        onChangeText={text => setDescription(text)}
                    />

                    <CheckBox
                        checked={medicalCheck}
                        onPress={() => setmedicalCheck(!medicalCheck)}
                        title={
                            <Text style={{ marginLeft: scale(10), maxWidth:'80%' }}>
                                Suitable for users with any medical conditions
                            </Text>}
                        iconType="material-community"
                        checkedIcon="checkbox-outline"
                        uncheckedIcon={'checkbox-blank-outline'}
                        checkedColor="black"
                        textStyle=''
                        containerStyle={{ backgroundColor: 'transparent'}}
                    />
                </View>

                <View style = {styles.bottomButtonView}>
                    <TouchableOpacity style = {styles.bottomButton} onPress = {() => navigation.navigate('CoachEditFitnessPlanPage2', {
                        coach: coach,
                        photo: photo,
                        goalType: goalType,
                        description: description,
                        name: name,
                        medicalCheck: medicalCheck,
                        routines: routines,
                        fitnessPlan: fitnessPlan,
                        isEditing: true
                    })}>
                
                        <Text style = {styles.bottomButtonText}>Manage Routines</Text>
                    </TouchableOpacity>
                </View>

        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FBF5F3',
        paddingTop: scale(75),
    },
    topButtonView:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: scale(20),
    },
    topButtons:{
        backgroundColor: 'black',
        padding: scale(5),
        borderRadius: scale(50),
        width: scale(150),
    },
    topButtonText:{
        color: 'white',
        textAlign: 'center',
        fontFamily: 'League-Spartan',
        fontSize: scale(20),

    },
    planPicContainer:{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E28413',
        marginTop: scale(20),
        padding: scale(20),
    },
    imagePlaceholder: {
        width: '80%',
        height: scale(225),
        backgroundColor: '#D3D3D3',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: scale(18),
    },
    statisticsView:{
        marginTop: scale(15),
        paddingHorizontal: scale(20),
        alignItems: 'flex-start',
        flexDirection: 'row',
        
    },
    stat :{
        flexDirection:'row',
        gap: scale(5),
        paddingHorizontal: scale(10),
        
    },
    icon:{
        width: scale(25), 
        height: scale(25)
    },
    iconText:{
        fontSize: scale(15),
        fontFamily: 'League-Spartan',
    },
    descriptionTitle: {
        alignSelf: 'flex-start',
        fontSize: scale(15),
        fontFamily: 'Poppins-SemiBold',
        marginBottom: scale(5),
    },
    dropdown: {
        height: scale(50),
        width: '100%',
        padding:scale(10),
        backgroundColor: 'white',
        borderColor: '#CCC',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: scale(20),
    },
    placeholderStyle: {
        fontSize: scale(13)
    },
    selectedTextStyle: {
        fontSize: scale(15),
        height:scale(18),
    },
    item: {
        paddingLeft: scale(5),
        height:scale(30),
        borderWidth:1,
        borderColor: 'lightgrey',
        paddingVertical: scale(5),
    },
    itemText: {
        fontSize: scale(12),
        fontFamily:'Poppins-Medium'
    },

    descriptionInput: {
        width: '100%',
        backgroundColor: '#FFF',
        padding: scale(10),
        borderColor: '#CCC',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: scale(20),
    },

    descriptionView: {
        paddingHorizontal: scale(20),
        marginTop: scale(20),
    },
    bottomButtonView:{
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: scale(20),
    },
    bottomButton:{
        backgroundColor: '#E28413',
        padding: scale(5),
        width: scale(175),
        borderRadius: 10,
        alignItems: 'center',
        marginHorizontal: scale(20),
    },
    bottomButtonText:{
        color: 'white',
        fontFamily: 'League-Spartan-SemiBold',
        fontSize: scale(18),
    },
});

export default CoachEditFitnessPlanPage;
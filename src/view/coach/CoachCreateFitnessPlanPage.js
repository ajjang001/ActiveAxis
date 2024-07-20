import React, {useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Modal } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Dropdown } from 'react-native-element-dropdown';
import { CheckBox } from '@rneui/themed';
import { LoadingDialog, MessageDialog, ActionDialog } from '../../components/Modal';

import { scale } from '../../components/scale';

const CoachCreateFitnessPlanPage = ({navigation, route}) => {

    const [coach, setCoach] = useState(route.params.coach);
    const [photo, setPhoto] = useState(null);
    const [goalType, setGoalType] = useState(1);
    const [details, setDetails] = useState('');
    const [name, setName] = useState('');
    const [medicalCheck, setmedicalCheck] = useState(false);
    const [routines, setRoutines] = useState([]);


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
                setGoalType(item.goalTypeID);
        
                dropdownRef.current.close();
            }}
            >
                    <Text style={styles.itemText}>{item.fitnessPlanName}</Text>
            </TouchableOpacity> 
            );
        };



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
        // isSave can be true or false
        // redirectAction: {isSave, refresh: true},
        if(route.params?.refresh){
            setCoach(route.params.coach);
            setName(route.params.name);
            setPhoto(route.params.photo);
            setGoalType(route.params.goalType);
            setDetails(route.params.details);
            setmedicalCheck(route.params.medicalCheck);
            setRoutines(route.params.routines);

            route.params.refresh = false;
        }

        console.log('days: ')
        routines.forEach(routine=>{
            console.log(routine.dayNumber);
        })
    },[route.params?.refresh]);


    return (
        <View style = {styles.container}>
                <View style = {styles.topButtonView}>
                    <TouchableOpacity style = {styles.topButtons} onPress = {() => changeConfirmVisible( true, 'Are you sure you want to discard this plan?')} >
                        <Text style = {styles.topButtonText}>Discard</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style = {styles.topButtons} onPress = {() => console.log(routines)}>
                        <Text style = {styles.topButtonText}>Create</Text>
                    </TouchableOpacity>
                </View>

                <View style = {styles.planPicContainer}>
                    <TouchableOpacity style={styles.imagePlaceholder} onPress={handleSelectPhoto}>
                        {
                        photo ? 
                        (
                            <Image source={{uri:photo.uri}} style={{width: '100%', height: '100%', borderRadius: scale(18)}} />
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
                        <Text style = {styles.iconText}>00 Days</Text>
                    </View>
                    <View style = {styles.stat}>
                        <Image source={require('../../../assets/fire_icon.png')} style={styles.icon} />
                        <Text style = {styles.iconText}>00 Cal</Text>
                    </View>
                </View>

                <View style = {styles.detailsView}>
                    <Text style={styles.detailsTitle}>Fitness Plan Name:</Text>
                    <TextInput
                        style={styles.detailsInput}
                        placeholder="Enter fitness plan name here..."
                        value={name}
                        onChangeText={(text) => setName(text)}
                        maxLength={32}
                    />

                    <Text style={styles.detailsTitle}>Goal Type:</Text>
                    <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        data={dropdownOpt}
                        maxHeight={300}
                        labelField="fitnessPlanName"
                        valueField="fitnessPlanID"
                        placeholder="Select Plan Goal"
                        value={goalType}
                        onChange={type => {
                            setGoalType(type);
                        }}
                        renderItem={renderItem}
                        ref={dropdownRef}
                    />

                    <Text style={styles.detailsTitle}>Details:</Text>
                    <TextInput
                        style={styles.detailsInput}
                        placeholder='Enter details here...'
                        value={details}
                        onChangeText={text => setDetails(text)}
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
                    <TouchableOpacity style = {styles.bottomButton} onPress = {() => navigation.navigate('CoachCreateFitnessPlanPage2', {
                        coach: coach,
                        photo: photo,
                        goalType: goalType,
                        details: details,
                        name: name,
                        medicalCheck: medicalCheck,
                        routines: routines
                    })}>
                
                        <Text style = {styles.bottomButtonText}>Manage Routines</Text>
                    </TouchableOpacity>
                </View>
        </View>
    );
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
    detailsTitle: {
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

    detailsInput: {
        width: '100%',
        backgroundColor: '#FFF',
        padding: scale(10),
        borderColor: '#CCC',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: scale(20),
    },

    detailsView: {
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

export default CoachCreateFitnessPlanPage;
import React, {useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Modal, Alert, ScrollView } from 'react-native';
import { scale } from "../../components/scale";
import { LoadingDialog, MessageDialog, ActionDialog } from '../../components/Modal';
import { Dropdown } from 'react-native-element-dropdown';
import moment from 'moment-timezone';

import DisplayFitnessPlanDetailsPresenter from "../../presenter/DisplayFitnessPlanDetailsPresenter";

const UserFitnessPlanDetailsPage = ({route, navigation}) => {
    const {user} = route.params;
    const {fitnessPlan} = route.params;
    const {planAllocation} = route.params;
    const {session} = route.params;
    const {isOnProgress} = route.params;
    const {allocatedPlans} = route.params;


    const [fitnessGoal, setFitnessGoal] = useState('');

    const [modalVisible, setModalVisible] = useState(false);
    const [modalMsg, setModalMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [confirmationVisible, setConfirmationVisible] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState('');

    const [initPlanLength, setInitPlanLength] = useState(fitnessPlan.routinesList.length * planAllocation.repetition || 0);
    const [planLength, setPlanLength] = useState(initPlanLength || 0);
    const [initCalBurn, setInitCalBurn] = useState(Math.ceil(fitnessPlan.routinesList.map(routine => routine.estCaloriesBurned).reduce((a, b) => a + b, 0)) * planAllocation.repetition || 0);
    const [calBurn, setCalBurn] = useState(initCalBurn || 0);
    const [repetition, setRepetition] = useState(planAllocation.repetition || 1);

    const [newEndDate, setNewEndDate] = useState(planAllocation.endDate || null);
    

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

    const formatDate = (date) => {
        if (!date) return "";
        return date.toLocaleString('en-US', {
            timeZone: 'Asia/Singapore',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        });
    };

    const updateEndDate = () => {
        if(planAllocation.startDate){
            const timezone = 'Asia/Singapore';
            const newEndDate = moment(planAllocation.startDate.toDate()).tz(timezone).add(planLength - 1, 'days').endOf('day').toDate();

            setNewEndDate(newEndDate);
        }
    }

    // Render Dropdown options
    const renderItem=(item)=>{
        return(
        <TouchableOpacity activeOpacity={.7} style={styles.item}
        onPress={()=>{
            setRepetition(item.value / initPlanLength);
            setCalBurn(Math.ceil(fitnessPlan.routinesList.map(routine => routine.estCaloriesBurned).reduce((a, b) => a + b, 0)) * item.value / initPlanLength);
            setPlanLength(item.value);
            dropdownRef.current.close();
        }}
        >
                <Text style={styles.itemText}>{item.label}</Text>
        </TouchableOpacity> 
        );
    };

    const getFitnessGoalByID = async(goalID) =>{
        try{
            await new DisplayFitnessPlanDetailsPresenter({updateFitnessGoal: setFitnessGoal}).getFitnessGoalByID(goalID);

        }catch(error){
            changeModalVisible(true, error.message.replace("Error: ", ""));
        }
    }

    const loadLength = (oldLength) =>{
        let opt = [];
        for(let i = 1; i <= 4; i++){
            const val = i *oldLength;

            const estEndDate = planAllocation.startDate.toDate().getTime() + val * 86400000;

            // check if val (number of days) + plan start date is not greater than session end date
            if( estEndDate > session.historyItem.endDate.toDate().getTime()){
                break;
            }

            // check if val (number of days) + plan start date does not overlap with other allocated plans
            // excluding this plan
            let isOverlap = false;

            for(let i = 0; i < allocatedPlans.length; i++){
                if(allocatedPlans[i].plan.allocationID === planAllocation.allocationID){
                    continue;
                }

                if (estEndDate >= allocatedPlans[i].plan.startDate.toDate().getTime() && estEndDate <= allocatedPlans[i].plan.endDate.toDate().getTime()){
                    isOverlap = true;
                    break;
                }
            }
            
            if(isOverlap){
                break;
            }

            const lab = i.toString() + ' x ' + oldLength.toString() + ' Days';
            opt.push({label: lab, value: val});
        }
        setDropdownOpt(opt);
    }

    const handleSave = async()=>{
        try{
            changeLoadingVisible(true);

            await new DisplayFitnessPlanDetailsPresenter().updateAllocationPlan(planAllocation.allocationID, repetition, newEndDate);
            Alert.alert('Success', 'Plan Length has been updated successfully');
            navigation.goBack()

        }catch(error){
            changeModalVisible(true, error.message.replace("Error: ", ""));
        }finally{
            changeLoadingVisible(false);
        }
    }

    const loadRoutines = async() =>{
        try{
            const rep = planAllocation.repetition || 1;
            await new DisplayFitnessPlanDetailsPresenter({fitnessPlan:fitnessPlan}).loadRoutines(rep, planAllocation.isNewEndDate);
        }catch(error){
            changeModalVisible(true, error.message.replace("Error: ", ""));
        }
    };

    const loadInfo = async() =>{
        try{
            changeLoadingVisible(true);
            if(fitnessPlan && session && planAllocation && allocatedPlans){
                await getFitnessGoalByID(fitnessPlan.planGoal);
                if(!planAllocation.isNewEndDate){
                    loadLength(fitnessPlan.routinesList.length);
                }
                await loadRoutines();
                
            }

        }catch(error){
            changeModalVisible(true, error.message.replace("Error: ", ""));
        }finally{
            changeLoadingVisible(false);
        }
    }

    useEffect(() => {
        loadInfo();
    } ,[ fitnessPlan, session, planAllocation, allocatedPlans]);

    useEffect(() => {
        if(planLength > 0){
            updateEndDate();
        }
    }, [planLength]);

    return(
        <View style = {styles.container}>
            <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={()=>changeLoadingVisible(false)}>
                <LoadingDialog />
            </Modal>
            <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={()=>changeModalVisible(false)}>
                <MessageDialog message = {modalMsg} changeModalVisible = {changeModalVisible} />
            </Modal>
            <Modal transparent={true} animationType='fade' visible={confirmationVisible} nRequestClose={()=>changeConfirmVisible(false)}>
                <ActionDialog
                message = {confirmMessage}
                changeModalVisible = {changeConfirmVisible}
                action = {handleSave}
                />
            </Modal>

            <ScrollView>
                <View style = {styles.topContainer}>
                    <View style = {styles.titleContainer}>
                        <Text style = {styles.planNameText}>{fitnessPlan.fitnessPlanName}</Text>
                        <View style = {styles.statsView}>
                            <View style = {styles.stats}>
                                <Image source = {require('../../../assets/clock_icon.png')} style = {styles.icon}/>
                                <Text style = {styles.statsText}>{planLength} Days</Text>
                            </View>
                            <View style = {styles.stats}>
                                <Image source = {require('../../../assets/fire_icon.png')} style = {styles.icon}/>
                                <Text style = {styles.statsText}>{`${calBurn} kcal ${dropdownOpt.length === 0 ? '' : `(${repetition} x ${initCalBurn} kcal)`}`}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style = {styles.planPicContainer}>
                    <View style={styles.imagePlaceholder}>
                        <Image source={{uri:fitnessPlan.fitnessPlanPicture}} style={{width: '100%', height: '100%', borderRadius: scale(18)}} />
                    </View>
                </View>

                
                <View style = {styles.detailsView}>
                    <Text style = {styles.detailsTitleText}>GOAL</Text>
                    <Text style = {styles.detailsText}>{fitnessGoal || ''}</Text>

                    <Text style = {styles.detailsTitleText}>DESCRIPTION</Text>
                    <Text style = {styles.detailsText}>{fitnessPlan.fitnessPlanDescription}</Text>

                    <Text style = {styles.detailsTitleText}>START DATE</Text>
                    <Text style = {styles.detailsText}>{formatDate(planAllocation.startDate.toDate())}</Text>

                    {
                        !isOnProgress  ?
                        <>
                            <Text style = {styles.detailsTitleText}>SELECT PLAN LENGTH:</Text>
                            <Dropdown
                                disable={dropdownOpt.length === 0}
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                data={dropdownOpt}
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder= {dropdownOpt.length === 0? "No Changes Allowed" : "Select Plan Length"}
                                value={planLength}
                                onChange={l => {
                                    setRepetition(l / initPlanLength);
                                    setCalBurn(Math.ceil(fitnessPlan.routinesList.map(routine => routine.estCaloriesBurned).reduce((a, b) => a + b, 0)) * l / initPlanLength);
                                    setPlanLength(l);
                                }}
                                renderItem={renderItem}
                                ref={dropdownRef}
                                
                            />
                        </>
                        :null
                    }

                    <Text style = {styles.detailsTitleText}>{ !isOnProgress && !planAllocation.isNewEndDate ? 'ESTIMATED ' : null}END DATE</Text>
                    <Text style = {styles.detailsText}>{formatDate(newEndDate)}</Text>
                </View>


            </ScrollView>
            <View style = {styles.bottomButtonView}>
                <TouchableOpacity onPress ={()=>{navigation.navigate('UserFitnessPlanDetailsPage2', {user, fitnessPlan, planAllocation, session, isOnProgress, repetition})}} style = {styles.bottomButton}>
                    <Text style = {styles.bottomButtonText}>View Routines</Text>
                </TouchableOpacity>
                {
                    !isOnProgress ?
                    <TouchableOpacity disabled ={dropdownOpt.length === 0} onPress={()=>{changeConfirmVisible( true, 'Once you save, you cannot modify the plan length anymore.\n\nAre you sure you want to save changes?')}} style = {[styles.bottomButton, dropdownOpt.length ===0 ? {backgroundColor:'#808080'} : null]}>
                        <Text style = {styles.bottomButtonText}>Save Changes</Text>
                    </TouchableOpacity>
                    :
                    null
                }
                
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#FBF5F3',
    },
    topContainer:{
        paddingHorizontal: scale(25),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    titleContainer:{
        maxWidth: '70%',
    },
    planNameText:{
        fontSize: scale(25),
        marginBottom: scale(5),
        fontWeight: 'bold',
    },
    statsView:{
        flexDirection: 'row',
        gap: scale(50),
        alignItems: 'center',
        
    },
    stats:{
        flexDirection: 'row',
        gap: scale(5),
        alignItems: 'center',
    },
    statsText:{
        fontFamily: 'League-Spartan',
        fontSize: scale(16),
    },
    icon:{
        width: scale(20),
        height: scale(20),
    
    },
    planPicContainer:{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E28413',
        marginTop: scale(20),
        padding: scale(20),
    },
    imagePlaceholder: {
        width: '90%',
        height: scale(225),
        backgroundColor: '#D3D3D3',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: scale(18),
    },
    detailsView: {
        paddingHorizontal: scale(20)
    },
    detailsTitleText:{
        marginTop: scale(20),
        fontFamily: 'Poppins-SemiBold',
        fontSize: scale(18),
    },
    detailsText:{
        fontFamily: 'Poppins',
        fontSize: scale(16),
    },
    bottomButtonView:{
        backgroundColor: '#FBF5F3',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: scale(50),
        flexDirection: 'row',
        justifyContent: 'space-evenly',
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
    dropdown: {
        height: scale(30),
        width: '50%',
        margin:5,
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
        fontSize: scale(15),
        height:scale(18),
        color:'#454545',
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
});

export default UserFitnessPlanDetailsPage;

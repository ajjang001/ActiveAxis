import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Keyboard, ScrollView, Alert } from 'react-native';
import { LoadingDialog, ActionDialog, MessageDialog } from "../../components/Modal";
import { scale } from '../../components/scale';
import { Dropdown } from 'react-native-element-dropdown';
import DatePicker from 'react-native-date-picker';
import { useFocusEffect } from '@react-navigation/native';

import CreateCompetitionPresenter from "../../presenter/CreateCompetitionPresenter";

const UserCreateCompetitionPage = ({ navigation, route }) => {

    const { user } = route.params;

    // Competition Details
    const [competitionName, setcompetitionName] = useState('');
    const [competitionType, setcompetitionType] = useState(1);
    const [startDate, setstartDate] = useState(()=>{
        const tomorrow = new Date(new Date());
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        return tomorrow;
    });
    const [endDate, setendDate] = useState(()=>{
        const nextWeek = new Date(startDate);
        nextWeek.setDate(nextWeek.getDate() + 14);
        nextWeek.setHours(0, 0, 0, 0);
        return nextWeek;
    });
    const [target, setTarget] = useState(0);
    const [competitionDetails, setcompetitionDetails] = useState('');
    const [friendsInvited, setFriendsInvited] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMsg, setModalMsg] = useState('');
    const [confirmationVisible, setConfirmationVisible] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState('');

    const [dropdownOpt, setDropdownOpt] = useState([]);
  
    // to close dropdown
    const dropdownRef = useRef(null);
    // Date Picker
    const [openStartDate, setOpenStartDate] = useState(false);
    const [openEndDate, setOpenEndDate] = useState(false);

    // change popup/modal visible
    const changeModalVisible = (b, m) => {
        setModalMsg(m);
        setModalVisible(b);
    }
    // change popup/modal visible
    const changeLoadingVisible = (b) => {
        setIsLoading(b);
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
                setcompetitionType(item.competitionTypeID);
        
                dropdownRef.current.close();
            }}
            >
                    <Text style={styles.itemText}>{item.competitionTypeName}</Text>
            </TouchableOpacity> 
            );
        };

    // Date formatter
    const formatDate = (date) => {
        if (!date) return "";
        return date.toLocaleDateString('en-US', {
            timeZone: 'Asia/Singapore',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getTomorrow = (date) => {
        const tomorrow = new Date(date);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        return tomorrow;
    }

    const getNext2Weeks = (date) => {
        const nextWeek = new Date(date);
        nextWeek.setDate(nextWeek.getDate() + 14);
        nextWeek.setHours(0, 0, 0, 0);
        return nextWeek;
    }


    // Process Create Competition
    const processCreate = async () => {
        changeLoadingVisible(true);
        try {
            await new CreateCompetitionPresenter().createCompetition(competitionName.trim(), competitionType, startDate, endDate, parseInt(target), competitionDetails.trim(), friendsInvited, user.accountID);
            Alert.alert('Competition created successfully.', 'The competition needs at least 2 players. Please let your friends accept the invitation before the competition starts. Otherwise, the competition will be cancelled.');
            navigation.navigate('UserCompetitionPage', { user });
        } catch (e) {
            changeModalVisible(true, e.message.replace('Error: ', ''));
        } finally {
            changeLoadingVisible(false);
        }
    };

    const loadCompetitionTypes = async () => {
        try{
            await new CreateCompetitionPresenter({updateDropdown: setDropdownOpt}).getCompetitionTypes();
        }catch(e){
            changeModalVisible(true, e.message.replace('Error: ', ''));
        }
    }

    const loadInfo = async () => {
        try{
            changeLoadingVisible(true);
            await loadCompetitionTypes();
        }catch(e){
            changeModalVisible(true, e.message.replace('Error: ', ''));
        }finally{
            changeLoadingVisible(false);
        }
    }

    useEffect(() => {
        loadInfo();
    }, []);

    useEffect(() => {
        setendDate(getNext2Weeks(startDate));
    }, [startDate]);

    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.headerBox}>
                    <Text style={styles.headerText}>Create Competition</Text>
                </View>
                <View style={styles.detailsBox}>
                    <TouchableOpacity style={styles.inviteButton} onPress={() => navigation.navigate('InviteFriendsCompetitionPage', {user, friendsInvited})}>
                        <Text style={styles.inviteText}>Invite Friends</Text>
                    </TouchableOpacity>
                    <Text style={styles.detailsTitle}>Competition Name</Text>
                    <TextInput
                        style={styles.input}
                        value={competitionName}
                        placeholder='Enter competition name'
                        onChangeText={setcompetitionName}
                        maxLength={24}
                    />
                    <Text style={styles.detailsTitle}>Type</Text>
                    <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        data={dropdownOpt}
                        maxHeight={300}
                        labelField="competitionTypeName"
                        valueField="competitionTypeID"
                        placeholder="Select Plan Goal"
                        value={competitionType}
                        onChange={type => {
                            setcompetitionType(type);
                        }}
                        renderItem={renderItem}
                        ref={dropdownRef}
                    />
                    {
                        competitionType === 0 ? null :

                        <>
                        <Text style={styles.detailsTitle}>Start Date</Text>
                        
                        <TouchableOpacity onPress={() => setOpenStartDate(true)}>
                            <View>
                                <Text style={styles.dateContainer}>{startDate ? formatDate(startDate) : "Select start date"}</Text>
                            </View>
                        </TouchableOpacity>
                        {
                            competitionType === 1 ? 
                            
                            <>
                                <Text style={styles.detailsTitle}>Target (steps)</Text>
                                <TextInput
                                    style={styles.input}
                                    value={target.toString()}
                                    placeholder='Enter number of steps'
                                    onChangeText={setTarget}
                                    keyboardType='number-pad'
                                />
                                
                            </>

                            :
                            <>
                                <Text style={styles.detailsTitle}>End Date</Text>
                                <TouchableOpacity onPress={() => setOpenEndDate(true)}>
                                    <View>
                                        <Text style={styles.dateContainer}>{endDate ? formatDate(endDate) : "Select end date"}</Text>
                                    </View>
                                </TouchableOpacity>
                            </>
                        }
                        
                        </>
                        
                    }
                    <DatePicker
                        modal
                        open={openStartDate}
                        date={startDate || getTomorrow(new Date())}
                        mode='date'
                        minimumDate={getTomorrow(new Date())}
                        maximumDate={getNext2Weeks(startDate)}
                        onConfirm={(date) => {
                            setOpenStartDate(false);
                            setstartDate(date);
                        }}
                        onCancel={() => {
                            setOpenStartDate(false);
                        }}
                    />
                    <DatePicker
                        modal
                        open={openEndDate}
                        date={endDate || getNext2Weeks(startDate)}
                        mode='date'
                        minimumDate={getTomorrow(startDate)}
                        maximumDate={getNext2Weeks(startDate)}
                        onConfirm={(date) => {
                            setOpenEndDate(false);
                            setendDate(date);
                        }}
                        onCancel={() => {
                            setOpenEndDate(false);
                        }}
                    />
                    
                    <Text style={styles.detailsTitle}>Details</Text>
                    <TextInput
                        style={styles.competitionDetailsInput}
                        value={competitionDetails}
                        onChangeText={setcompetitionDetails}
                        multiline={true}
                        numberOfLines={7}
                        maxLength={200}
                        placeholder="Enter your competition details here..."
                        textAlignVertical="top"
                    />
                    <TouchableOpacity style={styles.createButton} onPress={() => changeConfirmVisible(true, 'Do you want to create this competition?')}>
                        <Text style={styles.createText}>CREATE</Text>
                    </TouchableOpacity>
                </View>
                <Modal transparent={true} animationType='fade' visible={confirmationVisible} nRequestClose={() => changeConfirmVisible(false)}>
                    <ActionDialog
                        message={confirmMessage}
                        changeModalVisible={changeConfirmVisible}
                        action={processCreate}
                    />
                </Modal>
                <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={() => changeLoadingVisible(false)}>
                    <LoadingDialog />
                </Modal>
                <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={()=>changeModalVisible(false)}>
                    <MessageDialog message = {modalMsg} changeModalVisible = {changeModalVisible} />
                </Modal>
            </View>
        </ScrollView>

    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FBF5F3',
    },
    headerBox: {
        width: '100%',
        height: '8%',
    },
    headerText: {
        fontSize: scale(36),
        fontFamily: 'League-Spartan',
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: scale(10),
    },
    detailsBox: {
        width: '90%',
        backgroundColor: '#E6E6E6',
        padding: scale(15),
        borderWidth: 2,
        borderRadius: scale(36),
        marginTop: scale(10),
        borderColor: '#C42847',
    },
    detailsTitle: {
        fontFamily: 'Inter-SemiBold',
        fontSize: scale(16),
        marginVertical: scale(2),
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: scale(15),
        borderRadius: scale(8),
        paddingVertical: scale(10),
        marginBottom: scale(10),
        borderColor: '#ccc',
        borderWidth: 1,
        fontSize: scale(18),
        fontFamily: 'Inter',
    },
    competitionDetailsInput: {
        backgroundColor: 'white',
        paddingHorizontal: scale(15),
        borderRadius: scale(8),
        paddingVertical: scale(15),
        marginBottom: scale(10),
        borderColor: '#ccc',
        borderWidth: 1,
        fontSize: scale(18),
        fontFamily: 'Inter',
    },
    createButton: {
        borderWidth: 1,
        width: '50%',
        alignSelf: 'center',
        backgroundColor: '#C42847',
        paddingHorizontal: scale(50),
        paddingVertical: scale(5),
        marginTop: scale(15),
        marginBottom: scale(15),
        borderRadius: scale(8)
    },
    createText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: scale(16)
    },
    inviteButton: {
        width: '35%',
        backgroundColor: '#E28413',
        paddingVertical: scale(5),
        alignSelf: 'flex-end',
        marginBottom: scale(10),
        marginRight: scale(2),
        borderRadius: scale(8)
    },
    inviteText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: scale(16)
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
    dateContainer: {
        fontFamily: 'Inter',
        fontSize: scale(16),
        marginBottom: scale(5),
        paddingHorizontal: scale(15),
        paddingVertical: scale(10),
        borderRadius: scale(8),
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#ccc',
      },
});


export default UserCreateCompetitionPage;
import { View, Text, StyleSheet, TextInput, Image, ScrollView, Modal, TouchableOpacity } from "react-native"
import AccountListCard from "../../components/AccountListCard";
import { scale } from "../../components/scale";
import React, { useEffect, useState } from "react";
import { LoadingDialog, MessageDialog } from "../../components/Modal";

const MyCoacheePage = ({ navigation, route }) => {

    const { coach } = route.params;

    //debugging log
    console.log({ coach });

    // state variables
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMsg, setModalMsg] = useState('');

    // change popup/modal visible
    const changeConfirmVisible = (b, m) => {
        setConfirmMessage(m);
        setConfirmationVisible(b);
    }

    // change popup/modal visible
    const changeModalVisible = (b, m) => {
        setModalMsg(m);
        setModalVisible(b);
    }

    // change popup/modal visible
    const changeLoadingVisible = (b) => {
        setIsLoading(b);
    }

    // useEffect(()=>{
    //     if (route.params?.refresh){
    //         loadCoachRegistrationList();
    //         route.params.refresh = false;
    //     }
    // },[route.params?.refresh]);

    // useEffect(()=>{
    //     loadCoachRegistrationList();  
    // }, []);

    return (
        <View style={styles.container}>
            <View style={styles.headerView}>
                <Text style={styles.headerText}>Coachee List</Text>
            </View>


            <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={() => changeLoadingVisible(false)}>
                <LoadingDialog />
            </Modal>
            <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={() => changeModalVisible(false)}>
                <MessageDialog message={modalMsg} changeModalVisible={changeModalVisible} />
            </Modal>

            <ScrollView contentContainerStyle={styles.contentView}>
                <View>
                    <Text style={{ color: 'white', fontSize: scale(20) }}>No Coachee Found</Text>
                </View>
                {/* insert code  */}
                <TouchableOpacity onPress={() => {
                    navigation.navigate('ViewCoacheeDetails', {coach})
                }}>
                    <Text>Click here to see details test</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#C42847',
        alignItems: 'center',
    },
    headerView: {
        backgroundColor: 'white',
        width: '100%',
        height: '10%',
    },
    headerText: {
        fontSize: scale(36),
        fontFamily: 'League-Spartan',
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: scale(20),
    },
    contentView: {
        width: '100%',
        height: '100%',
        padding: scale(35),

    }
});

export default MyCoacheePage;
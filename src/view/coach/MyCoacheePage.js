import { View, Text, StyleSheet, ScrollView, Modal } from "react-native"
import AccountListCard from "../../components/AccountListCard";
import { scale } from "../../components/scale";
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState, useCallback } from "react";
import { LoadingDialog, MessageDialog } from "../../components/Modal";
import DisplayCoacheesPresenter from '../../presenter/DisplayCoacheesPresenter';

const MyCoacheePage = ({ navigation, route }) => {

    const { coach } = route.params;
    coachEmail = coach.email;

    //check when this tab is focus
    const isFocused = useIsFocused(); // Get the focused state of the screen

    // state variables
    const [coachee, setCoachee] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMsg, setModalMsg] = useState('');

    // change popup/modal visible
    const changeModalVisible = (b, m) => {
        setModalMsg(m);
        setModalVisible(b);
    }

    // change popup/modal visible
    const changeLoadingVisible = (b) => {
        setIsLoading(b);
    }

    // callback to enable refresh when changing tabs
    const loadCoacheeList = useCallback(async () => {
        try {
            setIsLoading(true);
            setCoachee([]);
            await new DisplayCoacheesPresenter({ updateCoacheeList: setCoachee }).displayCoachees(coachEmail);
        } catch (error) {
            setModalVisible(true);
            setModalMsg(error.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    //refresh when focus back this tab
    useEffect(() => {
        if (isFocused) {
            loadCoacheeList();
        }
    }, [isFocused, loadCoacheeList]);

    useEffect(() => {
        loadCoacheeList();
    }, []);

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
                {coachee.length == 0 ?
                    <Text style={{ color: 'white', fontSize: scale(20), alignSelf: 'center' }}>No Coachee Found</Text>
                    :
                    coachee.map((user, index) => {
                        return (
                            <AccountListCard
                                key={index}
                                numOfButtons={1}
                                account={user.user}
                                detailsHandler={() => { navigation.navigate('ViewCoacheeDetails', { coach, history: user }) }}
                            />
                        );
                    })}
            </ScrollView>
        </View>)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop: scale(50),
    },
    headerView: {
        width: '100%',
    },
    headerText: {
        fontSize: scale(36),
        fontFamily: 'League-Spartan',
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: scale(15),
    },
    contentView: {
        backgroundColor: '#C42847',
        minWidth: '100%',
        height: '100%',
        padding: scale(35),
    },
});

export default MyCoacheePage;
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, ActivityIndicator, Image } from 'react-native';
import { scale } from '../../components/scale';
import { LoadingDialog, MessageDialog } from "../../components/Modal";
import HireCoachPresenter from '../../presenter/HireCoachPresenter';

const UserCoachPage = ({ navigation, route }) => {

    const { user } = route.params;
    userID = user.accountID;

    const [coaches, setCoaches] = useState([]);

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
    

    const fetchCoaches = async () => {
        try {
            setIsLoading(true);
            const presenter = new HireCoachPresenter();
            await presenter.displayCoaches(setCoaches);
        } catch (error) {
            setModalVisible(true);
            setModalMsg(error.message);
            console.error('Error fetching coaches:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCoaches();
        console.log(coaches)
    }, [userID]);

    return (
        <View style={styles.container}>
            <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={() => changeLoadingVisible(false)}>
                <LoadingDialog />
            </Modal>
            <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={() => changeModalVisible(false)}>
                <MessageDialog message={modalMsg} changeModalVisible={changeModalVisible} />
            </Modal>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Coach</Text>
            </View>
            <View style={styles.historybuttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() =>
                    navigation.navigate("UserCoachHistoryPage", { user })
                }>
                    <Text style={styles.buttonText}>Coach History</Text>
                </TouchableOpacity>
            </View>
            {coaches.length === 0 ? (
                isLoading ? (
                    <ActivityIndicator size="large" color="white" />
                ) : (
                    <View style={styles.nocoach}>
                        <Text style={styles.nocoachText}>No Coaches Available</Text>
                    </View>
                )
            ) : (
                <View style={styles.coachContainer}>
                    <ScrollView>
                        {coaches.map((item, index) => (
                            <View key={index} style={styles.coachItem}>
                                <Image source={{ uri: item.coach.profilePicture }} style={styles.coachImage} />
                                <View style={styles.coachInfo}>
                                    <Text style={styles.coachName}>{item.coach.fullName}</Text>
                                    <Text style={styles.date}>Price: ${item.coach.chargePerMonth.toFixed(2)} / Month </Text>
                                    <View style={styles.buttonContainer}>
                                        <TouchableOpacity
                                            style={styles.detailsButton}
                                            onPress={() =>
                                                //navigation.navigate("UserCoachHistoryDetails", { user, coachDetails: item })
                                                console.log("Coach Details")
                                            }
                                        >
                                            <Text style={styles.buttonText}>Details</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.hireButton}
                                            onPress={() =>
                                               console.log("Hire coach")
                                            }
                                        >
                                            <Text style={styles.buttonText}>Hire</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            )}
        </View>


    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: scale(70),
        backgroundColor: '#FBF5F3',
    },
    headerContainer: {
        width: '90%',
    },
    headerText: {
        fontSize: scale(36),
        fontFamily: 'League-Spartan',
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: scale(10),
    },
    historybuttonContainer: {
        width: '30%',
        alignSelf: 'flex-end',
        marginRight: scale(40)

    },
    button: {
        backgroundColor: '#E28413',
        paddingVertical: scale(5),
        marginTop: scale(10),
    },
    buttonText: {
        color: 'black',
        textAlign: 'center',
        fontFamily: 'Inter',
        fontWeight: 'bold',
        fontSize: scale(16)
    },
    nocoach: {
        flex: 1,
        justifyContent: 'center'
    }
    ,
    nocoachText: {
        fontSize: scale(30),
        fontFamily: 'League-Spartan',
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'red',
    },
    coachContainer: {
        backgroundColor: '#C42847',
        width: '90%',
        borderRadius: scale(10),
        paddingVertical: scale(10),
        paddingHorizontal: scale(15),
        //minHeight: '90%'
    },
    coachItem: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: scale(10),
        marginVertical: scale(5),
        padding: scale(10),
        alignItems: 'center',
    },
    coachImage: {
        width: scale(80),
        height: scale(80),
        borderRadius: scale(40),
    },
    coachInfo: {
        marginLeft: scale(15),
        flex: 1,
    },
    coachName: {
        fontFamily: 'League-Spartan',
        fontSize: scale(18),
        fontWeight: 'bold',
    },
    date: {
        fontFamily: 'Inter',
        fontSize: scale(14),
        color: '#000',
        marginTop: scale(5),
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    detailsButton: {
        backgroundColor: '#D9D9D9',
        paddingVertical: scale(5),
        paddingHorizontal: scale(15),
        marginTop: scale(10),
    },
    hireButton: {
        backgroundColor: '#00AD3B',
        paddingVertical: scale(5),
        paddingHorizontal: scale(30),
        marginTop: scale(10),
    },
    buttonText: {
        color: 'black',
        fontFamily: 'League-Spartan',
        fontSize: scale(14),
        fontWeight: 'bold',
        textAlign: 'center',
    }
});


export default UserCoachPage;
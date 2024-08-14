import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, ActivityIndicator, Image } from 'react-native';
import { scale } from '../../components/scale';
import { useFocusEffect } from '@react-navigation/native';
import { LoadingDialog, ActionDialog, MessageDialog } from "../../components/Modal";
import HireCoachPresenter from '../../presenter/HireCoachPresenter';

const UserCoachPage = ({ navigation, route }) => {

    const { user } = route.params;
    userID = user.accountID;

    const [coaches, setCoaches] = useState([]);
    const [selectedCoach, setSelectedCoach] = useState(null); // State for the selected coach
    const [isHired, setIsHired] = useState(null);

    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modal1Visible, setModal1Visible] = useState(false);
    const [modal2Visible, setModal2Visible] = useState(false);
    const [modalMsg, setModalMsg] = useState('');

    const [refreshKey, setRefreshKey] = useState(0);

    // change popup/modal visible
    const changeModalVisible = (b, m) => {
        setModalMsg(m);
        setModalVisible(b);
    }

    // change popup/modal visible
    const changeModal1Visible = (b, m) => {
        setModalMsg(m);
        setModal1Visible(b);
    }

    // change popup/modal visible
    const changeModal2Visible = (b, m) => {
        setModalMsg(m);
        setModal2Visible(b);
    }

    // change popup/modal visible
    const changeLoadingVisible = (b) => {
        setIsLoading(b);
    }


    const fetchCoaches = async () => {
        try {
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

    const processHire = async () => {
        setIsLoading(true);
        try {
            await new HireCoachPresenter().userHireCoach(userID, selectedCoach.accountID);
            setRefreshKey(prevKey => prevKey + 1);
        } catch (e) {
            changeModal1Visible(true, e.message);
        } finally {
            setIsLoading(false);
            changeModal1Visible(true, "You have successfully hired a coach.");
        }
    };

    const processExtend = async () => {
        setIsLoading(true);
        try {
            await new HireCoachPresenter().userExtendHireCoach(isHired.session.historyItem.endDate, isHired.session.sessionID);
            setRefreshKey(prevKey => prevKey + 1);
        } catch (e) {
            changeModal1Visible(true, e.message);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp || !timestamp.seconds) return '';

        // Convert timestamp to a JavaScript Date object
        const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);

        // Adjust the date for the Asia/Singapore time zone manually
        const singaporeTimeOffset = 8 * 60; // Singapore is UTC+8
        const localDate = new Date(date.getTime() + singaporeTimeOffset * 60000);

        // Format the date in DD MMM YYYY format
        const day = String(localDate.getDate()).padStart(2, '0');
        const monthIndex = localDate.getMonth();
        const year = localDate.getFullYear();

        // Abbreviated month names
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const month = months[monthIndex];

        return `${day} ${month} ${year}`;
    };

    useFocusEffect(
        useCallback(() => {
            checkHiredStatus();
        }, [refreshKey])
    );

    const loadCoaches = () => {
        setIsLoading(true);
        setTimeout(() => {
            fetchCoaches();
        }, 500);
    };

    useEffect(() => {
        if (!isHired) {
            loadCoaches();
        }
    }, [isHired]);


    const checkHiredStatus = async () => {
        try {
            setIsLoading(true);
            setIsHired(await new HireCoachPresenter().getHireStatus(userID))
        } catch (error) {
            console.error("Error checking hire status:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={() => changeLoadingVisible(false)}>
                <LoadingDialog />
            </Modal>
            <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={() => changeModalVisible(false)}>
                <MessageDialog message={modalMsg} changeModalVisible={changeModalVisible} />
            </Modal>
            <Modal transparent={true} animationType='fade' visible={modal1Visible} nRequestClose={() => changeModal1Visible(false)}>
                <MessageDialog
                    message={modalMsg}
                    changeModalVisible={changeModal1Visible}
                />
            </Modal>
            <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={() => changeModalVisible(false)}>
                <ActionDialog
                    message={modalMsg}
                    changeModalVisible={changeModalVisible}
                    action={processHire}
                />
            </Modal>
            <Modal transparent={true} animationType='fade' visible={modal2Visible} nRequestClose={() => changeModal2Visible(false)}>
                <ActionDialog
                    message={modalMsg}
                    changeModalVisible={changeModal2Visible}
                    action={processExtend}
                />
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
            {isLoading ? (
                <ActivityIndicator size="large" color="white" />
            ) : isHired ? (
                <View style={styles.detailsBox}>
                    <Text style={styles.currentcoach}>Current Coach</Text>
                    <View style={styles.pictureContainer}>
                        {isHired.coach.profilePicture ? (
                            <Image source={{ uri: isHired.coach.profilePicture }} resizeMode='stretch' style={styles.hirecoachImage} />
                        ) : (
                            <ActivityIndicator size="large" />
                        )}
                    </View>
                    <Text style={styles.detailsTitle}>Name</Text>
                    <Text style={styles.detailsText}>{isHired.coach.fullName}</Text>
                    <Text style={styles.detailsTitle}>Email</Text>
                    <Text style={styles.detailsText}>{isHired.coach.email}</Text>
                    <Text style={styles.detailsTitle}>Phone Number</Text>
                    <Text style={styles.detailsText}>{isHired.coach.phoneNumber}</Text>
                    <Text style={styles.detailsTitle}>Start Date</Text>
                    <Text style={styles.detailsText}>{formatDate(isHired.session.historyItem.startDate)}</Text>
                    <Text style={styles.detailsTitle}>End Date</Text>
                    <Text style={styles.detailsText}>{formatDate(isHired.session.historyItem.endDate)}</Text>
                    <TouchableOpacity style={styles.extendbutton} onPress={() => {
                        setSelectedCoach(isHired.coach.accountID);
                        changeModal2Visible(true, 'Are you sure you want to extend with this coach?');
                    }}>
                        <Text style={styles.extendbuttonText}>Extend Duration</Text>
                    </TouchableOpacity>
                </View>
            ) : coaches.length !== 0 && !isLoading ? (
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
                                                navigation.navigate("UserCoachDetailsPage", { user, coachDetails: item.coach })
                                            }
                                        >
                                            <Text style={styles.buttonText}>Details</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.hireButton}
                                            onPress={() => {
                                                setSelectedCoach(item.coach);
                                                changeModalVisible(true, 'Are you sure you want to hire this coach?');
                                            }}
                                        >
                                            <Text style={styles.buttonText}>Hire</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            ) : (
                <View style={styles.nocoach}>
                    <Text style={styles.nocoachText}>No Coaches Available</Text>
                </View>
            )
            }
        </View >


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
    },
    pictureContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    hirecoachImage: {
        width: scale(120),
        height: scale(120),
        backgroundColor: 'white',
        borderRadius: scale(75)
    },
    detailsBox: {
        width: '90%',
        backgroundColor: '#E6E6E6',
        padding: scale(15),
        borderWidth: 2,
        borderRadius: scale(26),
        alignSelf: 'center',
        marginVertical: scale(25),
        borderColor: '#E28413'
    },
    detailsTitle: {
        fontFamily: 'Inter-SemiBold',
        fontSize: scale(16),
    },
    detailsText: {
        fontFamily: 'Inter',
        fontSize: scale(16),
        marginBottom: scale(5),
        paddingHorizontal: scale(15),
        paddingVertical: scale(10),
        borderRadius: scale(8),
        backgroundColor: 'white',
    },
    currentcoach: {
        fontSize: scale(24),
        fontFamily: 'League-Spartan',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: scale(5),
    },
    extendbutton: {
        width: '40%',
        backgroundColor: '#C42847',
        paddingVertical: scale(10),
        borderRadius: scale(8),
        marginVertical: scale(15),
        alignSelf: 'center',
        borderWidth: 1
    },
    extendbuttonText: {
        color: 'white',
        fontFamily: 'League-Spartan',
        fontSize: scale(14),
        fontWeight: 'bold',
        textAlign: 'center',
    },
});


export default UserCoachPage;
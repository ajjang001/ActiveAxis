import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, Image, ActivityIndicator } from 'react-native';
import { scale } from '../../components/scale';
import { LoadingDialog, MessageDialog } from "../../components/Modal";
import DisplayCoachHistoryPresenter from '../../presenter/DisplayCoachHistoryPresenter';

const UserCoachHistoryPage = ({ navigation, route }) => {

    const { user } = route.params;
    userID = user.accountID;

    const [coach, setCoaches] = useState([]);

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

    // Function to convert Firestore timestamp to a formatted date string
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


    const fetchCoachHistory = async () => {
        try {
            setIsLoading(true);
            const presenter = new DisplayCoachHistoryPresenter();
            await presenter.displayCoachingHistory(userID, setCoaches);
        } catch (error) {
            setModalVisible(true);
            setModalMsg(error.message);
            console.error('Error fetching coach history:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCoachHistory();
    }, [userID]);

    return (
        <View style={styles.container}>
            <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={() => changeLoadingVisible(false)}>
                <LoadingDialog />
            </Modal>
            <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={() => changeModalVisible(false)}>
                <MessageDialog message={modalMsg} changeModalVisible={changeModalVisible} />
            </Modal>

            <View style={styles.headerBox}>
                <Text style={styles.headerText}>Coach History</Text>
            </View>
            {coach.length === 0 ? (
                isLoading ? (
                    <ActivityIndicator size="large" color="white" />
                ) : (
                    <View style={styles.nohistory}>
                        <Text style={styles.nohistoryText}>No History Available</Text>
                    </View>
                )
            ) : (
                <View style={styles.coachContainer}>
                    <ScrollView>
                        {coach.map((item, index) => (
                            <View key={index} style={styles.coachItem}>
                                <Image source={{ uri: item.coachPicture }} style={styles.coachImage} />
                                <View style={styles.coachInfo}>
                                    <Text style={styles.coachName}>{item.coachFullName}</Text>
                                    <Text style={styles.date}>Start Date: {formatDate(item.startDate)}</Text>
                                    <Text style={styles.date}>End Date: {formatDate(item.endDate)}</Text>
                                    <View style={styles.buttonContainer}>
                                        <TouchableOpacity
                                            style={styles.detailsButton}
                                            onPress={() =>
                                                navigation.navigate("UserCoachHistoryDetails", { user, coachDetails: item })
                                            }
                                        >
                                            <Text style={styles.buttonText}>Details</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.feedbackButton}
                                            onPress={() =>
                                                navigation.navigate("UserCoachHistoryFeedback", { user, coachDetails: item })
                                            }
                                        >
                                            <Text style={styles.buttonText}>Feedback</Text>
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
        backgroundColor: '#FBF5F3',
        paddingBottom: scale(90),
    },
    headerBox: {
        width: '90%',
    },
    headerText: {
        fontSize: scale(36),
        fontFamily: 'League-Spartan',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: scale(5),
    },
    nohistory: {
        flex: 1,
        justifyContent: 'center'
    }
    ,
    nohistoryText: {
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
        paddingHorizontal: scale(10),
        marginTop: scale(10),
    },
    feedbackButton: {
        backgroundColor: '#D9D9D9',
        paddingVertical: scale(5),
        paddingHorizontal: scale(10),
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


export default UserCoachHistoryPage;
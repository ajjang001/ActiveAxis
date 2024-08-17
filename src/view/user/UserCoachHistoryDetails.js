import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, Image, ActivityIndicator } from 'react-native';
import { LoadingDialog, MessageDialog } from "../../components/Modal";
import { scale } from '../../components/scale';
import Icon from 'react-native-vector-icons/FontAwesome';
import FeedbackCard from '../../components/FeedbackCard';
import DisplayCoachDetailsPresenter from '../../presenter/DisplayCoachDetailsPresenter';

const UserCoachHistoryDetails = ({ route }) => {

    const { user, coachDetails } = route.params;


    const [feedback, setFeedback] = useState([]);
    const [selectedStar, setSelectedStar] = useState(5);

    // star filter
    const starFilter = [5, 4, 3, 2, 1];

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

    // load feedbacks
    const loadFeedbacks = async () => {
        try {
            changeLoadingVisible(true);
            await new DisplayCoachDetailsPresenter({ updateFeedback: setFeedback, coachID: coachDetails.coachID }).displayCoachFeedbacks();
        } catch (error) {
            changeModalVisible(true, error.message);
        } finally {
            changeLoadingVisible(false);
        }
    };

    useEffect(() => {
        loadFeedbacks();
    }, []);


    const formattedPrice = coachDetails.coachPrice.toFixed(2);

    return (
        <View style={styles.container}>
            <View style={styles.headerBox}>
                <Text style={styles.headerText}>Coach Details</Text>
            </View>
            <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={() => changeLoadingVisible(false)}>
                <LoadingDialog />
            </Modal>
            <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={() => changeModalVisible(false)}>
                <MessageDialog message={modalMsg} changeModalVisible={changeModalVisible} />
            </Modal>
            <View style={styles.detailsBox}>
                {coachDetails.coachPicture !== '' ? (
                    <View style={styles.pictureContainer}>
                        <Image source={{ uri: coachDetails.coachPicture }} resizeMode='stretch' style={styles.coachImage} />
                    </View>
                ) : (
                    <ActivityIndicator style={styles.pictureContainer} size="large" />
                )}
                <Text style={styles.detailsTitle}>Name</Text>
                <Text style={styles.detailsText}>{coachDetails.coachFullName}</Text>
                <Text style={styles.detailsTitle}>Email</Text>
                <Text style={styles.detailsText}>{coachDetails.coachEmail}</Text>
                <Text style={styles.detailsTitle}>Phone Number</Text>
                <Text style={styles.detailsText}>{coachDetails.coachPhone}</Text>
                <Text style={styles.detailsTitle}>Coach Rate (Monthly)</Text>
                <Text style={styles.detailsText}>${formattedPrice}</Text>
            </View>
            <View style={styles.filterView}>
                {starFilter.map((star) => (
                    <TouchableOpacity key={star} onPress={() => setSelectedStar(star)} style={styles.filterButton}>
                        <Text>{star}</Text>
                        <Icon
                            name="star"
                            size={15}
                            color={'#FFD700'}
                        />
                    </TouchableOpacity>
                ))}
            </View>
            <ScrollView style={styles.contentView} contentContainerStyle={{ alignItems: 'center' }}>
                <View style={styles.feedbacksView}>
                    {feedback.length === 0 ? (
                        isLoading ? (
                            <ActivityIndicator size="large" color="white" />
                        ) : (
                            <Text style={styles.noFeedbackText}>No Feedback Available</Text>
                        )
                    ) : (
                        feedback.filter((f) => f.rating === selectedStar).length === 0 ? (
                            <Text style={styles.noFeedbackText}>No Feedback Available</Text>
                        ) : (
                            feedback.filter((f) => f.rating === selectedStar).map((feedbackItem, index) => (
                                <FeedbackCard
                                    key={index}
                                    avatar={feedbackItem.profilePicture || feedbackItem.avatar}
                                    name={feedbackItem.fullName || feedbackItem.name}
                                    rating={feedbackItem.rating}
                                    feedback={feedbackItem.feedbackText}
                                />
                            ))
                        )
                    )}
                </View>
            </ScrollView>
        </View>


    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#C42847',
    },
    headerBox: {
        width: '90%',
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
        alignSelf: 'center',
        marginBottom: scale(20),
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
    pictureContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    coachImage: {
        width: scale(120),
        height: scale(120),
        backgroundColor: 'white',
        borderRadius: scale(75)
    },
    contentView: {
        width: '95%'
    },
    filterView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
        marginBottom: scale(20)
    },
    filterButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E6E6E6',
        borderWidth: 1,
        borderRadius: scale(10),
        paddingHorizontal: scale(10),
        marginHorizontal: scale(15)
    },
    feedbacksView: {
        width: '90%',
    },
    noFeedbackText: {
        fontFamily: 'Inter',
        fontSize: scale(20),
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    }
});


export default UserCoachHistoryDetails;
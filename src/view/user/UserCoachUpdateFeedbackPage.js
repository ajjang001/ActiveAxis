import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import { LoadingDialog, ActionDialog, MessageDialog } from "../../components/Modal";
import Icon from 'react-native-vector-icons/FontAwesome';
import { scale } from '../../components/scale';
import UpdateCoachFeedbackPresenter from '../../presenter/UpdateCoachFeedbackPresenter';

const UserCoachUpdateFeedbackPage = ({ navigation, route }) => {

    const { user, coachDetails, feedback } = route.params;
    let userID = user.accountID;
    let coachID = coachDetails.coachID;
    let feedbackID = feedback[0].id;

    const [updateFeedback, setupdateFeedback] = useState(feedback[0].feedbackText);
    const [rating, setRating] = useState(feedback[0].rating);

    const renderStars = () => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <TouchableOpacity key={i} onPress={() => setRating(i + 1)}>
                    <Icon
                        name="star"
                        size={30}
                        color={i < rating ? '#FFD700' : '#D3D3D3'}
                        style={styles.star}
                    />
                </TouchableOpacity>
            );
        }
        return stars;
    };

    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modal1Visible, setModal1Visible] = useState(false);
    const [modalMsg, setModalMsg] = useState('');

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
    const changeLoadingVisible = (b) => {
        setIsLoading(b);
    }

    const updateCoachFeedback = async () => {
        try {
            setIsLoading(true);

            const dateSubmitted = new Date();
            const feedbackData = {
                dateSubmitted: dateSubmitted,
                feedbackText: updateFeedback,
                rating: rating,
            };

            const presenter = new UpdateCoachFeedbackPresenter();
            await presenter.UserUpdateCoachFeedback(feedbackID, feedbackData);
            navigation.navigate('UserCoachHistoryFeedback', { user, coachDetails })
        } catch (error) {
            setModal1Visible(true);
            setModalMsg(error.message);
            console.log('Error submitting coach feedback:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={() => changeModalVisible(false)}>
                <ActionDialog
                    message={modalMsg}
                    changeModalVisible={changeModalVisible}
                    action={updateCoachFeedback}
                />
            </Modal>
            <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={() => changeLoadingVisible(false)}>
                <LoadingDialog />
            </Modal>
            <Modal transparent={true} animationType='fade' visible={modal1Visible} nRequestClose={() => changeModal1Visible(false)}>
                <MessageDialog
                    message={modalMsg}
                    changeModalVisible={changeModal1Visible}
                />
            </Modal>
            <View style={styles.headerBox}>
                <Text style={styles.headerText}>Update Coach Feedback</Text>
            </View>
            <View style={styles.feedbackContainer}>
                <Text style={styles.feedbackHeaderText}>Coach {coachDetails.coachFullName}</Text>
                <View style={styles.starsContainer}>{renderStars()}</View>
                <TextInput
                    style={styles.textInput}
                    placeholder="Enter reviews here"
                    placeholderTextColor="#666"
                    multiline={true}
                    numberOfLines={7}
                    maxLength={200}
                    value={updateFeedback}
                    onChangeText={setupdateFeedback}
                    textAlignVertical="top"
                />
                <TouchableOpacity
                    style={styles.updateButton}
                    onPress={() => changeModalVisible(true, 'Do you want to save changes?')}>
                    <Text style={styles.buttonText}>Update Feedback</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FBF5F3',
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
    buttonText: {
        color: 'white',
        fontFamily: 'League-Spartan',
        fontSize: scale(16),
        fontWeight: 'bold',
        textAlign: 'center',
    },
    feedbackContainer: {
        backgroundColor: '#C42847',
        width: '90%',
        alignItems: 'center',
        padding: scale(15),
        borderRadius: scale(10),
        marginTop: scale(15),
        paddingVertical: scale(30),
    },
    feedbackHeaderText: {
        fontSize: scale(24),
        fontFamily: 'League-Spartan',
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: scale(10),
        color: 'white',
    },
    starsContainer: {
        flexDirection: 'row',
        marginBottom: scale(20),
    },
    star: {
        marginHorizontal: scale(5),
    },
    textInput: {
        backgroundColor: '#E0E0E0',
        borderRadius: 10,
        width: '100%',
        textAlignVertical: 'top',
        color: '#000',
        marginBottom: scale(20),
        paddingHorizontal: scale(15),
        borderRadius: scale(8),
        paddingVertical: scale(15),
        fontSize: scale(18),
        fontFamily: 'Inter',
    },
    updateButton: {
        backgroundColor: '#D9D9D9',
        paddingVertical: scale(10),
        paddingHorizontal: scale(10),
        marginTop: scale(30),
        backgroundColor: '#E28413',
        borderRadius: scale(8),
        width: '50%',
        alignSelf: 'center'
    },
});


export default UserCoachUpdateFeedbackPage;
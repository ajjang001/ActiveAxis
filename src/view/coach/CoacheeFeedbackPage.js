import { View, Text, StyleSheet, Modal, ActivityIndicator } from "react-native"
import { scale } from "../../components/scale";
import React, { useEffect, useState } from "react";
import { LoadingDialog, MessageDialog } from "../../components/Modal";
import DisplayFeedbackFromCoacheePresenter from '../../presenter/DisplayFeedbackFromCoacheePresenter';
import FeedbackCard from '../../components/FeedbackCard';
import { ScrollView } from "react-native-gesture-handler";

const CoacheeFeedbackPage = ({ route }) => {

    const { coach } = route.params;
    coachEmail = coach.email;

    const [feedback, setFeedback] = useState([]);

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

    const loadCoachFeedback = async () => {
        try {
            setIsLoading(true);
            await new DisplayFeedbackFromCoacheePresenter({ updateFeedback: setFeedback }).displayCoachFeedbacks(coachEmail);
            setIsLoading(false);
        } catch (error) {
            setModalVisible(true);
            setModalMsg(error.message);
        }
    };

    useEffect(() => {
        loadCoachFeedback();
    }, []);


    return (
        <View style={styles.container}>
            <ScrollView style={styles.feedbackContainer}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>Coachee Feedbacks</Text>
                </View>
                <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={() => changeLoadingVisible(false)}>
                    <LoadingDialog />
                </Modal>
                <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={() => changeModalVisible(false)}>
                    <MessageDialog message={modalMsg} changeModalVisible={changeModalVisible} />
                </Modal>

                {feedback.length === 0 ? (
                    isLoading ? (
                        <ActivityIndicator size="large" color="white" />
                    ) : (
                        <Text style={styles.noFeedbackText}>No Feedback Available</Text>
                    )
                ) : (
                    feedback.map((feedbackItem, index) => (
                        <FeedbackCard
                            key={index}
                            avatar={feedbackItem.profilePicture || feedbackItem.avatar}
                            name={feedbackItem.fullName || feedbackItem.name}
                            rating={feedbackItem.rating}
                            feedback={feedbackItem.feedbackText}
                        />
                    ))
                )}
            </ScrollView>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FBF5F3',
        alignItems: 'center',
    },
    headerContainer: {
        width: '90%',
        marginVertical: scale(10),
        alignSelf:'center'
    },
    headerText: {
        fontSize: scale(36),
        fontFamily: 'League-Spartan',
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: scale(15),
    },
    feedbackContainer: {
        width: '100%',
    },
    noFeedbackText: {
        fontFamily: 'Inter',
        fontSize: scale(20),
        fontWeight: 'bold',
        color: 'red',
        textAlign: 'center',
    }
});
export default CoacheeFeedbackPage;
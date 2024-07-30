import { View, Text, StyleSheet, Modal, Image, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native"
import { scale } from "../../components/scale";
import React, { useEffect, useState } from "react";
import { LoadingDialog, MessageDialog } from "../../components/Modal";
import ViewCoacheePresenter from '../../presenter/ViewCoacheePresenter';

const ViewCoacheeDetails = ({ navigation, route }) => {

    const { coach, history } = route.params;
    
    const userEmail = history.user.email;

    const [coachee, setCoachee] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMsg, setModalMsg] = useState('');

    // Coachee Details
    const [profilePicture, setprofilePicture] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setphoneNumber] = useState('');
    const [gender, setGender] = useState('');
    const [medical, setMedical] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [goal, setGoal] = useState('');
    const [level, setLevel] = useState('');
    const startDate = new Date(history.startDate.seconds * 1000 + history.startDate.nanoseconds / 1000000);
    const startDateString = startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const endDate = new Date(history.endDate.seconds * 1000 + history.endDate.nanoseconds / 1000000);
    const endDateString = endDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    {/* May insert more Coachee details if needed */ }

    // change popup/modal visible
    const changeModalVisible = (b, m) => {
        setModalMsg(m);
        setModalVisible(b);
    }

    // change popup/modal visible
    const changeLoadingVisible = (b) => {
        setIsLoading(b);
    }

    const loadCoacheeDetails = async () => {
        try {
            setIsLoading(true);
            await new ViewCoacheePresenter({ loadCoacheeDetails: setCoachee }).viewCoacheeDetails(userEmail);
            setTimeout(() => {
                setIsLoading(false);
            }, 1500);
        } catch (error) {
            setModalVisible(true);
            setModalMsg(error.message);
        }
    };

    const loadGoalAndLevel = async (goalID, levelID) => {
        try{
            changeLoadingVisible(true);
            await new ViewCoacheePresenter({updateGoal:setGoal}).getFitnessGoalName(goalID);
            await new ViewCoacheePresenter({updateLevel:setLevel}).getFitnessLevelName(levelID);
        }catch(error){
            changeModalVisible(true, error.message.replace('Error: ', ''));
        }finally{
            changeLoadingVisible(false);
        }
    };

    useEffect(() => {
        loadCoacheeDetails();
    }, []);

    useEffect(() => {
        // Ensure coachee is populated before logging or using it
        if (coachee.length > 0) {
            setprofilePicture(coachee[0].user.profilePicture)
            setFullName(coachee[0].user.fullName);
            setEmail(coachee[0].user.email);
            setphoneNumber(coachee[0].user.phoneNumber);
            if (coachee[0].user.gender == 'm') {
                setGender("Male");
            }
            else {
                setGender("Female")
            }
            setWeight(coachee[0].user.weight + "kg");
            setHeight(coachee[0].user.height + "cm");
            loadGoalAndLevel(coachee[0].user.fitnessGoal, coachee[0].user.fitnessLevel);
            if (coachee[0].user.hasMedical == false) {
                setMedical("No");
            }
            else {
                setMedical("Yes")
            }
        }
    }, [coachee]);

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollContainer}>
                <View style={styles.headerBox}>
                    <Text style={styles.headerText}>Coachee Name Details</Text>
                </View>
                <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={() => changeLoadingVisible(false)}>
                    <LoadingDialog />
                </Modal>
                <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={() => changeModalVisible(false)}>
                    <MessageDialog message={modalMsg} changeModalVisible={changeModalVisible} />
                </Modal>
                <View style={styles.detailsBox}>
                    {profilePicture !== '' ? (
                        <View style={styles.pictureContainer}>
                            <Image source={{ uri: profilePicture }} resizeMode='stretch' style={styles.coacheeImage} />
                        </View>
                    ) : (
                        <ActivityIndicator style={styles.pictureContainer} size="large" />
                    )}
                    <Text style={styles.detailsTitle}>Name</Text>
                    <Text style={styles.detailsText}>{fullName}</Text>
                    <Text style={styles.detailsTitle}>Gender</Text>
                    <Text style={styles.detailsText}>{gender}</Text>
                    <Text style={styles.detailsTitle}>Email</Text>
                    <Text style={styles.detailsText}>{email}</Text>
                    <Text style={styles.detailsTitle}>Phone Number</Text>
                    <Text style={styles.detailsText}>{phoneNumber}</Text>
                    <Text style={styles.detailsTitle}>Weight</Text>
                    <Text style={styles.detailsText}>{weight}</Text>
                    <Text style={styles.detailsTitle}>Height</Text>
                    <Text style={styles.detailsText}>{height}</Text>
                    <Text style={styles.detailsTitle}>Fitness Goal</Text>
                    <Text style={styles.detailsText}>{goal}</Text>
                    <Text style={styles.detailsTitle}>Fitness Level</Text>
                    <Text style={styles.detailsText}>{level}</Text>
                    <Text style={styles.detailsTitle}>Medical Condition</Text>
                    <Text style={styles.detailsText}>{medical}</Text>
                    <Text style={styles.detailsTitle}>Start Date</Text>
                    <Text style={styles.detailsText}>{startDateString}</Text>
                    <Text style={styles.detailsTitle}>End Date</Text>
                    <Text style={styles.detailsText}>{endDateString}</Text>
                    {/* May insert more Coachee details if needed */}
                </View>
                <View style = {styles.viewPlanContainer}>
                    <TouchableOpacity style = {styles.viewPlanButton} onPress={() => navigation.navigate("CoachAllocatePlanPage", {coach, history})}>
                        <Text style = {styles.planButtonText}>Manage Plans</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#C42847',
        alignItems: 'center',
    },
    headerBox: {
        backgroundColor: '#D9D9D9',
        width: '90%',
        marginVertical: scale(15),
        borderRadius: scale(20),
        alignSelf: 'center'
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
        marginBottom: scale(30),
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
    coacheeImage: {
        width: scale(100),
        height: scale(100),
        backgroundColor: 'white',
        borderRadius: scale(75)
    },
    scrollContainer: {
        width: '100%',
    },
    viewPlanContainer:{
        padding: scale(15),
        marginBottom: scale(50),
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewPlanButton:{
        backgroundColor: '#E28413',
        paddingVertical: scale(10),
        paddingHorizontal: scale(25),
        borderRadius: scale(10),
    },
    planButtonText:{
        fontFamily: 'Inter-SemiBold',
        fontSize: scale(16),
        color: 'white',
    }
});

export default ViewCoacheeDetails;
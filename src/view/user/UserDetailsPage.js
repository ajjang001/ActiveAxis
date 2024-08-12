import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Modal } from 'react-native';
import DisplayUserDetailsPresenter from '../../presenter/DisplayUserDetailsPresenter';
import { db } from '../../firebase/firebaseConfig';
import { LoadingDialog, MessageDialog } from "../../components/Modal";
import { scale } from "../../components/scale";

const UserDetailsPage = ({ route }) => {
    const { userId } = route.params;

    let userID = userId.id;
    fitnessLevel = userId.fitnessLevel;
    fitnessGoal = userId.fitnessGoal;

    const [userDetails, setUserDetails] = useState([]);

    //For User Details
    const [gender, setGender] = useState('');
    const [goal, setGoal] = useState('');
    const [level, setLevel] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMsg, setModalMsg] = useState("");

    // change popup/modal visible
    const changeModalVisible = (b, m) => {
        setModalMsg(m);
        setModalVisible(b);
    }

    // change popup/modal visible
    const changeLoadingVisible = (b) => {
        setIsLoading(b);
    }

    const capitalizeFirstLetter = (string) => {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const fetchDetails = async () => {
        setIsLoading(true);
        try {
            console.log("Loading details for user:", userID);
            const presenter = new DisplayUserDetailsPresenter({ displayUserDetails: setUserDetails }, db);
            await presenter.loadUserDetails(userID);
        } catch (error) {
            console.error("Failed to load user details:", error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchGoalLevel = async () => {
        setIsLoading(true);
        try {
            const presenter = new DisplayUserDetailsPresenter({ loadGoalLevelName: setGoal, setLevel }, db);
            
            // Load goal and level names
            const user = await presenter.loadGoalLevelName(fitnessGoal, fitnessLevel);
    
            // Set the goal and level names in the state (assuming setGoal and setLevel are state setters)
            setGoal(user.fitnessGoalName);
            setLevel(user.fitnessLevelName);
            
        } catch (error) {
            console.error("Error fetching goal and level:", error.message); // Log the error
            // Optionally, you could set an error state here if you want to display an error message to the user
        } finally {
            setIsLoading(false); // Stop the loading indicator
        }
    }
    

    useEffect(() => {
        fetchDetails();
        fetchGoalLevel();
    }, [userId]);

    useEffect(() => {
        // Ensure user is populated before logging or using it
        if (userDetails) {
            if (userDetails.gender == 'm') {
                setGender("Male");
            }
            else if (userDetails.gender == 'f') {
                setGender("Female")
            }
        }
    }, [userDetails, fetchDetails]);

    return (
        <View style={styles.container}>
            <View style={styles.titleView}>
                <Text style={styles.title}>User Details</Text>
            </View>
            <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={() => changeLoadingVisible(false)}>
                <LoadingDialog />
            </Modal>
            <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={() => changeModalVisible(false)}>
                <MessageDialog message={modalMsg} changeModalVisible={changeModalVisible} />
            </Modal>
            <View style={styles.detailsContainer}>
                {
                    userDetails.profilePicture ? <Image source={{ uri: userDetails.profilePicture }} style={styles.profilePicture} /> : null
                }
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Name</Text>
                    <Text style={styles.value}>{userDetails.fullName}</Text>
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Gender</Text>
                    <Text style={styles.value}>{gender}</Text>
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Fitness Goal</Text>
                    <Text style={styles.value}>{goal}</Text>
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Fitness Level</Text>
                    <Text style={styles.value}>{capitalizeFirstLetter(level)}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: scale(10),
        backgroundColor: '#C42847',
        alignItems: 'center',
    },
    titleView: {
        backgroundColor: '#E28413',
        width: '100%',
        padding: scale(20),
        alignItems: 'center',
    },
    title: {
        fontSize: scale(24),
        fontWeight: 'bold',
        color: '#000',
    },
    detailsContainer: {
        backgroundColor: '#E6E6E6',
        borderRadius: scale(10),
        padding: scale(20),
        marginTop: scale(20),
        width: '90%',
        alignItems: 'center',
    },
    profilePicture: {
        width: scale(100),
        height: scale(100),
        borderRadius: scale(50),
        marginBottom: scale(20),
    },
    inputGroup: {
        width: '100%',
        marginVertical: scale(10),
    },
    label: {
        fontSize: scale(16),
        color: '#000',
        marginBottom: scale(5),
    },
    value: {
        backgroundColor: '#FFF',
        borderRadius: scale(5),
        padding: scale(10),
        width: '100%',
        borderColor: '#000',
        borderWidth: scale(1),
        fontSize: scale(16),
        color: '#000',
    },
});

export default UserDetailsPage;

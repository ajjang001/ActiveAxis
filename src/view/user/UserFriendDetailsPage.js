import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Modal } from 'react-native';
import DisplayFriendDetailsPresenter from '../../presenter/DisplayFriendDetailsPresenter';
// import { db } from '../../firebase/firebaseConfig';
import { scale } from "../../components/scale";
import { LoadingDialog, MessageDialog } from "../../components/Modal";

const UserFriendDetailsPage = ({ route }) => {
    const { friend } = route.params;
    // console.log(friend);
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

    const [friendDetails, setFriendDetails] = useState([]);
    console.log(friendDetails);

    const fetchDetails = async () => {
        setIsLoading(true);
        try {
            // console.log("Loading details for friend:", friend);
            const presenter = new DisplayFriendDetailsPresenter({ displayFriendDetails: setFriendDetails });
            await presenter.loadFriendDetails(friend);
        } catch (error) {
            console.error("Failed to load friend details:", error);
            changeModalVisible(true, error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchGoalLevel = async () => {
        setIsLoading(true);
        try {
            const presenter = new DisplayFriendDetailsPresenter({ loadGoalLevelName: setGoal, setLevel });
            fitnessGoal = friendDetails.fitnessGoal;
            fitnessLevel = friendDetails.fitnessLevel;
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
        if(friend){
            fetchDetails();
        }
    }, [friend]);

    useEffect(() => {
        // Only fetch goal and level if friendDetails is populated
        if (friendDetails.fitnessGoal && friendDetails.fitnessLevel) {
            fetchGoalLevel();
        }
    }, [friendDetails]); // Dependency on friendDetails to trigger fetchGoalLevel

    useEffect(() => {
        // Ensure user is populated before logging or using it
        if (friendDetails) {
            if (friendDetails.gender == 'm') {
                setGender("Male");
            }
            else if (friendDetails.gender == 'f') {
                setGender("Female")
            }
        }
    }, [friendDetails, fetchDetails, fetchGoalLevel]);

    return (
        <View style={styles.container}>
            <View style={styles.titleView}>
                <Text style={styles.title}>Friend Name Details</Text>
            </View>
            <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={() => changeLoadingVisible(false)}>
                <LoadingDialog />
            </Modal>
            <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={() => changeModalVisible(false)}>
                <MessageDialog message={modalMsg} changeModalVisible={changeModalVisible} />
            </Modal>
            <View style={styles.detailsContainer}>
                {friendDetails.profilePicture == null ? (
                    <LoadingDialog />
                ) : (
                    <Image source={{ uri: friendDetails.profilePicture }} style={styles.profilePicture} />
                )}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Name</Text>
                    <Text style={styles.value}>{friendDetails.fullName}</Text>
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

export default UserFriendDetailsPage;

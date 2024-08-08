import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import DisplayUserDetailsPresenter from '../../presenter/DisplayUserDetailsPresenter';
import { db } from '../../firebase/firebaseConfig';
import { scale } from "../../components/scale";

const UserDetailsPage = ({ route }) => {
    const { userId } = route.params;

    const [userDetails, setUserDetails] = useState({
        profilePicture: '',
        fullName: '',
        gender: '',
        fitnessGoal: '',
        fitnessLevel: ''
    });

    useEffect(() => {
        const fetchDetails = async () => {
            setIsLoading(true);
            try {
                console.log("Loading details for user:", userId);
                const presenter = new DisplayUserDetailsPresenter({ displayUserDetails: setUserDetails }, db);
                await presenter.loadUserDetails(userId);
            } catch (error) {
                console.error("Failed to load user details:", error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetails();
    }, [userId]);

    return (
        <View style={styles.container}>
            <View style={styles.titleView}>
                <Text style={styles.title}>User Details</Text>
            </View>
                <View style={styles.detailsContainer}>
                    <Image source={{ uri: userDetails.profilePicture }} style={styles.profilePicture} />
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Name</Text>
                        <Text style={styles.value}>{userDetails.fullName}</Text>
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Gender</Text>
                        <Text style={styles.value}>{userDetails.gender}</Text>
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Fitness Goal</Text>
                        <Text style={styles.value}>{userDetails.fitnessGoal}</Text>
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Fitness Level</Text>
                        <Text style={styles.value}>{userDetails.fitnessLevel}</Text>
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

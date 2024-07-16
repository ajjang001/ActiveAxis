// src/view/coach/CoachHomePage.js
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { ref, getDownloadURL } from 'firebase/storage';
import { LoadingDialog } from '../../components/Modal';
import { app, auth, db, storage } from '../../firebase/firebaseConfig';

const CoachHomePage = ({ route }) => {
    
    const { coach } = route.params;
    const [imageURL, setImageURL] = useState('');
    // get image url
    useEffect(() => {
        const getImageURL = async (c) => {
            const storageRef = ref(storage, c.profilePicture);
            const url = await getDownloadURL(storageRef);
            setImageURL(url);
        };
        getImageURL(coach);
    }, []);

    return (
        <View style={styles.pageContainer}>
            <Text>This is Coach Home Page</Text>
            {imageURL !== '' ? (
                <Image source={{ uri: imageURL }} style={styles.profileImage} />
            ) : (
                <LoadingDialog />
            )}
            <Text>Welcome {coach.fullName}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileImage: {
        width: 200,
        height: 200,
        borderRadius: 100,
    },
});

export default CoachHomePage;

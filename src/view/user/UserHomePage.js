import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity} from 'react-native';
import {ref, getDownloadURL} from 'firebase/storage';

import { storage } from '../../firebase/firebaseConfig';
import { LoadingDialog } from '../../components/Modal';

const UserHomePage = ({navigation, route}) => {
    // Get the user from the route params
    const {user} = route.params;
    // State to store the image URL
    const [imageURL, setImageURL] = useState('');

    // Get the image URL from the storage
    useEffect(() => {
        const getImageURL = async (u) => {
            const storageRef = ref(storage, u.profilePicture);
            const url = await getDownloadURL(storageRef);
            setImageURL(url);
        }
        getImageURL(user);
    }, []);

    


    return (
        <View>
            {imageURL !== '' ? <Image source={{uri: imageURL}} style={{width: 200, height: 200, borderRadius:100}}/> : <LoadingDialog />}
            <Text>Welcome {user.fullName}</Text>
        </View>
    );
};

export default UserHomePage;
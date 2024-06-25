import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity} from 'react-native';
import {ref, getDownloadURL} from 'firebase/storage';

import {app, auth, db, storage} from '../../.expo/api/firebase';
import { LoadingDialog } from '../components/Modal';

const UserHomePage = ({navigation, route}) => {
    const {user} = route.params;
    const [imageURL, setImageURL] = useState('');


    useEffect(() => {
        const getImageURL = async (u) => {
            const storageRef = ref(storage, u.profilePicture);
            const url = await getDownloadURL(storageRef);
            setImageURL(url);
        }
        getImageURL(user);
    });

    


    return (
        <View>
            {imageURL !== '' ? <Image source={{uri: imageURL}} style={{width: 200, height: 200, borderRadius:100}}/> : <LoadingDialog />}
            <Text>Welcome {user.fullName}</Text>
            <TouchableOpacity onPress={()=>navigation.navigate('TryConnectWearable')}>
                <Text>Try Wearable</Text>
            </TouchableOpacity>
        </View>
    );
};

export default UserHomePage;
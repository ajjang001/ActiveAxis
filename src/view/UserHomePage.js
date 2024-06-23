import React, { useEffect } from 'react';
import { View, Text, Image} from 'react-native';
import {ref, getDownloadURL} from 'firebase/storage';

import {app, auth, db, storage} from '../../.expo/api/firebase';
import { LoadingDialog } from '../components/Modal';

const UserHomePage = ({route}) => {
    const {user} = route.params;
    const [imageURL, setImageURL] = React.useState('');


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
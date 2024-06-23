import React, {useEffect} from 'react';
import { View, Text, Image} from 'react-native';
import {ref, getDownloadURL} from 'firebase/storage';
import {app, auth, db, storage} from '../../.expo/api/firebase';
import { LoadingDialog } from '../components/Modal';



const CoachHomePage = ({route}) => {
    const {coach} = route.params;
    const [imageURL, setImageURL] = React.useState('');

    useEffect(() => {
        const getImageURL = async (c) => {
            const storageRef = ref(storage, c.profilePicture);
            const url = await getDownloadURL(storageRef);
            setImageURL(url);
        }
        getImageURL(coach);
    }, []);


    return (
        <View>
            <Text>This is Coach Home Page</Text>
            {imageURL !== '' ? <Image source={{uri: imageURL}} style={{width: 200, height: 200, borderRadius:100}}/> : <LoadingDialog />}
            <Text>Welcome {coach.fullName}</Text>
        </View>
    );
};

export default CoachHomePage;

/**


const UserHomePage = ({route}) => {
    
    

    return (
        <View>
            
            
        </View>
    );
};

export default UserHomePage;
 */
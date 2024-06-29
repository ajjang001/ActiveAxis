import React, {useState, useEffect} from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ref, getDownloadURL } from 'firebase/storage';

import { scale } from './scale';
import { storage } from '../../.expo/api/firebase';
import { LoadingDialog } from './Modal';



const AccountListCard = (props)=>{
    const account = props.account !== undefined ? props.account : null;

        // State to store the image URL
    const [imageURL, setImageURL] = useState('');

    

    // Get the image URL from the storage
    useEffect(() => {
        const getImageURL = async (a) => {
            const storageRef = ref(storage, a.profilePicture);
            const url = await getDownloadURL(storageRef);
            setImageURL(url);
        }
        getImageURL(account);
    }, []);

    return (
        <View style = {style.coachContainer}>
            {imageURL !== '' ? <Image source={{uri: imageURL}} style = {style.coachImage}/> : <LoadingDialog />}
            
            
                {account === null ? <LoadingDialog /> : 
                    <View style = {style.coachDetails}>
                        <Text style = {style.name}>{account.fullName}</Text>
                        <Text style = {style.role}>{account.constructor.name}</Text>
                        <View style ={style.optButtons}>
                            <TouchableOpacity activeOpacity={0.7} style = {{backgroundColor:'#D9D9D9'}}>
                                <Text style={style.detailsText}>Details</Text>
                            </TouchableOpacity>

                            {props.numOfButtons == 1 ? null :(
                                
                                <TouchableOpacity activeOpacity={0.7} style = {[{width:scale(100)}, (account.isSuspended ? {backgroundColor: "#E28413"} : {backgroundColor: "#00AD3B"})]} >
                                    <Text style={style.suspendText}>{account.isSuspended ? "UNSUSPEND" : "SUSPEND"}</Text>
                                </TouchableOpacity>
                            )}
                            
                        </View>
                    </View>
                    
                }
                
            
        </View>
    )
}

const style = StyleSheet.create({
    coachContainer:{
        width: '100%',

        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',

        paddingBottom: scale(15),
        
        
    },

    coachImage:{
        width: scale(100),
        height: scale(100),
        backgroundColor:'white',
    },
    coachDetails:{
        display:'flex',
        justifyContent:'center',


        alignItems:'flex-end',
        flexDirection:'column',
        
        gap: scale(10),
        height: scale(100),
        
    },

    name:{
        fontFamily:'League-Spartan-SemiBold',
        fontSize: scale(15),
        backgroundColor:'white',
        width: scale(275),
        paddingHorizontal: scale(5),
    },
    role:{
        fontFamily:'League-Spartan-SemiBold',
        fontSize: scale(13),
        backgroundColor:'white',
        width: scale(275),
        padding: scale(5),
    },
    optButtons:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        width: scale(275),
    },
    detailsText:{
        fontFamily:'League-Spartan-SemiBold',
        fontSize: scale(15),
        paddingHorizontal: scale(15),

    },
    suspendText:{
        fontFamily:'League-Spartan-SemiBold',
        fontSize: scale(15),
        color:'white',
        textAlign:'center',
    }
});

export default AccountListCard;
import React, {useState, useEffect} from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

import { scale } from './scale';
import { LoadingDialog } from './Modal';



const AccountListCard = (props)=>{
    const account = props.account !== undefined ? props.account : null;
    const isAdminView = props.isAdminView !== undefined ? props.isAdminView : false;
    
    return (
        <View style = {style.coachContainer}>
                {account === null ? <LoadingDialog /> : 
                <>
                <Image source={{uri: account.profilePicture}} resizeMode='stretch' style = {style.coachImage}/>
                    <View style = {style.coachDetails}>
                        <Text style = {style.name}>{account.fullName}</Text>
                        <Text style = {style.role}>
                            {account.constructor.name === "Coach" ? 
                                (account.isPending ? 
                                    `Pending Approval - ${account.constructor.name}` 
                                    : 
                                    account.constructor.name
                                ) 
                            : 
                                account.constructor.name
                            }
                        </Text>
                        <View style ={style.optButtons}>
                            <TouchableOpacity onPress = {()=> props.detailsHandler()} activeOpacity={0.7} style = {{backgroundColor:'#D9D9D9'}}>
                                <Text style={style.detailsText}>
                                    {account.constructor.name === "Coach" ?(
                                        account.isPending ? "Request Pending"
                                        :
                                        "Details"
                                    ) : "Details"}
                                </Text>
                            </TouchableOpacity>


                            {props.numOfButtons <= 1 && isAdminView ? null :(
                                
                                <TouchableOpacity onPress = { (account.isSuspended ? () => props.unsuspendHandler() : () => props.suspendHandler() ) } activeOpacity={0.7} style = {[{width:scale(100)}, (account.isSuspended ? {backgroundColor: "#E28413"} : {backgroundColor: "#00AD3B"})]} >
                                    <Text style={style.suspendText}>{account.isSuspended ? "UNSUSPEND" : "SUSPEND"}</Text>
                                </TouchableOpacity>
                            )}
                            


                            
                        </View>
                    </View>
                    </>
                    
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
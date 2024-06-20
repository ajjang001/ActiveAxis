import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";

const MessageDialog = (props) =>{
    closeModal = (bool) => {
        props.changeModalVisible(bool);
    }

    return(
        <TouchableOpacity disabled={true} style={styles.container}>
            <View style = {styles.modal}>
                <View style = {styles.textView}>
                    <Text style = {styles.text}>{props.message}</Text>
                </View>

                <View style = {styles.buttonsView}>
                    <TouchableOpacity style = {styles.button} onPress = {() => closeModal(false, 'Ok')}>
                        <Text style = {styles.text}> OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const LoadingDialog = () =>{
    return(
        <TouchableOpacity disabled={true} style={styles.container}>
                <ActivityIndicator size="large" color="white" style={{ transform: [{ scaleX: 3 }, { scaleY: 3 }] }} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'rgba(0,0,0,0.5)',
    },
    modal:{
        width:300,
        height:110,
        backgroundColor:'white',
        borderWidth:5,
        padding:15,

        display:'flex',
        justifyContent:'center',
        alignItems:'center',
    },
    textView:{
        flex:1,
        alignItems:'center',
    },
    text:{
        fontSize:11,
        margin:5,
        fontWeight:'bold',
        fontFamily: 'Poppins SemiBold',
    },
    buttonsView:{
        flexDirection:'row',
        width:80,
        height:25,
    },
    button:{
        flex:1,
        alignItems:'center',
        
        backgroundColor:'#D9D9D9',
    }
    

});

export {MessageDialog, LoadingDialog };
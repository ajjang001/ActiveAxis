import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";

import { scale } from "./scale";


const MessageDialog = (props) =>{
    // Function to open/close the modal
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
                    <TouchableOpacity style = {styles.button} onPress = {() => closeModal(false)}>
                        <Text style = {styles.text}>OK</Text>
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

const ActionDialog = (props) =>{
    // Function to open/close the modal
    closeModal = (bool) => {
        props.changeModalVisible(bool);
    }

    performAction = (bool)=>{
        props.changeModalVisible(bool);
        props.action();
    }

    return(
        <TouchableOpacity disabled={true} style={styles.container}>
            <View style = {styles.modal}>
                <View style = {styles.textView}>
                    <Text style = {styles.text}>{props.message}</Text>
                </View>

                <View style = {styles.buttonsView}>
                    <TouchableOpacity style = {[styles.button, {right:scale(25)}]} onPress = {() => performAction(false)}>
                        <Text style = {styles.text}>Yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style = {[styles.button, {left:scale(25)}]} onPress = {() => closeModal(false)}>
                        <Text style = {styles.text}>No</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'rgba(0,0,0,0.5)',

        
    },
    modal:{
        width:scale(300),
        height:scale(125),
        backgroundColor:'white',
        borderWidth:scale(5),
        padding:scale(20),

        display:'flex',
        justifyContent:'center',
        alignItems:'center',

        borderRadius:scale(10),
        
    },
    textView:{
        flex:1,
    },
    text:{
        fontSize:scale(11),
        fontWeight:'bold',
        fontFamily: 'Poppins-SemiBold',
        textAlign:'center',
    },
    buttonsView:{
        flexDirection:'row',
        width:scale(80),
        height:scale(20),
    },
    button:{
        flex:1,
        alignItems:'center',
        backgroundColor:'#D9D9D9',
        justifyContent:'center',
        borderRadius:scale(5),
    }
    

});

export {MessageDialog, LoadingDialog, ActionDialog };
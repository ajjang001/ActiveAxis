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
            <View style={styles.modalView}>
                <Text style={styles.modalText}>{props.message}</Text>
                <View style={styles.modalButtons}>
                    <TouchableOpacity style={styles.modalButton} onPress={() => closeModal(false)}>
                        <Text style={styles.modalButtonText}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
            
        </TouchableOpacity>
        // <TouchableOpacity disabled={true} style={styles.container}>
        //     <View style = {styles.modal}>
        //         <View style = {styles.textView}>
        //             <Text style = {styles.text}>{props.message}</Text>
        //         </View>

        //         <View style = {styles.buttonsView}>
        //             <TouchableOpacity style = {styles.button} onPress = {() => closeModal(false)}>
        //                 <Text style = {styles.text}>OK</Text>
        //             </TouchableOpacity>
        //         </View>
        //     </View>
        // </TouchableOpacity>
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
            <View style={styles.modalView}>
                <Text style={styles.modalText}>{props.message}</Text>
                <View style={styles.modalButtons}>
                    <TouchableOpacity style={styles.modalButton} onPress={() => performAction(false)}>
                        <Text style={styles.modalButtonText}>Yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalButton} onPress={() => closeModal(false)}>
                        <Text style={styles.modalButtonText}>No</Text>
                    </TouchableOpacity>
                </View>
            </View>
            
        </TouchableOpacity>

        // <TouchableOpacity disabled={true} style={styles.container}>
        //     <View style = {styles.modal}>
        //         <View style = {styles.textView}>
        //             <Text style = {styles.text}>{props.message}</Text>
        //         </View>

        //         <View style = {styles.buttonsView}>
        //             <TouchableOpacity style = {[styles.button, {right:scale(25)}]} onPress = {() => performAction(false)}>
        //                 <Text style = {styles.text}>Yes</Text>
        //             </TouchableOpacity>
        //             <TouchableOpacity style = {[styles.button, {left:scale(25)}]} onPress = {() => closeModal(false)}>
        //                 <Text style = {styles.text}>No</Text>
        //             </TouchableOpacity>
        //         </View>
        //     </View>
        // </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'rgba(0,0,0,0.5)',  
    },
    modalView:{
        width: scale(400),
        height: scale(200),
        backgroundColor: 'white',
        borderRadius: 10,
        padding: scale(20),
        alignItems: 'center',
        justifyContent: 'space-evenly',
        shadowColor: '#000',
        shadowOffset: {
            width: scale(0),
            height: scale(2),
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: scale(5),
    },
    modalText:{
        fontSize: scale(18),
        fontWeight: 'bold',
        marginBottom: scale(20),
        textAlign: 'center',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        backgroundColor: '#E0E0E0',
        borderRadius: 5,
        padding: scale(10),
        marginHorizontal: scale(10),
        alignItems: 'center',
        flex: 1,
    },
    modalButtonText: {
        fontSize: scale(16),
        fontWeight: 'bold',
    },

    // modal:{
    //     width:scale(300),
    //     height:scale(125),
    //     backgroundColor:'white',
    //     borderWidth:scale(5),
    //     padding:scale(20),

    //     display:'flex',
    //     justifyContent:'center',
    //     alignItems:'center',

    //     borderRadius:scale(10),
        
    // },
    // textView:{
    //     flex:1,
    // },
    // text:{
    //     fontSize:scale(11),
    //     fontWeight:'bold',
    //     fontFamily: 'Poppins-SemiBold',
    //     textAlign:'center',
    // },
    // buttonsView:{
    //     flexDirection:'row',
    //     width:scale(80),
    //     height:scale(20),
    // },
    // button:{
    //     flex:1,
    //     alignItems:'center',
    //     backgroundColor:'#D9D9D9',
    //     justifyContent:'center',
    //     borderRadius:scale(5),
    // }
    

});

export {MessageDialog, LoadingDialog, ActionDialog };
import { View,Text, StyleSheet, TextInput, Image, ScrollView, Modal, TouchableOpacity} from "react-native"
import React, { useEffect, useState } from "react";

import { scale } from "../../components/scale";
import { LoadingDialog, MessageDialog, ActionDialog } from "../../components/Modal";

const UserFriendsListPage = ({route, navigation}) =>{
    // state variables
    const [search, setSearch] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMsg, setModalMsg] = useState('');

    // change popup/modal visible
    const changeModalVisible = (b, m)=>{
        setModalMsg(m);
        setModalVisible(b);
    }

    // change popup/modal visible
    const changeLoadingVisible = (b)=>{
        setIsLoading(b);
    }

    // search user account
    const searchHandler = async()=>{
        try{
            changeLoadingVisible(true);
            setUsers([]);
            await new SearchUserAccountPresenter({updateUserList: setUsers}).searchUserAccount(search);
        }catch(e){
            changeModalVisible(true, e.message);
        }finally{
            changeLoadingVisible(false);
        }
    }

    return (
        <View>
            <View style = {style.titleView}>
                <Text style = {style.title}>Friend List</Text>
            </View>


            <View style = {style.contentContainer}>

                <View style = {style.topContentContainer}>
                    <View style = {style.searchBarContainer}>
                        <Image style = {style.searchLogo} source={require('../../../assets/search_icon.png')} />    
                        <TextInput onEndEditing = {()=>searchHandler()} onChangeText={setSearch} value = {search} placeholder = 'Search User' /> 
                    </View>
                </View>

            
                <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={()=>changeLoadingVisible(false)}>
                    <LoadingDialog />
                </Modal>
                <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={()=>changeModalVisible(false)}>
                    <MessageDialog message = {modalMsg} changeModalVisible = {changeModalVisible} />
                </Modal>
            </View>
        </View>


    );
}

const style = StyleSheet.create({
    titleView:{
        backgroundColor: '#E28413',
    },
    title:{
        fontSize: 36,
        fontFamily: 'League-Spartan',
        fontWeight: 'bold',

        textAlign: 'center',
        marginVertical: 20,  
    },
    contentContainer:{
        backgroundColor: '#C42847',
        height: '100%',
        width: '100%',
    },
    topContentContainer:{
        width: '100%',
        marginVertical: scale(20),
        
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        
    
    },
    searchBarContainer:{
        width: '85%',
        padding: scale(5),
        borderRadius: scale(20),
        
        display:'flex',
        alignItems:'center',
        flexDirection:'row',
        gap:scale(5),

        backgroundColor: 'white'
    },

    searchLogo:{
        width:scale(20),
        height: scale(20),
    },
    middleContentContainer:{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    
    userListContainer:{
        height: '65%',
        width: '85%',
    },
    userListContent:{
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        
        
    }
});

export default UserFriendsListPage;
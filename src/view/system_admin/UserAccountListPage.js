import { View,Text, StyleSheet, TextInput, Image, ScrollView, Modal, TouchableOpacity} from "react-native"
import React, { useEffect, useState } from "react";

import AccountListCard from "../../components/AccountListCard";
import { scale } from "../../components/scale";
import { LoadingDialog, MessageDialog, ActionDialog } from "../../components/Modal";


import DisplayUsersPresenter from "../../presenter/DisplayUsersPresenter";
import SearchUserAccountPresenter from "../../presenter/SearchUserAccountPresenter";
import SuspendUserAccountPresenter from "../../presenter/SuspendUserAccountPresenter";
import UnsuspendUserAccountPresenter from "../../presenter/UnsuspendUserAccountPresenter";

const ListOfUserAccountsPage = ({route, navigation}) =>{
    // state variables
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState({});
    const [wantSuspend, setWantSuspend] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMsg, setModalMsg] = useState('');
    
    const [confirmationVisible, setConfirmationVisible] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState('');

    // change popup/modal visible
    const changeConfirmVisible = (b, m)=>{
        setConfirmMessage(m);
        setConfirmationVisible(b);
    }

    // change popup/modal visible
    const changeModalVisible = (b, m)=>{
        setModalMsg(m);
        setModalVisible(b);
    }

    // change popup/modal visible
    const changeLoadingVisible = (b)=>{
        setIsLoading(b);
    }

    // load user list
    const loadUserList = async()=>{
        try{
            changeLoadingVisible(true);
            await new DisplayUsersPresenter({updateUserList: setUsers}).displayUsers();
            changeLoadingVisible(false);
        }catch(error){
            throw new Error(error);
        }
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

    // suspend user account
    const suspendHandler = async()=>{
        try{
            changeLoadingVisible(true);
            await new SuspendUserAccountPresenter(selectedUser.user).suspendUser(selectedUser.id);
            setUsers([]);
            setSearch('');
            await loadUserList();
        }catch(e){
            changeModalVisible(true, e.message);
        }finally{
            changeLoadingVisible(false);
        }
    };

    // unsuspend user account
    const unsuspendHandler = async()=>{
        try{
            changeLoadingVisible(true);
            await new UnsuspendUserAccountPresenter(selectedUser.user).unsuspendUser(selectedUser.id);
            setUsers([]);
            setSearch('');
            await loadUserList();
        }catch(e){
            changeModalVisible(true, e.message);
        }finally{
            changeLoadingVisible(false);
        }
    }

    // refresh user list
    useEffect(()=>{
        if (route.params?.refresh){
            loadUserList();
            route.params.refresh = false;
        }
    },[route.params?.refresh]);

    // load user list
    useEffect(()=>{
        setSearch('');
        loadUserList();
    },[]);


    return (
        <View>
            <View style = {style.titleView}>
                <Text style = {style.title}>User Account List</Text>
            </View>


            <View style = {style.contentContainer}>

                <View style = {style.topContentContainer}>
                    <View style = {style.searchBarContainer}>
                        <Image style = {style.searchLogo} source={require('../../../assets/search_icon.png')} />    
                        <TextInput onEndEditing = {()=>searchHandler()} onChangeText={setSearch} value = {search} placeholder = 'Search User' /> 
                    </View>
                </View>

                <View style = {style.middleContentContainer}>
                    <ScrollView style = {style.userListContainer} contentContainerStyle = {style.userListContent}>
                        {users.length == 0 ? 
                        <View>
                            <Text style = {{color:'white', fontSize: scale(20)}}>No users found</Text>
                        </View> 
                        
                        :

                        users.map((user, index)=>{
                            return(
                                <AccountListCard 
                                key = {index}
                                numOfButtons = {2}
                                account = {user.user}
                                suspendHandler = {()=>{setSelectedUser(user); setWantSuspend(true) ;changeConfirmVisible(true, 'Are you sure you want to suspend this user?')}}
                                unsuspendHandler = {()=>{setSelectedUser(user); setWantSuspend(false); changeConfirmVisible(true, 'Are you sure you want to unsuspend this user?')}}
                                detailsHandler = { ()=>{navigation.navigate('UserAccountDetailsPage', {user} )} }
                                />
                            );
                        })}
                        

                    </ScrollView>
                    
                </View>

                

                <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={()=>changeLoadingVisible(false)}>
                    <LoadingDialog />
                </Modal>
                <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={()=>changeModalVisible(false)}>
                    <MessageDialog message = {modalMsg} changeModalVisible = {changeModalVisible} />
                </Modal>
                <Modal transparent={true} animationType='fade' visible={confirmationVisible} nRequestClose={()=>changeConfirmVisible(false)}>
                    <ActionDialog
                    message = {confirmMessage}
                    changeModalVisible = {changeConfirmVisible}
                    action = {wantSuspend ? ()=>suspendHandler() : ()=>unsuspendHandler()}
                    />
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

export default ListOfUserAccountsPage;
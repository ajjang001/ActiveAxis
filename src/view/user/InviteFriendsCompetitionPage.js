import { View,Text, StyleSheet, TextInput, Image, ScrollView, Modal, TouchableOpacity} from "react-native"
import { scale } from "../../components/scale";
import React, { useEffect, useState } from "react";
import { LoadingDialog, MessageDialog } from "../../components/Modal";

import InviteFriendToCompetitionPresenter from "../../presenter/InviteFriendToCompetitionPresenter";

const InviteFriendsCompetitionPage = ({route, navigation})=>{
    const {user, friendsInvited} = route.params;

    const [search, setSearch] = useState("");
    const [users,setUsers] = useState([]);
    
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

    const displayFriends = async ()=>{
        try{
            changeLoadingVisible(true);
            setUsers([]);
            await new InviteFriendToCompetitionPresenter({updateFriends: setUsers}).getFriends(user.accountID);
        }catch(error){
            changeModalVisible(true, error.message.replace('Error: ',''));
        }finally{
            changeLoadingVisible(false);
        }
    }

    const checkFriendInInvited = (friend)=>{
        for(let i = 0; i < friendsInvited.length; i++){
            if(friendsInvited[i] === friend.accountID){
                return true;
            }
        }
        return false;
    }

    const searchHandler = async ()=>{
        try{
            changeLoadingVisible(true);
            setUsers([]);
            await new InviteFriendToCompetitionPresenter({updateFriends: setUsers}).searchFriend(user.accountID, search.trim());
        }catch(error){
            console.log(error);
            changeModalVisible(true, error.message.replace('Error: ',''));
        }finally{
            changeLoadingVisible(false);
        }
    }

    const handleInvite = (friend)=>{
        friendsInvited.push(friend.accountID);
        changeModalVisible(true, 'Friend Invited');
        displayFriends();
    }

    const handleCancelInvite = (friend)=>{
        const index = friendsInvited.indexOf(friend.accountID);
        if(index > -1){
            friendsInvited.splice(index, 1);
            changeModalVisible(true, 'Invite Cancelled');
            displayFriends();
        }
    }


    useEffect(()=>{
        displayFriends();
    },[]);

    
    return (
        <View>
            <View style = {styles.titleView}>
                <Text style = {styles.title}>Friend List</Text>
            </View>
            <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={()=>changeLoadingVisible(false)}>
                <LoadingDialog />
            </Modal>
            <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={()=>changeModalVisible(false)}>
                <MessageDialog message = {modalMsg} changeModalVisible = {changeModalVisible} />
            </Modal>

            <View style = {styles.contentContainer}>
                <View style = {styles.topContentContainer}>
                    <View style = {styles.searchBarContainer}>
                        <Image style = {styles.searchLogo} source={require('../../../assets/search_icon.png')} />    
                        <TextInput onEndEditing = {searchHandler} onChangeText={setSearch} value = {search} placeholder = 'Search User' /> 
                    </View>
                </View>

                <View style = {styles.middleContentContainer}>
                    <ScrollView style = {styles.userListContainer} contentContainerStyle = {styles.userListContent}>
                    {users.length == 0 ? 
                        <View>
                            <Text style = {{color:'white', fontSize: scale(20)}}>No friend found</Text>
                        </View> 
                        :
                        users.map((user, index)=>{
                            return (
                                <View style = {styles.usersContainer} key = {index}>
                                    <Image source={{uri: user.profilePicture}} resizeMode='stretch' style = {styles.userImage}/>
                                    <View style = {styles.userDetails}>
                                        <Text style = {styles.name}>{user.fullName}</Text>
                                        <Text style = {styles.role}>User</Text>
                                        <View style ={styles.optButtons}>
                                            
                                            <TouchableOpacity onPress = { (checkFriendInInvited(user) ? ()=> handleCancelInvite(user) : ()=> handleInvite(user) )  } activeOpacity={0.7} style = {[{width:scale(100)}, (checkFriendInInvited(user) ? {backgroundColor: "#E28413"} : {backgroundColor: "#00AD3B"})]} >
                                                <Text style={styles.inviteText}>{checkFriendInInvited(user) ? 'INVITED' : 'INVITE'}</Text>
                                            </TouchableOpacity>

                                        </View>
                                    </View>
                                </View>
                            )
                        })
                        
                    }
                    </ScrollView>
                </View>

            </View>
            
        </View>
    )
};


const styles = StyleSheet.create({
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
        
    },
    usersContainer:{
        width: '100%',

        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',

        paddingBottom: scale(15),
        
        
    },
    userImage:{
        width: scale(100),
        height: scale(100),
        backgroundColor:'white',
    },
    userDetails:{
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
        justifyContent:'flex-end',
        alignItems:'center',
        width: scale(275),
    },
    inviteText:{
        fontFamily:'League-Spartan-SemiBold',
        fontSize: scale(15),
        color:'white',
        textAlign:'center',
    }
});

export default InviteFriendsCompetitionPage;

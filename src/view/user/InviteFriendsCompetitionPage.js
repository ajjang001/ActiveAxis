import { View,Text, StyleSheet, TextInput, Image, ScrollView, Modal, TouchableOpacity} from "react-native"
import { scale } from "../../components/scale";
import React, { useEffect, useState } from "react";

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

    
    return (
        <View>
            <View style = {styles.titleView}>
                <Text style = {styles.title}>Friend List</Text>
            </View>

            <View style = {styles.contentContainer}>
                <View style = {styles.topContentContainer}>
                    <View style = {styles.searchBarContainer}>
                        <Image style = {styles.searchLogo} source={require('../../../assets/search_icon.png')} />    
                        <TextInput onEndEditing = {()=>console.log('aaa')} onChangeText={setSearch} value = {search} placeholder = 'Search User' /> 
                    </View>
                </View>

                <View style = {styles.middleContentContainer}>
                    <ScrollView style = {styles.userListContainer} contentContainerStyle = {styles.userListContent}>
                    {users.length == 0 ? 
                        <View>
                            <Text style = {{color:'white', fontSize: scale(20)}}>No friend found</Text>
                        </View> 
                        :
                        null
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
        
    }
});

export default InviteFriendsCompetitionPage;

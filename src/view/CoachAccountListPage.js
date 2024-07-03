import { View,Text, StyleSheet, TextInput, Image, ScrollView, Modal, TouchableOpacity} from "react-native"

import AccountListCard from "../components/AccountListCard";
import { scale } from "../components/scale";
import React, { useEffect, useState } from "react";

import { LoadingDialog, MessageDialog, ActionDialog } from "../components/Modal";
import DisplayCoachesPresenter from "../presenter/DisplayCoachesPresenter";
import SearchCoachAccountPresenter from "../presenter/SearchCoachAccountPresenter";
import SuspendCoachAccountPresenter from "../presenter/SuspendCoachAccountPresenter";
import UnsuspendCoachAccountPresenter from "../presenter/UnsuspendCoachAccountPresenter";

const CoachAccountListPage = ({navigation})=>{
    const [search, setSearch] = useState("");
    const [coaches, setCoaches] = useState([]);
    const [selectedCoach, setSelectedCoach] = useState({});
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

    const loadCoachList = async()=>{
        try{
            changeLoadingVisible(true);
            await new DisplayCoachesPresenter({updateCoachList: setCoaches}).displayCoaches();
            changeLoadingVisible(false);
        }catch(error){
            throw new Error(error);
        }
    }

    const searchHandler = async()=>{
        try{
            setCoaches([]);
            await new SearchCoachAccountPresenter({updateCoachList: setCoaches}).searchCoachAccount(search);
        }catch(e){
            changeModalVisible(true, e.message);
        }
    }

    const suspendHandler = async()=>{
        try{
            changeLoadingVisible(true);
            await new SuspendCoachAccountPresenter(selectedCoach.coach).suspendCoach(selectedCoach.id);
            setCoaches([]);
            setSearch('');
            await loadCoachList();
        }catch(e){
            changeModalVisible(true, e.message);
        }finally{
            changeLoadingVisible(false);
        }
    };

    const unsuspendHandler = async()=>{
        try{
            changeLoadingVisible(true);
            await new UnsuspendCoachAccountPresenter(selectedCoach.coach).unsuspendCoach(selectedCoach.id);
            setCoaches([]);
            setSearch('');
            await loadCoachList();
        }catch(e){
            changeModalVisible(true, e.message);
        }finally{
            changeLoadingVisible(false);
        }
    }
    

    useEffect(()=>{
        loadCoachList();
    },[]);

    return(
        <View>
            <View style = {style.titleView}>
                <Text style = {style.title}>Coach Account List</Text>
            </View>

            <View style = {style.contentContainer}>

                <View style = {style.topContentContainer}>
                    <View style = {style.searchBarContainer}>
                        <Image style = {style.searchLogo} source={require('../../assets/search_icon.png')} />    
                        <TextInput onEndEditing = {()=>searchHandler()} onChangeText={setSearch} value = {search} placeholder = 'Search Coach' /> 
                    </View>
                </View>
                <View style = {style.middleContentContainer}>
                    <ScrollView style = {style.coachListContainer} contentContainerStyle = {style.coachListContent}>
                        {coaches.length == 0 ? 
                        <View>
                            <Text style = {{color:'white', fontSize: scale(20)}}>No coaches found</Text>
                        </View> 
                        
                        :

                        coaches.map((coach, index)=>{
                            return(
                                <AccountListCard 
                                key = {index}
                                numOfButtons = {2}
                                account = {coach.coach}
                                suspendHandler = {()=>{setSelectedCoach(coach); setWantSuspend(true) ;changeConfirmVisible(true, 'Are you sure you want to suspend this coach?')}}
                                unsuspendHandler = {()=>{setSelectedCoach(coach); setWantSuspend(false); changeConfirmVisible(true, 'Are you sure you want to unsuspend this coach?')}}
                                detailsHandler = { ()=>{navigation.navigate('CoachDetailsPage', {coach} )} }
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
                
                <View style = {{display:'flex', alignItems:'center'}}>
                    <View style = {style.bottomContentContainer}>
                        <TouchableOpacity onPress = {()=>navigation.navigate("CoachRegistrationListPage")} activeOpacity={0.7} style = {style.coachRegistrationButton}>
                            <Text style = {style.coachRegistrationText}>
                                Coach Registration List
                            </Text>
                            <Image style = {style.rightTriangleIcon} source = {require('../../assets/right_triangle_icon.png')} />

                        </TouchableOpacity> 
                    </View>
                </View>



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
    coachListContainer:{
        height: '65%',
        width: '85%',
    },
    coachListContent:{
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        
        
    },
    bottomContentContainer:{
        
        marginVertical: scale(20),
        display:'flex',
        alignItems:'flex-end',
        justifyContent:'center',

        width: '85%',
        
        
    },
    coachRegistrationText:{
        fontSize: scale(15),
        fontFamily: 'League-Spartan',
        fontWeight: 'bold',
    },

    coachRegistrationButton:{
        
        display:'flex',
        flexDirection:'row',
        
        alignItems:'center',
        justifyContent:'center',

        backgroundColor:'white',
        paddingHorizontal: scale(20),

        width: '65%',
    },
    rightTriangleIcon:{
        width: scale(20),
        height: scale(20)
    },

    


});

export default CoachAccountListPage;
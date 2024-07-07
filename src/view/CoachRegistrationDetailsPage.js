import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, Modal } from "react-native";
import { useEffect, useState } from "react";

import { scale } from "../components/scale";
import { ActionDialog, LoadingDialog, MessageDialog } from '../components/Modal';
import DisplayCoachRequestDetailsPresenter from "../presenter/DisplayCoachRequestDetailsPresenter";
import ApproveCoachPresenter from "../presenter/ApproveCoachPresenter";
import RejectCoachPresenter from "../presenter/RejectCoachPresenter";

const CoachRegistrationDetailsPage = ({navigation, route}) => {
    const {coach} = route.params;

    // state variables
    const [dob, setDob] = useState(null);
    const [resume, setResume] = useState(null);
    const [certificate, setCertificate] = useState(null);
    const [identification, setIdentification] = useState(null);
    const [isPressAccept, setIsPressAccept] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [modalMsg, setModalMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [confirmationVisible, setConfirmationVisible] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState('');

    // month names
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];


    // change popup/modal visible
    const changeLoadingVisible = (b)=>{
        setIsLoading(b);
    }

    // change popup/modal visible
    const changeModalVisible = (b, m)=>{
        setModalMsg(m);
        setModalVisible(b);
    }

    // change popup/modal visible
    const changeConfirmVisible = (b, m)=>{
        setConfirmMessage(m);
        setConfirmationVisible(b);
    }

    // convert firebase timestamp to date
    const convertToDate = (firebaseTimestamp) =>{
        const date = firebaseTimestamp.toDate();
        return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    }

    // load documents
    const loadDocuments = async () => {
        try{
            changeLoadingVisible(true);
            await new DisplayCoachRequestDetailsPresenter({coach: coach.coach, updateResume: setResume, updateCert: setCertificate, updateID: setIdentification}).displayDocuments();
        }catch(e){
            changeModalVisible(true, e.message);
        }finally{
            changeLoadingVisible(false);
        }
    };

    // process request
    const processRequest = async () => {
        try{
            changeLoadingVisible(true);
            if(isPressAccept){
                await new ApproveCoachPresenter({coach: coach.coach}).approveRequest(coach.id);
            }else{
                await new RejectCoachPresenter({coach: coach.coach}).rejectRequest(coach.id);
            }
            navigation.navigate('CoachRegistrationListPage', {refresh: true});
        }catch(e){
            changeModalVisible(true, e.message);
        }finally{
            changeLoadingVisible(false);
        }
    };

    // load documents and dob
    useEffect(() => {
        setDob(convertToDate(coach.coach.dob));
        loadDocuments();
    }, []);


    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style = {styles.headerView}>
                <Text style = {styles.headerText}>Request Details</Text>
            </View>

            <View style={styles.detailsBox}>
                <View style = {styles.pictureContainer}>
                    <Image source={{uri: coach.coach.profilePicture}} resizeMode='stretch' style = {styles.coachImage}/>
                </View>

                <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={()=>changeLoadingVisible(false)}>
                    <LoadingDialog />
                </Modal>
                <Modal transparent={true} animationType='fade' visible={confirmationVisible} nRequestClose={()=>(false)}>
                    <ActionDialog
                    message = {confirmMessage}
                    changeModalVisible = {setConfirmationVisible}
                    action = {processRequest}
                    />
                </Modal>
                <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={()=>changeModalVisible(false)}>
                    <MessageDialog message = {modalMsg} changeModalVisible = {changeModalVisible} />
                </Modal>

                <Text style = {styles.detailsTitle}>Name</Text>
                <Text style = {styles.detailsText}>{coach.coach.fullName}</Text>
                <Text style = {styles.detailsTitle}>Email</Text>
                <Text style = {styles.detailsText}>{coach.coach.email}</Text>
                <Text style = {styles.detailsTitle}>Phone Number</Text>
                <Text style = {styles.detailsText}>{coach.coach.phoneNumber}</Text>
                <Text style = {styles.detailsTitle}>Gender</Text>
                <Text style = {styles.detailsText}>{coach.coach.gender === 'm' ? "Male" : "Female"}</Text>
                <Text style = {styles.detailsTitle}>Date of Birth</Text>
                <Text style = {styles.detailsText}>{dob}</Text>
                <Text style = {styles.detailsTitle}>Charge per Month</Text>
                <Text style = {styles.detailsText}>{`S$ ${coach.coach.chargePerMonth.toFixed(2)}`}</Text>

                <Text style = {styles.detailsTitle}>Photo</Text>
                <TouchableOpacity onPress = {()=>{const pp = coach.coach.profilePicture;  navigation.navigate('PhotoViewer', {photo: pp})}}>
                    <Text style = {styles.detailsText}>Tap here to view</Text>
                </TouchableOpacity>

                <Text style = {styles.detailsTitle}>Resume</Text>
                <TouchableOpacity onPress = {()=>{ navigation.navigate('PhotoViewer', {photo: resume})}}>
                    <Text style = {styles.detailsText}>Tap here to view</Text>
                </TouchableOpacity>

                <Text style = {styles.detailsTitle}>Certificate</Text>
                <TouchableOpacity onPress = {()=>{ navigation.navigate('PhotoViewer', {photo: certificate})}}>
                    <Text style = {styles.detailsText}>Tap here to view</Text>
                </TouchableOpacity>

                <Text style = {styles.detailsTitle}>Identification</Text>
                <TouchableOpacity  onPress = {()=>{ navigation.navigate('PhotoViewer', {photo: identification})}}>
                    <Text style = {styles.detailsText}>Tap here to view</Text>
                </TouchableOpacity>
            </View>

            <View style = {styles.buttonView}>
                <TouchableOpacity onPress ={()=>{setIsPressAccept(true); changeModalVisible(true, 'Are you sure you want to Accept?')}} style = {styles.ARButton}>
                        <Image source={require('../../assets/check_icon.png')} style={styles.ARIcon}/>
                        <Text style = {styles.ARText}>ACCEPT</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress ={()=>{setIsPressAccept(false); changeModalVisible(true, 'Are you sure you want to Reject?')}} style = {styles.ARButton}>
                        <Image source={require('../../assets/cross_icon.png')} style={styles.ARIcon}/>
                        <Text style = {styles.ARText}>REJECT</Text>
                </TouchableOpacity>
            </View>

                    
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#C42847',
        alignItems: 'center',
    },
    headerView:{
        backgroundColor: '#E28413',
        width: '100%',
        height: '8%',
        marginBottom: scale(20),
    },
    headerText:{
        fontSize: scale(36),
        fontFamily: 'League-Spartan',
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: scale(20),
    },
    detailsBox:{
        width: '90%',
        backgroundColor: '#E6E6E6',
        padding: scale(20),
        borderRadius: scale(36),
        marginBottom: scale(10),
    },
    pictureContainer:{
        display: 'flex',
        justifyContent: 'center',
        alignItems:'center'
    },
    coachImage:{
        width: scale(125),
        height: scale(125),
        marginHorizontal: scale(25),
        backgroundColor:'white',
        borderRadius: scale(75),
    },
    detailsTitle:{
        fontFamily:'Inter-SemiBold',
        fontSize: scale(16),
    },
    detailsText:{
        fontFamily:'Inter',
        fontSize: scale(16),
        marginBottom: scale(15),
        paddingHorizontal: scale(15),
        paddingVertical: scale(10),
        borderRadius: scale(8),
        backgroundColor: 'white',
    },
    buttonView:{
        width: '90%',
        
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginBottom: scale(20),
    },
    ARButton:{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    ARIcon:{
        width: scale(50), 
        height: scale(50)
    },
    ARText:{
        fontFamily: 'Inter-SemiBold',
        fontSize: scale(16),
        color: 'white',
    }

});

export default CoachRegistrationDetailsPage;
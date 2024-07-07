
import React, {useState, useEffect} from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Modal, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { scale } from '../components/scale';
import { ActionDialog, LoadingDialog, MessageDialog } from '../components/Modal';
import FeedbackCard from '../components/FeedbackCard';
import DisplayCoachDetailsPresenter from '../presenter/DisplayCoachDetailsPresenter';

const CoachDetailsPage = ({route}) => {
    const {coach} = route.params;

    // State to store the image URL
    const [feedback, setFeedback] = useState([]);
    const [selectedStar, setSelectedStar] = useState(5);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMsg, setModalMsg] = useState('');
    const [dob, setDob] = useState(null);

    // star filter
    const starFilter = [5, 4, 3, 2, 1];
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

      // convert firebase timestamp to date
    const convertToDate = (firebaseTimestamp) =>{
        const date = firebaseTimestamp.toDate();
        return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    }

     // change popup/modal visible
    const changeLoadingVisible = (b)=>{
        setLoading(b);
    }
    
    // change popup/modal visible
    const changeModalVisible = (b, m)=>{
        setModalMsg(m);
        setModalVisible(b);
    }
    

    // load feedbacks
    const loadFeedbacks = async () => {
        try{
            changeLoadingVisible(true);
            await new DisplayCoachDetailsPresenter({updateFeedback: setFeedback, coachID: coach.id}).displayCoachFeedbacks();
        }catch(error){
            changeModalVisible(true, error.message);
        }finally{
            changeLoadingVisible(false);
        }
    };

    // load feedbacks and dob
    useEffect(() => {
        setDob(convertToDate(coach.coach.dob));
        loadFeedbacks();
      }, []);

    

    return(
        <View style = {styles.container}>
            <View style = {styles.blackbox}>
                <TouchableOpacity style = {styles.deleteButton}>
                    <Text style = {styles.deleteText}>Delete</Text>
                </TouchableOpacity>
            </View>

            <Modal transparent={true} animationType='fade' visible={loading} nRequestClose={()=>changeLoadingVisible(false)}>
                <LoadingDialog />
            </Modal>
            <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={()=>changeModalVisible(false)}>
                <MessageDialog message = {modalMsg} changeModalVisible = {changeModalVisible} />
            </Modal>

            <ScrollView contentContainerStyle = {styles.contentContainer}>

                <View style={styles.detailsBox}>
                    <View style = {styles.pictureContainer}>
                        <Image source={{uri: coach.coach.profilePicture}} resizeMode='stretch' style = {styles.coachImage}/>
                    </View>

                    <Text style = {styles.detailsTitle}>Name</Text>
                    <Text style = {styles.detailsText}>{coach.coach.fullName}</Text>
                    <Text style = {styles.detailsTitle}>Username</Text>
                    <Text style = {styles.detailsText}>{coach.coach.username}</Text>
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
                
                </View>
                <View style = {styles.filterView}>
                    {starFilter.map((star)=>(

                        <TouchableOpacity key = {star} onPress={()=>setSelectedStar(star)} style = {styles.filterButton}>
                            <Text>{star}</Text>
                            <Icon
                                name="star"
                                size={15}
                                color={'#FFD700'}
                            />
                        </TouchableOpacity>

                    ))}
                </View>
                <View style={styles.feedbacksView}>
                    {feedback.length === 0 ? (
                        loading ? (
                            <ActivityIndicator size="large" color="white" />
                        ) : (
                            <Text style={styles.noFeedbackText}>No Feedback Available</Text>
                        )
                    ) : (
                        (() => {
                            const filteredFeedback = feedback.filter((f) => f.rating === selectedStar);
                            return filteredFeedback.length === 0 ? (
                                <Text style={styles.noFeedbackText}>No Feedback Available</Text>
                            ) : (
                                filteredFeedback.map((feedbackItem, index) => (
                                    <FeedbackCard
                                        key={index}
                                        avatar={feedbackItem.profilePicture || feedbackItem.avatar}
                                        name={feedbackItem.fullName || feedbackItem.name}
                                        rating={feedbackItem.rating}
                                        feedback={feedbackItem.feedbackText}
                                    />
                                ))
                            );
                        })()
                    )}
                </View>

                
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#C42847',
        width: '100%',
        height: '100%',
    },
    blackbox:{
        backgroundColor:'black', 
        width:'100%', 
        height:scale(35),
        marginBottom:scale(20),

        display: 'flex',
        flexDirection: 'row',
        justifyContent:'flex-end',
        alignItems:'center'
    },
    contentContainer:{
        display: 'flex',
        alignItems: 'center',
    },
    coachImage:{
        width: scale(125),
        height: scale(125),
        marginHorizontal: scale(25),
        backgroundColor:'white',
        borderRadius: scale(75),
    },
    deleteButton:{
        borderWidth:1, 
        backgroundColor:'#E28413', 
        paddingHorizontal:scale(50), 
        
    },
    deleteText:{
        color:'white', 
        textAlign:'center', 
        fontFamily:'Inter', 
        fontWeight:'bold', 
        fontSize:scale(16)
    },
    detailsBox:{
        width: '90%',
        backgroundColor: '#E6E6E6',
        padding: scale(20),
        borderWidth: 2,
        borderRadius: scale(36),
    },
    pictureContainer:{
        display: 'flex',
        justifyContent: 'center',
        alignItems:'center'
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
    filterView:{
        flexDirection:'row',
        justifyContent: 'center',
        alignItems: 'center',

        width: '90%',
        marginVertical: scale(20)
    },
    filterButton:{

        flexDirection:'row',
        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: '#E6E6E6',

        borderWidth:1,
        borderRadius: scale(10),
        paddingHorizontal:scale(10),
        marginHorizontal: scale(15)
    },
    feedbacksView:{
        width: '90%',
    
    },
    noFeedbackText:{
        fontFamily:'Inter',
        fontSize: scale(20),
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    }

});

export default CoachDetailsPage;
import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Image, TextInput, Modal, Dimensions, ScrollView   } from "react-native";
import * as Font from 'expo-font';
import { CheckBox } from '@rneui/themed';
import { Dropdown } from 'react-native-element-dropdown';
import {scale} from '../components/scale';

import {app, auth, db} from '../../.expo/api/firebase';
import { getAuth, signInWithEmailAndPassword,browserLocalPersistence, browserSessionPersistence, setPersistence  } from "firebase/auth";
import { collection, query, where, getDoc } from "firebase/firestore"; 

import MessageDialog from '../components/Modal';




const LoginPage = ({navigation})=>{
    // User Login Info
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [loginType, setLoginType] = useState('u');

    // Firebase Authentication
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState(null);

    // Modal/Display Message
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalMsg, setModalMsg] = useState('');
    
    // to close dropdown
    const dropdownRef = useRef(null);
    

    // handle user state changes
    const onAuthStateChanged = (user) => {
        setUser(user);
        if (initializing) setInitializing(false);
    };

    useEffect(() => {
        async function loadFonts(){
            await Font.loadAsync({
                "Poppins SemiBold": require("../../assets/fonts/Poppins SemiBold.ttf"),
                "Poppins Medium": require("../../assets/fonts/Poppins Medium.ttf"),
                "Inter": require("../../assets/fonts/Inter.ttf"),
                "Inter SemiBold": require("../../assets/fonts/Inter SemiBold.ttf"),
                "Inter Medium": require("../../assets/fonts/Inter Medium.ttf"), 
                //"Fuzzy Bubbles": require("../../assets/fonts/Fuzzy Bubbles.ttf"), 
            });
        }

        loadFonts();
        

    }, []);


    // After authentication....
    // to check if the user is logged in or not
    // if logged in, user will be redirected to the home page
    // otherwise, user will be redirected to the login page
    useEffect(() => {
        //const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
        const subscriber = onAuthStateChanged(auth, onAuthStateChanged);
        return subscriber;
    }, []);

    
    if(initializing) return null;
    
    const processLogin = async (email, password, remember, loginType) => {
        console.log('Login in');
        // To if email is in valid format
        const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

        if(email.trim() === '' || password.trim() === ''){
            // Email and Password field is empty
            changeModalVisible(true, 'Please enter your email and password');
            return;
        }else if(!pattern.test(email)){
            // Email is not in valid format
            changeModalVisible(true, 'Invalid email format');
            return;
        }
        else{
            try{
                const persistenceType = remember
                ? browserLocalPersistence
                : browserSessionPersistence;

                await setPersistence(auth, persistenceType)
                await signInWithEmailAndPassword(auth, email, password);
                  


                //setPersistence(auth, persistenceType);
                const user = auth.currentUser;
                if (!user) {
                    throw new Error('No user is signed in');
                }

                const q = query(collection(db, 'users'), where('email', '==', user.email));
                const querySnapshot = await getDoc(q);
                querySnapshot.forEach((doc) => {
                    console.log(doc.id, ' => ', doc.data());
                });
                

                if (loginType !== userData.userType) {
                    auth.signOut();
                    changeModalVisible(true, 'Invalid login type');
                    return;
                }


                
            }catch(e){
                console.log("ERROR 2 " + e.message);
            }
        }
    };




    // Checkbox Toggle
    const toggleCheckbox = () => {
        setRemember(!remember);
    };

    // Dropdown - Login type
    const dropdownOpt = [
        {label: 'USER', value:'u'},
        {label: 'COACH', value:'c'},
        {label: 'SYSTEM ADMIN', value:'a'},
    ]
    

    // Render Dropdown options
    const renderItem=(item)=>{
        return(
           <TouchableOpacity activeOpacity={.7} style={styles.item}
           onPress={()=>{
            setLoginType(item.value);
            dropdownRef.current.close();
           }}
           >
                <Text style={styles.itemText}>{item.label}</Text>
           </TouchableOpacity> 
        );
    };
    


    // change popup/modal visible
    const changeModalVisible = (b, m)=>{
        setModalMsg(m);
        setIsModalVisible(b);
    }


    


    return(
        <View style = {styles.container}>
            
            <View style = {styles.topContainer}>
                <Image style = {styles.logo} source={require('../../assets/img/logo.png')} />
                <View style = {styles.redBox} />
            </View>
            
            <View style = {styles.middleContainer}>
                <Text style = {styles.title}>Login</Text>
                <TextInput style={styles.inputBox} onChangeText={setEmail} value = {email} placeholder='Enter your email'/>
                <TextInput secureTextEntry={true} style={styles.inputBox} onChangeText={setPassword} value = {password} placeholder='Enter your password'/>

                <TouchableOpacity onPress={()=>navigation.navigate('ResetPassword')}>
                    <Text style={styles.forgotPassText}>Forgot Password?</Text>
                </TouchableOpacity>

                
                <Text style ={{fontFamily:'Inter', fontSize:scale(15)}}>Login as</Text>
                <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    data={dropdownOpt}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Login"
                    value={loginType}
                    onChange={type => {
                        setLoginType(type);
                    }}
                    renderItem={renderItem}
                    ref={dropdownRef}
                />

            <View style={{
                    borderStyle:'dashed', 
                    maxWidth:'100%', 
                    borderWidth:1, 
                    margin:10}}></View>
            </View>

            <View style={styles.bottomContainer}>
                <TouchableOpacity activeOpacity={.7} style={styles.loginButton} onPress={()=>processLogin(email, password, remember, loginType)} >
                    <Text style={styles.loginButtonText}>LOGIN</Text>
                </TouchableOpacity>

                <Modal transparent={true} animationType='fade' visible={isModalVisible} nRequestClose={()=>changeModalVisible(false)}>
                    <MessageDialog
                    message = {modalMsg} 
                    changeModalVisible = {changeModalVisible} 
                    />

                </Modal>

                <Text style={styles.privacyPolicyText}>
                    By clicking login, you agree to our 
                    <Text style = {{color:'black'}}> Terms of Service </Text> 
                     and 
                    <Text style = {{color:'black'}}> Privacy Policy </Text>
                </Text>
            </View>

            

            <View style={styles.ovalAndText}>
                <View style={styles.oval}></View>

                <View style = {styles.inTextOval}>
                    <Text style={{fontFamily:'Inter Medium', fontSize:scale(14)}} >Don’t have an account?  
                            <Text style = {{fontFamily:'Inter', fontWeight:'bold', fontSize:scale(14)}} onPress={()=>{navigation.navigate('Register')}}> Register Now</Text>
                    </Text>

                    <Text style={{fontFamily:'Inter Medium', paddingTop:15, fontSize:scale(14)}}>Want to join us as a coach? 
                        <Text style = {{fontFamily:'Inter', fontWeight:'bold', fontSize:scale(14)}}> Click Here</Text>
                    </Text>

                    <TouchableOpacity activeOpacity={.7} style ={styles.aboutAppButton} onPress={()=>{navigation.navigate('AboutOurApp')}}>
                        <Image style = {styles.infoLogo} source={require('../../assets/img/info_logo.png')} />
                        <Text style={styles.aboutAppText}>
                            ABOUT OUR APP
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>


            

            
        </View>
    );

    
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: '#FBF5F3',
        width:'100%',
        height:'100%',
    },
    topContainer:{
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        paddingTop:scale(80),
    },  
    logo:{
        width:scale(125),
        height:scale(125),
        borderRadius:17,
    },
    redBox:{
        backgroundColor:'#C42847',
        height:scale(15),
        width:'90%',
        marginTop:scale(20),
    },

    middleContainer:{
        margin:scale(20)
    },
    title:{
        fontSize:scale(32),
        fontFamily: 'Poppins SemiBold',
    },
    inputBox:{
        backgroundColor:'white',
        borderRadius:10,
        padding:scale(10),
        margin:scale(10),
        fontSize:scale(14),
        fontFamily:'Inter'
    },
    forgotPassText:{
        fontFamily:'Inter',
        color:'black',
        fontSize:scale(14),
        fontWeight:'bold',
        textAlign:'right',
    },

    dropdown: {
        height: scale(30),
        width: '40%',
        margin:5,
        padding:scale(10),
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
        backgroundColor: 'white',
        borderRadius:8
    },
    placeholderStyle: {
        fontSize: scale(14),
    },
    selectedTextStyle: {
        fontSize: scale(15),
        height:scale(18),
        color:'grey'
    },
    item: {
        paddingLeft: scale(5),
        height:scale(25),
        borderWidth:1,
        borderColor: 'lightgrey',
    },
    itemText: {
        fontSize: scale(12),
        fontFamily:'Poppins Medium'
    },


    bottomContainer:{
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        paddingTop:scale(10),
    },
    loginButton:{
        backgroundColor:'black',
        width:'90%',
        height:scale(50),
        borderRadius:10,
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
    },
    loginButtonText:{
        color:'white',
        fontFamily:'Inter',
        fontSize:scale(20),
        fontWeight:'bold',
    },
    privacyPolicyText:{
        fontFamily:'Inter',
        fontSize:scale(15),
        color:'#828282',
        textAlign:'center',
        maxWidth:'85%',
        paddingTop:scale(10),
    },
    ovalAndText:{
        position:'absolute',
        width:'100%',
        bottom:scale(200),
        alignItems:'center',
    },

    oval: {
        position:'absolute',
        width: scale(300),
        height: scale(300),
        borderRadius: 150,
        borderWidth: 5,
        backgroundColor: "#E28413",
        borderColor: "#C42847",
        transform: [{ scaleX: 2 }],
        zIndex: 0,
        
      },
      inTextOval:{
        zIndex: 1,
        position:'absolute',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        paddingTop:scale(40),
      },

      aboutAppButton:{
        backgroundColor:'#C42847',
        height:scale(24),
        width:scale(175),
        borderRadius:35,

        marginTop:scale(20),
        

        display:'flex',
        justifyContent:'center',
        alignItems:'center',

        flexDirection:'row',
        
        gap:scale(5),

        
      },
      infoLogo:{
        width:16,
        height:16,
        
      },
      aboutAppText:{
        fontFamily:'Poppins SemiBold',
        fontSize:scale(11),
        color:'white',
        
        
      }





});

export default LoginPage;
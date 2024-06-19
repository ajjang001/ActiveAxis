import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Image, TextInput, Modal } from "react-native";
import { useFonts } from "expo-font";
import { CheckBox } from '@rneui/themed';
import { Dropdown } from 'react-native-element-dropdown';

import {app, auth, db} from '../../.expo/api/firebase';
import { getAuth, signInWithEmailAndPassword,browserLocalPersistence, browserSessionPersistence, setPersistence  } from "firebase/auth";
import { collection, query, where, getDoc } from "firebase/firestore"; 

import MessageDialog from '../other/Modal';

const LoginPage = ({navigation})=>{
    // Load Fonts
    const [fontsLoaded] = useFonts({
        "Poppins SemiBold": require("../../assets/fonts/Poppins SemiBold.ttf"),
        "Poppins Medium": require("../../assets/fonts/Poppins Medium.ttf"),
        "Inter": require("../../assets/fonts/Inter.ttf"),
        "Inter SemiBold": require("../../assets/fonts/Inter SemiBold.ttf"),
        "Inter Medium": require("../../assets/fonts/Inter Medium.ttf"), 
        "Fuzzy Bubbles": require("../../assets/fonts/Fuzzy Bubbles.ttf"), 
      });
    
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

    // After authentication....
    // to check if the user is logged in or not
    // if logged in, user will be redirected to the home page
    // otherwise, user will be redirected to the login page
    useEffect(() => {
        //const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
        const subscriber = onAuthStateChanged(auth, onAuthStateChanged);
        return subscriber;
    }, []);

    useEffect(() => {
        const checkPersistence = async () => {
            const currentUser = getAuth().currentUser;
            if (currentUser) {
                const userDoc = await firestore.collection('users').doc(currentUser.uid).get();
                if (userDoc.exists) {
                    const userData = userDoc.data();
                    console.log('Persisted User Data:', {
                        fullName: userData.fullName,
                        email: userData.email,
                        userType: userData.userType,
                        phoneNumber: userData.phoneNumber,
                    });
                    //navigation.navigate('Homepage');
                }
            } else {
                setUser(null);
                setInitializing(false);
            }
        };
        
        if(user){
            checkPersistence();
        }
            
    },[]);

    /*
    console.log('Hi! Im checking persistence');
            const currentUser = firebase.auth().currentUser;
            console.log('Current User is set');
            if (currentUser){
                console.log('Current User is found');
                const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
                console.log('Current User get db data');
                if(userDoc.exists){
                    console.log('userDocExists checkPersistence');
                    const userData = userDoc.data();
                    console.log('Persisted User Data:', {
                        fullName: userData.fullName,
                        email: userData.email,
                        userType: userData.userType,
                        phoneNumber: userData.phoneNumber,
                    });
                    //navigation.navigate('Homepage');
                }
            }else{
                console.log('Current User is not found');
                setUser(null);
                setInitializing(false);
            }
        };
    */

    if(initializing) return null;
    /*
    useEffect(() => {
    const checkPersistence = async () => {
        console.log('Hi! Im checking persistence');
        const currentUser = firebase.auth().currentUser;
        console.log('Current User is set');
        if (currentUser) {
            console.log('Current User is found');
            const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
            console.log('Current User get db data');
            if (userDoc.exists) {
                console.log('userDocExists checkPersistence');
                const userData = userDoc.data();
                console.log('Persisted User Data:', {
                    fullName: userData.fullName,
                    email: userData.email,
                    userType: userData.userType,
                    phoneNumber: userData.phoneNumber,
                });
                if (firebase.auth().persistence === firebase.auth.Auth.Persistence.LOCAL) {
                    // Redirect to user homepage based on type
                    // navigation.navigate('Homepage');
                } else if (firebase.auth().persistence === firebase.auth.Auth.Persistence.NONE) {
                    // Redirect to login and clear user data
                    firebase.auth().signOut();
                    setUser(null);
                    setInitializing(false);
                }
            }
        } else {
            console.log('Current User is not found');
            setUser(null);
            setInitializing(false);
        }
    };
    if (user) {
        console.log('User is found Why Im here?');
        checkPersistence();
    }
}, [user]);

    */

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

                setPersistence(auth, persistenceType)
                .then(() =>
                    {
                        signInWithEmailAndPassword(auth, email, password);
                    }
                );


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

    /* 
    await firebase.auth().setPersistence(persistenceType);

                // Proceed with sign-in
                await firebase.auth().signInWithEmailAndPassword(email, password);

                console.log('Login successful');

                const user = firebase.auth().currentUser;
                if (!user) {
                    throw new Error('No user is signed in');
                }
                const userData = (await firebase.firestore().collection('users').doc(user.uid).get()).data();
                if (!userData) {
                    throw new Error('User data not found');
                }

                console.log('Hello '+remember+' User Data:', {
                    fullName: userData.fullName,
                    email: userData.email,
                    userType: userData.userType,
                    phoneNumber: userData.phoneNumber,
                });

                if (loginType !== userData.userType) {
                    firebase.auth().signOut();
                    changeModalVisible(true, 'Invalid login type');
                    return;
                }
                

    */
    /*
    console.log('in Else');
                await firebase.auth().signInWithEmailAndPassword(email, password);
                console.log('1');
                const user = firebase.auth().currentUser;
                console.log('2');
                const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
                console.log('3');
                if(userDoc.exists){
                    console.log('userDoc exists');
                    const userData = userDoc.data();
                    
                    if(loginType === userData.userType){
                        console.log('Login Type is correct');
                        if(checked){
                            console.log('Local persistence');
                            await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
                            console.log('Hello Local User Data:', {
                                fullName: userData.fullName,
                                email: userData.email,
                                userType: userData.userType,
                                phoneNumber: userData.phoneNumber,
                            });
                        }else{
                            console.log('Session persistence');
                            await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
                            console.log('Hello Session User Data:', {
                                fullName: userData.fullName,
                                email: userData.email,
                                userType: userData.userType,
                                phoneNumber: userData.phoneNumber,
                            });
                        }
                    }else{
                        console.log('Invalid login type');
                        throw new Error('Invalid login type');
                    }
                } else{
                    console.log('User data not found');
                    throw new Error('User data not found');
                }
    */ 

    /*const processLogin = async (email, password) => {
        try {
            await firebase.auth().signInWithEmailAndPassword(email, password);
            const user = firebase.auth().currentUser;
            const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
    
                if (loginType === userData.userType) {
                    if (checked) {
                        if (firebase.auth.Auth.Persistence.LOCAL) {
                            await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
                        } else {
                            throw new Error('Local persistence is not supported in the current environment');
                        }
                    } else {
                        if (firebase.auth.Auth.Persistence.SESSION) {
                            await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
                        } else {
                            throw new Error('Session persistence is not supported in the current environment');
                        }
                    }
                } else {
                    throw new Error('Invalid login type');
                }
            } else {
                throw new Error('User data not found');
            }
        } catch (e) {
            console.log(e.message);
        }
    };*/

    






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
        <SafeAreaView style = {styles.container}>
            
            <View style = {styles.topContainer}>
                <Image style = {styles.logo} source={require('../../assets/img/logo.png')} />
                <View style = {styles.redBox} />
            </View>
            
            <View style = {styles.middleContainer}>
                <Text style = {styles.title}>Login</Text>
                <TextInput style={styles.inputBox} onChangeText={setEmail} value = {email} placeholder='Enter your email'/>
                <TextInput secureTextEntry={true} style={styles.inputBox} onChangeText={setPassword} value = {password} placeholder='Enter your password'/>

                <View style ={styles.rememberMe}>
                    <CheckBox
                        title="Remember me"
                        checked={remember}
                        fontFamily='Inter SemiBold'
                        containerStyle={styles.checkBoxContainter}
                        textStyle={styles.checkBoxText}
                        onPress={toggleCheckbox}
                        checkedColor='grey'
                        uncheckedColor='grey'
                    />

                    <Text style={styles.checkBoxText}>Forgot Password?</Text>
                </View>

                
                <Text style ={{fontFamily:'Inter', fontSize:15}}>Login as</Text>
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

                <Text>- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</Text>
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

                <View style={styles.oval}>
                    <Text style={{marginTop: 40, transform:[{scaleX:0.5}],}}>Don’t have an account? 
                            <Text style = {{fontFamily:'Inter', fontWeight:'bold'}}> Register Now</Text>
                    </Text>
                    <Text style={{marginTop: 20, transform:[{scaleX:0.5}],}}>Want to join us as a coach? 
                            <Text style = {{fontFamily:'Inter', fontWeight:'bold'}}> Click Here</Text>
                    </Text>

                    <TouchableOpacity activeOpacity={.7} style ={styles.aboutAppButton} >
                        <Image style = {styles.infoLogo} source={require('../../assets/img/info_logo.png')} />
                        <Text style={styles.aboutAppText}>
                            ABOUT OUR APP
                        </Text>
                    </TouchableOpacity>

                </View>
            
            
            </View>

            

            
        </SafeAreaView>
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
        paddingTop:70,
    },  
    logo:{
        width:125,
        height:125,
        borderRadius:17,
    },
    redBox:{
        backgroundColor:'#C42847',
        height:15,
        width:400,
        marginTop:20,
    },

    middleContainer:{
        margin:24
    },
    title:{
        fontSize:32,
        fontFamily: 'Fuzzy Bubbles',
    },
    inputBox:{
        backgroundColor:'white',
        borderRadius:10,
        padding:10,
        margin:10,
        fontSize:14,
        fontFamily:'Inter Regular'
    },

    rememberMe:{
        flexDirection: 'row',
        gap: 60,
        flexWrap: 'wrap',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        marginTop:-15,
        
    },
    checkBoxContainter:{
        maxWidth:'50%',
        maxHeight:50,
        backgroundColor:'transparent',
        right: 20,
    },
    checkBoxText:{
        fontFamily:'Inter',
        color:'black',
        fontSize:15,
        fontWeight:'bold',
    },

    dropdown: {
        height: 30,
        width: 160,
        margin:5,
        padding:10,
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
        backgroundColor: 'white',
        borderRadius:8
    },
    placeholderStyle: {
        fontSize: 14,
    },
    selectedTextStyle: {
        fontSize: 14,
        height:18,
        color:'grey'
    },
    item: {
        paddingLeft: 5,
        height:25,
        borderWidth:2,
        borderColor: 'lightgrey',
    },
    itemText: {
        fontSize: 12,
        fontFamily:'Popins Medium'
    },


    bottomContainer:{
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        paddingTop:10,
    },
    loginButton:{
        backgroundColor:'black',
        width:400,
        height:50,
        borderRadius:10,
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
    },
    loginButtonText:{
        color:'white',
        fontFamily:'Inter',
        fontSize:20,
        fontWeight:'bold',
    },
    privacyPolicyText:{
        fontFamily:'Inter',
        fontSize:15,
        color:'#828282',
        textAlign:'center',
        maxWidth:390,
        paddingTop:10,
    },

    oval: {
        width: 300,
        height: 300,
        margin: 30,

        borderRadius: 150,
        borderWidth: 5,
        backgroundColor: "#E28413",
        borderColor: "#C42847",

        justifyContent:'top',
        alignItems:'center',

        transform: [{ scaleX: 2 }],
        
      },

      aboutAppButton:{
        backgroundColor:'#C42847',
        height:24,
        width:124,
        borderRadius:35,
        transform: [{ scaleX: 0.5 }],

        marginTop:20,
        

        display:'flex',
        justifyContent:'center',
        alignItems:'center',

        flexDirection:'row',
        
        gap:5,

        
      },
      infoLogo:{
        width:16,
        height:16,
        
      },
      aboutAppText:{
        fontFamily:'Poppins SemiBold',
        fontSize:11,
        color:'white',
        
        
      }





})

export default LoginPage;
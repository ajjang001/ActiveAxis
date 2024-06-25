import React, { useState, useRef, useEffect} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, Modal} from "react-native";
import { Dropdown } from 'react-native-element-dropdown';
import {scale} from '../components/scale';

import LoginPresenter from '../presenter/LoginPresenter';

import {MessageDialog, LoadingDialog } from '../components/Modal';
import AsyncStorage from '@react-native-async-storage/async-storage';




const LoginPage = ({navigation})=>{ 
    
    // User Login Info
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginType, setLoginType] = useState('u');
    const [loginAccount, setLoginAccount] = useState(null);
    
    
    // Modal/Display Message
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [modalMsg, setModalMsg] = useState('');
    
    // to close dropdown
    const dropdownRef = useRef(null);

    const changeLoadingVisible = (b)=>{
        setIsLoading(b);
    }
    
    const checkUserSession = async () =>{
        //await AsyncStorage.removeItem('remember');
        changeLoadingVisible(true);
        try{
            await new LoginPresenter({updateLoginAcc: setLoginAccount, updateLoginType: setLoginType}).checkSession();

        }catch(e){
            changeModalVisible(true, e.message);
        }finally{
            changeLoadingVisible(false);
        }
    };

    // Check if User logged in
    useEffect(()=>{
        checkUserSession();
    },[]);

    const processLogin = async (email, password, loginType) => {
        changeLoadingVisible(true);
        try{
            await new LoginPresenter({updateLoginAcc: setLoginAccount}).processLogin(email, password, loginType);
        }catch(e){
            changeModalVisible(true, e.message);
        }finally{
            changeLoadingVisible(false);
        }

        
    };

    useEffect(()=>{
        if(loginAccount !== null){
            if(loginType === "u"){
                navigation.navigate('UserHomePage', {user:loginAccount});
            }
            if(loginType === "c"){
                navigation.navigate('CoachHomePage', {coach:loginAccount});
            }
            if(loginType === "a"){
                navigation.navigate('SystemAdminHomePage', {admin:loginAccount});
            }
        }
    },[loginAccount]);

    
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
                <Image style = {styles.logo} source={require('../../assets/activeaxislogo.png')} />
                <View style = {styles.redBox} />
            </View>
            
            <View style = {styles.middleContainer}>
                <Text style = {styles.title}>Login</Text>
                <TextInput style={styles.inputBox} onChangeText={setEmail} value = {email} placeholder='Enter your email'/>
                <TextInput secureTextEntry={true} style={styles.inputBox} onChangeText={setPassword} value = {password} placeholder='Enter your password'/>

                <TouchableOpacity style = {{marginLeft:'auto', marginRight:0}} onPress={()=>navigation.navigate('ResetPassword')}>
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
                <TouchableOpacity activeOpacity={.7} style={styles.loginButton} onPress={()=>processLogin(email, password, loginType)} >
                    <Text style={styles.loginButtonText}>LOGIN</Text>
                </TouchableOpacity>

                <Modal transparent={true} animationType='fade' visible={isModalVisible} nRequestClose={()=>changeModalVisible(false)}>
                    <MessageDialog
                    message = {modalMsg} 
                    changeModalVisible = {changeModalVisible} 
                    />
                </Modal>

                <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={()=>changeLoadingVisible(false)}>
                    <LoadingDialog />
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
                    <Text style={{fontFamily:'Inter Medium', fontSize:scale(14)}} >Don't have an account?  
                            <Text style = {{fontFamily:'Inter', fontWeight:'bold', fontSize:scale(14)}} onPress={()=>{navigation.navigate('Register')}}> Register Now</Text>
                    </Text>

                    <Text style={{fontFamily:'Inter Medium', paddingTop:15, fontSize:scale(14)}}>Want to join us as a coach? 
                        <Text style = {{fontFamily:'Inter', fontWeight:'bold', fontSize:scale(14)}} onPress = {() =>{navigation.navigate('CoachRegisterPage')}}> Click Here</Text>
                    </Text>

                    <TouchableOpacity activeOpacity={.7} style ={styles.aboutAppButton} onPress={()=>{navigation.navigate('AboutOurApp')}}>
                        <Image style = {styles.infoLogo} source={require('../../assets/info_logo.png')} />
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
        paddingRight:scale(10),
        width:scale(150),
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
        fontFamily:'Fuzzy Bubbles',
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
        width:'100%',
        bottom:scale(200),
        alignItems:'center',

        position:'absolute',
    },

    oval: {
        width: scale(300),
        height: scale(300),
        borderRadius: 150,
        borderWidth: 5,
        backgroundColor: "#E28413",
        borderColor: "#C42847",
        transform: [{ scaleX: 2 }],
        
        zIndex: 1,
        position:'absolute',
        
      },
      inTextOval:{
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        paddingTop:scale(40),

        zIndex: 2,
        position:'absolute',
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
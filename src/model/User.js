import {app, auth, db, storage} from '../../.expo/api/firebase';

import {signInWithEmailAndPassword} from 'firebase/auth';
import { getDoc, doc} from "firebase/firestore"; 
import AsyncStorage from '@react-native-async-storage/async-storage';

import Account from './Account';

class User extends Account{
    #isPremium;
    #weight;
    #height;
    #fitnessGoal;
    #fitnessLevel;
    #restInterval;


    constructor(){
        super();
    }

    get isPremium(){return this.#isPremium;}
    get weight(){return this.#weight;}
    get height(){return this.#height;}
    get fitnessGoal(){return this.#fitnessGoal;}
    get fitnessLevel(){return this.#fitnessLevel;}
    get restInterval(){return this.#restInterval;}
    
    set isPremium(isPremium){this.#isPremium = isPremium;}
    set weight(weight){this.#weight = weight;}
    set height(height){this.#height = height;}
    set fitnessGoal(fitnessGoal){this.#fitnessGoal = fitnessGoal;}
    set fitnessLevel(fitnessLevel){this.#fitnessLevel = fitnessLevel;}
    set restInterval(restInterval){this.#restInterval = restInterval;}

    async login(email, password){
        try{
            const authenticate = async (auth, email, password) =>{
                try{
                    const userCredential = await signInWithEmailAndPassword(auth, email, password);
                    return userCredential.user;
                }catch(e){
                    throw new Error('Incorrect email or password');
                } 
            }
    
            const user = await authenticate(auth, email, password);
            
            const q = doc(db, 'users', user.uid);
            const queryResult = await getDoc(q);
            
            if(queryResult.exists()){
                const data = queryResult.data();
                const ut = data.userType;
                if(ut === "u"){
                    const is = data.isSuspended;
                    if(is){
                        throw new Error('Your account is suspended\nPlease contact customer support.');
                    }else{
                        const u = new User();
                        u.username = data.username;
                        u.email = email;
                        u.profilePicture = data.profilePicture;
                        u.fullName = data.fullName;
                        u.gender = data.gender;
                        u.phoneNumber = data.phoneNumber;
                        u.isPremium = data.isPremium;
                        u.weight = data.weight;
                        u.height = data.height;
                        u.fitnessGoal = data.fitnessGoal;
                        u.fitnessLevel = data.fitnessLevel;
                        u.restInterval = data.restInterval;
                        console.log('Preparing to async storage');

                        await AsyncStorage.setItem('rememberEmail', email); 
                        
                        return u;
                    }

                }else{
                    throw new Error('Incorrect email or password');
                }
                
            }else{
                throw new Error('Incorrect email or password');
            }
        }catch(e){
            throw new Error('Incorrect email or password');
        }
    }
}

export default User;

/*
const processLogin = async (email, password, loginType) => {
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
                    changeLoadingVisible(true);

                    const login = async (auth, email, password) =>{
                        try{
                            const userCredential = await signInWithEmailAndPassword(auth, email, password);
                            return userCredential.user;
                        }catch(e){
                            throw new Error('Incorrect email or password');
                        }
                    }

                    const user = await login(auth, email, password);
                    const q = doc(db, 'users', user.uid);
                    const queryResult = await getDoc(q);
                    const ut = queryResult.data().userType
                    if(queryResult.exists() && loginType === ut){
                        changeLoadingVisible(false);
                        switch(ut){
                            case 'u':
                                await AsyncStorage.setItem('rememberEmail', email);
                                navigation.navigate('UserHomePage');
                                break;
                            case 'c':
                                await AsyncStorage.setItem('rememberEmail', email);
                                navigation.navigate('CoachHomePage');
                                break;
                            case 'a':
                                await AsyncStorage.removeItem('rememberEmail');
                                navigation.navigate('SystemAdminHomePage');
                                break;
                        }
                    }else{
                        throw new Error('Incorrect email or password');
                    }

                }catch(e){
                    changeLoadingVisible(false);
                    changeModalVisible(true, e.message);
                }
                 
        }
            
    };
*/
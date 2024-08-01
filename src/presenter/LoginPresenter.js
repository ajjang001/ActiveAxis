import User from '../model/User';
import Coach from '../model/Coach';
import SystemAdmin from '../model/SystemAdmin';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    initialize,
    requestPermission,
    readRecords,
  } from 'react-native-health-connect';


class LoginPresenter{
    constructor(view){
        this.view = view;
        this.loginAccount = null;
    }

    async checkHealthConnectExist(){
        try{
            const isInitialized = await initialize();

            if(!isInitialized){
                console.log('Please Install HealthConnect App to continue');
                throw new Error('Please Install HealthConnect App to continue');
            }else{
                console.log('HealthConnect App is installed');

                const permissions = [
                    {accessType: 'read', recordType: 'ActiveCaloriesBurned'},
                    {accessType: 'write', recordType: 'ActiveCaloriesBurned'},
                    {accessType: 'read', recordType: 'Distance'},
                    {accessType: 'read', recordType: 'Steps'},
                    {accessType: 'read', recordType: 'HeartRate'},
                    {accessType: 'read', recordType: 'TotalCaloriesBurned'},
                    {accessType: 'write', recordType: 'TotalCaloriesBurned'},
                    {accessType: 'read', recordType: 'Speed'},
                ];

                const permissionRequest = await requestPermission(permissions);

                for(let i = 0; i < permissions.length; i++){
                    if(permissionRequest){
                        if(permissionRequest[i].accessType === permissions[i].accessType && permissionRequest[i].recordType === permissions[i].recordType){
                            console.log('Permission granted for ' + permissions[i].recordType);
                        }else{
                            throw new Error('Some permissions are required to continue');
                        }
                    }else{
                        throw new Error('Some permissions are required to continue');
                    }
                }

            }
        }catch(e){
            console.log('Error occurred: ' + e.message);
            throw new Error('Please install HealthConnect and allow required permissions to continue\n*If issue still persists, please re-install the app and try again!');
        }
    }

    async processLogin(email, password, loginType){
        // To if email is in valid format
        const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

        if(email.trim() === '' || password.trim() === ''){
            // Email and Password field is empty
            throw new Error('Your username/password has not been entered');
        }else if(!pattern.test(email)){
            // Email is not in valid format
            throw new Error('Invalid email format');
        }else{
            try{
                // Call the model to login the user
                
                switch(loginType){
                    case "u":
                        await this.checkHealthConnectExist();
                        this.loginAccount = new User();
                        break;
                    case "c":
                        this.loginAccount = new Coach();
                        break;
                    case "a":
                        this.loginAccount = new SystemAdmin();
                        break;
                }
                
                const loginResult = await this.loginAccount.login(email, password);

                // Save the login result to AsyncStorage for persistence
                if(loginResult instanceof User || loginResult instanceof Coach){ 
                    await AsyncStorage.setItem('remember', JSON.stringify(loginResult) + '\n' + loginType);
                }
                
                // Update the view with the login result
                this.view.updateLoginAcc( loginResult );
            }catch(e){
                throw new Error(e.message);
            }
                

        }
    }

    async checkSession(){
        try{
            let j = await AsyncStorage.getItem('remember');
            
            if(j !== null){
                
                const type = j.split('\n')[1];
                j = j.split('\n')[0];

                let rememberData = JSON.parse(j);
                const e = rememberData._email;
                
                
                let remember;
                if(type === 'u'){
                    await this.checkHealthConnectExist();
                    remember = new User();
                }
                if (type === 'c'){
                    remember = new Coach();
                }

                if(remember){
                    const sessionResult = await remember.getInfo(e);
                    
                    this.view.updateLoginType( type );
                    this.view.updateLoginAcc( sessionResult );
                    
                    
                }

            }
        }catch(e){
            throw new Error('Error occurred: ' + e.message + '\nPlease try again or contact customer support');
        }
    }


}
export default LoginPresenter;
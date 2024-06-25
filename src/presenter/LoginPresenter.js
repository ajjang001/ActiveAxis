import User from '../model/User';
import Coach from '../model/Coach';
import SystemAdmin from '../model/SystemAdmin';

import AsyncStorage from '@react-native-async-storage/async-storage';


class LoginPresenter{
    constructor(view){
        this.view = view;
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
                let loginAccount;
                switch(loginType){
                    case "u":
                        loginAccount = new User();
                        break;
                    case "c":
                        loginAccount = new Coach();
                        break;
                    case "a":
                        loginAccount = new SystemAdmin();
                        break;
                }
                const loginResult = await loginAccount.login(email, password);

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
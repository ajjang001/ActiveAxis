import User from '../model/User';
import Coach from '../model/Coach';
import SystemAdmin from '../model/SystemAdmin';


class LoginPresenter{
    constructor(view){
        this.view = view;
    }

    async processLogin(email, password, loginType){
        // To if email is in valid format
        const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

        if(email.trim() === '' || password.trim() === ''){
            // Email and Password field is empty
            //changeModalVisible(true, 'Please enter your email and password');
            throw new Error('Your username/password has not been entered');
        }else if(!pattern.test(email)){
            // Email is not in valid format
            //changeModalVisible(true, 'Invalid email format');
            throw new Error('Invalid email format');
        }else{
            try{
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

                return await loginAccount.login(email, password);

            }catch(e){
                throw new Error(e.message);
            }
                

        }
    }


}

export default LoginPresenter;

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
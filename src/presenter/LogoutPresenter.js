import AsyncStorage from "@react-native-async-storage/async-storage";
import { signOut } from "firebase/auth";

import { auth } from "../../.expo/api/firebase";
import User from "../model/User";
import Coach from "../model/Coach";


class LogoutPresenter{
    constructor(view){
        this.view = view;
    }

    async logoutAccount (){
        try{
            const account = this.view.getAccount;

            // Remove the user from AsyncStorage
            if(account instanceof User || account instanceof Coach){ 
                await AsyncStorage.removeItem('remember');
            }

            // Sign out the user
            await signOut(auth);

            this.view.setAccount(null);
        }catch(error){
            throw new Error(error);
        }
    }
}

export default LogoutPresenter;
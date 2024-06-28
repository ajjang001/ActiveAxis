import AsyncStorage from "@react-native-async-storage/async-storage";
import User from "../model/User";
import Coach from "../model/Coach";

class LogoutPresenter{
    constructor(view){
        this.view = view;
    }

    async logout (){
        try{
            const account = this.view.getAccount; 
            // Remove the user from AsyncStorage
            if(account instanceof User || account instanceof Coach){ 
                await AsyncStorage.removeItem('remember');
            }


            this.view.setAccount(null);
        }catch(error){
            throw new Error(error);
        }
    }
}

export default LogoutPresenter;
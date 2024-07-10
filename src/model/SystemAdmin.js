import {app, auth, db, storage} from '../../.expo/api/firebase';

import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { getDoc, doc, getDocs, query, collection, where } from "firebase/firestore";

class SystemAdmin{
    #username;
    #email;
    
    constructor(){}

    get username(){return this.#username;}
    get email(){return this.#email;}

    set username(username){this.#username = username;}
    set email(email){this.#email = email;}

    async authenticate(email, password){
        try{
            // Call the parent class authenticate method
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential.user;
        }catch(e){
            // Handle error
            if (e.code === 'auth/invalid-credential') {
                throw new Error("Invalid email or password");
            } else {
                throw new Error("Error occurred: " + e.message + "\nPlease try again or contact customer support");
            }
        }
    }

    async login(email, password){
        try{
            // Call the parent class authenticate method
            const admin = await this.authenticate(email, password);

            // Check if admin data exists
            const q = doc(db, 'systemadmin', admin.uid);
            const queryResult = await getDoc(q);
            if(queryResult.exists()){
                // Get the data
                const data = queryResult.data();
                
                const a = new SystemAdmin();
                a.username = data.username;
                a.email = email;

                return a;
                   
            }else{
                throw new Error('Invalid email or password');
            }
        }catch(e){
            throw new Error(e.message);
        }
    }

    async resetPassword(email) {
        try {
            // Check if the email exists
            const q = query(collection(db, 'systemadmin'), where('email', '==', email));
            const queryResult = await getDocs(q);
            
            if (queryResult.empty == true) {
                throw new Error("There is no account associated with that email.");
            }
            else {
                await sendPasswordResetEmail(auth, email)
            }
        }
        catch (e) {
            throw new Error("Failed to reset password. Please try again or contact support.");
        }
    }

}

export default SystemAdmin;
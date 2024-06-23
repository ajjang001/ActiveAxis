import {app, auth, db, storage} from '../../.expo/api/firebase';

import { signInWithEmailAndPassword } from "firebase/auth";
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
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential.user;
        }catch(e){
            if (e.code === 'auth/invalid-credential') {
                throw new Error("Invalid email or password");
            } else {
                throw new Error("Error occurred: " + e.message + "\nPlease try again or contact customer support");
            }
        }
    }

    async login(email, password){
        try{
            const admin = await this.authenticate(email, password);
            const q = doc(db, 'systemadmin', admin.uid);
            const queryResult = await getDoc(q);
            
            if(queryResult.exists()){
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

    // async getInfo(){
    //     const q = query(collection(db, 'systemadmin'), where('email', '==', this.email));
    //     const queryResult = await getDocs(q);
    //     if(!queryResult.empty){
    //         const data = queryResult.docs[0].data();
                    
    //         this.username = data.username;
    //         this.email = data.email;
            
                    
    //     }

    // }

}

export default SystemAdmin;
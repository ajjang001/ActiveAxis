import {app, auth, db, storage} from '../../.expo/api/firebase';

import { getDoc, doc, getDocs, query, collection, where } from "firebase/firestore";

import Account from './Account';

class Coach extends Account{
    #isPending;
    #chargePerMonth;


    constructor(){
        super();
    }

    get isPending(){return this.#isPending;}
    get chargePerMonth(){return this.#chargePerMonth;}
    set isPending(isPending){this.#isPending = isPending;}
    set chargePerMonth(chargePerMonth){this.#chargePerMonth = chargePerMonth;}

    async login(email, password){
        try{
            // Call the parent class authenticate method
            const coach = await super.authenticate(email, password);
            
            // Check if coach is suspended or pending
            const q = doc(db, 'coach', coach.uid);
            const queryResult = await getDoc(q);
            
            if(queryResult.exists()){
                const data = queryResult.data();
                const is = data.isSuspended;
                const ip = data.isPending;
                
                if(ip){
                    // Account is pending
                    throw new Error('Your account is pending\nPlease wait for the admin to approve your account.');
                }else if (is){
                    // Account is suspended
                    throw new Error('Your account is suspended\nPlease contact customer support.');
                }else{
                    // Account is active
                    // Get the data
                    const c = new Coach();
                    c.username = data.username;
                    c.email = email;
                    c.profilePicture = data.profilePicture;
                    c.fullName = data.fullName;
                    c.dob = data.dob;
                    c.gender = data.gender;
                    c.phoneNumber = data.phoneNumber;
                    c.chargePerMonth = data.chargePerMonth;
                    
                    return c;
                }   
            }else{
                // Account does not exist
                throw new Error('Invalid email or password');
            }
        }catch(e){
            // Handle error
            throw new Error(e.message);
        }
    }

    async getInfo(email){
        // Check if coach data exists
        const q = query(collection(db, 'coach'), where('email', '==', email));
        const queryResult = await getDocs(q);
        if(!queryResult.empty){
            // Get the data
            const data = queryResult.docs[0].data();
            const c = new Coach();
                    
            c.username = data.username;
            c.email = data.email;
            c.profilePicture = data.profilePicture;
            c.fullName = data.fullName;
            c.dob = data.dob;
            c.gender = data.gender;
            c.phoneNumber = data.phoneNumber;
            c.chargePerMonth = data.chargePerMonth;

            return c;
                    
        }
    }
}

export default Coach;
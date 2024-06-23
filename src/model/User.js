import {app, auth, db, storage} from '../../.expo/api/firebase';

import { getDoc, doc, getDocs, query, collection, where } from "firebase/firestore";

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
            const user = await super.authenticate(email, password);
            
            const q = doc(db, 'user', user.uid);
            const queryResult = await getDoc(q);
            
            if(queryResult.exists()){
                const data = queryResult.data();
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

                    return u;
                }   
            }else{
                throw new Error('Invalid email or password');
            }
        }catch(e){
            throw new Error(e.message);
        }
    }

    async getInfo(email){
        const q = query(collection(db, 'user'), where('email', '==', email));
        const queryResult = await getDocs(q);
        if(!queryResult.empty){
            const data = queryResult.docs[0].data();
            const u = new User();

            u.username = data.username;
            u.email = data.email;
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

            return u;
        }
                
    }
}

export default User;
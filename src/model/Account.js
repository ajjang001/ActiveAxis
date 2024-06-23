import { signInWithEmailAndPassword } from "firebase/auth";
import {app, auth, db, storage} from '../../.expo/api/firebase';

class Account{
    _username;
    _email;
    _profilePicture;
    _fullName;
    _gender;
    _phoneNumber;

    constructor() {
        if(this.constructor === Account){
            throw new Error("Cannot instantiate abstract class");
        }
    }

    get username(){return this._username;}
    get email(){return this._email;}
    get profilePicture(){return this._profilePicture;}
    get fullName(){return this._fullName;}
    get gender(){return this._gender;}
    get phoneNumber(){return this._phoneNumber;}

    set username(username){this._username = username;}
    set email(email){this._email = email;}
    set profilePicture(profilePicture){this._profilePicture = profilePicture;}
    set fullName(fullName){this._fullName = fullName;}
    set gender(gender){this._gender = gender;}
    set phoneNumber(phoneNumber){this._phoneNumber = phoneNumber;}

    async authenticate(email, password){
        try{
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential.user;
        }catch(e){
            if (e.code === 'auth/user-disabled') {
                throw new Error("Your account is suspended\nPlease contact customer support.");
              } else if (e.code === 'auth/invalid-credential') {
                throw new Error("Invalid email or password");
              } else {
                throw new Error("Error occurred: " + e.message + "\nPlease try again or contact customer support");
              }
        }
    }
}

export default Account;
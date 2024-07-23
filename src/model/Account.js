import { signInWithEmailAndPassword } from "firebase/auth";
import { ref, getDownloadURL } from 'firebase/storage';
import { auth, storage} from '../firebase/firebaseConfig';


class Account{
    _accountID;
    _username;
    _email;
    _profilePicture;
    _fullName;
    _dob;
    _gender;
    _phoneNumber;
    _isSuspended;

    constructor() {
        if(this.constructor === Account){
            throw new Error("Cannot instantiate abstract class");
        }
        this._accountID = "";
        this._username = "";
        this._email = "";
        this._profilePicture = "";
        this._fullName = "";
        this._dob = "";
        this._gender="";
        this._phoneNumber = "";
        this._isSuspended = false;   
    }

    get accountID(){return this._accountID;}
    get username(){return this._username;}
    get email(){return this._email;}
    get profilePicture(){return this._profilePicture;}
    get fullName(){return this._fullName;}
    get dob(){return this._dob;}
    get gender(){return this._gender;}
    get phoneNumber(){return this._phoneNumber;}
    get isSuspended(){return this._isSuspended;}

    set accountID(accountID){this._accountID = accountID;}
    set username(username){this._username = username;}
    set email(email){this._email = email;}
    set profilePicture(profilePicture){this._profilePicture = profilePicture;}
    set fullName(fullName){this._fullName = fullName;}
    set dob(dob){this._dob = dob;}
    set gender(gender){this._gender = gender;}
    set phoneNumber(phoneNumber){this._phoneNumber = phoneNumber;}
    set isSuspended(isSuspended){this._isSuspended = isSuspended;}

    async authenticate(email, password){
        try{
            // Authenticate the user
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential.user;

        }catch(e){
            // Handle error
            if (e.code === 'auth/user-disabled') {
                throw new Error("Your account is suspended\nPlease contact customer support.");
              } else if (e.code === 'auth/invalid-credential') {
                throw new Error("Invalid email or password");
              } else {
                throw new Error("Error occurred: " + e.message + "\nPlease try again or contact customer support");
              }
        }
    }

    async getProfilePictureURL(){
        try{
            // Get the profile picture URL
            const ppRef = ref(storage, this.profilePicture);
            const ppURL = await getDownloadURL(ppRef);
            return ppURL;
        }catch(e){
            throw new Error(e.message);
        }
    }
}

export default Account;
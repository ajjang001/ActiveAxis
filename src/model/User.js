import { app, auth, db, storage } from '../../.expo/api/firebase';
import { getDoc, doc, getDocs, query, collection, where, setDoc, Timestamp, orderBy, startAt, endAt, updateDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth';
import axios from 'axios';
import Account from './Account';

class User extends Account{
    #hasMedical;
    #isPremium;
    #weight;
    #height;
    #fitnessGoal;
    #fitnessLevel;
    #restInterval;


    constructor() {
        super();
    }

    get hasMedical(){return this.#hasMedical;}
    get isPremium(){return this.#isPremium;}
    get weight(){return this.#weight;}
    get height(){return this.#height;}
    get fitnessGoal(){return this.#fitnessGoal;}
    get fitnessLevel(){return this.#fitnessLevel;}
    get restInterval(){return this.#restInterval;}
    
    set hasMedical(hasMedical){this.#hasMedical = hasMedical;}
    set isPremium(isPremium){this.#isPremium = isPremium;}
    set weight(weight){this.#weight = weight;}
    set height(height){this.#height = height;}
    set fitnessGoal(fitnessGoal){this.#fitnessGoal = fitnessGoal;}
    set fitnessLevel(fitnessLevel){this.#fitnessLevel = fitnessLevel;}
    set restInterval(restInterval){this.#restInterval = restInterval;}

    async login(email, password) {
        try {
            // Call the parent class authenticate method
            const user = await super.authenticate(email, password);

            // Check if user is suspended or email is verified
            const q = doc(db, 'user', user.uid);
            const queryResult = await getDoc(q);

            if (queryResult.exists()) {
                const data = queryResult.data();
                const is = data.isSuspended;
                const iv = user.emailVerified;

                if (!iv) {
                    //await sendEmailVerification(user, {
                    //    handleCodeInApp: true,
                    //    url: "https://activeaxis-c49ed.firebaseapp.com",
                    //});
                    
                    // Account is not verified
                    throw new Error('Please verify your email first\nCheck your email for the verification link.');
                } 
                else if (is){
                    // Account is suspended
                    throw new Error('Your account is suspended\nPlease contact customer support.');
                }
                else {
                    // Account is valid
                    const u = new User();
                    u.username = data.username;
                    u.email = email;
                    u.profilePicture = data.profilePicture;
                    u.profilePicture = await u.getProfilePictureURL();
                    u.fullName = data.fullName;
                    u.dob = data.dob;
                    u.gender = data.gender;
                    u.phoneNumber = data.phoneNumber;
                    u.hasMedical = data.hasMedical;
                    u.isPremium = data.isPremium;
                    u.weight = data.weight;
                    u.height = data.height;
                    u.fitnessGoal = data.fitnessGoal;
                    u.fitnessLevel = data.fitnessLevel;
                    u.restInterval = data.restInterval;

                    return u;
                }
            } else {
                // Account does not exist
                throw new Error('Invalid email or password');
            }
        } catch (e) {
            // Throw error message
            throw new Error(e.message);
        }
    }



    async getInfo(email) {
        // Get the user data from the database
        const q = query(collection(db, 'user'), where('email', '==', email));
        const queryResult = await getDocs(q);

        if (!queryResult.empty) {
            // Get the user data
            const data = queryResult.docs[0].data();

            const u = new User();
            u.username = data.username;
            u.email = data.email;
            u.profilePicture = data.profilePicture;
            u.profilePicture = await u.getProfilePictureURL();
            u.fullName = data.fullName;
            u.dob = data.dob;
            u.gender = data.gender;
            u.phoneNumber = data.phoneNumber;
            u.hasMedical = data.hasMedical;
            u.isPremium = data.isPremium;
            u.isSuspended = data.isSuspended;
            u.weight = data.weight;
            u.height = data.height;
            u.fitnessGoal = data.fitnessGoal;
            u.fitnessLevel = data.fitnessLevel;
            u.restInterval = data.restInterval;

            return u;
        }

    }

    async register(name, email, phone, password, gender, dob, weight, height, goal, level, medicalCheck) {
        try {
            // Create the user account in Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // Send email verification
            await sendEmailVerification(userCredential.user, {
                handleCodeInApp: true,
                url: "https://activeaxis-c49ed.firebaseapp.com",
            });

            // Generate username
            const nameArr = name.split(' ');
            const fname = nameArr[0].toLowerCase();
            let uname = "";
            for(let i = 1; i < nameArr.length; i++){
                uname += nameArr[i][0].toLowerCase();
            }
            uname += fname + "-";

            // get number
            const q = query(
                collection(db, 'user'),
                where("username", ">=", uname),
                where("username", "<", uname + "\uf8ff"),
                orderBy("username")
            );
            const querySnapshot = await getDocs(q);
            const result = [];
            querySnapshot.forEach((doc) => {
                result.push( doc.data().username );
            });
            if(result.length === 0){
                uname += "1";
            }else{
                for (let i = 1; i <= result.length; i++){
                    if (parseInt(result[i-1].split('-')[1]) !== i){
                        uname += i;
                        break;
                    }
                    if (i === result.length){
                        uname += result.length+1;
                    }
                }

            }
            
            // Create the user account in the firestore firestore database
            await setDoc(doc(db, "user", userCredential.user.uid), {
                dob : Timestamp.fromDate(new Date(dob)),
                email: email,
                fitnessGoal: goal,
                fitnessLevel: level,
                fullName: name,
                gender: gender,
                hasMedical: medicalCheck,
                height: height,
                isPremium: false,
                isSuspended: false,
                phoneNumber: phone,
                profilePicture: "user/default_pp.png",
                restInterval: 30,
                username: uname,
                weight: weight,
            });
            
        }
        catch (e) {
            // Throw error message
            if (e.code === 'auth/email-already-in-use') {
                throw new Error("The email provided has already been used. Please use another email.");
            }
            else if (e.code === 'auth/weak-password') {
                throw new Error("The password is too weak. Min 6 characters.");
            }
            else {
                throw new Error("Error occurred: " + e.message + "\nPlease try again or contact customer support.");
            }
        }
    }

    async resetPassword(email) {
        try {
            // Check if the email exists
            const q = query(collection(db, 'user'), where('email', '==', email));
            const queryResult = await getDocs(q);

            // Send password reset email
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

    async getUserList(filter) {
        try {
            // Get all users
            let q = null;
            if (filter === 'free') {
                q = query(collection(db, 'user'), where('isPremium', '==', false), orderBy('fullName'));
            }else if (filter === 'premium'){
                q = query(collection(db, 'user'), where('isPremium', '==', true), orderBy('fullName'));
            }else{
                q = query(collection(db, 'user'), orderBy('fullName'));
            }
            const queryResult = await getDocs(q);
            const users = [];

            for (const doc of queryResult.docs) {
                const data = doc.data();
                const u = new User();

                u.username = data.username;
                u.email = data.email;
                u.profilePicture = data.profilePicture;
                u.profilePicture = await u.getProfilePictureURL();
                u.fullName = data.fullName;
                u.dob = data.dob;
                u.gender = data.gender;
                u.phoneNumber = data.phoneNumber;
                u.hasMedical = data.hasMedical;
                u.isPremium = data.isPremium;
                u.isSuspended = data.isSuspended;
                u.weight = data.weight;
                u.height = data.height;
                u.fitnessGoal = data.fitnessGoal;
                u.fitnessLevel = data.fitnessLevel;
                u.restInterval = data.restInterval;



                users.push({ id: doc.id, user: u });

            }

            return users;
        } catch (e) {
            throw new Error(e.message);
        }
    }

    async search(search, filter) {
        try {
            // Search for users by name 
            console.log(search);
            console.log(filter);
            let q = null;
            if (search.trim() === '') {
                if (filter === 'free') {
                    q = query(collection(db, 'user'), where('isPremium', '==', false), orderBy('fullName'));
                }else if (filter === 'premium'){
                    q = query(collection(db, 'user'), where('isPremium', '==', true), orderBy('fullName'));
                }else{
                    q = query(collection(db, 'user'), orderBy('fullName'));
                }
            } else {

                if (filter === 'free') {
                    q = query(collection(db, 'user'), where('isPremium', '==', false), orderBy('fullName'), startAt(search), endAt(search + '\uf8ff'));
                }else if (filter === 'premium'){
                    q = query(collection(db, 'user'), where('isPremium', '==', true), orderBy('fullName'), startAt(search), endAt(search + '\uf8ff'));
                }else{
                    q = query(collection(db, 'user'), orderBy('fullName'), startAt(search), endAt(search + '\uf8ff'));
                }

                
            }

            const queryResult = await getDocs(q);
            const users = [];

            for (const doc of queryResult.docs) {
                const data = doc.data();
                const u = new User();

                u.username = data.username;
                u.email = data.email;
                u.profilePicture = data.profilePicture;
                u.profilePicture = await u.getProfilePictureURL();
                u.fullName = data.fullName;
                u.dob = data.dob;
                u.gender = data.gender;
                u.phoneNumber = data.phoneNumber;
                u.hasMedical = data.hasMedical;
                u.isPremium = data.isPremium;
                u.isSuspended = data.isSuspended;
                u.weight = data.weight;
                u.height = data.height;
                u.fitnessGoal = data.fitnessGoal;
                u.fitnessLevel = data.fitnessLevel;
                u.restInterval = data.restInterval;

                // Add user to the list
                users.push({ id: doc.id, user: u });
            }

            return users;


        } catch (e) {
            throw new Error(e.message);
        }
    }
    
    async suspend(userID) {
        try {
            // Suspend the user account
            const q = doc(db, 'user', userID);
            await updateDoc(q, { isSuspended: true });

            const res = await axios.post('http://10.93.19.181:3000/api/disable-account', { uid: userID });
            console.log(res.data.message);

        } catch (e) {
            throw new Error(e.message);
        }
    }

    async unsuspend(userID) {
        try {
            // Unsuspend the user account
            const q = doc(db, 'user', userID);
            await updateDoc(q, { isSuspended: false });

            const res = await axios.post('http://10.93.19.181:3000/api/enable-account', { uid: userID });
            console.log(res.data.message);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    async updatePassword(userID, newPassword) {
        try {
            // Send a request to the server to update the user's password in Firebase Auth
            const res = await axios.post('http://10.93.19.181:3000/api/update-password', { uid: userID, newPassword });
            console.log(res.data.message);
        } catch (e) {
            throw new Error(e.message);
        }
    }


}

export default User;
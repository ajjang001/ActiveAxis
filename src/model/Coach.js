import { app, auth, db, storage } from '../../.expo/api/firebase';

import { createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth';
import { getDoc, doc, getDocs, query, collection, where, setDoc, Timestamp, updateDoc, orderBy, startAt, endAt, deleteDoc  } from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import axios from 'axios';

import Account from './Account';

class Coach extends Account {
    #isPending;
    #chargePerMonth;
    #certificate;
    #id;
    #resume;


    constructor() {
        super();
    }

    get isPending() { return this.#isPending; }
    get chargePerMonth() { return this.#chargePerMonth; }
    get certificate() { return this.#certificate; }
    get id() { return this.#id; }
    get resume() { return this.#resume; }

    set isPending(isPending) { this.#isPending = isPending; }
    set chargePerMonth(chargePerMonth) { this.#chargePerMonth = chargePerMonth; }
    set certificate(certificate) { this.#certificate = certificate; }
    set id(id) { this.#id = id; }
    set resume(resume) { this.#resume = resume; }


    async login(email, password) {
        try {
            // Call the parent class authenticate method
            const coach = await super.authenticate(email, password);

            // Check if coach is suspended or pending
            const q = doc(db, 'coach', coach.uid);
            const queryResult = await getDoc(q);

            if (queryResult.exists()) {
                const data = queryResult.data();
                const is = data.isSuspended;
                const ip = data.isPending;
                const iv = coach.emailVerified;

                if (!iv) {
                    // Account is not verified
                    throw new Error('Please verify your email first\nCheck your email for the verification link.');
                }else if (ip) {
                    // Account is pending
                    throw new Error('Your account is pending\nPlease wait for the admin to approve your account.');
                } else if (is) {
                    // Account is suspended
                    throw new Error('Your account is suspended\nPlease contact customer support.');
                } else {
                    // Account is active
                    // Get the data
                    const c = new Coach();
                    c.username = data.username;
                    c.email = email;
                    c.profilePicture = data.profilePicture;
                    c.profilePicture = await c.getProfilePictureURL();
                    c.fullName = data.fullName;
                    c.dob = data.dob;
                    c.gender = data.gender;
                    c.phoneNumber = data.phoneNumber;
                    c.isPending = ip;
                    c.isSuspended = is;
                    c.chargePerMonth = data.chargePerMonth;
                    c.certificate = data.certificate;
                    c.id = data.id;
                    c.resume = data.resume;

                    return c;
                }
            } else {
                // Account does not exist
                throw new Error('Invalid email or password');
            }
        } catch (e) {
            // Handle error
            throw new Error(e.message);
        }
    }

    async getInfo(email) {
        // Check if coach data exists
        const q = query(collection(db, 'coach'), where('email', '==', email));
        const queryResult = await getDocs(q);
        if (!queryResult.empty) {
            // Get the data
            const data = queryResult.docs[0].data();
            const c = new Coach();

            c.username = data.username;
            c.email = data.email;
            c.profilePicture = data.profilePicture;
            c.profilePicture = await c.getProfilePictureURL();
            c.fullName = data.fullName;
            c.dob = data.dob;
            c.gender = data.gender;
            c.phoneNumber = data.phoneNumber;
            c.isPending = data.isPending;
            c.isSuspended = data.isSuspended;
            c.chargePerMonth = data.chargePerMonth;
            c.certificate = data.certificate;
            c.id = data.id;
            c.resume = data.resume;

            return c;

        }
    }

    async register(name, email, phone, password, gender, dob, chargePM, photo, resume, certificate, identification) {
        try {
            // Create the coach account in Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // Send email verification
            await sendEmailVerification(userCredential.user, {
                handleCodeInApp: true,
                url: "https://activeaxis-c49ed.firebaseapp.com",
            });

            // Convert URI to Blob
            const uriToBlob = (uri) => {
                return new Promise((resolve, reject) => {
                   const xhr = new XMLHttpRequest()
                   xhr.onload = function () {
                     // return the blob
                     resolve(xhr.response)
                   }
                   xhr.onerror = function () {
                     reject(new Error('uriToBlob failed'))
                   }
                   xhr.responseType = 'blob'
                   xhr.open('GET', uri, true)
               
                   xhr.send(null)})
                };

                // Upload file to Firebase Storage
            const uploadFile = async (file, folderPath) => {
                if (!file || !file.uri) throw new Error('File URI is invalid');

                const storageRef = ref(storage, folderPath + file.name);
                const blobFile = await uriToBlob(file.uri);
                try{
                    await uploadBytes(storageRef, blobFile);
                    return `${folderPath}${file.name}`;
                }catch(e){
                    throw new Error("Error occurred: " + e.message + "\nPlease try again or contact customer support.");
                    
                }

              };

            // Folder path
            const folderPath = `coach_registration/${email.split('@')[0]}/`;


            // Upload files to Firebase Storage
            const photoPath = await uploadFile(photo, folderPath);
            const resumePath = await uploadFile(resume, folderPath);
            const certificatePath = await uploadFile(certificate, folderPath);
            const idPath = await uploadFile(identification, folderPath);
            
            

            // Create the coach account in the firestore firestore database
            await setDoc(doc(db, "coach", userCredential.user.uid), {
                certificate: certificatePath,
                chargePerMonth: chargePM,
                dob: Timestamp.fromDate(new Date(dob)),
                email: email,
                fullName: name,
                gender: gender,
                isPending: true,
                isSuspended: false,
                phoneNumber: phone,
                profilePicture: photoPath,
                resume: resumePath,
                identification: idPath,
                username: null,
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
            const q = query(collection(db, 'coach'), where('email', '==', email));
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

    async getCoachList() {
        try {
            const q = query(collection(db, 'coach'), where('isPending', '==', false));
            const queryResult = await getDocs(q);
            const coaches = [];

            for (const doc of queryResult.docs){
                const data = doc.data();
                const c = new Coach();

                c.username = data.username;
                c.email = data.email;
                c.profilePicture = data.profilePicture;
                c.fullName = data.fullName;
                c.dob = data.dob;
                c.gender = data.gender;
                c.phoneNumber = data.phoneNumber;
                c.isPending = data.isPending;
                c.isSuspended = data.isSuspended;
                c.chargePerMonth = data.chargePerMonth;
                c.certificate = data.certificate;
                c.id = data.id;
                c.resume = data.resume;

                // Call the superclass method and wait for the result
                c.profilePicture = await c.getProfilePictureURL();

                coaches.push({id: doc.id, coach: c});

            }

            return coaches;
        } catch (e) {
            throw new Error(e.message);
        }
    }

    async search(search){
        try{
            
            let q = null;
            if(search.trim() === ''){
                q = query(collection(db, 'coach'), where('isPending', '==', false));
            }else{

                q = query(collection(db, 'coach'), where('isPending', '==', false), orderBy('fullName'), startAt(search), endAt(search + '\uf8ff'));
            }
            
            const queryResult = await getDocs(q);
            const coaches = [];

            for (const doc of queryResult.docs){
                const data = doc.data();
                const c = new Coach();
                c.username = data.username;
                c.email = data.email;
                c.profilePicture = data.profilePicture;
                c.fullName = data.fullName;
                c.dob = data.dob;
                c.gender = data.gender;
                c.phoneNumber = data.phoneNumber;
                c.isPending = data.isPending;
                c.isSuspended = data.isSuspended;
                c.chargePerMonth = data.chargePerMonth;
                c.certificate = data.certificate;
                c.id = data.id;
                c.resume = data.resume;

                // Call the superclass method and wait for the result
                c.profilePicture = await c.getProfilePictureURL();
                
                coaches.push({id: doc.id, coach: c});
    
                

            }
            
            return coaches;


        }catch(e){
            throw new Error(e.message);
        }
    }

    async suspend(coachID){
        try{
            const q = doc(db, 'coach', coachID);
            await updateDoc(q, {isSuspended: true});

            const uid = coachID;
            const res = await axios.post('http://10.33.246.244:3000/api/disable-user', { uid });
            console.log(res.data.message);
            
        }catch(e){
            throw new Error(e.message);
        }
    }

    async unsuspend(coachID){
        try{
            const q = doc(db, 'coach', coachID);
            await updateDoc(q, {isSuspended: false});

            const uid = coachID;
            const res = await axios.post('http://10.33.246.244:3000/api/enable-user', {uid});
            console.log(res.data.message);
        }catch(e){
            throw new Error(e.message);
        }
    }

    async delete(coachID){
        try{

        }catch(e){
            throw new Error(e.message);
        }
    }

    async getListOfCoachRegistration(){
        try{
            const q = query(collection(db, 'coach'), where('isPending', '==', true));
            const queryResult = await getDocs(q);
            const coaches = [];

            for (const doc of queryResult.docs){
                const data = doc.data();
                const c = new Coach();

                c.username = data.username;
                c.email = data.email;
                c.profilePicture = data.profilePicture;
                c.fullName = data.fullName;
                c.dob = data.dob;
                c.gender = data.gender;
                c.phoneNumber = data.phoneNumber;
                c.isPending = data.isPending;
                c.isSuspended = data.isSuspended;
                c.chargePerMonth = data.chargePerMonth;
                c.certificate = data.certificate;
                c.id = data.id;
                c.resume = data.resume;

                // Call the superclass method and wait for the result
                c.profilePicture = await c.getProfilePictureURL();

                coaches.push({id: doc.id, coach: c});

            }


            return coaches;


        }catch(e){
            throw new Error(e.message);
        }
    }

    

}

export default Coach;
import { app, auth, db, storage } from '../../.expo/api/firebase';
import { createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth';
import { getDoc, doc, getDocs, query, collection, where, setDoc, Timestamp, orderBy } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";

import Account from './Account';

class Coach extends Account {
    #isPending;
    #chargePerMonth;


    constructor() {
        super();
    }

    get isPending() { return this.#isPending; }
    get chargePerMonth() { return this.#chargePerMonth; }
    set isPending(isPending) { this.#isPending = isPending; }
    set chargePerMonth(chargePerMonth) { this.#chargePerMonth = chargePerMonth; }

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

                if (ip) {
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
                    c.fullName = data.fullName;
                    c.dob = data.dob;
                    c.gender = data.gender;
                    c.phoneNumber = data.phoneNumber;
                    c.chargePerMonth = data.chargePerMonth;

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
            c.fullName = data.fullName;
            c.dob = data.dob;
            c.gender = data.gender;
            c.phoneNumber = data.phoneNumber;
            c.chargePerMonth = data.chargePerMonth;

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

            // insert photo/file logic to firebase storage

            // get path of the photo/file that inserted to firebase storage

            // // Create the coach account in the firestore firestore database
            await setDoc(doc(db, "coach", userCredential.user.uid), {
                //certificate: ,
                chargePerMonth: chargePM,
                dob: Timestamp.fromDate(new Date(dob)),
                email: email,
                fullName: name,
                gender: gender,
                isPending: true,
                isSuspended: false,
                phoneNumber: phone,
                //profilePicture: ,
                //resume:,
                //identification:,
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

}

export default Coach;
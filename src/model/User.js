
import { db, auth } from '../firebase/firebaseConfig';
import { getDoc, doc, getDocs, query, collection, where, setDoc, Timestamp, orderBy, startAt, endAt, updateDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth';
import axios from 'axios';
import Account from './Account';

class User extends Account {
    #hasMedical;
    #weight;
    #height;
    #fitnessGoal;
    #fitnessLevel;
    #restInterval;
    #stepTarget;
    #calorieTarget;

    constructor() {
        super();
        this.#hasMedical = false;
        this.#weight = 0;
        this.#height = 0;
        this.#fitnessGoal = "";
        this.#fitnessLevel = "";
        this.#restInterval = 0;
        this.#stepTarget = 0;
        this.#calorieTarget = 0;
    }

    get hasMedical() { return this.#hasMedical; }
    get weight() { return this.#weight; }
    get height() { return this.#height; }
    get fitnessGoal() { return this.#fitnessGoal; }
    get fitnessLevel() { return this.#fitnessLevel; }
    get restInterval() { return this.#restInterval; }
    get stepTarget() { return this.#stepTarget}
    get calorieTarget() { return this.#calorieTarget}

    set hasMedical(hasMedical) { this.#hasMedical = hasMedical; }
    set weight(weight) { this.#weight = weight; }
    set height(height) { this.#height = height; }
    set fitnessGoal(fitnessGoal) { this.#fitnessGoal = fitnessGoal; }
    set fitnessLevel(fitnessLevel) { this.#fitnessLevel = fitnessLevel; }
    set restInterval(restInterval) { this.#restInterval = restInterval; }
    set stepTarget(stepTarget) { return this.#stepTarget = stepTarget; }
    set calorieTarget(calorieTarget) { return this.#calorieTarget = calorieTarget; } 

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
                else if (is) {
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
            u.isSuspended = data.isSuspended;
            u.weight = data.weight;
            u.height = data.height;
            u.fitnessGoal = data.fitnessGoal;
            u.fitnessLevel = data.fitnessLevel;
            u.restInterval = data.restInterval;

            return u;
        }

    }

    async register(name, email, phone, password, gender, dob, weight, height, goal, level, medicalCheck, intervalInSeconds) {
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
            for (let i = 1; i < nameArr.length; i++) {
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
                result.push(doc.data().username);
            });
            if (result.length === 0) {
                uname += "1";
            } else {
                for (let i = 1; i <= result.length; i++) {
                    if (parseInt(result[i - 1].split('-')[1]) !== i) {
                        uname += i;
                        break;
                    }
                    if (i === result.length) {
                        uname += result.length + 1;
                    }
                }

            }

            // Create the user account in the firestore firestore database
            await setDoc(doc(db, "user", userCredential.user.uid), {
                dob: Timestamp.fromDate(new Date(dob)),
                email: email,
                fitnessGoal: goal,
                fitnessLevel: level,
                fullName: name,
                gender: gender,
                hasMedical: medicalCheck,
                height: height,
                isSuspended: false,
                phoneNumber: phone,
                profilePicture: "user/default_pp.png",
                restInterval: intervalInSeconds,
                username: uname,
                weight: weight,

                //default value first
                stepTarget: 1500,
                calorieTarget: 150
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

    async getUserList() {
        try {
            // Get all users
            let q = query(collection(db, 'user'), orderBy('fullName'));

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

    async search(search) {
        try {
            // Search for users by name 
            console.log(search);
            let q = null;
            if (search.trim() === '') {
                q = query(collection(db, 'user'), orderBy('fullName'));
            } else {
                q = query(collection(db, 'user'), orderBy('fullName'), startAt(search), endAt(search + '\uf8ff'));
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

            const res = await axios.post('https://myapi-af5izkapwq-uc.a.run.app/account/disable-account', { uid: userID });
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

            const res = await axios.post('https://myapi-af5izkapwq-uc.a.run.app/account/enable-account', { uid: userID });
            console.log(res.data.message);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    async updatePassword(userID, newPassword) {
        try {
            // Send a request to the server to update the user's password in Firebase Auth
            const res = await axios.post('https://myapi-af5izkapwq-uc.a.run.app/account/update-password', { uid: userID, newPassword });
            console.log(res.data.message);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    async getListOfCoachee(coachEmail) {
        try {
            //get doc.id
            const coachQuery = query(collection(db, 'coach'), where('email', '==', coachEmail));
            const coachSnapshot = await getDocs(coachQuery);
            const coachDoc = coachSnapshot.docs[0];
            const coachID = coachDoc.id;

            // Get the current timestamp
            const currentTimestamp = new Date();

            const q = query(
                collection(db, 'coachinghistory'),
                where('coachID', '==', coachID),
                where('endDate', '>', currentTimestamp) //Indexed & to display only date later than current date (also checks for time)
            );
            const queryResult = await getDocs(q);
            const coachees = [];

            for (const coachingDoc of queryResult.docs) {
                const coachingData = coachingDoc.data();
                const userDocRef = doc(db, 'user', coachingData.userID);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const data = userDoc.data();
                    const u = new User();

                    u.username = data.username;
                    u.email = data.email;
                    u.profilePicture = data.profilePicture;
                    u.profilePicture = await u.getProfilePictureURL();
                    u.fullName = data.fullName;
                    u.dob = data.dob;
                    u.gender = data.gender;
                    u.phoneNumber = data.phoneNumber;

                    // Include startDate and endDate
                    const startDate = coachingData.startDate;
                    const endDate = coachingData.endDate;

                    coachees.push({
                        id: coachingDoc.id,
                        user: u,
                        startDate: startDate,
                        endDate: endDate
                    });
                }
            }

            return coachees;
        } catch (e) {
            throw new Error(e.message);
        }
    }

    async getCoacheeDetails(userEmail) {
        try {
            const q = query(collection(db, 'user'), where('email', '==', userEmail));
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
                u.isSuspended = data.isSuspended;
                u.weight = data.weight;
                u.height = data.height;
                u.fitnessGoal = data.fitnessGoal;
                u.fitnessLevel = data.fitnessLevel;
                u.restInterval = data.restInterval;
                u.stepTarget = data.stepTarget;
                u.calorieTarget = data.calorieTarget;

                users.push({ id: doc.id, user: u });

            }

            return users;
        } catch (e) {
            throw new Error(e.message);
        }

    }

    async updateAccountDetails(email, gender, phoneNumber, weight, height, fitnessGoal, fitnessLevel, hasMedical) {

        console.log({ email, gender, phoneNumber, weight, height, fitnessGoal, fitnessLevel, hasMedical });

        try {
            // Check if the email exists
            const q = query(collection(db, 'user'), where('email', '==', email));
            const queryResult = await getDocs(q);

            if (queryResult.empty) {
                throw new Error('User not found');
            }

            // Get the document ID of the first matching user (assuming email is unique)
            const userDocId = queryResult.docs[0].id;

            // Update the document with new values
            const userDocRef = doc(db, 'user', userDocId);
            await updateDoc(userDocRef, {
                gender,
                phoneNumber,
                weight,
                height,
                fitnessGoal,
                fitnessLevel,
                hasMedical
            });

            console.log('User details updated successfully');
        } catch (e) {
            console.error('Error updating user details:', e.message);
            throw new Error(e.message);
        }
    }

    async updateExerciseSettings(email, restInterval, stepTarget, calorieTarget) {
        try {
            // Check if the email exists
            const q = query(collection(db, 'user'), where('email', '==', email));
            const queryResult = await getDocs(q);

            if (queryResult.empty) {
                throw new Error('User not found');
            } 

            // Get the document ID of the first matching user (assuming email is unique)
            const userDocId = queryResult.docs[0].id;

            // Update the document with new values
            const userDocRef = doc(db, 'user', userDocId);
            await updateDoc(userDocRef, {
                restInterval,
                stepTarget,
                calorieTarget,
            });

            console.log('Exercise settings updated successfully');
        } catch (e) {
            console.error('Error updating exercise settings:', e.message);
            throw new Error(e.message);
        }
    }
}

export default User;

import { auth, db, storage } from '../firebase/firebaseConfig';
import { createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail} from 'firebase/auth';
import { getDoc, doc, getDocs, query, collection, where, setDoc, Timestamp, updateDoc, orderBy, startAt, endAt, deleteDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
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
        this.#isPending = false;
        this.#chargePerMonth = 0;
        this.#certificate = '';
        this.#id = '';
        this.#resume = '';
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
                } else if (ip) {
                    // Account is pending
                    throw new Error('Your account is pending\nPlease wait for the admin to approve your account.');
                } else if (is) {
                    // Account is suspended
                    throw new Error('Your account is suspended\nPlease contact customer support.');
                } else {
                    // Account is active
                    // Get the data
                    const c = new Coach();
                    c.accountID = coach.uid;
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
                    c.id = data.photoID;
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

            c.accountID = queryResult.docs[0].id;
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
            c.id = data.photoID;
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

                    xhr.send(null)
                })
            };

            // Upload file to Firebase Storage
            const uploadFile = async (file, folderPath) => {
                if (!file || !file.uri) throw new Error('File URI is invalid');

                const storageRef = ref(storage, folderPath + file.name);
                const blobFile = await uriToBlob(file.uri);
                try {
                    await uploadBytes(storageRef, blobFile);
                    return `${folderPath}${file.name}`;
                } catch (e) {
                    throw new Error("Error occurred: " + e.message + "\nPlease try again or contact customer support.");

                }

            };

            // Folder path
            const folderPath = `coach/${email.split('@')[0]}/`;


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
                photoID: idPath,
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

            for (const doc of queryResult.docs) {
                const data = doc.data();
                const c = new Coach();

                c.accountID = doc.id;
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
                c.id = data.photoID;
                c.resume = data.resume;



                coaches.push({ id: doc.id, coach: c });

            }

            return coaches;
        } catch (e) {
            throw new Error(e.message);
        }
    }

    async search(search) {
        try {

            let q = null;
            if (search.trim() === '') {
                q = query(collection(db, 'coach'), where('isPending', '==', false));
            } else {

                q = query(collection(db, 'coach'), where('isPending', '==', false), orderBy('fullName'), startAt(search), endAt(search + '\uf8ff'));
            }

            const queryResult = await getDocs(q);
            const coaches = [];

            for (const doc of queryResult.docs) {
                const data = doc.data();
                const c = new Coach();
                c.accountID = doc.id;
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
                c.id = data.photoID;
                c.resume = data.resume;



                coaches.push({ id: doc.id, coach: c });



            }

            return coaches;


        } catch (e) {
            throw new Error(e.message);
        }
    }

    async suspend(coachID) {
        try {
            const q = doc(db, 'coach', coachID);
            await updateDoc(q, { isSuspended: true });

            const res = await axios.post('https://myapi-af5izkapwq-uc.a.run.app/account/disable-account', { uid: coachID });
            console.log(res.data.message);

        } catch (e) {
            throw new Error(e.message);
        }
    }

    async unsuspend(coachID) {
        try {
            const q = doc(db, 'coach', coachID);
            await updateDoc(q, { isSuspended: false });

            const res = await axios.post('https://myapi-af5izkapwq-uc.a.run.app/account/enable-account', { uid: coachID });
            
            console.log(res.data.message);
        } catch (e) {
            throw new Error(e.message);
        }
    }


    async getListOfCoachRegistration() {
        try {
            const q = query(collection(db, 'coach'), where('isPending', '==', true));
            const queryResult = await getDocs(q);
            const coaches = [];

            for (const doc of queryResult.docs) {
                const data = doc.data();
                const c = new Coach();

                c.accountID = doc.id;
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
                c.id = data.photoID;
                c.resume = data.resume;



                coaches.push({ id: doc.id, coach: c });

            }


            return coaches;


        } catch (e) {
            throw new Error(e.message);
        }
    }

    async getDocuments() {
        try {
            const resumeRef = ref(storage, this.resume);
            const certRef = ref(storage, this.certificate);
            const idRef = ref(storage, this.id);

            const resumeURL = await getDownloadURL(resumeRef);
            const certURL = await getDownloadURL(certRef);
            const idURL = await getDownloadURL(idRef);

            return { resumeURL, certURL, idURL };
        } catch (e) {
            throw new Error(e.message);
        }
    }

    async approveCoach(coachID) {
        try {
            const fullnameArr = this.fullName.split(' ');
            let username = '';
            for (let i = 1; i < fullnameArr.length; i++) {
                username += fullnameArr[i].charAt(0).toLowerCase();
            }
            username += fullnameArr[0].toLowerCase() + '_';

            const q = query(collection(db, 'coach'), orderBy('username'), startAt(username), endAt(username + '\uf8ff'));
            const queryResult = await getDocs(q);

            if (queryResult.empty) {
                username += '1';
            } else {

                let i = 1;
                let isFound = false;
                for (const doc of queryResult.docs) {
                    const data = doc.data();
                    const checkName = username + i;
                    if (checkName !== data.username) {
                        username = checkName;
                        isFound = true;
                        break;
                    }
                    i++;
                }

                if (!isFound) {
                    username += i;
                }



            }

            const coachRef = doc(db, 'coach', coachID);
            await updateDoc(coachRef, {
                isPending: false,
                username: username
            });







        } catch (e) {
            throw new Error(e.message);
        }
    }

    async rejectCoach(coachID){
        try{
            // Delete storage
            // Delete resume
            const resumeRef = ref(storage, this.resume);
            await deleteObject(resumeRef);
            // Delete certificate
            const certRef = ref(storage, this.certificate);
            await deleteObject(certRef);
            // Delete identification
            const idRef = ref(storage, this.id);
            await deleteObject(idRef);
            // Delete profile picture
            const profileRef = ref(storage, this.profilePicture);
            await deleteObject(profileRef);

            // Delete account in authentication
            const res = await axios.post('https://myapi-af5izkapwq-uc.a.run.app/account/delete-account', { uid: coachID });
            console.log(res.data.message);
            


            // Delete document
            const coachRef = doc(db, 'coach', coachID);
            await deleteDoc(coachRef);
        }catch(e){
            throw new Error(e.message);
        }
    }

    async updateCoachAccountDetails(email, name, phoneNumber, tempEmail) {
        try {
            // Fetch the coach document from Firestore
            const q = query(collection(db, 'coach'), where('email', '==', email));
            const queryResult = await getDocs(q);

            if (queryResult.empty) {
                throw new Error('Coach not found.');
            }

            const coachDoc = queryResult.docs[0];
            const coachID = coachDoc.id;

            // Update the email in Firebase Authentication if it has changed
            if (email !== tempEmail) {
                const user = auth.currentUser;
                await updateEmail(user, tempEmail);
            }

            // Update the coach document in Firestore
            const coachRef = doc(db, 'coach', coachID);
            await updateDoc(coachRef, {
                email: tempEmail,
                fullName: name,
                phoneNumber: phoneNumber,
            });

            console.log('Coach account details updated successfully.');
        } catch (error) {
            console.error('Error updating coach account details:', error.message);
            throw new Error('Failed to update coach account details. Please try again.');
        }
    }
    async updatePassword(coachID, newPassword) {
        try {
            // Send a request to the server to update the user's password in Firebase Auth
            const res = await axios.post('https://myapi-af5izkapwq-uc.a.run.app/account/update-password', { uid: coachID, newPassword });
            console.log(res.data.message);
        } catch (e) {
            throw new Error(e.message || 'Failed to update password');
        }
    }
}

export default Coach;
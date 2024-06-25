import { app, auth, db, storage } from '../../.expo/api/firebase';
import { getDoc, doc, getDocs, query, collection, where, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth';
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
            const user = await super.authenticate(email, password);

            const q = doc(db, 'user', user.uid);
            const queryResult = await getDoc(q);

            if (queryResult.exists()) {
                const data = queryResult.data();
                const is = data.isSuspended;

                if (is) {
                    throw new Error('Your account is suspended\nPlease contact customer support.');
                } else {
                    const u = new User();
                    u.username = data.username;
                    u.email = email;
                    u.profilePicture = data.profilePicture;
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
                throw new Error('Invalid email or password');
            }
        } catch (e) {
            throw new Error(e.message);
        }
    }

    async getInfo(email) {
        const q = query(collection(db, 'user'), where('email', '==', email));
        const queryResult = await getDocs(q);
        if (!queryResult.empty) {
            const data = queryResult.docs[0].data();
            const u = new User();

            u.username = data.username;
            u.email = data.email;
            u.profilePicture = data.profilePicture;
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

    }

    async register(name, email, phone, password, gender, age, weight, height, goal, level, medicalCheck) {
        try {

            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            await sendEmailVerification(userCredential.user, {
                handleCodeInApp: true,
                url: "https://activeaxis-c49ed.firebaseapp.com",
            });
            await setDoc(doc(db, "user", userCredential.user.uid), {
                email: email,
                fullName: name,
                phoneNumber: phone,
                gender: gender,
                age: age,
                weight: weight,
                height: height,
                fitnessGoal: goal,
                level: level,
                hasMedical: medicalCheck,
                //username: username (regex)
            })

        }
        catch (e) {
            console.log(e);
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
            const q = query(collection(db, 'user'), where('email', '==', email));
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

export default User;
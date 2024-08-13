import { db } from '../firebase/firebaseConfig';
import { getDocs, collection, addDoc, updateDoc, doc, query, where } from 'firebase/firestore';

class FitnessGoals {
    _goalID;
    _goalName;

    constructor() {
        this._goalID = "";
        this._goalName = "";
    }

    get goalID() { return this._goalID; }
    get goalName() { return this._goalName; }

    set goalID(goalID) { this._goalID = goalID; }
    set goalName(goalName) { this._goalName = goalName; }

    async getFitnessGoals() {
        try {
            const goals = [];
            const querySnapshot = await getDocs(collection(db, 'fitnessgoal'));
            querySnapshot.forEach((doc) => {
                const d = doc.data();
                console.log('Fetched document:', d);  // Debug log
                const goal = new FitnessGoals();
                goal.goalID = d.goalID;
                goal.goalName = d.goalName;
                goals.push(goal);
            });
            return goals;
        } catch (error) {
            throw new Error(error);
        }
    }

    async addFitnessGoal(newGoalName) {
        try {
            // Fetch the current maximum goalID
            const querySnapshot = await getDocs(collection(db, 'fitnessgoal'));
            let maxID = 0;
            querySnapshot.forEach((doc) => {
                const d = doc.data();
                if (d.goalID > maxID) {
                    maxID = d.goalID;
                }
            });

            const newGoalID = maxID + 1;
            const newGoal = {
                goalID: newGoalID,
                goalName: newGoalName,
            };
            const docRef = await addDoc(collection(db, 'fitnessgoal'), newGoal);
            return newGoalID; // Return the new incremented ID
        } catch (error) {
            throw new Error(error);
        }
    }

    async updateFitnessGoal(goalID, updatedGoalName) {
        try {
            const querySnapshot = await getDocs(collection(db, 'fitnessgoal'));
            let docID = null;
            querySnapshot.forEach((doc) => {
                if (doc.data().goalID === goalID) {
                    docID = doc.id;
                }
            });
            if (docID) {
                const goalRef = doc(db, 'fitnessgoal', docID);
                await updateDoc(goalRef, { goalName: updatedGoalName });
            } else {
                throw new Error('Document with given goalID not found');
            }
        } catch (error) {
            throw new Error(error);
        }
    }

    async getFitnessGoalByID(goalID) {
        try{
            const q = query(collection(db, 'fitnessgoal'), where('goalID', '==', goalID));
            const querySnapshot = await getDocs(q);


            if(querySnapshot.size === 0){
                throw new Error('No data found');
            }else{
                // assume only return 1 document
                return querySnapshot.docs[0].data().goalName;
            }

        }catch(error){
            throw new Error(error);
        }
    }
}

export default FitnessGoals;

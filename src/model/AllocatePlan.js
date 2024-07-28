import { getDocs, getDoc, deleteDoc, collection, query, where, orderBy, addDoc, doc, updateDoc } from 'firebase/firestore';

import {db, auth, storage} from '../firebase/firebaseConfig';

class AllocatePlan{
    _allocationID;
    _fitnessPlanID;
    _sessionID;
    _startDate;
    _endDate;

    constructor(){
        this._allocationID = '';
        this._fitnessPlanID = '';
        this._sessionID = '';
        this._startDate = new Date();
        this._endDate = new Date();
    }

    get allocationID(){return this._allocationID;}
    get fitnessPlanID(){return this._fitnessPlanID;}
    get sessionID(){return this._sessionID;}
    get startDate(){return this._startDate;}
    get endDate(){return this._endDate;}

    set allocationID(value){this._allocationID = value;}
    set fitnessPlanID(value){this._fitnessPlanID = value;}
    set sessionID(value){this._sessionID = value;}
    set startDate(value){this._startDate = value;}
    set endDate(value){this._endDate = value;}

    async getAllocatePlanOnProgressDetails(sessionID){
        try{
            const q = query(collection(db, "allocateplan"), where("sessionID", "==", sessionID), where("startDate", "<", new Date()), where("endDate", ">", new Date()), orderBy("startDate", "desc"));
            const querySnapshot = await getDocs(q);

            let allocatePlan = [];
            for(const doc of querySnapshot.docs){
                const data = doc.data();

                const allocation = new AllocatePlan();
                allocation.allocationID = doc.id;
                allocation.fitnessPlanID = data.fitnessPlanID;
                allocation.sessionID = data.sessionID;
                allocation.startDate = data.startDate.toDate();
                allocation.endDate = data.endDate.toDate();

                allocatePlan.push(allocation);
            }

            return allocatePlan;

        }catch(error){
            throw new Error(error.message);
        }
    }

    async getAllocatePlanHistoryDetails(sessionID){
        try{
            // console.log(sessionID);
            const q = query(collection(db, "allocateplan"), where("sessionID", "==", sessionID), where("endDate", "<", new Date()), orderBy("startDate", "desc"));
            const querySnapshot = await getDocs(q);

            // console.log(querySnapshot.docs.length);

            let allocatePlan = [];
            for(const doc of querySnapshot.docs){
                const data = doc.data();

                const allocation = new AllocatePlan();
                allocation.allocationID = doc.id;
                allocation.fitnessPlanID = data.fitnessPlanID;
                allocation.sessionID = data.sessionID;
                allocation.startDate = data.startDate.toDate();
                allocation.endDate = data.endDate.toDate();

                allocatePlan.push(allocation);
            }

            return allocatePlan;
        }catch(error){
            throw new Error(error.message);
        }
    }
}

export default AllocatePlan;
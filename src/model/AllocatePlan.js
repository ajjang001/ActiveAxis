import { getDocs, getDoc, deleteDoc, collection, query, where, orderBy, addDoc, doc, updateDoc } from 'firebase/firestore';
import {db, auth, storage} from '../firebase/firebaseConfig';

class AllocatePlan{
    _allocationID;
    _fitnessPlanID;
    _sessionID;
    _startDate;
    _endDate;
    _isNewEndDate;
    _repetition;

    constructor(){
        this._allocationID = '';
        this._fitnessPlanID = '';
        this._sessionID = '';
        this._startDate = new Date();
        this._endDate = new Date();
        this._isNewEndDate = false;
        this._repetition = 1;
    }

    get allocationID(){return this._allocationID;}
    get fitnessPlanID(){return this._fitnessPlanID;}
    get sessionID(){return this._sessionID;}
    get startDate(){return this._startDate;}
    get endDate(){return this._endDate;}
    get isNewEndDate(){return this._isNewEndDate;}
    get repetition(){return this._repetition;}

    set allocationID(value){this._allocationID = value;}
    set fitnessPlanID(value){this._fitnessPlanID = value;}
    set sessionID(value){this._sessionID = value;}
    set startDate(value){this._startDate = value;}
    set endDate(value){this._endDate = value;}
    set isNewEndDate(value){this._isNewEndDate = value;}
    set repetition(value){this._repetition = value;}

    async getAllocatedPlans(sessionID){
        try{
            const q = query(collection(db, "allocateplan"), where("sessionID", "==", sessionID), where("startDate", ">", new Date()), where("endDate", ">", new Date()), orderBy("startDate", "asc"));
            const querySnapshot = await getDocs(q);

            let allocatePlan = [];
            for(const doc of querySnapshot.docs){
                const data = doc.data();

                const allocation = new AllocatePlan();
                allocation.allocationID = doc.id;
                allocation.fitnessPlanID = data.fitnessPlanID;
                allocation.sessionID = data.sessionID;
                allocation.startDate = data.startDate;
                allocation.endDate = data.endDate;
                allocation.isNewEndDate = data.isNewEndDate;
                allocation.repetition = data.repetition;

                allocatePlan.push(allocation);
            }

            return allocatePlan;

        }catch(error){
            throw new Error(error.message);
        }
    }

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
                allocation.startDate = data.startDate;
                allocation.endDate = data.endDate;
                allocation.isNewEndDate = data.isNewEndDate;
                allocation.repetition = data.repetition;

                allocatePlan.push(allocation);
            }

            return allocatePlan;

        }catch(error){
            throw new Error(error.message);
        }
    }

    async getAllocatePlanHistoryDetails(sessionID){
        try{
            const q = query(collection(db, "allocateplan"), where("sessionID", "==", sessionID), where("endDate", "<", new Date()), orderBy("startDate", "desc"));
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
                allocation.isNewEndDate = data.isNewEndDate;
                allocation.repetition = data.repetition;

                allocatePlan.push(allocation);
            }

            return allocatePlan;
        }catch(error){
            throw new Error(error.message);
        }
    }

    async addAllocatePlan(fitnessPlanID, sessionID, startDate, endDate){
        try{
            // check if there are any other plans that are overlapping
            // overlapping considered as the following:
            // 1. the start date of the new plan is between the start date and end date of the existing plan
            // 2. the end date of the new plan is between the start date and end date of the existing plan
            // 3. the start date and end date of the new plan is between the start date and end date of the existing plan

            // if not, write to database

            const q = query(collection(db, "allocateplan"), where("sessionID", "==", sessionID));
            const querySnapshot = await getDocs(q);

            for(const doc of querySnapshot.docs){
                const data = doc.data();
                const existingStartDate = data.startDate.toDate();
                const existingEndDate = data.endDate.toDate();

                if((startDate >= existingStartDate && startDate <= existingEndDate) || (endDate >= existingStartDate && endDate <= existingEndDate) || (startDate <= existingStartDate && endDate >= existingEndDate)){
                    throw new Error("There is an overlapping plan");
                }


            }

            await addDoc(collection(db, "allocateplan"), {
                fitnessPlanID: fitnessPlanID,
                sessionID: sessionID,
                startDate: startDate,
                endDate: endDate,
                isNewEndDate: false,
                repetition: 1
            });

        }catch(error){
            throw new Error(error.message);
        }
    }

    async deleteAllocatePlan(allocationID){
        try{
            await deleteDoc(doc(db, "allocateplan", allocationID));
        }catch(error){
            throw new Error(error.message);
        }
    }

    async updateAllocationPlan(allocationID, repetition, newEndDate){
        try{
            const docRef = doc(db, "allocateplan", allocationID);
            await updateDoc(docRef, {
                repetition: repetition,
                endDate: newEndDate,
                isNewEndDate: true
            });
        }catch(error){
            throw new Error(error.message);
        }
    }
}

export default AllocatePlan;
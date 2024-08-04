import { getDoc, doc, getDocs, query, collection, where, setDoc, Timestamp, updateDoc, orderBy, startAt, endAt, deleteDoc, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import {auth, db, storage} from '../firebase/firebaseConfig';


class Competition{
    _competitionID;
    _host_userID;
    _competitionType;
    _competitionName;
    _competitionDetails;
    _target;
    _startDate;
    _endDate;

    constructor(){
        this._competitionID = "";
        this._host_userID = "";
        this._competitionType = "";
        this._competitionName = "";
        this._competitionDetails = "";
        this._target = null;
        this._startDate = null;
        this._endDate = null;
    }

    get competitionID(){return this._competitionID;}
    get host_userID(){return this._host_userID;}
    get competitionType(){return this._competitionType;}
    get competitionName(){return this._competitionName;}
    get competitionDetails(){return this._competitionDetails;}
    get target(){return this._target;}
    get startDate(){return this._startDate;}
    get endDate(){return this._endDate;}

    
    set competitionID(value){this._competitionID = value;}
    set host_userID(value){this._host_userID = value;}
    set competitionType(value){this._competitionType = value;}
    set competitionName(value){this._competitionName = value;}
    set competitionDetails(value){this._competitionDetails = value;}
    set target(value){this._target = value;}
    set startDate(value){this._startDate = value;}
    set endDate(value){this._endDate = value;}

    async createCompetition(name, type, startDate, endDate, target, details, friendList, hostUserID){
        try{

            // Be there first
            let docRef;

            if(type === 1){
                docRef = await addDoc(collection(db, "competition"),{
                    host_userID: hostUserID,
                    competitionType: type,
                    competitionName: name,
                    competitionDetails: details,
                    target: target,
                    startDate: startDate,
                    endDate: endDate,
                });

                

            }

            // Steps Champion
            if (type === 2){
                docRef = await addDoc(collection(db, "competition"),{
                    host_userID: hostUserID,
                    competitionType: type,
                    competitionName: name,
                    competitionDetails: details,
                    target: null,
                    startDate: startDate,
                    endDate: endDate,
                });

            }

            for (const friend of friendList){
                await addDoc(collection(db, "competitioninvite"),{
                    competitionID: docRef.id,
                    participant_userID: friend,
                    status: "Pending"
                });
            }





        }catch(error){
            throw new Error (error);
        }
    }

}

export default Competition;
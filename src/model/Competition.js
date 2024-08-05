import { getDoc, doc, getDocs, query, collection, where, setDoc, Timestamp, updateDoc, orderBy, startAt, endAt, deleteDoc, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import {auth, db, storage} from '../firebase/firebaseConfig';
import CompetitionType from "./CompetitionType";


class Competition{
    _competitionID;
    _host_userID;
    _competitionType;
    _competitionName;
    _competitionDetails;
    _target;
    _startDate;
    _endDate;
    _participants;

    constructor(){
        this._competitionID = "";
        this._host_userID = "";
        this._competitionType = "";
        this._competitionName = "";
        this._competitionDetails = "";
        this._target = null;
        this._startDate = null;
        this._endDate = null;
        this._participants = [];
    }

    get competitionID(){return this._competitionID;}
    get host_userID(){return this._host_userID;}
    get competitionType(){return this._competitionType;}
    get competitionName(){return this._competitionName;}
    get competitionDetails(){return this._competitionDetails;}
    get target(){return this._target;}
    get startDate(){return this._startDate;}
    get endDate(){return this._endDate;}
    get participants(){return this._participants;}

    
    set competitionID(value){this._competitionID = value;}
    set host_userID(value){this._host_userID = value;}
    set competitionType(value){this._competitionType = value;}
    set competitionName(value){this._competitionName = value;}
    set competitionDetails(value){this._competitionDetails = value;}
    set target(value){this._target = value;}
    set startDate(value){this._startDate = value;}
    set endDate(value){this._endDate = value;}
    set participants(value){this._participants = value;}

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

    async getCompetitions(userID){
        try{
            const myCompetitions = [];
            const participatedCompetitions = [];

            // get my competitions
            const myCompetitionsQuery = query(collection(db, "competition"), where("host_userID", "==", userID));
            const myCompetitionsSnapshot = await getDocs(myCompetitionsQuery);

            for(const d of myCompetitionsSnapshot.docs){
                const data = d.data();
                const c = new Competition();
                c.competitionID = d.id;
                c.host_userID = data.host_userID;
                c.competitionType = await new CompetitionType().getCompetitionType(data.competitionType);
                c.competitionName = data.competitionName;
                c.competitionDetails = data.competitionDetails;
                c.target = data.target;
                c.startDate = data.startDate.toDate();
                c.endDate = data.endDate.toDate();

                // get participants
                const participantsQuery = query(collection(db, "competitioninvite"), where("competitionID", "==", c.competitionID));
                const participantsSnapshot = await getDocs(participantsQuery);

                for(const p of participantsSnapshot.docs){
                    if(p.data().status === "Accepted"){
                        c.participants.push(p.data().participant_userID);
                    }
                }

                myCompetitions.push(c);
            }


            // Get participated competitions
            const participatedCompetitionsQuery = query(collection(db, "competitioninvite"), where("participant_userID", "==", userID));
            const participatedCompetitionsSnapshot = await getDocs(participatedCompetitionsQuery);

            for( const d of participatedCompetitionsSnapshot.docs){
                const data = d.data();

                // Get competition details
                const competitionDoc = await getDoc(doc(db, "competition", data.competitionID));

                const c = new Competition();
                c.competitionID = competitionDoc.id;
                c.host_userID = competitionDoc.data().host_userID;
                c.competitionType = await new CompetitionType().getCompetitionType(competitionDoc.data().competitionType);
                c.competitionName = competitionDoc.data().competitionName;
                c.competitionDetails = competitionDoc.data().competitionDetails;
                c.target = competitionDoc.data().target;
                c.startDate = competitionDoc.data().startDate.toDate();
                c.endDate = competitionDoc.data().endDate.toDate();

                // get participants
                const participantsQuery = query(collection(db, "competitioninvite"), where("competitionID", "==", c.competitionID));
                const participantsSnapshot = await getDocs(participantsQuery);

                for(const p of participantsSnapshot.docs){
                    if(p.data().status === "Accepted"){
                        c.participants.push(p.data().participant_userID);
                    }
                }

                participatedCompetitions.push(c);

            }

            return {myCompetitions, participatedCompetitions};

        }catch(error){
            throw new Error(error);
        }
    }

}

export default Competition;
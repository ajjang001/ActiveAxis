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
                    competitionName: name,
                    competitionDetails: details,
                    competitionType: type,
                    target: target,
                    startDate: startDate,
                    endDate: endDate,
                });
            }

            // Steps Champion
            if (type === 2){
                docRef = await addDoc(collection(db, "competition"),{
                    host_userID: hostUserID,
                    competitionName: name,
                    competitionDetails: details,
                    competitionType: type,
                    target: null,
                    startDate: startDate,
                    endDate: endDate,
                });

            }


            for (const friend of friendList){
                await this.inviteFriend(docRef.id, friend);
            }

            


        }catch(error){
            throw new Error (error);
        }
    }

    async getCompetitions(userID){
        try{
            const myCompetitions = [];
            const participatedCompetitions = [];

            // get my competitions (ongoing)
            // sort by start date in descending order
            const myCompetitionsQuery = query(collection(db, "competition"), where("host_userID", "==", userID), where ("endDate", ">", Timestamp.now()) ,orderBy("startDate", "desc"));
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
                c.startDate = data.startDate;
                c.endDate = data.endDate;

                // get participants
                console.log(c.competitionID);
                const participantsQuery = query(collection(db, "competitioninvite"), where("competitionID", "==", c.competitionID));
                const participantsSnapshot = await getDocs(participantsQuery);

                for(const p of participantsSnapshot.docs){
                    console.log(p.id);

                    // push all accepted participants
                    if(p.data().status === "Accepted"){
                        c.participants.push(p.data().participant_userID);
                    }else{

                        // if not accepted, check if the event has started
                        // if has started, remove the remaining pendings
                        if(c.startDate.toDate() < new Date()){
                            console.log(p.id);
                            await deleteDoc(doc(db, "competitioninvite", p.id));
                        }


                    }

                    
                }

                // Add the host to participant
                c.participants.push(c.host_userID);

                // Check if competition has started
                // and delete competition if no participants
                if(c.startDate.toDate() < new Date() && c.participants.length <= 1){
                    await this.deleteCompetition(c.competitionID);
                    continue;
                }

                myCompetitions.push(c);
                console.log('\n');
            }


            // Get participated competitions
            const participatedCompetitionsQuery = query(collection(db, "competitioninvite"), where("participant_userID", "==", userID), where("status", "==", "Accepted"));
            const participatedCompetitionsSnapshot = await getDocs(participatedCompetitionsQuery);

            for( const d of participatedCompetitionsSnapshot.docs){
                const data = d.data();

                // Get competition details
                const competitionDoc = await getDoc(doc(db, "competition", data.competitionID));

                const endDate = competitionDoc.data().endDate.toDate();

                if(endDate < new Date()){
                    continue;
                }


                const c = new Competition();
                c.competitionID = competitionDoc.id;
                c.host_userID = competitionDoc.data().host_userID;
                c.competitionType = await new CompetitionType().getCompetitionType(competitionDoc.data().competitionType);
                c.competitionName = competitionDoc.data().competitionName;
                c.competitionDetails = competitionDoc.data().competitionDetails;
                c.target = competitionDoc.data().target;
                c.startDate = competitionDoc.data().startDate;
                c.endDate = competitionDoc.data().endDate;

                // get participants
                const participantsQuery = query(collection(db, "competitioninvite"), where("competitionID", "==", c.competitionID));
                const participantsSnapshot = await getDocs(participantsQuery);

                for(const p of participantsSnapshot.docs){
                    if(p.data().status === "Accepted"){
                        c.participants.push(p.data().participant_userID);
                    }
                }

                // Add the host to participant
                c.participants.push(c.host_userID);

                participatedCompetitions.push(c);

            }

            return {myCompetitions, participatedCompetitions};

        }catch(error){
            throw new Error(error);
        }
    }

    async deleteCompetition(competitionID){
        try{
            // delete competition in competition collection
            await deleteDoc(doc(db, "competition", competitionID));

            // delete the existing invites
            const inviteQuery = query(collection(db, "competitioninvite"), where("competitionID", "==", competitionID));
            const inviteSnapshot = await getDocs(inviteQuery);

            for(const d of inviteSnapshot.docs){
                await deleteDoc(doc(db, "competitioninvite", d.id));
            }


        }catch(error){
            throw new Error(error);
        }
    }


    async cancelInvite(competitionID, userID){
        try{
            const inviteQuery = query(collection(db, "competitioninvite"), where("competitionID", "==", competitionID), where("participant_userID", "==", userID));
            const inviteSnapshot = await getDocs(inviteQuery);

            for(const d of inviteSnapshot.docs){
                await deleteDoc(doc(db, "competitioninvite", d.id));
            }

        }catch(error){
            throw new Error(error);
        }
    }

    async inviteFriend(competitionID, userID){
        try{

            await addDoc(collection(db, "competitioninvite"),{
                competitionID: competitionID,
                participant_userID: userID,
                status: "Pending"
            });

        }catch(error){
            throw new Error(error);
        }
    }

    async getPendingInvites(competitionID){
        try{
            const pendingInvites = [];

            const inviteQuery = query(collection(db, "competitioninvite"), where("competitionID", "==", competitionID), where("status", "==", "Pending"));
            const inviteSnapshot = await getDocs(inviteQuery);

            for(const d of inviteSnapshot.docs){
                pendingInvites.push(d.data());
            }

            return pendingInvites;

        }catch(error){
            throw new Error(error);
        }
    }

    async getMyPendingInvites(userID){
        try{
            const myInvites = [];

            const q = query(collection(db, "competitioninvite"), where("participant_userID", "==", userID), where("status", "==", "Pending"));
            const s = await getDocs(q);

            // remove all pending invites that has already started
            for(const d of s.docs){
                const data = d.data();

                const docRef = await getDoc(doc(db, "competition", data.competitionID));
                const endDate = docRef.data().endDate.toDate();

                if(endDate < new Date()){
                    await deleteDoc(doc(db, "competitioninvite", d.id));
                }
            }

            for(const d of s.docs){
                const data = d.data();

                const docRef = await getDoc(doc(db, "competition", data.competitionID));
                
                const c = new Competition();
                c.competitionID = docRef.id;
                c.host_userID = docRef.data().host_userID;
                c.competitionType = await new CompetitionType().getCompetitionType(docRef.data().competitionType);
                c.competitionName = docRef.data().competitionName;
                c.competitionDetails = docRef.data().competitionDetails;
                c.target = docRef.data().target;
                c.startDate = docRef.data().startDate;
                c.endDate = docRef.data().endDate;

                // get participants
                const participantsQuery = query(collection(db, "competitioninvite"), where("competitionID", "==", c.competitionID));
                const participantsSnapshot = await getDocs(participantsQuery);

                for(const p of participantsSnapshot.docs){
                    if(p.data().status === "Accepted"){
                        c.participants.push(p.data().participant_userID);
                    }
                }

                // Add the host to participant
                c.participants.push(c.host_userID);

                myInvites.push(c); 
            }

            return myInvites;
        }catch(error){
            throw new Error(error);
        }
    }

}

export default Competition;
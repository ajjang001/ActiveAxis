import { getDoc, doc, getDocs, query, collection, where, setDoc, Timestamp, updateDoc, orderBy, startAt, endAt, deleteDoc, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import {auth, db, storage} from '../firebase/firebaseConfig';
import { initialize, requestPermission, readRecords } from 'react-native-health-connect';
import User from "./User";


class CompetitionLeaderboard{
    _participant;
    _competition;
    _userProgress;

    constructor(){
        this._participant = null;
        this._competition = null;
        this._userProgress = 0;
    }

    get participant(){ return this._participant;}
    get competition(){ return this._competition;}
    get userProgress(){ return this._userProgress;}

    set participant(participant){ this._participant = participant;}
    set competition(competition){ this._competition = competition;}
    set userProgress(userProgress){ this._userProgress = userProgress;}


    async initializeLeaderboard(){
        try{
            // find all competitions that has started
            const q1 = query(collection(db, "competition"), where("startDate", "<=", Timestamp.now()), where("endDate", ">=", Timestamp.now()));
            const qs1 = await getDocs(q1);

            for(const doc of qs1.docs){
                // find all participants in the competition
                const q2 = query(collection(db, "competitioninvite"), where("competitionID", "==", doc.id), where("status", "==", "Accepted"));
                const qs2 = await getDocs(q2);

                // get number of accepted users
                const numAcceptedUsers = qs2.docs.length;

                // if none, dont write to leaderboard and ignore this competition
                if(numAcceptedUsers == 0){
                    continue;
                }

                // the the number of users in the leaderboard
                const q3 = query(collection(db, "competitionleaderboard"), where("competitionID", "==", doc.id));
                const qs3 = await getDocs(q3);
                const numUsersInLeaderboard = qs3.docs.length;
                

                // if the number of users in the leaderboard is less than the number of accepted users
                // then add the remaining users to the leaderboard
                if(numUsersInLeaderboard < numAcceptedUsers){
                    for(const doc2 of qs2.docs){
                        const q4 = query(collection(db, "competitionleaderboard"), where("participant_userID", "==", doc2.data().participant_userID), where("competitionID", "==", doc.id));
                        const qs4 = await getDocs(q4);

                        if(qs4.docs.length == 0){
                            await addDoc(collection(db, 'competitionleaderboard'), {
                                participant_userID: doc2.data().participant_userID,
                                competitionID: doc.id,
                                userProgress: 0
                            });
                        }
                    }
                }

                // add the host into leaderboard if not exists
                const q5 = query(collection(db, "competitionleaderboard"), where("participant_userID", "==", doc.data().host_userID), where("competitionID", "==", doc.id));
                const qs5 = await getDocs(q5);

                if(qs5.docs.length == 0){
                    await addDoc(collection(db, 'competitionleaderboard'), {
                        participant_userID: doc.data().host_userID,
                        competitionID: doc.id,
                        userProgress: 0
                    });
                }
            }
        }catch(error){
            throw new Error(error);
        }
    }

    async updateLeaderboard(userID){
        try{

            await this.initializeLeaderboard();

            // check if user hosted a competition
            // and it has started
            const q0 = query(collection(db, "competition"), where("host_userID", "==", userID), where("startDate", "<=", Timestamp.now()), where("endDate", ">=", Timestamp.now()));
            const qs0 = await getDocs(q0);

            // if have then update leaderboard
            for (const d of qs0.docs){
                const q1 = query(collection(db, "competitionleaderboard"), where("participant_userID", "==", userID), where("competitionID", "==", d.id));
                const qs1 = await getDocs(q1);

                // get user current step
                const isInitialized = await initialize();
                let steps = 0;
                if (!isInitialized) {
                    throw new Error('Failed to initialize Health Connect');
                }else{
                    const timeRangeFilter = {
                        operator: 'between',
                        startTime: new Date(d.data().startDate.toDate()).toISOString(),
                        endTime: new Date(d.data().endDate.toDate()).toISOString(),
                    }
                    // Reading steps record
                    const stepsRecords = await readRecords('Steps', { timeRangeFilter });
                    
                    steps = stepsRecords.length === 0 ? 0 : stepsRecords.reduce((acc, record) => acc + record.count, 0);
                }

                // if exists then update and assume there is only 1 entry each user in each competition
                // otherwise add new entry
                if(qs1.docs.length > 0){
                    await updateDoc(qs1.docs[0].ref, {
                        userProgress: steps
                    });

                console.log('updated ' + d.data().competitionName + ' ' + steps);
                }else{
                    await addDoc(collection(db, 'competitionleaderboard'), {
                        participant_userID: userID,
                        competitionID: d.id,
                        userProgress: steps
                    });

                    console.log('added ' + d.data().competitionName + ' ' + steps);
                }
            }
            
            // check all accepted invites
            const q1 = query(collection(db, "competitioninvite"), where("participant_userID", "==", userID), where("status", "==", "Accepted"));
            const qs1 = await getDocs(q1);


            for(const d of qs1.docs){
                
                // check if competition has started
                const competitionID = d.data().competitionID;
                const qs2 = await getDoc(doc(db, "competition", competitionID));

                if(qs2.data().startDate.toDate() <= new Date() && qs2.data().endDate.toDate() >= new Date()){
                    // get user current step
                    const isInitialized = await initialize();
                    let steps = 0;
                    if (!isInitialized) {
                        throw new Error('Failed to initialize Health Connect');
                    }else{
                        const timeRangeFilter = {
                            operator: 'between',
                            startTime: new Date(qs2.data().startDate.toDate()).toISOString(),
                            endTime: new Date(qs2.data().endDate.toDate()).toISOString(),
                        }
                        // Reading steps record
                        const stepsRecords = await readRecords('Steps', { timeRangeFilter });
                        
                        steps = stepsRecords.length === 0 ? 0 : stepsRecords.reduce((acc, record) => acc + record.count, 0);
                    }

                    // check if user is already in leaderboard
                    const q3 = query(collection(db, "competitionleaderboard"), where("participant_userID", "==", userID), where("competitionID", "==", competitionID));
                    const qs3 = await getDocs(q3);

                    if(qs3.docs.length > 0){
                        await updateDoc(qs3.docs[0].ref, {
                            userProgress: steps
                        });

                        console.log('updated ' + qs2.data().competitionName + ' ' + steps);
                    }else{
                        await addDoc(collection(db, 'competitionleaderboard'), {
                            participant_userID: userID,
                            competitionID: competitionID,
                            userProgress: steps
                        });

                        console.log('added ' + qs2.data().competitionName + ' ' + steps);
                    }
                }
                
            }


            

        }catch(error){
            throw new Error(error);
        }
    }


    async getLeaderboard(competitionID){
        try{
            const q = query(collection(db, "competitionleaderboard"), where("competitionID", "==", competitionID), orderBy("userProgress", "desc"));
            const qs = await getDocs(q);

            const leaderboard = [];

            for(const d of qs.docs){
                const l = new CompetitionLeaderboard();

                // get user information
                const userDoc = await getDoc(doc(db, "user", d.data().participant_userID));

                const u = new User();
                u.accountID = userDoc.id;
                u.profilePicture = userDoc.data().profilePicture;
                u.profilePicture = await u.getProfilePictureURL();
                u.fullName = userDoc.data().fullName;

                l.participant = u;
                l.competition = competitionID;
                l.userProgress = d.data().userProgress == 0 ? '--' : d.data().userProgress;

                leaderboard.push(l);
            }



            return leaderboard;

        }catch(error){
            throw new Error(error);
        }
    }

    async getCompetitionProgress(userID, competitionID){
        try{

            const q = query(collection(db, "competitionleaderboard"), where("participant_userID", "==", userID), where("competitionID", "==", competitionID));
            const qs = await getDocs(q);

            if(qs.docs.length == 0){
                return 0;
            }else{
                return qs.docs[0].data().userProgress;
            }

        }
        catch(error){
            throw new Error(error);
        }
    }



}

export default CompetitionLeaderboard;
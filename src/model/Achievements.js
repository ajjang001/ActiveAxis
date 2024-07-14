import CompetitionType from "./CompetitionType";
import { db, storage } from '../firebase/firebaseConfig';
import { getDocs, getDoc, deleteDoc, collection, query, where, orderBy, addDoc, doc } from 'firebase/firestore';

import { ref, getDownloadURL, uploadBytes, deleteObject } from 'firebase/storage';



class Achievements{
    _achievementID;
    _achievementName;
    _achievementPicture;
    _competitionType;
    _description;
    _maxProgress;

    constructor () {}

    get achievementID() {return this._achievementID;}
    get achievementName() {return this._achievementName;}
    get achievementPicture() {return this._achievementPicture;}
    get competitionType() {return this._competitionType;}
    get description() {return this._description;}
    get maxProgress() {return this._maxProgress;}

    set achievementID(achievementID) {this._achievementID = achievementID;}
    set achievementName(achievementName) {this._achievementName = achievementName;}
    set achievementPicture(achievementPicture) {this._achievementPicture = achievementPicture;}
    set competitionType(competitionType) {this._competitionType = competitionType;}
    set description(description) {this._description = description;}
    set maxProgress(maxProgress) {this._maxProgress = maxProgress;}

    async getURL(r){
        try{
            // Get the profile picture URL
            const ppRef = ref(storage, r);
            const ppURL = await getDownloadURL(ppRef);
            return ppURL;
        }catch(e){
            throw new Error(e.message);
        }
    }

    async getAchievement(achievementID){
        try{
            // Get the achievement details
            const docRef = doc(db, "achievements", achievementID);
            const docSnap = await getDoc(docRef);


            if (!docSnap.empty) {
                // Get the data
                const d = docSnap.data();
                const a = new Achievements();

                a.achievementID = docSnap.id;
                a.achievementName = d.achievementName;
                a.achievementPicture = await this.getURL(d.achievementPicture);
                a.competitionType = await new CompetitionType().getCompetitionType(d.competitionTypeID);
                a.description = d.description;
                a.maxProgress = d.maxProgress;


                return a;
            }else{
                return null;
            }
            
        }catch(e){
            throw new Error(e.message);
        }
    }


    async getListOfAchievements() {
        try {
            const types = await new CompetitionType().getCompetitionTypes();
            let achArray = [];
    
            // Get the achievements for each competition type
            for (const type of types) {
                const q = query(collection(db, "achievements"),  where("competitionTypeID", "==", type.competitionTypeID), orderBy("maxProgress", 'asc'));
                const querySnapshot = await getDocs(q);
    
                let dataArr = [];
    
                const dataPromises = querySnapshot.docs.map(async (doc) => {
                    const d = doc.data();
                    const a = new Achievements();
                    
                    a.achievementID = doc.id;
                    a.achievementName = d.achievementName;
                    a.achievementPicture = await this.getURL(d.achievementPicture);
                    a.competitionType = type.competitionTypeName;
                    a.description = d.description;
                    a.maxProgress = d.maxProgress;
                    
                    dataArr.push(a);
                });
    
                await Promise.all(dataPromises); 

                // Sort the data array
                dataArr.sort((a, b) => a.maxProgress - b.maxProgress); 

                // add to achArray
                achArray.push({ id: type.competitionTypeID, type: type.competitionTypeName, data: dataArr });
            }
    
            return achArray;
        } catch (e) {
            throw new Error(e);
        }
    }

    async createAchievement(typeID, name, description, target, photo){
        try{
            const typeName = await new CompetitionType().getCompetitionType(typeID);

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

            const folderPath = `achievements/${
                (typeName === 'Competitions Won' ? 'Competitions' : typeName)
            }/`;

            const photoPath = await uploadFile(photo, folderPath);

            // Add to database
            await addDoc(collection(db, 'achievements'), {
                achievementName: name,
                achievementPicture: photoPath,
                description: description,
                competitionTypeID: typeID,
                maxProgress: target
            });

        }
        catch(error){
            throw new Error(error);
        }
    }

    async deleteAchievement(){
        try{
            // Delete from achievement table
            const docRef = doc(db, "achievements", this.achievementID);
            await deleteDoc(docRef);

            // Delete from the storage
            const ppRef = ref(storage, this.achievementPicture);
            await deleteObject(ppRef);

            // Delete from achievement obtained table
            const q = query(collection(db, "achievementsobtained"), where("achievementID", "==", this.achievementID));
            const querySnapshot = await getDocs(q);
            

            querySnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
            });

            

        }catch(e){
            throw new Error(e.message);
        }
    }
    
    

    


}

export default Achievements;
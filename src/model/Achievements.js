import ExerciseType from "./ExerciseType";
import { app, auth, db, storage } from '../../.expo/api/firebase.js';
import { getDocs, collection, query, where, orderBy } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';

class Achievements{
    _achievementName;
    _achievementPicture;
    _exerciseType;
    _description;
    _maxProgress;

    constructor () {}

    get achievementName() {return this._achievementName;}
    get achievementPicture() {return this._achievementPicture;}
    get exerciseType() {return this._exerciseType;}
    get description() {return this._description;}
    get maxProgress() {return this._maxProgress;}

    set achievementName(achievementName) {this._achievementName = achievementName;}
    set achievementPicture(achievementPicture) {this._achievementPicture = achievementPicture;}
    set exerciseType(exerciseType) {this._exerciseType = exerciseType;}
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


    async getListOfAchievements() {
        try {
            const types = await new ExerciseType().getExerciseType();
            let achArray = [];
    
            // Use for loop instead of map for better async/await handling
            for (const type of types) {
                const q = query(collection(db, "achievements"),  where("exerciseTypeID", "==", type.exerciseTypeID), orderBy("maxProgress", 'asc'));
                const querySnapshot = await getDocs(q);
    
                let dataArr = [];
    
                const dataPromises = querySnapshot.docs.map(async (doc) => {
                    const d = doc.data();
                    const a = new Achievements();
                    
                    a.achievementName = d.achievementName;
                    a.achievementPicture = await this.getURL(d.achievementPicture);
                    a.exerciseType = type.exerciseTypeName;
                    a.description = d.description;
                    a.maxProgress = d.maxProgress;
                    
                    dataArr.push(a);
                });
    
                await Promise.all(dataPromises); 

                dataArr.sort((a, b) => a.maxProgress - b.maxProgress); 

                achArray.push({ id: type.exerciseTypeID, type: type.exerciseTypeName, data: dataArr });
            }
    
            return achArray;
        } catch (e) {
            throw new Error(e);
        }
    }
    
    

    


}

export default Achievements;
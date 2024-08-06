import AchievementType from "../model/AchievementType";

class ManageAchievementTypePresenter{
    constructor(view){
        this.view = view;
        this.achievementType = new AchievementType();
    }

    async getAchievementTypes(){
        try{
            const achievementTypes = await this.achievementType.getAchievementTypes();
            this.view.displayAchievementTypes(achievementTypes);
        }catch(e){
            throw new Error(e);
        }
    }

    async addAchievementType(newTypeName, achievementTypes){
        try{
            const newTypeID = await this.achievementType.addAchievementType(newTypeName);
            const newAchievementType = new AchievementType();
            newAchievementType.achievementTypeID = newTypeID;
            newAchievementType.achievementTypeName = newTypeName;
            achievementTypes.push(newAchievementType);
            this.view.updateAchievementTypeArray(achievementTypes);
        } catch (error){
            console.error('Failed to add achievement type:', error); 
        }
    }

    async updateAchievementType(index, updatedTypeName, achievementTypes){
        try{
            const type = achievementTypes[index];
            await this.achievementType.updateAchievementType(type.achievementTypeID, updatedTypeName);
            achievementTypes[index].achievementTypeName = updatedTypeName;
            this.view.updateAchievementTypeArray(achievementTypes);
        } catch(error){
            console.error('Failed to update achievement type:', error);
        }
    }
}

export default ManageAchievementTypePresenter;
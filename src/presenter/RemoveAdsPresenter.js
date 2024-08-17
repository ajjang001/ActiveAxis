import User from "../model/User";

class RemoveAdsPresenter {
    constructor(view) {
        this.view = view;
        this.user = new User();
    }

    async isAdRemoved(userID) {
        try {
            const result = await this.user.getAdRemoved(userID);
            return result; // Return the boolean result from the getAdRemoved function
        } catch (error) {
            throw new Error(error);
        }
    }

    async setAdsRemoved(userID) {
        try {
            const result = await this.user.setAdRemoved(userID);
            return result; // Return the boolean result from the getAdRemoved function
        }
        catch (error) {
            throw new Error(error);
        }
    }
}
export default RemoveAdsPresenter;
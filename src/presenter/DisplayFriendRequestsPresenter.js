import Friends from '../model/Friends';

class DisplayFriendRequestsPresenter {
    constructor({ updateFriendRequests }) {
        this.updateFriendRequests = updateFriendRequests;
        this.friends = new Friends();
    }

    async getFriendRequests(userId) {
        try {
            const friendRequests = await this.friends.getFriendRequests(userId);
            this.updateFriendRequests(friendRequests);
        } catch (error) {
            console.error("Error getting friend requests:", error);
            throw new Error(error.message);
        }
    }
}

export default DisplayFriendRequestsPresenter;

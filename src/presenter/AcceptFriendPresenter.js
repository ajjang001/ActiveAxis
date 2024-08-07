import Friends from '../model/Friends';

class AcceptFriendRequestPresenter {
    constructor() {
        this.friends = new Friends();
    }

    async acceptRequest(currentUserId, selectedUserId) {
        try {
            await this.friends.respondToFriendRequest(currentUserId, selectedUserId, true);
        } catch (error) {
            console.error("Error accepting friend request:", error);
            throw new Error(error.message);
        }
    }
}

export default AcceptFriendRequestPresenter;

import Friends from '../model/Friends';

class RejectFriendRequestPresenter {
    constructor() {
        this.friends = new Friends();
    }

    async rejectRequest(currentUserId, selectedUserId) {
        try {
            await this.friends.respondToFriendRequest(currentUserId, selectedUserId, false);
        } catch (error) {
            console.error("Error rejecting friend request:", error);
            throw new Error(error.message);
        }
    }
}

export default RejectFriendRequestPresenter;

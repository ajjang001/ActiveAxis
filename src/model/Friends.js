import { db } from '../firebase/firebaseConfig';
import { collection, query, where, getDocs, addDoc, deleteDoc, updateDoc} from 'firebase/firestore';

class Friends {
    _dateAdded;
    _status;
    _userID1;
    _userID2;

    get dateAdded() { return this._dateAdded; }
    get status() { return this._status; }
    get userID1() { return this._userID1; }
    get userID2() { return this._userID2; }

    set dateAdded(dateAdded) { this._dateAdded = dateAdded; }
    set status(status) { this._status = status; }
    set userID1(userID1) { this._userID1 = userID1; }
    set userID2(userID2) { this._userID2 = userID2; }

    constructor() {
        this._dateAdded = "";
        this._status = "";
        this._userID1 = "";
        this._userID2 = "";
    }

    async getFriends(userId) {
        let friends = [];

        // Query where User1 == current logged in user
        const user1Query = query(collection(db, 'friends'), where('userID1', '==', userId), where('status', '==', 'Friend'));
        const user1Snapshot = await getDocs(user1Query);
        user1Snapshot.forEach(doc => {
            friends.push(doc.data());
        });

        // Query where User2 == current logged in user
        const user2Query = query(collection(db, 'friends'), where('userID2', '==', userId), where('status', '==', 'Friend'));
        const user2Snapshot = await getDocs(user2Query);
        user2Snapshot.forEach(doc => {
            friends.push(doc.data());
        });

        return friends;
    }

    async removeFriend(userId1, userId2) {
        // Query to delete the friend relationship
        const user1Query = query(collection(db, 'friends'), where('userID1', '==', userId1), where('userID2', '==', userId2));
        const user1Snapshot = await getDocs(user1Query);
        user1Snapshot.forEach(doc => {
            deleteDoc(doc.ref);
        });

        const user2Query = query(collection(db, 'friends'), where('userID2', '==', userId1), where('userID1', '==', userId2));
        const user2Snapshot = await getDocs(user2Query);
        user2Snapshot.forEach(doc => {
            deleteDoc(doc.ref);
        });
    }

    async searchUsers(searchText, currentUserId) {
        // Fetch all users except the current logged in user and those who are suspended
        const usersSnapshot = await getDocs(collection(db, 'users'), where('isSuspended', '==', false));
        let users = [];
        usersSnapshot.forEach(doc => {
            if (doc.data().username !== currentUserId) {
                users.push(doc.data());
            }
        });

        // Filter users based on search text
        const searched = users.filter(user => user.fullName === searchText || user.username === searchText);

        return searched;
    }

    async searchUser(userId, currentUserId) {
        // Check if the user is a friend or if a request is pending
        const tempArray = [];

        const userSnapshot = await getDocs(query(collection(db, 'users'), where('isSuspended', '==', false), where('username', '!=', currentUserId), limit(10)));
        userSnapshot.forEach(async doc => {
            let user = doc.data();
            let status = "Not Friend";

            const friendQuery1 = query(collection(db, 'friends'), where('userID1', '==', currentUserId), where('userID2', '==', user.id));
            const friendSnapshot1 = await getDocs(friendQuery1);
            if (friendSnapshot1.empty) {
                const friendQuery2 = query(collection(db, 'friends'), where('userID2', '==', currentUserId), where('userID1', '==', user.id));
                const friendSnapshot2 = await getDocs(friendQuery2);
                if (!friendSnapshot2.empty) {
                    status = friendSnapshot2.docs[0].data().status;
                }
            } else {
                status = friendSnapshot1.docs[0].data().status;
            }

            tempArray.push({
                user1: currentUserId,
                user2: user,
                status: status
            });
        });

        return tempArray;
    }

    async addFriend(currentUserId, selectedUserId) {
        await addDoc(collection(db, 'friends'), {
            userID1: currentUserId,
            userID2: selectedUserId,
            status: "Pending",
            dateAdded: new Date()
        });
    }

    async cancelFriendRequest(currentUserId, selectedUserId) {
        await this.removeFriend(currentUserId, selectedUserId);
    }

    async getFriendRequests(userId) {
        let friendRequests = [];

        // Query where User2 == current logged in user and status == "Pending"
        const friendRequestsQuery = query(collection(db, 'friends'), where('userID2', '==', userId), where('status', '==', 'Pending'));
        const friendRequestsSnapshot = await getDocs(friendRequestsQuery);
        friendRequestsSnapshot.forEach(doc => {
            friendRequests.push(doc.data());
        });

        return friendRequests;
    }

    async respondToFriendRequest(currentUserId, selectedUserId, accept) {
        // Find the friend request document
        const friendRequestQuery = query(collection(db, 'friends'), where('userID1', '==', selectedUserId), where('userID2', '==', currentUserId), where('status', '==', 'Pending'));
        const friendRequestSnapshot = await getDocs(friendRequestQuery);
        
        friendRequestSnapshot.forEach(doc => {
            const friendRequestDoc = doc.ref;
            if (accept) {
                // Accept the friend request
                updateDoc(friendRequestDoc, { status: 'Friend' });
            } else {
                // Reject the friend request
                deleteDoc(friendRequestDoc);
            }
        });
    }
}

export default Friends;

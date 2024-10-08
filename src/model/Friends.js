import { db, storage } from '../firebase/firebaseConfig';
import { collection, query, where, getDocs, addDoc, deleteDoc, updateDoc, getDoc, doc, limit } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';

import User from './User';

class Friends {
    _dateAdded;
    _status;
    _user1;
    _user2;

    get dateAdded() { return this._dateAdded; }
    get status() { return this._status; }
    get user1() { return this._user1; }
    get user2() { return this._user2; }

    set dateAdded(dateAdded) { this._dateAdded = dateAdded; }
    set status(status) { this._status = status; }
    set user1(user1) { this._user1 = user1; }
    set user2(user2) { this._user2 = user2; }

    constructor() {
        this._dateAdded = "";
        this._status = "";
        this._user1 = "";
        this._user2 = "";
    }

    async getFriends(userId) {
        let friends = [];

        // Query where User1 == current logged in user
        const user1Query = query(collection(db, 'friends'), where('userID1', '==', userId), where('status', '==', 'Friend'));
        const user1Snapshot = await getDocs(user1Query);

        for (const d of user1Snapshot.docs) {
            // get user data
            const docRef = doc(db, 'user', d.data().userID2);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const u = new User();
                u.accountID = d.data().userID2;
                u.profilePicture = docSnap.data().profilePicture;
                u.profilePicture = await u.getProfilePictureURL();
                u.fullName = docSnap.data().fullName;

                friends.push(u);
            }
        }

        // Query where User2 == current logged in user
        const user2Query = query(collection(db, 'friends'), where('userID2', '==', userId), where('status', '==', 'Friend'));
        const user2Snapshot = await getDocs(user2Query);

        for (const d of user2Snapshot.docs) {
            // get user data
            const docRef = doc(db, 'user', d.data().userID1);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const u = new User();
                u.accountID = d.data().userID1;
                u.profilePicture = docSnap.data().profilePicture;
                u.profilePicture = await u.getProfilePictureURL();
                u.fullName = docSnap.data().fullName;

                friends.push(u);
            }
        }

        return friends;
    }



    async getFriendDetails(userId) {
        console.log("Fetching details for userId:", userId);
        const docRef = doc(db, 'user', userId);
        const docSnap = await getDoc(docRef);

        console.log("Document reference:", docRef); // Debugging line
        console.log("Document snapshot exists:", docSnap.exists()); // Debugging line

        if (docSnap.exists()) {
            const data = docSnap.data();
            let profilePictureURL = '';
            if (data.profilePicture) {
                const profilePicRef = ref(storage, data.profilePicture); // Create a non-root reference
                profilePictureURL = await getDownloadURL(profilePicRef); // Get the download URL
            }
            return {
                profilePicture: profilePictureURL,
                fullName: data.fullName || '',
                gender: data.gender || '',
                fitnessGoal: data.fitnessGoal || '',
                fitnessLevel: data.fitnessLevel || ''
            };
        } else {
            console.error("No document found for userId:", userId); // Debugging line
            throw new Error('No such document!');
        }
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
        console.log(searchText);
        const usersSnapshot = await getDocs(collection(db, 'user'), where('isSuspended', '==', false));
        let users = [];

        for (const doc of usersSnapshot.docs) {
            const userData = doc.data();
            const userId = doc.id;
            
            const profilePicRef = ref(storage, userData.profilePicture);
            // Get the download URL
            const profilePictureURL = await getDownloadURL(profilePicRef);

            if (doc.data().accountID !== currentUserId) {
                // Check if there's a pending friend request
                const friendRequestQuery = query(
                    collection(db, 'friends'),
                    where('userID1', '==', currentUserId),
                    where('userID2', '==', userId),
                    where ('status', '==', "Pending"),
                );
                const friendRequestQuery2 = query(
                    collection(db, 'friends'),
                    where('userID1', '==', userId),
                    where('userID2', '==', currentUserId),
                    where ('status', '==', "Pending"),
                );
                const friendRequestSnapshot = await getDocs(friendRequestQuery);
                const friendRequestSnapshot2 = await getDocs(friendRequestQuery2);

                // const status = friendRequestSnapshot.empty ? "Add" : "Pending";
                let status;
                if (friendRequestSnapshot.empty && friendRequestSnapshot2.empty){
                    status = "Add";
                }
                else{
                    if (!friendRequestSnapshot.empty){
                        if (friendRequestSnapshot.docs[0].data().status == "Pending"){
                            status = "Pending";
                        }
                        if (friendRequestSnapshot.docs[0].data().status == "Friend"){
                            status = "Friend";
                        }
                    }
                    if (!friendRequestSnapshot2.empty){
                        if (friendRequestSnapshot2.docs[0].data().status == "Pending"){
                            status = "Pending";
                        }
                        if (friendRequestSnapshot2.docs[0].data().status == "Friend"){
                            status = "Friend";
                        }
                    }
                }
                users.push({ id: userId, ...userData, profilePictureURL, status });
            }
        };

        // Fetch current user's friends
        const friends = await this.getFriends(currentUserId);
        const friendIds = friends.map(friend => friend.accountID);
        console.log(users);
        // Filter users based on search text and exclude friends and current user
        const searched = users.filter(user =>
            (user.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
                user.username.toLowerCase().includes(searchText.toLowerCase())) &&
            user.id !== currentUserId &&
            !friendIds.includes(user.id)
        );

        return searched;
    }


    async searchFriend(userId, keyword) {
        try {
            const result = [];
            const u = new User();
            const temp = await u.search(keyword);

            for (const d of temp) {
                let q = query(collection(db, 'friends'), where('userID1', '==', userId), where('userID2', '==', d.id), where('status', '==', 'Friend'));
                let s = await getDocs(q);

                if (s.empty) {
                    q = query(collection(db, 'friends'), where('userID2', '==', userId), where('userID1', '==', d.id), where('status', '==', 'Friend'));
                    s = await getDocs(q);
                    if (!s.empty) {
                        result.push(d.user);
                    }
                } else {
                    result.push(d.user);
                }
            }



            return result;

        } catch (error) {
            throw new Error(error);
        }
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

        for (const docSnapshot of friendRequestsSnapshot.docs) {
        const requestData = docSnapshot.data();
        const userDocRef = doc(db, 'user', requestData.userID1);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();  // Correctly get the data object
            let profilePictureURL = '';
            if (userData.profilePicture) {
                const profilePicRef = ref(storage, userData.profilePicture);
                profilePictureURL = await getDownloadURL(profilePicRef);
            }

            friendRequests.push({
                userID1: requestData.userID1,
                fullName: userData.fullName || 'Unknown User',
                profilePictureURL: profilePictureURL,
                // Add any other details you want to use
            });
        }
    }

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

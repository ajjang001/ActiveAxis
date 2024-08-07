import { db } from '../firebase/firebaseConfig';
import { collection, query, where, getDocs, addDoc, deleteDoc, updateDoc, getDoc, doc, limit} from 'firebase/firestore';

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

        for ( const d of user1Snapshot.docs ) {
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
        
        for ( const d of user2Snapshot.docs ) {
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
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);
    
        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                profilePicture: data.profilePicture ? await new User().getProfilePictureURL(data.profilePicture) : '',
                fullName: data.fullName || '',
                gender: data.gender || '',
                fitnessGoal: data.fitnessGoal || '',
                fitnessLevel: data.fitnessLevel || ''
            };
        } else {
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
        const usersSnapshot = await getDocs(collection(db, 'users'), where('isSuspended', '==', false));
        let users = [];
        usersSnapshot.forEach(doc => {
          if (doc.data().accountID !== currentUserId) {
            users.push({ id: doc.id, ...doc.data() });
          }
        });
      
        // Filter users based on search text
        const searched = users.filter(user => 
          user.fullName.toLowerCase().includes(searchText.toLowerCase()) || 
          user.username.toLowerCase().includes(searchText.toLowerCase())
        );
      
        return searched;
      }
      

    async searchFriend(userId, keyword) {
        try{
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

        }catch(error){
            throw new Error(error);
        }
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

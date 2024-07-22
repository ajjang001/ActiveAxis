import User from '../model/User';

class EditUserAccountDetailsPresenter {
    constructor(view) {
        this.view = view;
        this.user = null;
    }

    async updatePassword(userID, newPassword, confirmnewPassword) {
        if (newPassword.trim() === '') {
            throw new Error('Password has not been entered!');
        }
        else if (newPassword.trim().length < 6) {
            throw new Error('Password must be at least 6 characters long!');
        }
        else if (newPassword != confirmnewPassword) {
            throw new Error('Passwords do not match.');
        }
        else if (newPassword == confirmnewPassword) {
            try {
                console.log(userID);
                console.log(newPassword);
                this.user = new User();
                await this.user.updatePassword(userID, newPassword)
            }
            catch (error) {
                throw new Error(error);
            }
        }
    }
}
export default EditUserAccountDetailsPresenter;
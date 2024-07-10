import User from '../model/User';
import Coach from '../model/Coach';

class ResetPasswordPresenter {
    constructor(view) {
        this.view = view;
        this.account = null;
    }
    async processResetPassword(email) {
        // To if email is in valid format
        const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (email.trim() === '') {
            throw new Error('Please enter your email!');
        }
        else if (!pattern.test(email)) {
            throw new Error('Invalid email format');
        }
        else {
            try {
                this.account = new User();
                await this.account.resetPassword(email)
            } catch (e) {
                console.log('User not found. Searching for valid coach.');
                try{
                    this.account = new Coach();
                    return this.account.resetPassword(email);
                }
                catch{
                    throw new Error(e.message);
                }
            }
        }
    }

}
export default ResetPasswordPresenter;
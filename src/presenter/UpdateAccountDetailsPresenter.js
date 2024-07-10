import SystemAdmin from "../model/SystemAdmin";

class UpdateAccountDetailsPresenter {
    constructor(view) {
        this.view = view;
        this.account = null;
    }

    async updateAccount(email) {
        try {
            this.account = new SystemAdmin();
            await this.account.resetPassword(email)
        } catch (error) {
            console.log('Account not found.');
            throw new Error(error);
        }
    }
}

export default UpdateAccountDetailsPresenter;
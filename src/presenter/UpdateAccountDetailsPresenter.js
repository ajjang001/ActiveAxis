import SystemAdmin from "../model/SystemAdmin";
import User from "../model/User";

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

    async updateAccountDetails(email, gender, phoneNumber, weight, height, fitnessGoal, fitnessLevel, hasMedical) {
        
        const phonePattern = /^\+65\d{8}$/;
        const floatPattern = /^\d+(\.\d+)?$/;

        if (!phonePattern.test(phoneNumber)) {
            // Check if phone number is 8 digits
            throw new Error('Please enter a valid phone number (8 Digits)!');
        }
        else if (weight.trim() === '' || height.trim() === '') {
            throw new Error('Please complete all fields!');
        }
        else if (!floatPattern.test(weight)) {
            // Check if weight is a number or decimal
            throw new Error('Please only enter numbers or decimals for weight!');
          } else if (!floatPattern.test(height)) {
            // Check if height is a number or decimal
            throw new Error('Please only enter numbers or decimals for height!');
          }
        else {
            try {
                this.account = new User();
                await this.account.updateAccountDetails(email, gender, phoneNumber, parseFloat(weight), parseFloat(height), fitnessGoal, fitnessLevel, hasMedical);
            } catch (error) {
                throw new Error(error);
            }
        }

    }
}

export default UpdateAccountDetailsPresenter;
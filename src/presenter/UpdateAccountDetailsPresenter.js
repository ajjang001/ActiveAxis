import SystemAdmin from "../model/SystemAdmin";
import User from "../model/User";
import FitnessPlan from '../model/FitnessPlan';
import Coach from '../model/Coach';

class UpdateAccountDetailsPresenter {
    constructor(view) {
        this.view = view;
        this.account = null;
    }

    async getCoachDetails(email) {
      try {
          this.account = new Coach();
          const details = await this.account.getInfo(email);
          this.view.displayAccountDetails(details);
      } catch (error) {
          console.log('Coach not found.');
          throw new Error(error);
      }
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

    async getGoals() {
        try {
          this.account = new FitnessPlan();
          this.view.fetchGoalsData(await this.account.getGoals());
        } catch (error) {
          throw new Error(error);
        }
      }
    
      async getLevel() {
        try {
          this.account = new FitnessPlan();
          this.view.fetchLevelData(await this.account.getFitnessLevel());
        } catch (error) {
          throw new Error(error);
        }
      }
    

      async updateCoachAccountDetails(email, name, phoneNumber, tempEmail) {
        console.log("updateAccountDetails parameters:", { email, name, phoneNumber, tempEmail });
        
        const phonePattern = /^\+65\d{8}$/;

        if (!phonePattern.test(phoneNumber)) {
            // Check if phone number is 8 digits
            throw new Error('Please enter a valid phone number (8 Digits)!');
        }
        else if (!email || !name || !phoneNumber || !tempEmail) {
            throw new Error('Please complete all fields!');
        }
        else {
            try {
                this.account = new Coach();
                await this.account.updateCoachAccountDetails(email, name, phoneNumber, tempEmail);
            } catch (error) {
                throw new Error(error);
            }
        }
      }
    async updateAccountDetails(email, gender, phoneNumber, weight, height, fitnessGoal, fitnessLevel, hasMedical) {
        
        const phonePattern = /^\+65\d{8}$/;
        const floatPattern = /^\d+(\.\d+)?$/;

        if (!phonePattern.test(phoneNumber)) {
            // Check if phone number is 8 digits
            throw new Error('Please enter a valid phone number (8 Digits)!');
        }
        else if (weight.trim() === '' || height.trim() === '' || fitnessGoal.trim() === '' || fitnessLevel.trim() === '') {
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
            await this.account.updateAccountDetails(email, gender, phoneNumber1, parseFloat(weight), parseFloat(height), fitnessGoal, fitnessLevel, hasMedical);
          } catch (error) {
              throw new Error(error);
        }
        }
        
    }
    async updateCoachPassword(coachID, newPassword, confirmNewPassword) {
      if (newPassword.trim() === '') {
          throw new Error('Password has not been entered!');
      } else if (newPassword.trim().length < 6) {
          throw new Error('Password must be at least 6 characters long!');
      } else if (newPassword !== confirmNewPassword) {
          throw new Error('Passwords do not match.');
      } else {
          try {
              this.account = new Coach();
              await this.account.updatePassword(coachID, newPassword);
          } catch (error) {
              console.error('Error updating password:', error.message);
              throw new Error(error.message || 'An unknown error occurred while updating the password.');
          }
      }
  }
}

export default UpdateAccountDetailsPresenter;
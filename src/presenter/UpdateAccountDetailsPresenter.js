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


  async updateCoachAccountDetails(userEmail, tempName, tempPhoneNumber, tempEmail, coachID, newPassword, confirmnewPassword, profilePic, newprofilePic) {

    const phonePattern = /^\+65\d{8}$/;
    try{

    if (!phonePattern.test(tempPhoneNumber)) {
      // Check if phone number is 8 digits
      throw new Error('Please enter a valid phone number (8 Digits)!');
    }
    else if (!tempName || !tempPhoneNumber || !tempEmail) {
      throw new Error('Please complete all fields!');
    }
    else {
      if(newPassword.trim() !== confirmnewPassword.trim()){
        throw new Error('Passwords do not match.');
      }

      this.account = new Coach();

      if(newPassword.trim() !== '' && confirmnewPassword.trim() !== ''){
        

        if(newPassword.trim().length < 6){
          throw new Error('Password must be at least 6 characters long!');
        }else if (newPassword != confirmnewPassword) {
          throw new Error('Passwords do not match.');
        }else{
          await this.account.updatePassword(coachID, newPassword);
        }
      }

      await this.account.updateCoachAccountDetails(userEmail, tempName, tempPhoneNumber, tempEmail);

      if (profilePic === newprofilePic) {
        console.log("No update to picture.");
      }
      else {
        await this.account.updateAccountPicture(userEmail, newprofilePic);
      }

      

    }
  }catch(error){
    throw new Error(error);
  }

  }

  async updateAccountDetails(email, gender, phoneNumber, weight, height, fitnessGoal, fitnessLevel, hasMedical, profilePic, newprofilePic, userID) {

    const phonePattern = /^\+65\d{8}$/;
    const floatPattern = /^\d+(\.\d+)?$/;

    if (!phonePattern.test(phoneNumber)) {
      // Check if phone number is 8 digits
      throw new Error('Please enter a valid phone number (8 Digits)!');
    }
    else if (weight.trim() === '' || height.trim() === '' || fitnessGoal === null || fitnessLevel === null) {
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
        
        if (profilePic === newprofilePic) {
          console.log("No update to picture.");
        }
        else {
          await this.account.updateAccountPicture(email, newprofilePic);
        }
      } catch (error) {
        throw new Error(error);
      }
    }

  }
  async updatePassword(coachID, newPassword, confirmnewPassword) {
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
        this.user = new Coach();
        await this.user.updatePassword(coachID, newPassword)
      }
      catch (error) {
        throw new Error(error);
      }
    }
  }
}

export default UpdateAccountDetailsPresenter;
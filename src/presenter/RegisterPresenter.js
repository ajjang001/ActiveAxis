import User from '../model/User';
import Coach from '../model/Coach';
import FitnessPlan from '../model/FitnessPlan';

class RegisterPresenter {
  constructor(view) {
    this.view = view;
    this.account = null;
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

  async processProfiling(gender, dob, weight, height, goal, level, medicalCheck, intervalInSeconds) {
    // Pattern to check if weight and height are numbers or decimals
    const floatPattern = /^\d+(\.\d+)?$/;

    if (gender.trim() === '' || dob === null || weight.trim() === '' || height.trim() === '' || goal === null || level === null || intervalInSeconds === null) {
      // Check if all fields are filled
      throw new Error('Please complete all fields!');
    } else if (!floatPattern.test(weight)) {
      // Check if weight is a number or decimal
      throw new Error('Please only enter numbers or decimals for weight');
    } else if (!floatPattern.test(height)) {
      // Check if height is a number or decimal
      throw new Error('Please only enter numbers or decimals for height');
    } else if (intervalInSeconds === 0 || intervalInSeconds < 20) {
      throw new Error('Rest Interval must be more than 20 seconds! ');
    }
    else {
      // Log the values
      // All good here!
      console.log({ gender, dob, weight, height, goal, level, medicalCheck, intervalInSeconds });
    }
  }


  async processRegister(name, email, phone, password, checkTC, gender, dob, weight, height, goal, level, medicalCheck, intervalInSeconds) {
    // To if email is in valid format
    const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    // To if name is in valid format
    const namePattern = /^[a-zA-Z\s]+$/;
    // To if phone number is 8 digits
    const phonePattern = /^\+65\d{8}$/;

    if (name.trim() === '' || email.trim() === '' || phone.trim() === '' || password.trim() === '') {
      // Check if all fields are filled
      throw new Error('Please complete all fields!');
    } else if (!namePattern.test(name)) {
      // Check if name is only letters
      throw new Error('Please only enter letters for name');
    }
    else if (!pattern.test(email)) {
      // Check if email is in valid format
      throw new Error('Invalid email format');
    }
    else if (!phonePattern.test(phone)) {
      // Check if phone number is 8 digits
      throw new Error('Please enter a valid phone number');
    }
    else if (checkTC == false) {
      // Check if terms and conditions are checked
      throw new Error('Please Agree to the Terms & Conditions!')
    }
    else {
      try {
        // Call the model to register the user
        this.account = new User();
        await this.account.register(name.trim(), email.trim(), phone.trim(), password, gender, dob, parseFloat(weight), parseFloat(height), goal, level, medicalCheck, intervalInSeconds);

      } catch (e) {
        // Throw error message
        throw new Error(e.message);
      }


    }
  }

  async processProfilingCoach(gender, dob, chargePM, photo, resume, certificate, identification) {
    // Pattern to check if weight and height are numbers or decimals
    const floatPattern = /^\d+(\.\d+)?$/;

    if (gender.trim() === '' || dob === null || chargePM.trim() === '') {
      // Check if all fields are filled
      throw new Error('Please complete all fields!');
    } else if (!floatPattern.test(chargePM)) {
      // Check if weight is a number or decimal
      throw new Error('Please only enter numbers or decimals for charge per month');
    }
    else if (resume == null || certificate == null || identification == null || photo == null) {
      throw new Error('Please ensure all files are uploaded!');
    }
    else {
      // Log the values
      // All good here!
      console.log({ gender, dob, chargePM, photo, resume, certificate, identification })
    }
  }

  async processRegisterCoach(name, email, phone, password, checkTC, gender, dob, chargePM, photo, resume, certificate, identification) {
    // To if email is in valid format
    const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    // To if name is in valid format
    const namePattern = /^[a-zA-Z\s]+$/;
    // To if phone number is 8 digits
    const phonePattern = /^\+65\d{8}$/;

    if (name.trim() === '' || email.trim() === '' || phone.trim() === '' || password.trim() === '') {
      // Check if all fields are filled
      throw new Error('Please complete all fields!');
    } else if (!namePattern.test(name)) {
      // Check if name is only letters
      throw new Error('Please only enter letters for name');
    }
    else if (!pattern.test(email)) {
      // Check if email is in valid format
      throw new Error('Invalid email format');
    }
    else if (!phonePattern.test(phone)) {
      // Check if phone number is 8 digits
      throw new Error('Please enter a valid phone number');
    }
    else if (checkTC == false) {
      // Check if terms and conditions are checked
      throw new Error('Please Agree to the Terms & Conditions!')
    }
    else {
      try {
        // Call the model to register the coach
        this.account = new Coach();
        await this.account.register(name.trim(), email.trim(), phone.trim(), password, gender, dob, parseFloat(chargePM), photo, resume, certificate, identification);

      } catch (e) {
        // Throw error message
        throw new Error(e.message);
      }


    }
  }

}
export default RegisterPresenter;
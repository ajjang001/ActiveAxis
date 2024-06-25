import User from '../model/User';

class RegisterPresenter {
    constructor(view) {
        this.view = view;
    }

    async processProfiling(gender, dob, weight, height, goal, level, medicalCheck) {
      // Pattern to check if weight and height are numbers or decimals
      const floatPattern = /^\d+(\.\d+)?$/;

      if (gender.trim() === '' || dob === null || weight.trim() === '' || height.trim() === '' || goal.trim() === '' || level.trim() === '') {
        // Check if all fields are filled
        throw new Error('Please complete all fields!');
      }else if (!floatPattern.test(weight)){
        // Check if weight is a number or decimal
        throw new Error('Please only enter numbers or decimals for weight');
      }else if (!floatPattern.test(height)){
        // Check if height is a number or decimal
        throw new Error('Please only enter numbers or decimals for height');
      }else{
        // Log the values
        // All good here!
        console.log({ gender, dob, weight, height, goal, level, medicalCheck });
      }
    }


    async processRegister(name, email, phone, password, checkTC, gender, dob, weight, height, goal, level, medicalCheck) {
        // To if email is in valid format
        const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        // To if name is in valid format
        const namePattern = /^[a-zA-Z\s]+$/;

        if (name.trim() === '' || email.trim() === '' || phone.trim() === '' || password.trim() === '') {
          // Check if all fields are filled
            throw new Error('Please complete all fields!');
        }else if (!namePattern.test(name)) {
          // Check if name is only letters
            throw new Error('Please only enter letters for name');
        } 
        else if (!pattern.test(email)) {
          // Check if email is in valid format
            throw new Error('Invalid email format');
        } else if (checkTC == false) {
          // Check if terms and conditions are checked
            throw new Error('Please Agree to the Terms & Conditions!')
        }
        else {
            try {
              // Call the model to register the user
                const user = new User();
                await user.register(name, email, phone, password, gender, dob, parseFloat(weight), parseFloat(height), goal, level, medicalCheck);

            } catch (e) {
              // Throw error message
                throw new Error(e.message);
            }


        }
    }

}
export default RegisterPresenter;
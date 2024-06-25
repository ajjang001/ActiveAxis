import User from '../model/User';

class RegisterPresenter {
    constructor(view) {
        this.view = view;
    }

    async processProfiling(gender, age, weight, height, goal, level, medicalCheck) {

        if (gender.trim() === '' || age.trim() === '' || weight.trim() === '' || height.trim() === '' || goal.trim() === '' || level.trim() === '') {

            throw new Error('Please complete all fields!');
        } else {
            try {
                console.log({ gender, age, weight, height, goal, level, medicalCheck })
            } catch (e) {
                throw new Error(e.message);
            }


        }
    }

    async processRegister(name, email, phone, password, checkTC, gender, age, weight, height, goal, level, medicalCheck) {
        // To if email is in valid format
        const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

        if (name.trim() === '' || email.trim() === '' || phone.trim() === '' || password.trim() === '') {
            throw new Error('Please complete all fields!');
        } else if (!pattern.test(email)) {
            throw new Error('Invalid email format');
        } else if (checkTC == false) {
            throw new Error('Please Agree to the Terms & Conditions!')
        }
        else {
            try {
                const user = new User();
                await user.register(name, email, phone, password, gender, age, weight, height, goal, level, medicalCheck);

            } catch (e) {
                console.log(e);
                throw new Error(e.message);
            }


        }
    }

}
export default RegisterPresenter;
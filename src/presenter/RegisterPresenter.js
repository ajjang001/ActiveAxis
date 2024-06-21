import { firebase } from '../../.expo/api/firebase'

class RegisterPresenter {
    constructor(view) {
        this.view = view;
    }

    registerUser(user) {
        firebase.auth()
            .createUserWithEmailAndPassword(user.email, user.password)
            .then(() => {
                this.view.onRegisterSuccess();
            })
            .catch(error => {
                this.view.onRegisterError(error.message);
            });
    }
}
export default RegisterPresenter;
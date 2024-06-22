import {app, auth, db, storage} from '../../.expo/api/firebase';

import Account from './Account';

class Coach extends Account{
    chargePerMonth;

    constructor(){
        super();
    }

    get chargePerMonth(){return this.chargePerMonth;}
    set chargePerMonth(chargePerMonth){this.chargePerMonth = chargePerMonth;}
}

export default Coach;
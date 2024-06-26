import AppInfo from '../model/AppInfo.js';

class DisplayAppFeaturesPresenter{
    constructor(view){
        this.view = view;
    }

    async displayAppFeatures(){
        try{
            const features = await new AppInfo().getFunctionsFeatures();
            this.view.changeFeatures(features);
        }catch(error){
            console.error(error);
        }
    }


}

export default DisplayAppFeaturesPresenter;
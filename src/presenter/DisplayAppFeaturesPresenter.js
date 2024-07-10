import AppInfo from '../model/AppInfo.js';

class DisplayAppFeaturesPresenter{
    constructor(view){
        this.view = view;
        this.appInfo = new AppInfo();
    }

    async displayAppFeatures(){
        try{
            const features = await this.appInfo.getFunctionsFeatures();
            this.view.changeFeatures(features);
        }catch(error){
            console.error(error);
        }
    }


}

export default DisplayAppFeaturesPresenter;
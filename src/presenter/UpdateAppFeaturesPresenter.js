import AppInfo from '../model/AppInfo.js';

class UpdateAppFeaturesPresenter{
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

    async updateAppFeatures(newFeatures){
        try{
          await this.appInfo.updateFunctionsFeatures(newFeatures);
        }catch(error){
          console.error(error);
          throw error;
        }
      }
}

export default UpdateAppFeaturesPresenter;
import AppInfo from '../model/AppInfo.js';

class UpdateAppFeaturesPresenter{
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

    async updateAppFeatures(newFeatures){
        try{
          await new AppInfo().updateFunctionsFeatures(newFeatures);
        }catch(error){
          console.error(error);
          throw error;
        }
      }
}

export default UpdateAppFeaturesPresenter;
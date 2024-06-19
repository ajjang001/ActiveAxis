import Model from '../model/Model';

class Presenter {
  constructor(view) {
    this.view = view;
    this.model = new Model();
  }

  async loadData(collectionName) {
    try{
      const data = await this.model.getData(collectionName);
      this.view.updateView(data);
    }catch(error){
      console.log(error);
    }
  }

  async addData(collection, data) {
    try{
      await this.model.addData(collection, data);
      this.loadData(collection);
    }catch(error){
      console.log(error);
    }
    
  }
}

export default Presenter;
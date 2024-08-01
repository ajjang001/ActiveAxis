class DisplayFitnessStatisticsPresenter {
  constructor(view) {
    this.view = view;
  }

  calculateBMI(user){
    try{
        const weight = user.weight;
        const height = user.height/100;
        const bmi = weight / (height * height);
        this.view.updateBMI(bmi);
    }catch(error){
        throw new Error(error);
    }
  }
}

export default DisplayFitnessStatisticsPresenter;
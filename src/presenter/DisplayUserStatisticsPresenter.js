
//import AppFeedback from '../model/AppFeedback.js';
import AppInfo from '../model/AppInfo.js';

class DisplayUserStatisticsPresenter {
  constructor(view) {
    this.view = view;
  }

  async displayTotalAppFeedback(){
    try{
      const appInfo = new AppInfo();
      const totalFeedback = await appInfo.getAppFeedbackCount();
      
      this.view.changeTotalFeedback(totalFeedback);
    } catch(error){
      console.error(error);
    }
    
  }

  async displayAvgRatings(){
    try{
      const appInfo = new AppInfo();
      const avgRating = await appInfo.getAvgRatings();
      this.view.changeAvgRating(avgRating);
    } catch (error){
      console.error(error);
    }
  }

  async displayDaysAndUsers(){
    try{
      const appInfo = new AppInfo();
      const stats = await appInfo.getStats();
      this.view.changePreviousDays(stats.days);
      this.view.changeDataStats(stats.data);
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default DisplayUserStatisticsPresenter;
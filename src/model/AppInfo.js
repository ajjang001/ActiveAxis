class AppInfo {
    #aboutActiveAxis
    #functionsAndFeatures
    #appFeedbacks
    #userStatistics

    get aboutActiveAxis(){return this.#aboutActiveAxis;}
    get functionsAndFeatures(){return this.#functionsAndFeatures;}
    get appFeedbacks(){return this.#appFeedbacks;}
    get userStatistics(){return this.#userStatistics;}    

    set aboutActiveAxis(aboutActiveAxis){this.#aboutActiveAxis = aboutActiveAxis;}
    set functionsAndFeatures(functionsAndFeatures){this.#functionsAndFeatures = functionsAndFeatures;}
    set appFeedbacks(appFeedbacks){this.#appFeedbacks = appFeedbacks;}
    set userStatistics(userStatistics){this.#userStatistics = userStatistics;}

    constructor() {
      this.aboutActiveAxis = "Information about ActiveAxis";
      this.functionsAndFeatures = "Details of functions and features";
      this.appFeedbacks = "User feedbacks";
      this.userStatistics = "Statistics of user usage";
    }
  
    getAboutActiveAxis() {
      return this.aboutActiveAxis;
    }
  
    getFunctionsAndFeatures() {
      return this.functionsAndFeatures;
    }
  
    getAppFeedbacks() {
      return this.appFeedbacks;
    }
  
    getUserStatistics() {
      return this.userStatistics;
    }
  }
  
  export default AppInfo;
  
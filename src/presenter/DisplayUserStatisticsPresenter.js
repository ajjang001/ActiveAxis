// import React, { useEffect, useState } from 'react';
// import { StyleSheet, Text, View, Image } from 'react-native';
// import { err } from 'react-native-svg';
import AppInfo from '../model/AppInfo.js';

class DisplayUserStatisticsPresenter {
  constructor(view) {
    this.view = view;
  }

  async displayActiveUsers(){

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

  async displayTotalDownloads(){

  } 
}

export default DisplayUserStatisticsPresenter;
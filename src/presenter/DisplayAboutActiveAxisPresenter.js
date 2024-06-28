import AppInfo from '../model/AppInfo.js';

class DisplayAboutActiveAxisPresenter {
  constructor(view) {
    this.view = view;
  }

  async displayAboutActiveAxis() {
    try {
      const appInfo = new AppInfo();
      const about = await appInfo.getAboutActiveAxis();
      this.view.changeAbout(about);
    } catch (error) {
      console.error(error);
    }
  }

  async displayLogoURL() {
    try {
      const appInfo = new AppInfo();
      const logoURL = await appInfo.getLogoURL();
      this.view.changeLogoURL(logoURL);
    } catch (error) {
      console.error(error);
    }
  }
}

export default DisplayAboutActiveAxisPresenter;

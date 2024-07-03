import AppInfo from '../model/AppInfo.js';

class UpdateAboutUsPresenter {
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

  async updateAboutActiveAxis(about) {
    try {
      const appInfo = new AppInfo();
      await appInfo.updateAboutActiveAxis(about);
    } catch (error) {
      console.error(error);
    }
  }
}

export default UpdateAboutUsPresenter;

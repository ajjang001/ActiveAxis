import AppInfo from '../model/AppInfo.js';

class UpdateAboutUsPresenter {
  constructor(view) {
    this.view = view;
    this.appInfo = new AppInfo();
  }

  async displayAboutActiveAxis() {
    try {
      const about = await this.appInfo.getAboutActiveAxis();
      this.view.changeAbout(about);
    } catch (error) {
      console.error(error);
    }
  }

  async displayLogoURL() {
    try {
      const logoURL = await this.appInfo.getLogoURL();
      this.view.changeLogoURL(logoURL);
    } catch (error) {
      console.error(error);
    }
  }

  async updateAboutActiveAxis(about) {
    try {
      await this.appInfo.updateAboutActiveAxis(about);
    } catch (error) {
      console.error(error);
    }
  }
}

export default UpdateAboutUsPresenter;

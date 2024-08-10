import Share from 'react-native-share';


class ShareCompetitionPresenter {
  constructor(view) {
    this.view = view;
  }

  async shareCompetition(competition, platform) {
    try{

        const shareOptions = {
            title: 'Competition Completed!',
            message: `I have completed the competition "${competition.competition.competitionName}" (Ranked #${competition.position}) hosted by ${competition.competition.host_user.fullName} on ActiveAxis!\n\nGet the app now and join the competition!`,
            subject: 'Check out my competition result!',
          };

        switch (platform) {
            case 'facebook':
            await Share.shareSingle({ ...shareOptions, social: Share.Social.FACEBOOK });
            break;
            case 'twitter':
            await Share.shareSingle({ ...shareOptions, social: Share.Social.TWITTER });
            break;
            case 'whatsapp':
            await Share.shareSingle({ ...shareOptions, social: Share.Social.WHATSAPP });
            break;
            case 'instagram':
            await Share.shareSingle({ ...shareOptions, social: Share.Social.INSTAGRAM });
            break;
            default:
            await Share.open(shareOptions);
        }

    }catch(error){
        throw new Error(error);
    }
  }
}

export default ShareCompetitionPresenter;
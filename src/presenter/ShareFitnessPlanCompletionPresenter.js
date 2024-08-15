import Share from 'react-native-share';

class ShareFitnessPlanCompletionPresenter{
    constructor(view){
        this.view = view;
    }

    async shareDayPlanCompletion(planName, dayNumber, platform){
        try{

            const shareOptions = {
                title: 'Exercise Completed!',
                message: `I have completed the exercise: ${planName} - Day ${dayNumber} on ActiveAxis!\n\nDownload the app now and try out fitness plans crafted by our fitness coaches!`,
                subject: 'Check out my exercise completion result!',
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

export default ShareFitnessPlanCompletionPresenter;
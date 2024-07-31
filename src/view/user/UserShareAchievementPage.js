import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { scale } from '../../components/scale';
import Share from 'react-native-share';

const UserShareAchievementPage = ({ route }) => {

    const { achievement } = route.params;

    const dateAchieved = new Date(achievement.dateAchieved.seconds * 1000 + achievement.dateAchieved.nanoseconds / 1000000);
    const dateAchievedString = dateAchieved.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const handleShare = async (platform) => {
        const shareOptions = {
            title: 'Achievement Unlocked!',
            message: `I have unlocked the achievement "${achievement._achievementName}" on ActiveAxis!\n\n`,
            url: achievement._achievementPicture,
            type: 'image/png',
            subject: 'Check out my achievement!',
          };
    
    try {
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
    } catch (error) {
      console.log('Error sharing achievement:', error);
    }
  };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>{achievement._achievementName}</Text>
            </View>
            <Image
                source={{ uri: achievement._achievementPicture }}
                style={styles.achievementIcon}
            />
            <View style={styles.detailsContainer}>
            <Text style={styles.type}>{achievement._achievementType}</Text>
            <Text style={styles.description}>{achievement._description}</Text>
            <Text style={styles.date}>Date Achieved: {dateAchievedString}</Text>
            </View>


            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
                <Text style={styles.shareText}>SHARE</Text>
            </TouchableOpacity>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    headerContainer: {
        width: '90%',
    },
    headerText: {
        fontSize: scale(36),
        fontFamily: 'League-Spartan',
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: scale(50)
    },
    achievementIcon: {
        width: scale(300),
        height: scale(300),
        marginVertical: scale(30),
        borderRadius: scale(150),
        backgroundColor: 'white',
    },
    detailsContainer: {
        width: '75%',
        backgroundColor: '#E6E6E6',
        padding: scale(15),
        borderWidth: 2,
        borderRadius: scale(15),
        borderColor: '#C42847',
        alignItems: 'center'
    },
    type: {
        fontSize: scale(20),
        fontFamily: 'Inter-SemiBold',
        textAlign: 'center'
    },
    description: {
        fontSize: scale(16),
        textAlign: 'center',
        fontFamily: 'Inter',
        marginVertical: scale(10),
    },
    date: {
        fontSize: scale(18),
        textAlign: 'center',
        fontFamily: 'Inter',
        marginTop: scale(20),
        color: '#454545'
    },
    shareButton: {
        borderWidth: 1,
        backgroundColor: '#E28413',
        paddingVertical: scale(10),
        marginTop: scale(30),
        width:'50%'
    },
    shareText: {
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Inter',
        fontWeight: 'bold',
        fontSize: scale(18)
    },
});


export default UserShareAchievementPage;
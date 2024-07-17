import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { scale } from "../../components/scale";

const CoachListOfFitnessPlansPage = ({navigation, route}) => {

    const {coach} = route.params;
    console.log(coach);

    return (
        <View style = {styles.container}>
            <Text style = {styles.titleText}>Fitness Plan</Text>
            
            <View style = {styles.topHeaderView}>
                
                <View style = {styles.createButtonView}>
                    <TouchableOpacity onPress = {()=>navigation.navigate('CoachCreateFitnessPlanPage', {coach})} style = {styles.createButton}>
                        <Text style = {styles.createText}>Create</Text>
                    </TouchableOpacity>
                </View>

                
            </View>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FBF5F3',
    },
    titleText:{
        fontSize: scale(35),
        fontFamily: 'Poppins-SemiBold',
        
    },
    topHeaderView:{
        width: '100%',
        backgroundColor: '#C42847',
        height: scale(40),
        justifyContent: 'center',
        alignItems: 'flex-end',

    },
    createButtonView:{
        height: scale(40), 
        backgroundColor:'#FBF5F3', 
        justifyContent:'center',
        paddingHorizontal: scale(40),
    },
    createButton:{
        backgroundColor: '#E28413',
        width: scale(120),
        borderRadius: 15,
        padding: scale(2),
        
    },
    createText:{
        fontSize: scale(18),
        fontFamily: 'League-Spartan-SemiBold',
        color: 'white',
        textAlign: 'center',
        
    }

});

export default CoachListOfFitnessPlansPage;
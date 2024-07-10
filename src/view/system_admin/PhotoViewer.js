import { View, Image, StyleSheet } from "react-native";


const PhotoViewer = ({ route }) => {
    const { photo } = route.params;
    
    return (
        <View style = {styles.container}>
            <Image source={{uri: photo}} resizeMode='stretch' style= {styles.photo}/>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black'
    },
    photo:{
        width: '100%',
        height: '100%',
        backgroundColor: 'white'
    }
});



export default PhotoViewer;
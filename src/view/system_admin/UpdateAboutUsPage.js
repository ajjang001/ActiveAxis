import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TextInput, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import UpdateAboutUsPresenter from '../../presenter/UpdateAboutUsPresenter';
import { LoadingDialog } from '../../components/Modal';
import { scale } from '../../components/scale';

const UpdateAboutUsPage = () => {
    // state variables
    const [about, setAbout] = useState([]);
    const [logoURL, setLogoURL] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editedAbout, setEditedAbout] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    
    // change popup/modal visible
    const changeLoadingVisible = (b)=>{
        setIsLoading(b);
    }


    // load page
    const loadPage = async () => {
        try{
            changeLoadingVisible(true);
            const presenter = new UpdateAboutUsPresenter({ changeAbout, changeLogoURL });
            // load about and logo
            await presenter.displayAboutActiveAxis();
            await presenter.displayLogoURL();
        }catch(error){
            console.error("Error loading page: ", error);
        }finally{
            changeLoadingVisible(false);
        }
    };

    // change about 
    const changeAbout = (aboutData) => {
        setAbout(aboutData);
        setEditedAbout(aboutData);
    };

    // change logo url
    const changeLogoURL = (url) => {
        setLogoURL(url);
    };

    // handle edit
    const handleEdit = () => {
        setIsEditing(true);
    };

    // handle save
    const handleSave = async () => {
        try {
            setIsEditing(false);
            setAbout(editedAbout);
            const presenter = new UpdateAboutUsPresenter({ changeAbout, changeLogoURL });
            await presenter.updateAboutActiveAxis(editedAbout);
        } catch (error) {
            console.error("Error saving changes: ", error);
        }
    };

    // handle text change
    const handleTextChange = (text, index) => {
        const newEditedAbout = [...editedAbout];
        newEditedAbout[index] = text;
        setEditedAbout(newEditedAbout);
    };

    // load page on component mount
    useEffect(() => {
        loadPage();
    }, []);


    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity onPress={isEditing ? handleSave : handleEdit} style={styles.button}>
                <Text style={styles.buttonText}>{isEditing ? 'Save' : 'Edit'}</Text>
            </TouchableOpacity>
            <Text style={styles.title}>About ActiveAxis</Text>
            {logoURL ? <Image source={{ uri: logoURL }} style={styles.logo} /> : <ActivityIndicator size='large' color='blue' style={styles.logo} />}
            <View style={styles.divider} />
            <View style = {styles.paragraphView}>
                {isEditing ? (
                    editedAbout.map((paragraph, index) => (
                        <TextInput
                            key={index}
                            style={styles.paragraphInput}
                            value={paragraph}
                            onChangeText={(text) => handleTextChange(text, index)}
                            multiline
                        />
                    ))
                ) : (
                    about.map((paragraph, index) => (
                        <Text key={index} style={styles.paragraph}>{paragraph.trim()}</Text>
                    ))
                )}
            </View>

            <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={()=>changeLoadingVisible(false)}>
                <LoadingDialog />
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: scale(1),
        justifyContent: 'center',
        alignItems: 'center',
        padding: scale(20),
        paddingTop: scale(-20),
        backgroundColor: '#FBF5F3',
    },
    title: {
        fontSize: scale(30),
        fontWeight: 'bold',
        marginVertical: scale(20),
        alignSelf: 'center',
    },
    logo: {
        width: scale(140),
        height: scale(140),
        borderRadius: scale(20),
        marginBottom: scale(20),
    },
    divider: {
        width: '90%',
        height: scale(5),
        backgroundColor: '#C42847',
        marginVertical: scale(20),
    },
    paragraphView:{
        width: '90%',
        alignItems: 'center',
    },
    paragraph: {
        fontSize: scale(16),
        textAlign: 'left',
        marginBottom: scale(10),
    },
    paragraphInput: {
        fontSize: scale(16),
        textAlign: 'left',
        marginBottom: scale(10),
        borderWidth: 1,
        borderColor: '#C42847',
        padding: scale(10),
        borderRadius: 5,
        width: '100%',
    },
    button: {
        backgroundColor: '#C42847',
        padding: scale(10),
        borderRadius: 5,
        marginTop: scale(20),
        alignSelf: 'flex-end',
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});

export default UpdateAboutUsPage;

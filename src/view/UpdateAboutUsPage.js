import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import UpdateAboutUsPresenter from '../presenter/UpdateAboutUsPresenter';

const UpdateAboutUsPage = () => {
    const [about, setAbout] = useState([]);
    const [logoURL, setLogoURL] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editedAbout, setEditedAbout] = useState([]);

    useEffect(() => {
        const presenter = new UpdateAboutUsPresenter({ changeAbout, changeLogoURL });
        presenter.displayAboutActiveAxis();
        presenter.displayLogoURL();
    }, []);

    const changeAbout = (aboutData) => {
        setAbout(aboutData);
        setEditedAbout(aboutData);
    };

    const changeLogoURL = (url) => {
        setLogoURL(url);
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

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

    const handleTextChange = (text, index) => {
        const newEditedAbout = [...editedAbout];
        newEditedAbout[index] = text;
        setEditedAbout(newEditedAbout);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity onPress={isEditing ? handleSave : handleEdit} style={styles.button}>
                <Text style={styles.buttonText}>{isEditing ? 'Save' : 'Edit'}</Text>
            </TouchableOpacity>
            <Text style={styles.title}>About ActiveAxis</Text>
            {logoURL ? <Image source={{ uri: logoURL }} style={styles.logo} /> : null}
            <View style={styles.divider} />
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
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        paddingTop: -20,
        backgroundColor: '#FBF5F3',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 20,
        alignSelf: 'center',
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    divider: {
        width: '90%',
        height: 5,
        backgroundColor: '#C42847',
        marginVertical: 20,
    },
    paragraph: {
        fontSize: 16,
        textAlign: 'left',
        marginBottom: 10,
    },
    paragraphInput: {
        fontSize: 16,
        textAlign: 'left',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#C42847',
        padding: 10,
        borderRadius: 5,
        width: '100%',
    },
    button: {
        backgroundColor: '#C42847',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
        alignSelf: 'flex-end',
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});

export default UpdateAboutUsPage;

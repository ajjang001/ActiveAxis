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
    const changeLoadingVisible = (b) => {
        setIsLoading(b);
    }


    // load page
    const loadPage = async () => {
        try {
            changeLoadingVisible(true);
            const presenter = new UpdateAboutUsPresenter({ changeAbout, changeLogoURL });
            // load about and logo
            await presenter.displayAboutActiveAxis();
            await presenter.displayLogoURL();
        } catch (error) {
            console.error("Error loading page: ", error);
        } finally {
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
            //console.log({ editedAbout });
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

    const handleAddParagraph = () => {
        setEditedAbout([...editedAbout, '']);
    };

    const handleRemoveParagraph = (index) => {
        const newParagraphs = editedAbout.filter((_, i) => i !== index);
        setEditedAbout(newParagraphs);
    };

    // load page on component mount
    useEffect(() => {
        loadPage();
    }, []);


    return (
        <ScrollView contentContainerStyle={styles.container} keyboardDismissMode='on-drag'>
            <TouchableOpacity onPress={isEditing ? handleSave : handleEdit} style={isEditing ? styles.saveButton : styles.editButton}>
                <Text style={styles.buttonText}>{isEditing ? 'Save' : 'Edit'}</Text>
            </TouchableOpacity>
            <Text style={styles.title}>About ActiveAxis</Text>
            {logoURL ? <Image source={{ uri: logoURL }} style={styles.logo} /> : <ActivityIndicator size='large' color='blue' style={styles.logo} />}
            <View style={styles.divider} />
            <View style={styles.paragraphView}>
                {isEditing ? (
                    editedAbout.map((paragraph, index) => (
                        <View key={index} style={styles.paragraphContainer}>
                            <TextInput
                                key={index}
                                style={styles.paragraphInput}
                                value={paragraph}
                                onChangeText={(text) => handleTextChange(text, index)}
                                multiline
                            />
                            <TouchableOpacity
                                style={styles.paragraphButton}
                                onPress={() => handleRemoveParagraph(index)}
                            >
                                <Text style={styles.buttonText}>-</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                ) : (
                    about.map((paragraph, index) => (
                        <Text key={index} style={styles.paragraph}>{paragraph.trim()}</Text>
                    ))
                )}
                {isEditing && (
                    <TouchableOpacity
                        style={styles.paragraphButton}
                        onPress={handleAddParagraph}
                    >
                        <Text style={styles.buttonText}>+</Text>
                    </TouchableOpacity>
                )}
            </View>

            <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={() => changeLoadingVisible(false)}>
                <LoadingDialog />
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: scale(20),
        paddingTop: scale(-20),
        backgroundColor: '#FBF5F3',
    },
    title: {
        fontSize: scale(30),
        fontWeight: 'bold',
        marginVertical: scale(10),
        alignSelf: 'center',
    },
    logo: {
        width: scale(140),
        height: scale(140),
        borderRadius: scale(20),
    },
    divider: {
        backgroundColor:'#C42847',
        height:scale(15),
        width:'100%',
        marginTop:scale(20),
        marginBottom: scale(10),
    },
    paragraphView: {
        width: '90%',
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
    editButton: {
        backgroundColor: '#E28413',
        paddingHorizontal: scale(40),
        paddingVertical: scale(5),
        alignSelf: 'flex-end',
    },
    saveButton: {
        backgroundColor: '#C42847',
        paddingHorizontal: scale(37),
        paddingVertical: scale(5),
        alignSelf: 'flex-end',
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    paragraphContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    paragraphButton: {
        backgroundColor: '#C42847',
        borderRadius: 3,
        width: '5%',
        alignItems: 'center',
        marginLeft: 10,
        marginBottom: scale(10),
        alignSelf: 'center'
    }
});

export default UpdateAboutUsPage;

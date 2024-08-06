import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { scale } from '../../components/scale';
import ManageAchievementTypePresenter from '../../presenter/ManageAchievementTypePresenter';
import { useFocusEffect } from '@react-navigation/native';

const ManageAchievementTypePage = () => {
    const [achievementTypes, setAchievementTypes] = useState([]);
    const [newType, setNewType] = useState("");
    const [tempUpdate, setTempUpdate] = useState(null);
    const [editingIndex, setEditingIndex] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize presenter once
    const presenter = new ManageAchievementTypePresenter({
        displayAchievementTypes: (types) => {
            setAchievementTypes(types);
            setIsLoading(false);
        },
        updateAchievementTypeArray: (types) => {
            setAchievementTypes(types);
        }
    });

    useFocusEffect(
        useCallback(()=>{
            setAchievementTypes([]);
            presenter.getAchievementTypes();
            console.log(achievementTypes);
        },[])
    );


    const handleAddAchievementType = async () => {
        if (newType.trim() === '') {
            alert('Please enter a valid achievement type.');
            return;
        }
        await presenter.addAchievementType(newType, achievementTypes);
        setAchievementTypes([]);
        presenter.getAchievementTypes();
        setNewType('');
    };

    const handleUpdateAchievementType = async (index) => {
        if(tempUpdate.trim()===''){
            alert('Please enter a non-empty achievement type to update');
            return;
        }
        await presenter.updateAchievementType(index, tempUpdate, achievementTypes);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Achievement Types</Text>
            <TextInput
                style={styles.input}
                placeholder="Add new type"
                value={newType}
                onChangeText={(text)=>setNewType(text)}
            />
            <Button title="Add" onPress={handleAddAchievementType} />
            {isLoading ? (

                <ActivityIndicator size ="large"/>
            
            ) : (
                <FlatList
                    data={achievementTypes}
                    keyExtractor={(item) => item.achievementTypeID.toString()}
                    renderItem={({ item, index }) => (
                        <View style={styles.listItem}>
                            <TextInput
                                style={styles.listInput}
                                value={editingIndex === index ? tempUpdate : item.achievementTypeName}
                                onChangeText={(text)=>{
                                    setEditingIndex(index);
                                    setTempUpdate(text);
                                    console.log(text);
                                }}
                                onEndEditing={() => handleUpdateAchievementType(index)}
                            />
                        </View>
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: scale(20),
        backgroundColor: '#FBF5F3',
    },
    title: {
        fontSize: scale(24),
        fontWeight: 'bold',
        marginBottom: scale(10),
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: scale(10),
        marginBottom: scale(10),
        borderRadius: 5,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: scale(10),
    },
    listInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        padding: scale(10),
        borderRadius: 5,
        marginRight: scale(10),
    },
});

export default ManageAchievementTypePage;

// ManageAchievementTypePage.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import ManageAchievementTypePresenter from '../../presenter/ManageAchievementTypePresenter';

const ManageAchievementTypePage = () => {
    const [achievementTypes, setAchievementTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const presenter = new ManageAchievementTypePresenter({
            displayAchievementTypes: (types) => {
                setAchievementTypes(types);
                setIsLoading(false);
            }
        });

        presenter.getAchievementTypes();
    }, []);

    return (
        <View style={styles.container}>
            {isLoading ? (
                <Text>Loading...</Text>
            ) : (
                <FlatList
                    data={achievementTypes}
                    keyExtractor={(item) => item.achievementTypeID.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.itemContainer}>
                            <Text style={styles.itemText}>{item.achievementTypeName}</Text>
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
        padding: 16,
        backgroundColor: '#fff',
    },
    itemContainer: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    itemText: {
        fontSize: 18,
    },
});

export default ManageAchievementTypePage;

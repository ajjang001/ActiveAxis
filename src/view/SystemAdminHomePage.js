import React from 'react';
import { View, Text} from 'react-native';

const SystemAdminHomePage = ({route}) => {
    const {admin} = route.params;

    return (
        <View>
            <Text>This is System Admin Home page</Text>
            <Text>Welcome {admin.username}</Text>
        </View>
    );
};

export default SystemAdminHomePage;
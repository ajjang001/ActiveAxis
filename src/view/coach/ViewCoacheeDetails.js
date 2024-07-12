import { View, Text, StyleSheet, TextInput, Image, ScrollView, Modal, TouchableOpacity } from "react-native"
import { scale } from "../../components/scale";
import React, { useEffect, useState } from "react";
import { LoadingDialog, MessageDialog } from "../../components/Modal";

const ViewCoacheeDetails = ({ route }) => {

    const { coach } = route.params;

    //debugging log
    console.log({ coach });
    return (
        <View>
            <Text>Coach Details here!</Text>
        </View>
    )
}

const styles = StyleSheet.create({

});

export default ViewCoacheeDetails;
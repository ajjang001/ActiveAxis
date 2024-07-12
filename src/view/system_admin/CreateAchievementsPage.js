import React, {useEffect, useState, useRef} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

import CreateAchievementPresenter from '../../presenter/CreateAchievementPresenter';
import { scale } from '../../components/scale';


const CreateAchievementsPage = ({ navigation }) => {
  const [photo, setPhoto] = useState(null);
  const [exerciseType, setExerciseType] = useState();
  const [details, setDetails] = useState('');
  const [dropdownOpt, setDropdownOpt] = useState([]);

  const [isPhotoSet, setIsPhotoSet] = useState(false);

  // to close dropdown
  const dropdownRef = useRef(null);


// Render Dropdown options
const renderItem=(item)=>{
  return(
    <TouchableOpacity activeOpacity={.7} style={styles.item}
    onPress={()=>{
        setExerciseType(item.id);
        dropdownRef.current.close();
    }}
    >
            <Text style={styles.itemText}>{item.name}</Text>
    </TouchableOpacity> 
    );
  };

  const loadType = async () => {
    await new CreateAchievementPresenter({setOptions:setDropdownOpt}).getExerciseType();
  };

  useEffect(() => {
    loadType();
  },[]);





  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Achievement</Text>
      
      <View style={styles.imagePlaceholder} />
      <Text style={styles.detailsTitle}>Achievement Details:</Text>
        <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={dropdownOpt}
            maxHeight={300}
            labelField="name"
            valueField="id"
            placeholder="Select Type"
            value={exerciseType}
            onChange={type => {
                setExerciseType(type);
            }}
            renderItem={renderItem}
            ref={dropdownRef}
        />

      <TextInput
        style={styles.detailsInput}
        placeholder="Enter details here..."
        value={details}
        onChangeText={(text) => setDetails(text)}
        multiline
      />
      <TouchableOpacity style={styles.postButton} onPress={() => { /* Handle post action */ }}>
        <Text style={styles.postButtonText}>POST</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FBF5F3',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: '#D3D3D3',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsTitle: {
    alignSelf: 'flex-start',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dropdown: {
    height: scale(30),
    width: '40%',
    margin:5,
    padding:scale(10),
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
    backgroundColor: 'white',
    borderRadius:8,
    alignSelf:'flex-start',
  },
  placeholderStyle: {
      fontSize: scale(13)
  },
  selectedTextStyle: {
      fontSize: scale(15),
      height:scale(18),
  },
  item: {
      paddingLeft: scale(5),
      height:scale(25),
      borderWidth:1,
      borderColor: 'lightgrey',
  },
  itemText: {
      fontSize: scale(12),
      fontFamily:'Poppins-Medium'
  },

  detailsInput: {
    width: '100%',
    height: 100,
    backgroundColor: '#FFF',
    padding: 10,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
  postButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#B22222',
    borderRadius: 5,
    alignItems: 'center',
  },
  postButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CreateAchievementsPage;

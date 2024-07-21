import React, {useEffect, useState, useRef} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Modal } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { launchImageLibrary } from 'react-native-image-picker';

import CreateAchievementPresenter from '../../presenter/CreateAchievementPresenter';
import { scale } from '../../components/scale';
import { ScrollView } from 'react-native-gesture-handler';
import { ActionDialog, LoadingDialog, MessageDialog } from '../../components/Modal';


const CreateAchievementsPage = ({ navigation }) => {
  const [photo, setPhoto] = useState(null);
  const [achievementType, setAchievementType] = useState(1);
  const [details, setDetails] = useState('');
  const [name, setName] = useState('');
  const [target, setTarget] = useState(0);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMsg, setModalMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');

  const [dropdownOpt, setDropdownOpt] = useState([]);
  
  // to close dropdown
  const dropdownRef = useRef(null);

  // change popup/modal visible
  const changeLoadingVisible = (b)=>{
      setIsLoading(b);
  }

  // change popup/modal visible
  const changeModalVisible = (b, m)=>{
      setModalMsg(m);
      setModalVisible(b);
  }

  // change popup/modal visible
  const changeConfirmVisible = (b, m)=>{
      setConfirmMessage(m);
      setConfirmationVisible(b);
  }

  // handle select photo
  const handleSelectPhoto = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const asset = response.assets[0];
        const uri = asset.uri;
        const name = asset.fileName || uri.split('/').pop();
        
        setPhoto({ uri, name });
      }
    });
  };


// Render Dropdown options
const renderItem=(item)=>{
  return(
    <TouchableOpacity activeOpacity={.7} style={styles.item}
    onPress={()=>{
        setAchievementType(item.achievementTypeID);

        dropdownRef.current.close();
    }}
    >
            <Text style={styles.itemText}>{item.achievementTypeName}</Text>
    </TouchableOpacity> 
    );
  };

  const loadType = async () => {
    try{
      changeLoadingVisible(true);
      setDropdownOpt([]);
      await new CreateAchievementPresenter({setOptions:setDropdownOpt}).getAchievementTypes();
    }catch(error){
      changeModalVisible(true, error.message);
    }finally{
      changeLoadingVisible(false);
    }
  };

  const createHandler = async () => {
    try{
        changeLoadingVisible(true);
        const typeName = dropdownOpt.find((item) => item.achievementTypeID === achievementType).achievementTypeName;
        
        await new CreateAchievementPresenter({type:{typeID: achievementType,typeName: typeName}, name:name, description:details, target:target, photo: photo}).createAchievement();
        navigation.navigate('AchievementsPage', {refresh: true});
    }catch(e){
        let errorMessage = e.message;
        if (errorMessage.startsWith("Error: ")) {
          errorMessage = errorMessage.slice(7); 
        }
        changeModalVisible(true, errorMessage);
    }finally{
        changeLoadingVisible(false);
    }
  };

  useEffect(() => {
    loadType();
  },[]);





  return (
    <ScrollView style={styles.container} contentContainerStyle={{alignItems: 'center'}}>
      
      <Text style={styles.title}>Create Achievement</Text>
      
      <TouchableOpacity style={styles.imagePlaceholder} onPress={handleSelectPhoto}>
        {
          photo ? 
          (
            <Image source={{uri:photo.uri}} style={{width: scale(200), height: scale(200)}} />
          )
          :
          (
            
              <Image source={require('../../../assets/upload_icon.png')} style={{width: scale(200), height: scale(200)}} />
            
          )

        }
        
      </TouchableOpacity>

      <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={()=>changeLoadingVisible(false)}>
          <LoadingDialog />
      </Modal>
      <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={()=>changeModalVisible(false)}>
          <MessageDialog message = {modalMsg} changeModalVisible = {changeModalVisible} />
      </Modal>
      
      

      

      

      <Text style={styles.detailsTitle}>Achievement Name:</Text>
      <TextInput
        style={styles.detailsInput}
        placeholder="Enter achievement name here..."
        value={name}
        onChangeText={(text) => setName(text)}
        maxLength={18}
      />

      <Text style={styles.detailsTitle}>Achievement Descriptions:</Text>
      <TextInput
        style={styles.detailsInput}
        placeholder="Enter descriptions here..."
        value={details}
        onChangeText={(text) => setDetails(text)}
        
      />

      <Text style={styles.detailsTitle}>Type:</Text>
      <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={dropdownOpt}
          maxHeight={300}
          labelField="achievementTypeName"
          valueField="achievementTypeID"
          placeholder="Select Type"
          value={achievementType}
          onChange={type => {
              setAchievementType(type);
          }}
          renderItem={renderItem}
          ref={dropdownRef}
      />

      <Text style={styles.detailsTitle}>Achievement Target:</Text>
      <TextInput
          style={styles.detailsInput}
          placeholder='Enter target here...'
          keyboardType="phone-pad"
          returnKeyType='done'
          value={target}
          onChangeText={num => setTarget(num)}
      />
      <TouchableOpacity style={styles.postButton} onPress={createHandler}>
        <Text style={styles.postButtonText}>CREATE</Text>
      </TouchableOpacity>
      
    </ScrollView>
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
    marginBottom: scale(20),
  },
  imagePlaceholder: {
    width: scale(200),
    height: scale(200),
    backgroundColor: '#D3D3D3',
    marginBottom: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  detailsTitle: {
    alignSelf: 'flex-start',
    fontSize: scale(15),
    fontWeight: 'bold',
    marginBottom: scale(10),
  },
  dropdown: {
    height: scale(50),
    width: '100%',
    padding:scale(10),
    backgroundColor: 'white',
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: scale(20),
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
      height:scale(30),
      borderWidth:1,
      borderColor: 'lightgrey',
      paddingVertical: scale(5),
  },
  itemText: {
      fontSize: scale(12),
      fontFamily:'Poppins-Medium'
  },

  detailsInput: {
    width: '100%',
    backgroundColor: '#FFF',
    padding: scale(10),
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: scale(20),
  },
  postButton: {
    width: '100%',
    padding: scale(15),
    backgroundColor: '#B22222',
    borderRadius: 5,
    alignItems: 'center',
  },
  postButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: scale(16),
  },
});

export default CreateAchievementsPage;

import React, {useState} from 'react'
import {View, ImageBackground, Image, StyleSheet, Text, TextInput, KeyboardAvoidingView, Platform} from 'react-native'
import{RectButton} from 'react-native-gesture-handler'
import {Feather as Icon} from '@expo/vector-icons'
import {useNavigation} from '@react-navigation/native'
// import {Roboto_400Regular, Roboto_500Medium} from '@expo-google-fonts/roboto'
// import {Ubuntu_700Bold, useFonts} from '@expo-google-fonts/ubuntu'

const Home = () => {
    const navigation = useNavigation()
    const [city, setCity] = useState('')
    const [state, setState] = useState('')

    const handleNavigateToPoints = () => {
        navigation.navigate('Places', {
            state,
            city,
        })
    }

    return (
        <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ImageBackground source={require('../../assets/home-background.png')} imageStyle={{width:274, height:368}} style={styles.container}>
            <View style={styles.main}>
                <Image source={require('../../assets/logo.png')}/>
                <View>
                    <Text style={styles.title}>Your marketplace of waste collection</Text>
                    <Text style={styles.description}>We help you find a place to discard your waste</Text>
                </View>
            </View>
            
            <View style={styles.footer}>
                <TextInput 
                   style={styles.input}
                   placeholder='Type your State'
                   value={state}
                   onChangeText={text => setState(text)}
                   maxLength={2}
                   autoCapitalize='characters'
                   autoCorrect={false}
                   />
                <TextInput 
                   style={styles.input}
                   placeholder='Type your City' 
                   value={city}
                   onChangeText={setCity}
                   autoCorrect={false}
                />
                <RectButton onPress={handleNavigateToPoints} style={styles.button}>
                    <View style={styles.buttonIcon}>
                       <Icon name='arrow-right' color='#fff' size={24}/>
                    </View>
                    <Text style={styles.buttonText}>Enter</Text>
                </RectButton>
            </View>
        </ImageBackground>
        </KeyboardAvoidingView>
    )    
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 32,
    },
  
    main: {
      flex: 1,
      justifyContent: 'center',
    },
  
    title: {
      color: '#322153',
      fontSize: 32,
    //   fontFamily: 'Ubuntu_700Bold',
      maxWidth: 260,
      marginTop: 64,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 16,
    //   fontFamily: 'Roboto_400Regular',
      maxWidth: 260,
      lineHeight: 24,
    },
  
    footer: {},
  
    select: {},
  
    input: {
      height: 60,
      backgroundColor: '#FFF',
      borderRadius: 10,
      marginBottom: 8,
      paddingHorizontal: 24,
      fontSize: 16,
    },
  
    button: {
      backgroundColor: '#34CB79',
      height: 60,
      flexDirection: 'row',
      borderRadius: 10,
      overflow: 'hidden',
      alignItems: 'center',
      marginTop: 8,
    },
  
    buttonIcon: {
      height: 60,
      width: 60,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      justifyContent: 'center',
      alignItems: 'center'
    },
  
    buttonText: {
      flex: 1,
      justifyContent: 'center',
      textAlign: 'center',
      color: '#FFF',
    //   fontFamily: 'Roboto_500Medium',
      fontSize: 16,
    }
  });

export default Home
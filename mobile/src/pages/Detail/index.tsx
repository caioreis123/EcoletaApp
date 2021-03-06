import React, {useEffect, useState} from 'react'
import {View, StyleSheet, TouchableOpacity, Image, Text, Linking} from 'react-native'
import {Feather as Icon, FontAwesome} from '@expo/vector-icons'
import {useNavigation, useRoute} from '@react-navigation/native'
import { RectButton } from 'react-native-gesture-handler'
import api from '../../services/api'
import * as MailComposer from 'expo-mail-composer'

const Detail = () => {
    const navigation = useNavigation()
    const route = useRoute()

    interface Params {
        place_id:number;
    }

    interface Data {
       place:{
           image:string;
           url: string;
           name:string;
           email:string;
           whatsapp:string;
           city:string;
           state:string;
       };
       itemsColectedByThePlace:{
           title: string;
       }[];
    }

    const routeParams = route.params as Params

    const [data, setData] = useState<Data>({} as Data)

    useEffect(()=>{
        api.get(`places/${routeParams.place_id}`).then(response=>{
            console.log(`olha a response:${response}`)
            setData(response.data)
        })
    }, [])

    const handleComposeMail = () => {
        MailComposer.composeAsync({
            subject: 'I want to talk about waste collection',
            recipients: [data.place.email],
        })
    }

    const handleWhatsapp = () => {
        Linking.openURL(`whatsapp://send?phone=${data.place.whatsapp}&text=Let's talk about waste collection`)
    }

    const handleNavigateBack = () => {
        navigation.goBack()
    }

    if (!data.place){
        return null
    }

    return (
        <>
            <View style={styles.container}>
                <TouchableOpacity onPress={handleNavigateBack}>
                    <Icon name='arrow-left' size={20} color='#34cd79' />
                </TouchableOpacity> 

                <Image style={styles.pointImage} source={{uri:data.place.url}} />
                <Text style={styles.pointName}>{data.place.name}</Text>
                <Text style={styles.pointItems}>{data.itemsColectedByThePlace.map(item=>item.title).join(', ')}</Text>

                <View style={styles.address}>
                    <Text style={styles.addressTitle}>Address</Text>
                    <Text style={styles.addressContent}>{data.place.city}, {data.place.state}</Text>
                </View>
            </View>

            <View style={styles.footer}>
                <RectButton style={styles.button} onPress={handleWhatsapp}>
                    <FontAwesome name='whatsapp' size={20} color='#fff'/>
                    <Text>  Whatsapp</Text>
                </RectButton>
                <RectButton style={styles.button} onPress={handleComposeMail}>
                    <Icon name='mail' size={20} color='#fff'/>
                    <Text>  E-mail</Text>
                </RectButton>
            </View>
        </>
    )
}

export default Detail

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 32,
      paddingTop: 50,
    },
  
    pointImage: {
      width: '100%',
      height: 120,
      resizeMode: 'cover',
      borderRadius: 10,
      marginTop: 32,
    },
  
    pointName: {
      color: '#322153',
      fontSize: 28,
    //   fontFamily: 'Ubuntu_700Bold',
      marginTop: 24,
    },
  
    pointItems: {
    //   fontFamily: 'Roboto_400Regular',
      fontSize: 16,
      lineHeight: 24,
      marginTop: 8,
      color: '#6C6C80',
    },
  
    address: {
      marginTop: 32,
    },
  
    addressTitle: {
      color: '#322153',
    //   fontFamily: 'Roboto_500Medium',
      fontSize: 16,
    },
  
    addressContent: {
    //   fontFamily: 'Roboto_400Regular',
      lineHeight: 24,
      marginTop: 8,
      color: '#6C6C80',
    },
  
    footer: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderColor: '#999',
      paddingVertical: 20,
      paddingHorizontal: 32,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  
    button: {
      width: '48%',
      backgroundColor: '#34CB79',
      borderRadius: 10,
      height: 50,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
  
    buttonText: {
      marginLeft: 8,
      color: '#FFF',
      fontSize: 16,
    //   fontFamily: 'Roboto_500Medium',
    },
  });
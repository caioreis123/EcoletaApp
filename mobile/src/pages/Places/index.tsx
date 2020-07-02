import React, {useEffect, useState} from 'react'
import {View, StyleSheet, TouchableOpacity, Text, ScrollView, Image, Alert} from 'react-native'
import {useNavigation, useRoute} from '@react-navigation/native'
import {Feather as Icon} from '@expo/vector-icons'
import MapView, {Marker} from 'react-native-maps'
import {SvgUri} from 'react-native-svg'
import api from '../../services/api'
import * as Location from 'expo-location'

interface Item{
    id: number;
    title: string;
    url: string;
}
interface Place{
    id: number;
    image: string;
    name: string;
    latitude: number;
    longitude: number;
}

interface Params{
    state:string;
    city: string;
}

const Places = () => {
    const [items, setItems] = useState<Item[]>([])
    const [places, setPlaces] = useState<Place[]>([])
    const [selectedItems, setSelectedItems] = useState<number[]>([])
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0,0])

    useEffect(()=>{
        async function loadPosition(){
            const {status} = await Location.requestPermissionsAsync()
            if (status !== 'granted'){
                Alert.alert('We need your permission to get your location')
                return
            }

            const location = await Location.getCurrentPositionAsync()

            const {latitude, longitude} = location.coords

            setInitialPosition([latitude, longitude])
        }

        loadPosition()
    }, [])

    useEffect(()=>{
        api.get('items').then(response => {
            setItems(response.data)
        })
    }, [])

    useEffect(()=>{
        api.get('places', {
            params:{
                city: routeParams.city,
                state: routeParams.state,
                items: selectedItems,
            }
        }).then(response=>{
            setPlaces(response.data)
        })
    }, [selectedItems])
    
    const navigation = useNavigation()

    const routes = useRoute()

    const routeParams = routes.params as Params
    
    const handleNavigateBack = () => {
        navigation.goBack()
    }

    const handleNavigateToDetail = (id: number) => {
        navigation.navigate('Detail', {place_id: id})
    }

    const handleSelectItem = (id:number) => {
        const alreadySelected = selectedItems.findIndex(e => e === id )
        if(alreadySelected !== -1){
            const filteredItems = selectedItems.filter(e => e !== id)
            setSelectedItems(filteredItems)
        }
        else{
            setSelectedItems([...selectedItems, id])
        }
    }

    return (
        <>
            <View style={styles.container}>
                <TouchableOpacity onPress={handleNavigateBack}>
                    <Icon name='arrow-left' size={20} color='#34cd79' />
                </TouchableOpacity> 

                <Text style={styles.title}>Welcome!</Text>
                <Text style={styles.description}>Find a place to discard</Text>

                <View style={styles.mapContainer}>
                    {initialPosition[0] !== 0 && (
                        <MapView 
                        style={styles.mapContainer}
                        initialRegion={{
                            latitude: initialPosition[0],
                            longitude: initialPosition[1],
                            latitudeDelta: 0.014,
                            longitudeDelta: 0.014,
                        }}
                    >
                        {places.map((place)=>(
                            <Marker
                            key={place.id}
                            onPress={()=>handleNavigateToDetail(place.id)}
                            coordinate={{
                                latitude: place.latitude,
                                longitude: place.longitude,
                            }}
                        >
                            <View style={styles.mapMarkerContainer}>
                                <Image style={styles.mapMarkerImage} source={{uri:place.image}} />
                                <Text style={styles.mapMarkerTitle}>{place.name}</Text>
                            </View>
                        </Marker>
                        ))}
                    </MapView>
                    )}
                </View>
            </View>

            <View style={styles.itemsContainer}>
                <ScrollView 
                    horizontal
                    contentContainerStyle={{
                        paddingHorizontal:20,
                    }}
                >
                   {items.map(item=>(
                    <TouchableOpacity 
                        onPress={()=>handleSelectItem(item.id)} 
                        key={item.id} 
                        style={[
                            styles.item,
                            selectedItems.includes(item.id) ? styles.selectedItem : {},
                        ]}
                        activeOpacity={0.6}
                    >
                        <SvgUri width={42} height={42} uri={item.url} />
                        <Text style={styles.itemTitle}>{item.title}</Text>
                    </TouchableOpacity>
                   ))}
                </ScrollView>
            </View>
        </>
    )
    
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 32,
      paddingTop: 50,
    },
  
    title: {
      fontSize: 20,
    //   fontFamily: 'Ubuntu_700Bold',
      marginTop: 24,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 4,
    //   fontFamily: 'Roboto_400Regular',
    },
  
    mapContainer: {
      flex: 1,
      width: '100%',
      borderRadius: 10,
      overflow: 'hidden',
      marginTop: 16,
    },
  
    map: {
      width: '100%',
      height: '100%',
    },
  
    mapMarker: {
      width: 90,
      height: 80,
    },
  
    mapMarkerContainer: {
      width: 90,
      height: 70,
      backgroundColor: '#34CB79',
      flexDirection: 'column',
      borderRadius: 8,
      overflow: 'hidden',
      alignItems: 'center',
    },
  
    mapMarkerImage: {
      width: 90,
      height: 45,
      resizeMode: 'cover',
    },
  
    mapMarkerTitle: {
      flex: 1,
    //   fontFamily: 'Roboto_400Regular',
      color: '#FFF',
      fontSize: 10,
      lineHeight: 23,
    },
  
    itemsContainer: {
      flexDirection: 'row',
      marginTop: 16,
      marginBottom: 32,
    },
  
    item: {
      backgroundColor: '#fff',
      borderWidth: 2,
      borderColor: '#eee',
      height: 120,
      width: 120,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingTop: 20,
      paddingBottom: 16,
      marginRight: 8,
      alignItems: 'center',
      justifyContent: 'space-between',
  
      textAlign: 'center',
    },
  
    selectedItem: {
      borderColor: '#34CB79',
      borderWidth: 2,
    },
  
    itemTitle: {
    //   fontFamily: 'Roboto_400RfontFaegular',
      textAlign: 'center',
      fontSize: 13,
    },
  });

export default Places
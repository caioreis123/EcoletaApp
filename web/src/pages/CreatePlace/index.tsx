import React, {useEffect, useState, ChangeEvent, FormEvent} from 'react'
import './styles.css'
import logo from '../../assets/logo.svg'
import { Link, useHistory } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import {Map, TileLayer, Marker} from 'react-leaflet'
import api from '../../services/api'
import axios from 'axios'
import {LeafletMouseEvent} from 'leaflet'

//in TS we need to inform the types of each element inside an object or array:
interface Item{
    id: number;
    title: string;
    url: string;
}
interface Uf{
    sigla: string;
}
interface Cities{
    nome: string;
}

const CreatePoint = () =>{

    const [items, setItems] = useState<Item[]>([])
    const [selectedItems, setSelectedItems] = useState<number[]>([])
    const [ufs, setUfs] = useState<string[]>([])
    const [cities, setCities] = useState<string[]>([])
    const [selectedUf, setSelectedUf] = useState<string>('0')
    const [selectedCity, setSelectedCity] = useState<string>('0')
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0,0])
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0,0])
    const [formData, setFormData] = useState({
        name:'',
        email:'',
        whatsapp:''
    })

    const history = useHistory()

    useEffect(()=>{
        navigator.geolocation.getCurrentPosition(position=>{
            const {latitude, longitude} = position.coords
            setInitialPosition([
                latitude,
                longitude
            ])
        })
    })
    
    useEffect(()=>{
        api.get('/items').then(response=>{
            setItems(response.data)
        })
    },[])

    useEffect(()=>{
        axios.get<Uf[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome').then(response=>{
            const ufs = response.data.map(e=>e.sigla)
            setUfs(ufs)
        })
    }, [])

    useEffect(()=>{
        axios.get<Cities[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios?orderBy=nome`).then(response=>{
            const cities = response.data.map(e=>e.nome)
            setCities(cities)
        })
    }, [selectedUf])
    
    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>){
        const uf = event.target.value
        setSelectedUf(uf)
    }

    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>){
        const city = event.target.value
        setSelectedCity(city)
    }

    function handleMapClick(event:LeafletMouseEvent){
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng,
        ])
    }

    function handleInputChange(event:ChangeEvent<HTMLInputElement>){
        const {name, value} = event.target
        setFormData({...formData, [name]: value})
    }

    function handleSelectItem(id:number){
        const alreadySelected = selectedItems.findIndex(e => e === id )
        if(alreadySelected !== -1){
            const filteredItems = selectedItems.filter(e => e !== id)
            setSelectedItems(filteredItems)
        }
        else{
            setSelectedItems([...selectedItems, id])
        }
    }

    async function handleSubmit(event:FormEvent){
        event.preventDefault()
        const {name, email, whatsapp} = formData
        const uf = selectedUf
        const city = selectedCity
        const[latitude, longitude] = selectedPosition
        const items = selectedItems
        const data = {
            name,
            email,
            whatsapp,
            state: uf,
            city,
            latitude,
            longitude,
            items
        }
        await api.post('places', data)
        alert('Registration complete!')
        history.push('/')
    }

    return(
       <div id="page-create-place">
           <header>
               <img src={logo} alt="Ecoleta"/>
               <Link to='/'>
                   <FiArrowLeft/>
                   Back to home
               </Link>
           </header>

           <form onSubmit={handleSubmit}>
               <h1>Register waste collection place</h1>
               <fieldset>
                   <legend>
                       <h2>Basic Information</h2>
                   </legend>

                   <div className="field">
                       <label htmlFor="name">Place name</label>
                       <input 
                       type="text"
                       name='name'
                       id='name'
                       onChange={handleInputChange}
                       />
                   </div>
                   <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input 
                            type="email"
                            name='email'
                            id='email'
                            onChange={handleInputChange}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input 
                            type="text"
                            name='whatsapp'
                            id='whatsapp'
                            onChange={handleInputChange}
                            />
                        </div>
                   </div>
               </fieldset>
               <fieldset>
                   <legend>
                       <h2>Address</h2>
                       <span>Select the address in the map</span>
                   </legend>

                   <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
                       <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
                       />
                       <Marker position={selectedPosition}/>
                   </Map>

                   <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">State(UF)</label>
                            <select onChange={handleSelectUf} name="uf" id="uf" value={selectedUf}>
                                <option value="0">Select a State</option>
                                {ufs.map(uf=>(
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>

                        <div className="field">
                            <label htmlFor="city">City</label>
                            <select name="city" id="city" onChange={handleSelectCity} value={selectedCity}>
                                <option value="0">Select a City</option>
                                {cities.map(city=>(
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                   </div>
               </fieldset>
               <fieldset>
                   <legend>
                       <h2>Collected Items</h2>
                       <span>Select one or more itens</span>
                   </legend>
                   <ul className="items-grid">
                       {items.map(item=>(
                            <li 
                            key={item.id} 
                            onClick={()=>handleSelectItem(item.id)}
                            className={selectedItems.includes(item.id)?'selected':''}
                            >
                                <img src={item.url} alt="teste"/>
                                <span>{item.title}</span>
                            </li>
                       ))}
                   </ul>
               </fieldset>
               <button type='submit'>
                   Register a waste collection place
               </button>
           </form>
       </div>
    )
}

export default CreatePoint
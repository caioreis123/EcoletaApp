import React from 'react'
import logo from '../../assets/logo.svg'
import './styles.css'
import {FiLogIn} from 'react-icons/fi'
import {Link} from 'react-router-dom'

const Home = () =>{
    return(
        <div id="page-home">
            <div className="content">
                <header>
                    <img src={logo} alt="Ecoleta"/>
                </header>
                <main>
                    <h1>Your marketplace for recycling</h1>
                    <p>We help people find places for proper waste disposal</p>
                    <Link to="/create-place">
                        <span>
                            <FiLogIn/>
                        </span>
                        <strong>Register a waste collection place</strong>
                    </Link>
                </main>
            </div>
        </div>
    )
}

export default Home
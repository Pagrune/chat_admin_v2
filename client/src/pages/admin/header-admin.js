import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Header = () => {
    const [sujets, setSujets] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:4000/sujet')
            .then(response => {
                setSujets(response.data);
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des sujets:", error);
            });
    }, []);

    return (
        <div className='header'>
            <nav className='menu_navigation'>
                <a href='/admin'>Page accueil administration</a>
                <a href='/admin/conv-open'>Conversations en cours</a>
                <a href='/admin/conv-closed'>Conversations fermées</a>
               
            </nav>
        </div>
    );
};

export default Header;

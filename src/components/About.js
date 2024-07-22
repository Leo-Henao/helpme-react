import React from 'react';
import Card from './ui/Card';
import '../index.css';

// simulamos una tabla
const cardsContent = [
    {
        id: 1,
        title: '¿Quienes somos?',
        texto: 'HelmeIUD nace para combatir la violencia, los hechos que no son noticia y quedan impunes...',
        subtitle: 'HelmeIUD',
        src: 'https://www.iudigital.edu.co/images/Noticias/2024/Boletin_19/Danilo%20y%20su%20familia.webp'
    },
    {
        id: 2,
        title: 'Proyecto',
        texto: 'Ayudar en comunidad a estar prevenidos por la ola de violencia que asota la ciudad en los distintos sitios...',
        subtitle: 'Unidos somos más',
        src: 'https://www.iudigital.edu.co/images/Noticias/2024/Boletin_17/Banner_Alexandra.webp'
    }
]

export default function About() {

    return (
        <div className="container my-3">
            <div className="row row-cols-1 row-cols-md-3 g-4 needs-validation">
            {
                cardsContent.map(c => {
                    return (
                        <div className="col" key = {c.id}>
                        <Card 
                            
                            title={c.title}
                            texto={c.texto}
                            subtitle={`HelmeIUD`} 
                            src={c.src}
                        />
                        </div> 
                    )
                })
            }
            </div>
        </div>
    )
}

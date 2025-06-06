import React from 'react';
import { useNavigate } from 'react-router-dom';
import SideDrawer from '../components/SideDrawer';
import Button from '../components/Button';
import styles from './Home.module.css';


function Home() {
    const navigate = useNavigate();

    const handleVenderClick = () => {
        navigate('/venda');
    };

    return (
        <div className='flex h-screen'>
            <SideDrawer isOpen={true} />
            <div className='flex flex-col ml-[250px] '>
                <div className='flex-grow p-4'>
                    <div className='py-10 px-12'>
                        <h1>BEM VINDO AO CAIXA DA FILIGRANA!</h1>
                        <h2 className='light'>COMECE UMA NOVA VENDA</h2>
                    </div>
                </div>
                <div className='p-20'>
                    <Button size='big' onClick={handleVenderClick}>VENDER</Button>
                </div>
            </div>
        </div>
    );
}

export default Home;

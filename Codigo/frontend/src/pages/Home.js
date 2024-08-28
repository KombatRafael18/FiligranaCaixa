import React from 'react';
import SideDrawer from '../components/SideDrawer';

function Home() {

    return (
        <div className='flex'>
            <SideDrawer isOpen={true} />
            <div className='flex-1 p-4 ml-[250px]'>
                
                <div className='py-10 px-12'>
                <h1>BEM VINDO AO CAIXA DA FILIGRANA</h1>
                <h2 className='light'>COMEÇE UMA NOVA VENDA</h2>

                </div>


              
            </div>
        </div>
    );
}

export default Home;

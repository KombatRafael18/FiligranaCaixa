import React from 'react';
import SideDrawer from '../components/SideDrawer';
import Button from '../components/Button';

function Home() {

    return (
        <div className='flex h-screen'>
            <SideDrawer isOpen={true} />
            <div className='flex-1 flex flex-col ml-[250px]'>
                <div className='flex-grow p-4'>
                    <div className='py-10 px-12'>
                        <h1>BEM VINDO AO CAIXA DA FILIGRANA</h1>
                        <h2 className='light'>COMEÇE UMA NOVA VENDA</h2>
                    </div>
                </div>
                <div className='p-20'>
                    <Button size='big'>VENDER</Button>
                </div>
            </div>
        </div>
    );
}

export default Home;

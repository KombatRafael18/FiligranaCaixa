import React from 'react';
import SideDrawer from '../components/SideDrawer';
import Button from '../components/Button';
import { useState } from 'react';

function Venda() {
    const [isRegistered, setIsRegistered] = useState('');
    const [clientType, setClientType] = useState('');


    return (
        <div className='flex h-screen'>
            <SideDrawer isOpen={true} />
            <div className='flex flex-col items-center ml-[250px] mt-20 flex-grow'>
                <h1 className='text-center mb-40'>SELECIONE O TIPO DE VENDA</h1>
                {isRegistered === '' ? (
                    <div className='flex flex-row gap-60'>
                        <div className='flex flex-col items-center'>
                            <Button
                                size="giant"
                                image={require('../assets/images/semCadastro.png')}
                                onClick={() => setIsRegistered('false')}
                            />
                            <h2 className="max-w-[250px] mt-4 text-center text-[33px]">SEM CADASTRO</h2>
                        </div>
                        <div>
                            <Button
                                size="giant"
                                image={require('../assets/images/comCadastro.png')}
                                onClick={() => setIsRegistered('true')}
                            />
                            <h2 className="max-w-[250px] mt-4 text-center text-[33px]">CLIENTE CADASTRADO</h2>
                        </div>
                    </div>
                ) : (
                    <div className='flex flex-row gap-60'>
                        <div className='flex flex-col items-center'>
                        <Button
                                size="giant"
                                image={require('../assets/images/atacado.png')}
                                onClick={() => setClientType('atacado')}
                            />
                            <h2 className="max-w-[250px] mt-4 text-center text-[33px]">ATACADO</h2>
                        </div>
                        <div className='flex flex-col items-center'>
                        <Button
                                size="giant"
                                image={require('../assets/images/varejo.png')}
                                onClick={() => setClientType('varejo')}
                            />
                            <h2 className="max-w-[250px] mt-4 text-center text-[33px]">VAREJO</h2>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Venda;

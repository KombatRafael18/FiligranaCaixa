import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SideDrawer from '../components/SideDrawer';
import Button from '../components/Button';
import { SVenda } from '../assets/strings';

function Venda() {
    const [isRegistered, setIsRegistered] = useState('');
    const navigate = useNavigate();

    const handleClientTypeClick = (type) => {
        navigate('/fechamento-venda');
    };

    return (
        <div className='flex h-screen'>
            <SideDrawer isOpen={true} />
            <div className='flex flex-col items-center ml-[250px] mt-20 flex-grow'>
                <h1 className='text-center mb-40'>{SVenda.Tipo_Venda_Titulo}</h1>   
                {isRegistered === '' ? (
                    <div className='flex flex-row gap-60'>
                        <div className='flex flex-col items-center'>
                            <Button
                                size="giant"
                                image={require('../assets/images/semCadastro.png')}
                                onClick={() => setIsRegistered('false')}
                            />
                            <h2 className="max-w-[250px] mt-4 text-center text-[33px]">{SVenda.Cliente_Sem_Cadastrado}</h2>
                        </div>
                        <div>
                            <Button
                                size="giant"
                                image={require('../assets/images/comCadastro.png')}
                                onClick={() => setIsRegistered('true')}
                            />
                            <h2 className="max-w-[250px] mt-4 text-center text-[33px]">{SVenda.Cliente_Cadastrado}</h2>
                        </div>
                    </div>
                ) : (
                    <div className='flex flex-row gap-60'>
                        <div className='flex flex-col items-center'>
                            <Button
                                size="giant"
                                image={require('../assets/images/atacado.png')}
                                onClick={() => handleClientTypeClick('atacado')}
                            />
                            <h2 className="max-w-[250px] mt-4 text-center text-[33px]">{SVenda.Atacado}</h2>
                        </div>
                        <div className='flex flex-col items-center'>
                            <Button
                                size="giant"
                                image={require('../assets/images/varejo.png')}
                                onClick={() => handleClientTypeClick('varejo')}
                            />
                            <h2 className="max-w-[250px] mt-4 text-center text-[33px]">{SVenda.Varejo}</h2>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Venda;
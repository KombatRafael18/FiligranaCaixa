import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SideDrawer from '../components/SideDrawer';
import Button from '../components/Button';
import { SVenda, SCadastro } from '../assets/Strings/stringsVenda';
import Input from '../components/Input';
import styles from './Venda.module.css';

function Venda() {
    const [isRegistered, setIsRegistered] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [clientData, setClientData] = useState(null);
    const [cpf, setCpf] = useState('');
    const [searchFailed, setSearchFailed] = useState(false);
    const navigate = useNavigate();

    const handleClientTypeClick = (type) => {
        console.log('Tipo de venda:', type); 
        navigate('/fechamento-venda', { state: { clientData, sellType: type } }); 
    };

    const handleClienteCadastradoClick = () => {
        setIsModalOpen(true);
    };

    const handleModalCloseAndReset = () => {
        setIsModalOpen(false);
        setClientData(null);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    function searchClient(cpf) {
        console.log('buscar cliente');
        fetch(`http://localhost:3000/api/clients/cpf/${cpf}`)
            .then(response => {
                if (response.status === 400) {
                    setSearchFailed(true);
                    throw new Error('Cliente não encontrado');
                }
                return response.json();
            })
            .then(data => {
                setClientData(data);
                setSearchFailed(false); 
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    const confirmClient = () => {
        setIsRegistered('true');
        handleModalClose();
        console.log(clientData);
       
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
                                onClick={handleClienteCadastradoClick}
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

            {isModalOpen && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
                    <div className='bg-white p-8 rounded shadow-lg w-[500px]'>
                        <div className='flex items-center justify-between'>
                            <h3>{SVenda.Buscar_Cliente}</h3>
                            <span className='close cursor-pointer text-3xl' onClick={handleModalCloseAndReset}>&times;</span>
                        </div>

                        <div className='flex flex-col mt-2'>
                            <Input
                                type='text'
                                value={cpf}
                                onChange={(e) => setCpf(e.target.value)}
                                placeholder='CPF'
                                className='max-w-full'
                            />
                             {clientData && !searchFailed ? (
                            <div className='mb-4'>
                                <p>{SCadastro.CPF}{clientData.CPF}</p>
                                <p>{SCadastro.Nome}{clientData.NAME}</p>
                                <p>{SCadastro.Email}{clientData.EMAIL}</p>
                                <p>{SCadastro.Endereço}{clientData.ADDRESS}</p>
                                <p>{SCadastro.Telefone}{clientData.PHONE}</p>
                                <p>{SCadastro.Cashback}{clientData.CASHBACK}</p>
                            </div>
                        ) : searchFailed && (
                            <p className='mb-4'>{SVenda.Cliente_Nao_Encontrado}</p>
                        )}
                            <Button
                                size="default"
                                onClick={clientData ? confirmClient : () => searchClient(cpf)}
                                children={clientData ? "Confirmar" : "Buscar"} 
                                className='w-[404px]'
                            />
                        </div>
                       
                    </div>
                </div>
            )}
        </div>
        
    );
}

export default Venda;

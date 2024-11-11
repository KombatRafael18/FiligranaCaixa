import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import { getApiOrigin } from '../services/filigranaapi/config';

function Login() {
    const [usuario, setUsuario] = useState('');
    const [senha, setSenha] = useState('');
    const navigate = useNavigate();
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (usuario, senha) => {
        setIsLoading(true);
        fetch(`${getApiOrigin()}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario, senha }),
        })
            .then(response => response.json())
            .then(data => {
                setIsLoading(false);
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    navigate('/home');
                } else {
                    alert('Usuário ou senha inválida!');
                }
            })
            .catch(() => {
                setIsLoading(false); 
                setShowErrorModal(true);
            });
    };

    return (
        <div className='flex justify-center items-center h-screen'>
            <div className='w-[500px] rounded-lg overflow-hidden shadow-lg'>
                <div className='bg-[#9b5c6f] p-4 text-center'>
                    <h1 className='text-white text-2xl font-bold'>FILIGRANA</h1>
                </div>
                <div className='bg-[#f6b9b6] p-4 flex flex-col items-center '>
                    <Input
                        label="USUÁRIO:"
                        name="usuario"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                        fullWidth={true}
                    />
                    <Input
                        label="SENHA:"
                        name="senha"
                        type="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        fullWidth={true}
                    />

                    <Button className="mt-4" fullWidth={true} onClick={() => handleLogin(usuario, senha)}>
                        {isLoading ? 'Entrando...' : 'Logar'}
                    </Button>
                </div>
            </div>
            {showErrorModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <span className="close cursor-pointer" onClick={() => setShowErrorModal(false)}>&times;</span>
                        <p>Houve um erro na comunicação com o servidor. Por favor, tente novamente mais tarde.</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Login;

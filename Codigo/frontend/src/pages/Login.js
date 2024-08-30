import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';

function Login() {
    const [usuario, setUsuario] = useState('');
    const [senha, setSenha] = useState('');
    const navigate = useNavigate();

    const handleLogin = () => {
       
        navigate('/home');
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
                  
                    <Button className="mt-4" fullWidth={true} onClick={handleLogin}>Logar</Button>
                </div>
            </div>
        </div>
    );
}

export default Login;

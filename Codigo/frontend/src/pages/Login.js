import React from 'react';
import Button from '../components/Button';

function Login() {

    return (
        <div className='flex justify-center items-center h-screen'>
            <div className='w-96 rounded-lg overflow-hidden shadow-lg'>
                <div className='bg-[#9b5c6f] p-4 text-center'>
                    <h1 className='text-white text-2xl font-bold'>FILIGRANA</h1>
                </div>
                <div className='bg-[#f6b9b6] p-4 flex flex-col items-center'>
                    <p className='text-center'>Usuario</p>
                    <p className='text-center'>Senha</p>
                    <Button className="mt-4">Logar</Button>
                </div>
            </div>
        </div>
    );
}

export default Login;

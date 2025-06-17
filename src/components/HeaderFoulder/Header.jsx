import Logo from '../../assets/Header-assets/Logo.png'
import { IoPaw } from "react-icons/io5";
import { Link } from 'react-router-dom'
import { FaUser, FaSignOutAlt, FaCog, FaSignInAlt } from 'react-icons/fa'
import { MdOutlineModeComment } from "react-icons/md";
import { useState } from 'react'

export default function Header() {

    const [isOpen, setIsOpen] = useState(false)
    const [isLogged, setLogged] = useState(false)
    const [counter, setCounter] = useState(0)


    function handleClick() {
        setIsOpen(!isOpen)
    }

    function handleLoggin() {
        setLogged(!isLogged)
    }

    function CounterClick() {
        setCounter(prevCounter => prevCounter + 1)
    }


    return (
        <>
            <div className='flex items-center justify-between px-10 py-3 text-white bg-gray-800 shadow-md'>
                <div className='flex items-center gap-2'>
                    <IoPaw className='w-8 h-8'/>
                    <Link to='/' className='text-2xl sour-gummy-400'>PetTracker</Link>
                </div>
                <div className='flex items-center justify-center gap-6 cursor-pointer'>
                    <div className='mb-3' onClick={CounterClick}>
                        <div className='relative w-4 h-4 text-white bg-red-500 rounded-full top-3 right-1'>
                            <h1 className='text-xs font-bold text-center'>
                                {counter}
                            </h1>
                        </div>
                        <MdOutlineModeComment className='w-6 h-6' />
                    </div>

                    <div className='relative'>
                        <div className='p-2 border rounded-full' onClick={handleClick}>
                            <FaUser className='w-6 h-6 cursor-pointer' />
                        </div>

                        {isOpen && (
                            <div className='absolute right-0 z-10 w-48 py-1 mt-2 bg-white rounded-md shadow-lg'>
                                {isLogged ? (
                                    <>
                                        <div>
                                            <Link to={'/profile'} className='flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
                                                <FaUser className='w-4 h-4' />
                                                Perfil
                                            </Link>
                                        </div>

                                        <div>
                                            <Link to={'/profileConfig'} className='flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
                                                <FaCog className='w-4 h-4' />
                                                Configurações
                                            </Link>
                                        </div>

                                        <div>
                                            <Link to={'/'} className='flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
                                                <FaSignOutAlt className='w-4 h-4' />
                                                Sair
                                            </Link>
                                        </div>
                                    </>
                                ) : (
                                    <div>
                                        <Link to={'/login'} className='flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
                                            <FaSignInAlt className='w-4 h-4' />
                                            Entrar
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
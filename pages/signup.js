import React, { useContext, useState } from 'react'
import Footer from './footer'
import styles from '@/styles/Signup.module.css'
import Link from 'next/link'
import { FaFacebook, FaGithub, FaGoogle } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeContext } from './context/themeContext';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import router from 'next/router';
import { useSession, signIn, signOut } from "next-auth/react"

const Signup = () => {

    const [textType, setTextType] = useState("password");

    const [visible, setVisible] = useState(true);

    const { theme, handleOnClick } = useContext(ThemeContext)

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    //google signin
    async function handleGoogleSignin() {
        signIn("google", { callbackUrl: "https://codebytenext.vercel.app" })

    }

    //github signin
    async function handleGithubSignin() {
        signIn("github", { callbackUrl: "https://codebytenext.vercel.app" })
    }

    const handleTextType = () => {
        setVisible(!visible)
        if (visible) {
            setTextType('text')
        }
        else {
            setTextType('password')
        }
    }

    const handleChange = (e) => {
        if (e.target.name === 'name') {
            setName(e.target.value)
        }
        else if (e.target.name === 'email') {
            setEmail(e.target.value)
        }
        else if (e.target.name === 'password') {
            setPassword(e.target.value)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
        } else if (password.search(/[a-z]/) < 0) {
            setError('Password must contain at least one lowercase letter');
        } else if (password.search(/[A-Z]/) < 0) {
            setError('Password must contain at least one uppercase letter');
        } else if (password.search(/[0-9]/) < 0) {
            setError('Password must contain at least one digit');
        }else if((password.search(/[!@#$%^&*]/) < 0)){
            setError('Password must contain at least one special character');
        } else {
            setError('');
            const data = { name, email, password };

            try {
                let res = await fetch('https://codebytenext.vercel.app/api/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                let response = await res.json();
                console.log(response);

                setEmail('');
                setName('');
                setPassword('');

                if (response.error) {
                    toast.error(response.error, {
                        position: "bottom-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                } else if (response.success) {
                    toast.success(response.success, {
                        position: "bottom-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                    setTimeout(() => {
                        router.push('https://codebytenext.vercel.app/login');
                    }, 3000);
                } else {
                    toast.error("Unexpected response from server", {
                        position: "bottom-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                }
            } catch (error) {
                console.error('An error occurred:', error);
                toast.error("An error occurred while processing your request", {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        }
    };


    return (
        <>
            <ToastContainer
                position="bottom-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <div className={`${theme === "light" ? styles.maindark : styles.mainlight}`}>
                <div className={`${styles.image}`}>
                    <img src={'/HarshLogin.jpg'} className={`${styles.photo}`} alt='none' width={100} height={150} />
                </div>
                <form className={`${styles.form} container `} onSubmit={handleSubmit} method='POST' >
                    <h3 className={`text-center ${theme === "light" ? "textpurpledark" : "textpurplelight"}`}>Signup</h3>
                    <div className="form-group">
                        <label htmlFor="name" className={`text-${theme === "light" ? 'white' : 'black'} mx-1 `}>Name</label>
                        <input onChange={handleChange} type="text" className={`${styles.input2} border-secondary form-control m-1`} name='name' id="name" value={name} aria-describedby="emailHelp" placeholder="Enter name" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email" className={`text-${theme === "light" ? 'white' : 'black'}  mx-1`}>Email address</label>
                        <input onChange={handleChange} value={email} type="email" className={`${styles.input1} border-secondary form-control m-1`} name='email' id="email" aria-describedby="emailHelp" placeholder="Enter email" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className={`text-${theme === "light" ? 'white' : 'black'} mx-1`}>Password</label>
                        <div className={`${styles.eyeinput}`}>
                            <input onChange={handleChange} value={password} type={textType} className={`${styles.input} border-secondary form-control m-1`} name='password' id="password" placeholder="Password" required />
                            <i onClick={handleTextType} className={`${theme === "light" ? styles.eyelight : styles.eyedark}`}>
                                {visible ? <FaEye /> : <FaEyeSlash />}
                            </i>
                        </div>
                        {error && (<div class="alert alert-danger" role="alert">
                            {error}
                        </div>)}
                    </div>
                    {/* <div className="form-group form-check m-1">
                        <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                        <label className={`text-${theme === "light" ? 'white' : 'black'}form-check-label`} htmlFor="Check">Check me out</label>
                    </div> */}
                    <span>
                        <button type="submit" className={`${styles.button} btn m-2`}>Signup</button>
                        <Link href={'/forgot'} style={{ float: 'right' }} className='m-3'>Forgot Password</Link></span>
                    <div className='text-center'>
                        <p className={`text-${theme === "light" ? 'white' : 'black'} ${styles.signusing} text-center m-1`}>Or Signup using</p>
                        <span onClick={handleGoogleSignin} ><FaGoogle className={`${styles.google} m-2`} /></span>
                        <span onClick={handleGithubSignin}><FaGithub className={`${styles.google} m-2`} /></span>
                    </div>
                    <div className={`${styles.already}`}>
                        <p className={`text-${theme === "light" ? 'white' : 'black'} text-center`}>Already have an account <Link href={'/login'}>Login</Link></p>
                    </div>
                </form>
            </div>
            <Footer />
        </>

    )
}

export default Signup

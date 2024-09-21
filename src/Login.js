import { Link, useHistory } from 'react-router-dom'
import { useRef, useState } from "react"
import { useAuth } from './contexts/AuthContext'

const LoginPage = () => {
    const emailRef = useRef()
    const passwordRef = useRef()
    const { login, currentUser } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const history = useHistory()

    if (currentUser){
        history.push('/dashboard')
    }
    async function handleSubmit(e){
        e.preventDefault()

        try {
            setError('')
            setLoading(true)
            await login(emailRef.current.value, passwordRef.current.value)
            history.push("/dashboard")
        } catch {
            setError("Failed to log in")
        }
        setLoading(false)
    }
    return ( 
        <div className='login'>
            
            <div className="loginWindow">
                <form onSubmit={handleSubmit} className="loginForm">
                    <h1>Sign In</h1>
                    {error && <h2 className="error">{error}</h2>}
                    <h2>Email</h2> 
                    <input type="text" ref={emailRef} />
                    <h2>Password</h2>
                    <input type="password" ref={passwordRef} />
                    <div className="buttonHolder center-flex">
                            <input type="submit" id='login' value="Log in"></input>           
                    </div>
                </form>
                
                <div className="buttonHolder center-flex">
                    <Link to="/forgot-password">
                        <button id='forgot-password'>Forgot Password</button>
                    </Link>
                    <Link to="/signup">
                        <button id='create-account'>Create Account</button>
                    </Link>
                </div>
                
            </div>
        </div>
     );
}
 
export default LoginPage;
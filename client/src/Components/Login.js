import { LoginContext } from "../Context/LoginContext";
import { useState,useContext } from "react";
import '../Styles/Register.css'
import { Link,useNavigate,useLocation} from "react-router-dom";



const Login = () =>{

    const Navigate = useNavigate();
    const Location = useLocation();
    
    const {handleSignIn} = useContext(LoginContext);
    const [errors, setErrors] = useState({});
    
    const [User,setUser] = useState({
        Email : "",
        Password : ''
    });
    const handleChange = (e) => {
        setUser({...User, [e.target.name] : e.target.value});
    }

    

    const validate = () => {
        if(User.Email.trim() === ''){
            setErrors({...errors, email : 'Email is required'});
            return false;
        }

        if(User.Password.trim() === ''){
            setErrors({...errors, password : 'Password is required'});
            return false;
        }
        return true;
    }
    

    const handleSubmit = (e) => {
        e.preventDefault();
        if(validate()){
            handleSignIn(User);
            //We currently don't know whether we will succesfully login or not. So we will pass redirectedURL to the callback function
            // const redirectURL = new URLSearchParams(Location.search).get('redirect') || "/";
            // Navigate(redirectURL);
        }
    }

    const handleCancel = () =>{
        setUser({ Email : "", Password : ''});
        setErrors({});
        Navigate('/');
    }

    return (
        <div className='Register_mainContainer'>
            <div className='Register_container'>
                
                <div className='auth-switch'>
                    <div className='signup-link'><Link to='/Signup'>Sign Up</Link></div>
                    <div className='login-title'>Log In</div>
                </div>
                

                <div className='formContainer'>
                    <form>

                        <div className={`inputField ${errors.email ? 'error' : ''}`}>
                            <div>
                                Email 
                            </div>
                            <input
                                type='email'
                                name='Email'
                                placeholder={!errors.email ? 'Enter Your email' : 'Invalid Email'}
                                onChange={handleChange}
                                value={User.Email}
                            />
                        </div>


                        <div className={`inputField ${errors.password ? 'error' : ''}`}>
                            <div>
                                Password
                            </div>
                            <input
                                type='password'
                                name='Password'
                                placeholder={!errors.password ? 'Enter password' : 'Weak password'}
                                onChange={handleChange}
                                value={User.Password}
                            />
                        </div>
                        
                        <button className='loginButton' onClick={handleSubmit}>Log In</button>
                    </form>
                </div>
                
                    
                <button className="cancel" onClick={handleCancel}>x</button>
            </div>
        </div>
    );
}

export default Login;
import { LoginContext } from "../Context/LoginContext";
import { useState,useContext } from "react";
import '../Styles/Register.css'
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";



const SignUp = () =>{
    const Navigate = useNavigate();
    const {handleSignUp} = useContext(LoginContext);
    
    const [User,setUser] = useState({
        Name : '',
        Email : "",
        Password : ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setUser({...User, [e.target.name] : e.target.value});
    }

    const validate = () => {
        if(User.Name.trim() === ''){
            setErrors({...errors, name : 'Name is required'});
            return false;
        }

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
            handleSignUp(User);
        }
    }

    const handleCancel = () =>{
        setUser({Name : '', Email : "", Password : ''});
        setErrors({});
        Navigate('/');
    }
    return (
        <div className='Register_mainContainer'>
            <div className='Register_container'>

                <div className='auth-switch'>
                    <div className='signup-title'>Sign Up</div>
                    <div className='login-link'><Link to='/Login'>Log In</Link></div>
                </div>
                <div className='formContainer'>
                    <form>
                        <div className= {`inputField ${errors.name ? 'error' : ''}`}>
                            <label htmlFor='name'>Name</label>
                            <input
                                type='text'
                                name='Name'
                                placeholder={!errors.name ? 'Enter Your Name' : 'Invalid Name'}
                                onChange={handleChange}
                                value={User.Name}
                            />
                        </div>
    
                        <div className={`inputField ${errors.email ? 'error' : ''}`}>
                            <label htmlFor='email'>Email</label>
                            <input
                                type='email'
                                name='Email'
                                placeholder={!errors.email ? 'Enter Your email' : 'Invalid Email'}
                                onChange={handleChange}
                                value={User.Email}
                            />
                        </div>
    
                        <div className={`inputField ${errors.password ? 'error' : ''}`}>
                            <label htmlFor='password'>Password</label>
                            <input
                                type='password'
                                name='Password'
                                placeholder={!errors.password ? 'Enter password' : 'Weak password'}
                                onChange={handleChange}
                                value={User.Password}
                            />
                        </div>
    
                        <button className='signupButton' onClick={handleSubmit}>Sign-Up</button>
                    </form>
                </div>

                <button className="cancel" onClick={handleCancel}>x</button>
            </div>
        </div>
    );
}

export default SignUp;
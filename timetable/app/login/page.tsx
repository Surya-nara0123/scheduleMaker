'use client'
import pocketbase from 'pocketbase';
import { useState } from 'react';

const pb = new pocketbase('https://snuc.pockethost.io');

function Login() {
    const handleLogin = async () => {
        const record = await pb.collection('users').getFirstListItem('username="Frenzy"', {
            expand: 'relField1,relField2.subRelField',
        });
        console.log(record);
    }        
    const [user, setUser] = useState({email: '', password: ''});
    return ( 
        <main>
            <div>
                <h1>Login</h1>
                <div>
            <input type="text" placeholder="email"
            onChange={
              (e) => {
                setUser({...user, email: e.target.value});
              }
            
            } />
            <input type="password" placeholder="Password" 
            onChange={
              (e) => {
                setUser({...user, password: e.target.value});
              }
            
            } />
                    <button type="submit" onClick={handleLogin}>Login</button>
                    </div>
            </div>
        </main>
     );
}

export default Login;
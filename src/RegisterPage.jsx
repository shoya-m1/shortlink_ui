import { useState } from 'react';
import { registerUser } from './auth';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        referral_code: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // ✅ Validasi password dan konfirmasi
        if (formData.password !== formData.password_confirmation) {
            setError('Password dan konfirmasi password tidak cocok');
            return;
        }

        try {
            // const { confirm_password, ...dataToSend } = formData; // hilangkan confirm_password sebelum dikirim ke API
            const response = await registerUser(formData);
            console.log('Registration successful:', response.data);

            // ✅ Redirect ke dashboard atau home
            // navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
            console.error('Registration error:', err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <div className="error">{error}</div>}
            
            <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <input
                type="password"
                placeholder="Confirm Password"
                value={formData.password_confirmation}
                onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})}
            />
            <input
                type="text"
                placeholder="Referral Code (optional)"
                value={formData.referral_code}
                onChange={(e) => setFormData({...formData, referral_code: e.target.value})}
            />
            
            <button type="submit">Register</button>
        </form>
    );
}
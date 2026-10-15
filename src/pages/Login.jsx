import { useForm } from 'react-hook-form';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { FiMail, FiLock } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const cardRef = useRef(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  useGSAP(() => {
    gsap.from(cardRef.current, { opacity: 0, y: 12, duration: 0.35, ease: 'power2.out' });
  }, { scope: cardRef });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  
const onSubmit = async (values) => {
  const res = await login(values);
  if (res.success) navigate('/admin');
};

  return (
    <div
      ref={cardRef}
      className="w-full max-w-sm card p-7"
    >
      <div className="text-center mb-6">
        <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold mx-auto mb-3">
          A
        </div>
        <h1 className="text-xl font-semibold">Welcome back</h1>
        <p className="text-sm text-gray-500 mt-1">Sign in to your admin account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          autoComplete="username"
          icon={FiMail}
          placeholder="admin@example.com"
          error={errors.email?.message}
          {...register('email', { required: 'Email is required' })}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          icon={FiLock}
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password', { required: 'Password is required' })}
        />
        <Button type="submit" className="w-full" loading={isSubmitting}>
          Sign In
        </Button>
      </form>
    </div>
  );
};

export default Login;

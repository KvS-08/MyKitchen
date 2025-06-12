import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Building2, User, Mail, Phone, ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

type RegisterFormInputs = {
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  countryCode: string;
  password: string;
  confirmPassword: string;
};

interface RegisterFormProps {
  onBackToLogin: () => void;
}

const COUNTRY_CODES = [
  { code: '+504', country: 'Honduras', flag: '🇭🇳' },
  { code: '+1', country: 'Estados Unidos', flag: '🇺🇸' },
  { code: '+52', country: 'México', flag: '🇲🇽' },
  { code: '+503', country: 'El Salvador', flag: '🇸🇻' },
  { code: '+502', country: 'Guatemala', flag: '🇬🇹' },
  { code: '+505', country: 'Nicaragua', flag: '🇳🇮' },
  { code: '+506', country: 'Costa Rica', flag: '🇨🇷' },
  { code: '+507', country: 'Panamá', flag: '🇵🇦' },
  { code: '+34', country: 'España', flag: '🇪🇸' },
  { code: '+57', country: 'Colombia', flag: '🇨🇴' },
];

export const RegisterForm: React.FC<RegisterFormProps> = ({ onBackToLogin }) => {
  const [loading, setLoading] = useState(false);
  const { 
    register, 
    handleSubmit,
    watch,
    setError,
    formState: { errors }
  } = useForm<RegisterFormInputs>({
    defaultValues: {
      countryCode: '+504'
    }
  });
  
  const password = watch('password');
  
  const onSubmit = async (data: RegisterFormInputs) => {
    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', {
        type: 'manual',
        message: 'Las contraseñas no coinciden'
      });
      return;
    }

    setLoading(true);
    
    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.ownerName,
          }
        }
      });

      if (authError) {
        // Handle specific case of user already exists
        if (authError.message?.includes('already registered') || authError.message?.includes('user_already_exists')) {
          setError('email', {
            type: 'manual',
            message: 'Este correo ya está registrado'
          });
          return;
        }
        throw authError;
      }
      
      if (!authData.user) throw new Error('No se pudo crear el usuario');

      // 2. Wait for the session to be established and then create business record
      // We need to ensure the user is properly authenticated before creating business
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        // If no session, try to sign in the user
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });
        
        if (signInError) throw signInError;
        if (!signInData.user) throw new Error('No se pudo autenticar el usuario');
      }

      // 3. Create business record with proper authentication context
      const { data: businessData, error: businessError } = await supabase
        .from('businesses')
        .insert({
          name: data.businessName,
          owner_id: authData.user.id,
          email: data.email,
          phone: `${data.countryCode}${data.phone}`,
          is_active: true,
        })
        .select()
        .single();

      if (businessError) {
        console.error('Business creation error:', businessError);
        throw new Error('Error al crear el negocio: ' + businessError.message);
      }

      // 4. Create user profile
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: data.email,
          full_name: data.ownerName,
          role: 'admin',
          business_id: businessData.id,
          is_active: true,
        });

      if (userError) {
        console.error('User profile creation error:', userError);
        throw new Error('Error al crear el perfil de usuario: ' + userError.message);
      }

      toast.success('¡Registro exitoso! Revisa tu correo para confirmar tu cuenta.');
      onBackToLogin();
      
    } catch (error: any) {
      console.error('Registration error:', error);
      
      let errorMessage = 'Error al registrar el negocio';
      
      if (error.message?.includes('Password')) {
        errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      } else if (error.message?.includes('row-level security')) {
        errorMessage = 'Error de permisos. Por favor, intenta nuevamente.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError('root', {
        type: 'manual',
        message: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Registra tu Negocio
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Crea tu cuenta y comienza a gestionar tu restaurante
        </p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {errors.root && (
          <div className="p-3 text-sm text-danger-800 bg-danger-100 rounded-md dark:text-danger-400 dark:bg-danger-900/30">
            {errors.root.message}
          </div>
        )}
        
        <div className="space-y-2">
          <label htmlFor="businessName" className="label">
            Nombre de tu negocio
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Building2 className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="businessName"
              type="text"
              className={`input pl-10 w-full ${errors.businessName ? 'border-red-500' : ''}`}
              placeholder="Restaurante El Buen Sabor"
              disabled={loading}
              {...register('businessName', { 
                required: 'El nombre del negocio es requerido',
                minLength: {
                  value: 2,
                  message: 'El nombre debe tener al menos 2 caracteres'
                }
              })}
            />
          </div>
          {errors.businessName && (
            <p className="text-xs text-red-500">{errors.businessName.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="ownerName" className="label">
            Nombre del Dueño o Administrador
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="ownerName"
              type="text"
              className={`input pl-10 w-full ${errors.ownerName ? 'border-red-500' : ''}`}
              placeholder="Juan Pérez"
              disabled={loading}
              {...register('ownerName', { 
                required: 'El nombre del administrador es requerido',
                minLength: {
                  value: 2,
                  message: 'El nombre debe tener al menos 2 caracteres'
                }
              })}
            />
          </div>
          {errors.ownerName && (
            <p className="text-xs text-red-500">{errors.ownerName.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="email" className="label">
            E-mail del Negocio
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              type="email"
              className={`input pl-10 w-full ${errors.email ? 'border-red-500' : ''}`}
              placeholder="contacto@restaurante.com"
              disabled={loading}
              {...register('email', { 
                required: 'El correo es requerido',
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: 'Formato de correo inválido'
                }
              })}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="phone" className="label">
            Número de Teléfono
          </label>
          <div className="flex">
            <select
              className="input rounded-r-none border-r-0 w-32"
              disabled={loading}
              {...register('countryCode', { required: true })}
            >
              {COUNTRY_CODES.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.code}
                </option>
              ))}
            </select>
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="phone"
                type="tel"
                className={`input pl-10 w-full rounded-l-none ${errors.phone ? 'border-red-500' : ''}`}
                placeholder="9999-9999"
                disabled={loading}
                {...register('phone', { 
                  required: 'El número de teléfono es requerido',
                  pattern: {
                    value: /^[0-9-\s]+$/,
                    message: 'Formato de teléfono inválido'
                  },
                  minLength: {
                    value: 8,
                    message: 'El teléfono debe tener al menos 8 dígitos'
                  }
                })}
              />
            </div>
          </div>
          {errors.phone && (
            <p className="text-xs text-red-500">{errors.phone.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="password" className="label">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            className={`input w-full ${errors.password ? 'border-red-500' : ''}`}
            placeholder="••••••••"
            disabled={loading}
            {...register('password', { 
              required: 'La contraseña es requerida',
              minLength: {
                value: 6,
                message: 'La contraseña debe tener al menos 6 caracteres'
              }
            })}
          />
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="label">
            Confirmar Contraseña
          </label>
          <input
            id="confirmPassword"
            type="password"
            className={`input w-full ${errors.confirmPassword ? 'border-red-500' : ''}`}
            placeholder="••••••••"
            disabled={loading}
            {...register('confirmPassword', { 
              required: 'Confirma tu contraseña',
              validate: value => value === password || 'Las contraseñas no coinciden'
            })}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>
        
        <button
          type="submit"
          className="btn-primary w-full flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
              Registrando...
            </>
          ) : (
            'Registrar Negocio'
          )}
        </button>
        
        <button
          type="button"
          onClick={onBackToLogin}
          className="btn-outline w-full flex items-center justify-center"
          disabled={loading}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al Login
        </button>
      </form>
      
      <div className="text-center text-sm">
        <p className="text-gray-600 dark:text-gray-400">
          Al registrarte, aceptas nuestros{' '}
          <a href="#" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
            Términos de Servicio
          </a>
          {' '}y{' '}
          <a href="#" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
            Política de Privacidad
          </a>
        </p>
      </div>
    </div>
  );
};
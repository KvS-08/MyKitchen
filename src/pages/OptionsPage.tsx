import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Save } from 'lucide-react';
import { MdOutlineDriveFileRenameOutline } from 'react-icons/md';
import { IoMdBusiness } from 'react-icons/io';
import { FaMapLocationDot, FaTreeCity } from 'react-icons/fa6';
import { BiWorld, BiSolidBank } from 'react-icons/bi';
import { MdOutlineEmail } from 'react-icons/md';
import { FaUserGear } from 'react-icons/fa6';
import { FaPhoneAlt } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const OptionsPage: React.FC = () => {
  const { user } = useAuth();
  const [isBusinessInfoOpen, setIsBusinessInfoOpen] = useState(false);
  const [hasBusinessInfoChanged, setHasBusinessInfoChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Business info states
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [businessLogo, setBusinessLogo] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumberPrefix, setPhoneNumberPrefix] = useState('');
  
  // Employee config states
  const [isEmployeeConfigOpen, setIsEmployeeConfigOpen] = useState(false);
  const [employeeName, setEmployeeName] = useState('');
  const [employeeRole, setEmployeeRole] = useState('');
  const [employeeEmail, setEmployeeEmail] = useState('');

  const countryPrefixes: { [key: string]: string } = {
    "Canadá": "+1",
    "Estados Unidos": "+1",
    "México": "+52",
    "Belice": "+501",
    "Costa Rica": "+506",
    "El Salvador": "+503",
    "Guatemala": "+502",
    "Honduras": "+504",
    "Nicaragua": "+505",
    "Panamá": "+507",
    "Argentina": "+54",
    "Bolivia": "+591",
    "Brasil": "+55",
    "Chile": "+56",
    "Colombia": "+57",
    "Ecuador": "+593",
    "Paraguay": "+595",
    "Perú": "+51",
    "Uruguay": "+598",
    "Venezuela": "+58",
  };

  // Load business data when component mounts
  useEffect(() => {
    if (user?.business_id) {
      loadBusinessData();
    }
  }, [user?.business_id]);

  const loadBusinessData = async () => {
    if (!user?.business_id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', user.business_id)
        .single();

      if (error) {
        console.error('Error loading business data:', error);
        toast.error('Error al cargar los datos del negocio');
        return;
      }

      if (data) {
        setBusinessName(data.name || '');
        setEmail(data.email || '');
        setAddress(data.address || '');
        setCity(data.city || '');
        setCountry(data.country || '');
        setBankAccount(data.bank_account || '');
        
        // Handle phone number - extract prefix and number
        if (data.phone) {
          const phoneStr = data.phone;
          // Find matching prefix
          const matchingCountry = Object.entries(countryPrefixes).find(([_, prefix]) => 
            phoneStr.startsWith(prefix)
          );
          
          if (matchingCountry) {
            const [countryName, prefix] = matchingCountry;
            setPhoneNumberPrefix(prefix);
            setPhoneNumber(phoneStr.substring(prefix.length));
            if (!country) setCountry(countryName);
          } else {
            setPhoneNumber(phoneStr);
          }
        }
        
        // Set prefix based on country if not already set
        if (data.country && countryPrefixes[data.country] && !phoneNumberPrefix) {
          setPhoneNumberPrefix(countryPrefixes[data.country]);
        }
      }
    } catch (error) {
      console.error('Error loading business data:', error);
      toast.error('Error al cargar los datos del negocio');
    } finally {
      setLoading(false);
    }
  };

  const saveBusinessData = async () => {
    if (!user?.business_id) {
      toast.error('No se encontró información del negocio');
      return;
    }

    setSaving(true);
    try {
      // Combine phone prefix and number
      const fullPhoneNumber = phoneNumberPrefix && phoneNumber 
        ? `${phoneNumberPrefix}${phoneNumber}` 
        : phoneNumber;

      const updateData = {
        name: businessName,
        email: email,
        address: address || null,
        city: city || null,
        country: country || null,
        phone: fullPhoneNumber || null,
        bank_account: bankAccount || null,
      };

      const { error } = await supabase
        .from('businesses')
        .update(updateData)
        .eq('id', user.business_id);

      if (error) {
        console.error('Error saving business data:', error);
        toast.error('Error al guardar los datos del negocio');
        return;
      }

      toast.success('Datos del negocio guardados correctamente');
      setHasBusinessInfoChanged(false);
    } catch (error) {
      console.error('Error saving business data:', error);
      toast.error('Error al guardar los datos del negocio');
    } finally {
      setSaving(false);
    }
  };

  const handleFieldChange = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setHasBusinessInfoChanged(true);
  };

  const toggleBusinessInfo = () => {
    setIsBusinessInfoOpen(!isBusinessInfoOpen);
  };

  const toggleEmployeeConfig = () => {
    setIsEmployeeConfigOpen(!isEmployeeConfigOpen);
  };

  return (
    <div className="space-y-6 md:ml-32 pt-4 md:pt-0 md:-mt-10">
      <h1 className="text-2xl font-bold mb-6">Opciones</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-4">
        <button
          onClick={toggleBusinessInfo}
          className="flex items-center justify-between w-full p-4 text-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg"
        >
          <span>Información del negocio</span>
          {isBusinessInfoOpen ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>
        {isBusinessInfoOpen && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <span className="ml-2 text-gray-600 dark:text-gray-400">Cargando datos...</span>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Nombre del Negocio *
                    </label>
                    <div className="relative mt-1">
                      <MdOutlineDriveFileRenameOutline className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" 
                        id="businessName" 
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-8" 
                        value={businessName} 
                        onChange={(e) => handleFieldChange(setBusinessName)(e.target.value)}
                        placeholder="Nombre de tu negocio"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Tipo de Negocio
                    </label>
                    <div className="relative mt-1">
                      <IoMdBusiness className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" 
                        id="businessType" 
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-8" 
                        value={businessType} 
                        onChange={(e) => handleFieldChange(setBusinessType)(e.target.value)}
                        placeholder="Ej: Restaurante, Cafetería"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="businessLogo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Logo del Negocio
                    </label>
                    <input 
                      type="file" 
                      id="businessLogo" 
                      accept="image/*" 
                      className="mt-1 block w-full text-gray-700 dark:text-gray-300" 
                      onChange={(e) => handleFieldChange(setBusinessLogo)(e.target.files ? e.target.files[0].name : '')} 
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Dirección
                    </label>
                    <div className="relative mt-1">
                      <FaMapLocationDot className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" 
                        id="address" 
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-8" 
                        value={address} 
                        onChange={(e) => handleFieldChange(setAddress)(e.target.value)}
                        placeholder="Dirección completa"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Ciudad
                    </label>
                    <div className="relative mt-1">
                      <FaTreeCity className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" 
                        id="city" 
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-8" 
                        value={city} 
                        onChange={(e) => handleFieldChange(setCity)(e.target.value)}
                        placeholder="Ciudad"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      País
                    </label>
                    <div className="relative mt-1">
                      <BiWorld className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <select 
                        id="country" 
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-8" 
                        value={country} 
                        onChange={(e) => {
                          const selectedCountry = e.target.value;
                          handleFieldChange(setCountry)(selectedCountry);
                          setPhoneNumberPrefix(countryPrefixes[selectedCountry] || '');
                        }}
                      >
                        <option value="">Seleccione un país</option>
                        <optgroup label="Norteamérica">
                          <option value="Canadá">Canadá</option>
                          <option value="Estados Unidos">Estados Unidos</option>
                          <option value="México">México</option>
                        </optgroup>
                        <optgroup label="Centroamérica">
                          <option value="Belice">Belice</option>
                          <option value="Costa Rica">Costa Rica</option>
                          <option value="El Salvador">El Salvador</option>
                          <option value="Guatemala">Guatemala</option>
                          <option value="Honduras">Honduras</option>
                          <option value="Nicaragua">Nicaragua</option>
                          <option value="Panamá">Panamá</option>
                        </optgroup>
                        <optgroup label="Suramérica">
                          <option value="Argentina">Argentina</option>
                          <option value="Bolivia">Bolivia</option>
                          <option value="Brasil">Brasil</option>
                          <option value="Chile">Chile</option>
                          <option value="Colombia">Colombia</option>
                          <option value="Ecuador">Ecuador</option>
                          <option value="Paraguay">Paraguay</option>
                          <option value="Perú">Perú</option>
                          <option value="Uruguay">Uruguay</option>
                          <option value="Venezuela">Venezuela</option>
                        </optgroup>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="bankAccount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Cuenta Bancaria
                    </label>
                    <div className="relative mt-1">
                      <BiSolidBank className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" 
                        id="bankAccount" 
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-8" 
                        value={bankAccount} 
                        onChange={(e) => handleFieldChange(setBankAccount)(e.target.value)}
                        placeholder="Número de cuenta"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      E-mail *
                    </label>
                    <div className="relative mt-1">
                      <MdOutlineEmail className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input 
                        type="email" 
                        id="email" 
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-8" 
                        value={email} 
                        onChange={(e) => handleFieldChange(setEmail)(e.target.value)}
                        placeholder="correo@ejemplo.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Número Telefónico
                    </label>
                    <div className="relative mt-1 flex items-center">
                      {phoneNumberPrefix && (
                        <span className="text-gray-500 dark:text-gray-400 text-sm bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded-md mr-2">
                          {phoneNumberPrefix}
                        </span>
                      )}
                      <div className="relative flex-1">
                        <FaPhoneAlt className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input 
                          type="tel" 
                          id="phoneNumber" 
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-8" 
                          value={phoneNumber} 
                          onChange={(e) => handleFieldChange(setPhoneNumber)(e.target.value)}
                          placeholder="Ej: 9876-5432"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {hasBusinessInfoChanged && (
                  <div className="flex justify-end mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={saveBusinessData}
                      disabled={saving || !businessName || !email}
                      className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Guardar Cambios
                        </>
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-4">
        <button
          onClick={toggleEmployeeConfig}
          className="flex items-center justify-between w-full p-4 text-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg"
        >
          <span>Configurar empleados</span>
          {isEmployeeConfigOpen ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>
        {isEmployeeConfigOpen && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="employeeName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nombre del empleado
                </label>
                <div className="relative mt-1">
                  <MdOutlineDriveFileRenameOutline className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    id="employeeName" 
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-8" 
                    value={employeeName} 
                    onChange={(e) => setEmployeeName(e.target.value)}
                    placeholder="Nombre completo"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="employeeRole" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Rol
                </label>
                <div className="relative mt-1">
                  <FaUserGear className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select 
                    id="employeeRole" 
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-8" 
                    value={employeeRole} 
                    onChange={(e) => setEmployeeRole(e.target.value)}
                  >
                    <option value="">Seleccione un rol</option>
                    <option value="admin">Administrador</option>
                    <option value="cashier">Cajero</option>
                    <option value="chef">Cocinero</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="employeeEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <div className="relative mt-1">
                  <MdOutlineEmail className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input 
                    type="email" 
                    id="employeeEmail" 
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-8" 
                    value={employeeEmail} 
                    onChange={(e) => setEmployeeEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button className="btn-primary">
                Agregar Empleado
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OptionsPage;
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, CalendarDays, Clock, DollarSign } from 'lucide-react';
import { MdOutlineDriveFileRenameOutline, MdDelete } from 'react-icons/md';
import { IoMdBusiness } from 'react-icons/io';
import { FaMapLocationDot, FaTreeCity } from 'react-icons/fa6';
import { BiWorld, BiSolidBank } from 'react-icons/bi';
import { MdOutlineEmail } from 'react-icons/md';
import { HiColorSwatch } from 'react-icons/hi';
import { BsCurrencyExchange, BsFillInfoCircleFill, BsCalendarDateFill } from 'react-icons/bs';
import { FaUserGear, FaUserPlus } from 'react-icons/fa6';
import { FaPhoneAlt } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import ColorPicker from '../components/ui/ColorPicker';

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
  const [employeeName, setEmployeeName] = useState<string>('');
  const [employeeRole, setEmployeeRole] = useState<string>('');
  const [employeeEmail, setEmployeeEmail] = useState<string>('');

  // Regional format states
  const [isRegionalFormatOpen, setIsRegionalFormatOpen] = useState(false);

  // Customize App states
  const [isCustomizeAppOpen, setIsCustomizeAppOpen] = useState(false);
  const [appThemeColor, setAppThemeColor] = useState('');

  const toggleCustomizeApp = () => {
    setIsCustomizeAppOpen(!isCustomizeAppOpen);
  };

  const handleAppThemeColorChange = (color: string) => {
    setAppThemeColor(color);
    setHasBusinessInfoChanged(true);
  };
  const [dateFormat, setDateFormat] = useState<string>('');
  const [timeFormat, setTimeFormat] = useState<string>('');
  const [currencyFormat, setCurrencyFormat] = useState<string>('');

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

  const countryCurrencies: { [key: string]: { symbol: string; name: string; region: string }[] } = {
    "Canadá": [{ symbol: "CA$", name: "Dólar Canadiense", region: "Norteamérica" }],
    "Estados Unidos": [{ symbol: "US$", name: "Dólar Estadounidense", region: "Norteamérica" }],
    "México": [{ symbol: "MX$", name: "Peso Mexicano", region: "Norteamérica" }],
    "Belice": [{ symbol: "BZ$", name: "Dólar Beliceño", region: "Centroamérica" }],
    "Costa Rica": [{ symbol: "₡", name: "Colón Costarricense", region: "Centroamérica" }],
    "El Salvador": [{ symbol: "$", name: "Dólar Estadounidense", region: "Centroamérica" }],
    "Guatemala": [{ symbol: "Q", name: "Quetzal Guatemalteco", region: "Centroamérica" }],
    "Honduras": [{ symbol: "L", name: "Lempira Hondureña", region: "Centroamérica" }],
    "Nicaragua": [{ symbol: "C$", name: "Córdoba Nicaragüense", region: "Centroamérica" }],
    "Panamá": [{ symbol: "B/.", name: "Balboa Panameño", region: "Centroamérica" }],
    "Argentina": [{ symbol: "$", name: "Peso Argentino", region: "Sudamérica" }],
    "Bolivia": [{ symbol: "Bs.", name: "Boliviano", region: "Sudamérica" }],
    "Brasil": [{ symbol: "R$", name: "Real Brasileño", region: "Sudamérica" }],
    "Chile": [{ symbol: "$", name: "Peso Chileno", region: "Sudamérica" }],
    "Colombia": [{ symbol: "$", name: "Peso Colombiano", region: "Sudamérica" }],
    "Ecuador": [{ symbol: "$", name: "Dólar Estadounidense", region: "Sudamérica" }],
    "Paraguay": [{ symbol: "₲", name: "Guaraní Paraguayo", region: "Sudamérica" }],
    "Perú": [{ symbol: "S/.", name: "Sol Peruano", region: "Sudamérica" }],
    "Uruguay": [{ symbol: "$", name: "Peso Uruguayo", region: "Sudamérica" }],
    "Venezuela": [{ symbol: "Bs.S", name: "Bolívar Soberano", region: "Sudamérica" }],
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
        setAppThemeColor(data.app_theme_color || '');
        
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
        app_theme_color: appThemeColor || null,
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

  const toggleRegionalFormat = () => {
    setIsRegionalFormatOpen(!isRegionalFormatOpen);
  };

  return (
    <div className="space-y-6 md:ml-32 pt-4 md:pt-0 md:-mt-10">
      <div className="flex justify-between items-center">
        <h1 className="text-xl md:text-3xl font-bold">
          {(() => {
            const formattedDate = format(new Date(), 'EEEE, dd \'de\' MMMM \'de\' yyyy', { locale: es });
            const parts = formattedDate.split(',');
            if (parts.length > 0) {
              const day = parts[0];
              const capitalizedDay = day.charAt(0).toUpperCase() + day.slice(1);
              return [capitalizedDay, ...parts.slice(1)].join(',');
            }
            return formattedDate; // Fallback if split fails
          })()}
        </h1>
        <div className="hidden md:block">
          <ThemeToggle />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-4 mt-6">
        <button
          onClick={toggleBusinessInfo}
          className="flex items-center justify-between w-full p-4 text-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg"
        >
          <div className="flex items-center">
            <BsFillInfoCircleFill className="h-5 w-5 mr-2" />
            <span>Información del Negocio</span>
          </div>
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
                <div className="grid grid-cols-1 gap-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                    <div>
                      <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Nombre del Negocio
                      </label>
                      <div className="relative mt-1">
                        <MdOutlineDriveFileRenameOutline className="absolute left-1 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input 
                          type="text" 
                          id="businessName" 
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-6 text-sm py-1" 
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
                        <IoMdBusiness className="absolute left-1 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input 
                          type="text" 
                          id="businessType" 
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-6 text-sm py-1" 
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
                      className="mt-1 block w-auto text-gray-700 dark:text-gray-300 text-sm py-2" 
                      onChange={(e) => handleFieldChange(setBusinessLogo)(e.target.files ? e.target.files[0].name : '')} 
                    />
                  </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Dirección
                    </label>
                    <div className="relative mt-1">
                      <FaMapLocationDot className="absolute left-1 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" 
                        id="address" 
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-6 text-sm py-1" 
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
                      <FaTreeCity className="absolute left-1 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" 
                        id="city" 
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-6 text-sm py-1" 
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
                      <BiWorld className="absolute left-1 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <select 
                        id="country" 
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-5 text-sm py-1" 
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
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label htmlFor="bankAccount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Cuenta Bancaria
                      </label>
                      <div className="relative mt-1">
                        <BiSolidBank className="absolute left-1 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input 
                          type="text" 
                          id="bankAccount" 
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-6 text-sm py-1" 
                          value={bankAccount} 
                          onChange={(e) => handleFieldChange(setBankAccount)(e.target.value)}
                          placeholder="Número de cuenta"
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-1">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        E-mail
                      </label>
                      <div className="relative mt-1">
                        <MdOutlineEmail className="absolute left-1 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input 
                          type="email" 
                          id="email" 
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-6 text-sm py-1" 
                          value={email} 
                          onChange={(e) => handleFieldChange(setEmail)(e.target.value)}
                          placeholder="correo@ejemplo.com"
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-1">
                      <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Número Telefónico
                      </label>
                      <div className="relative mt-1 flex items-center">
                        {phoneNumberPrefix && (
                            <span className="text-gray-500 dark:text-gray-400 text-sm bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded-md mr-0.5">
                              {phoneNumberPrefix}
                            </span>
                          )}
                          <div className="relative flex-1">
                            <FaPhoneAlt className="absolute left-1 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input 
                              type="tel" 
                              id="phoneNumber" 
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-6 text-sm py-1" 
                              value={phoneNumber} 
                              onChange={(e) => handleFieldChange(setPhoneNumber)(e.target.value)}
                              placeholder="Ej: 9876-5432"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                </div>
                
                {hasBusinessInfoChanged && (
                  <div className="flex justify-end mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={saveBusinessData}
                      disabled={saving || !businessName || !email}
                      className="text-green-500 hover:text-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? 'Guardando...' : 'Guardar cambios'}
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
          <div className="flex items-center">
            <FaUserPlus className="h-5 w-5 mr-2" />
            <span>Configurar Empleados</span>
          </div>
          {isEmployeeConfigOpen ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>
        {isEmployeeConfigOpen && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="employeeName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nombre del Usuario
                </label>
                <div className="relative mt-1">
                  <MdOutlineDriveFileRenameOutline className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    id="employeeName" 
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-6 text-sm py-1" 
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
                  <FaUserGear className="absolute left-1 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select 
                    id="employeeRole" 
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-6 text-sm py-1" 
                    value={employeeRole} 
                    onChange={(e) => setEmployeeRole(e.target.value)}
                  >
                    <option value="">Seleccione un rol</option>
                    <option value="admin">Admin</option>
                    <option value="cashier">Cajero</option>
                    <option value="waiter">Mesero</option> {/* Corrected from cashier to waiter based on common roles */}
                    <option value="chef">Cocinero</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="employeeEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <div className="relative mt-1">
                  <MdOutlineEmail className="absolute left-1 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input 
                    type="email" 
                    id="employeeEmail" 
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-6 text-sm py-1" 
                    value={employeeEmail} 
                    onChange={(e) => setEmployeeEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                  />
                </div>
              </div>
            </div>
            {/* Employee Table */}
            <div className="mt-6">
              <div className="flex items-center">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Lista de Empleados</h3>
                {(employeeName && employeeRole && employeeEmail) && (
                  <button className="text-green-500 hover:text-green-600 ml-auto">
                    Agregar
                  </button>
                )}
              </div>
              <div className="overflow-x-auto mt-2">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider sm:w-1/3">
                        Nombre
                      </th>
                      <th scope="col" className="px-0 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider sm:w-1/6">
                        Rol
                      </th>
                      <th scope="col" className="px-7 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider sm:w-1/3">
                        Email
                      </th>
                      <th scope="col" className="px-0 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider sm:w-1/12">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {/* Employee data will be dynamically loaded here */}
                    {/* Add more rows as needed */}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Regional Format Accordion */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-4">
        <button
          onClick={toggleRegionalFormat}
          className="flex items-center justify-between w-full p-4 text-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg"
        >
          <div className="flex items-center">
            <BsCalendarDateFill className="h-5 w-5 mr-2" />
            <span>Formato Regional</span>
          </div>
          {isRegionalFormatOpen ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>
        {isRegionalFormatOpen && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Formato de fecha
                </label>
                <div className="relative mt-1">
                  <CalendarDays className="absolute left-1 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <select
                    id="dateFormat"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-6 text-xs py-1"
                    value={dateFormat}
                    onChange={(e) => setDateFormat(e.target.value)}
                  >
                    <option value="">Tipo de Fecha</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col">
                <label htmlFor="timeFormat" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Formato de hora
                </label>
                <div className="relative mt-1">
                  <Clock className="absolute left-1 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <select
                    id="timeFormat"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-6 text-xs py-1"
                    value={timeFormat}
                    onChange={(e) => setTimeFormat(e.target.value)}
                  >
                    <option value="">Tpo de Hora</option>
                    <option value="HH:mm">HH:mm (24h)</option>
                    <option value="hh:mm A">hh:mm AM/PM (12h)</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col">
                <label htmlFor="currencyFormat" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Moneda de cobro
                </label>
                <div className="relative mt-1">
                  <BsCurrencyExchange className="absolute left-1 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <select 
                          id="currencyFormat" 
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-5 text-xs py-1" 
                          value={currencyFormat} 
                          onChange={(e) => setCurrencyFormat(e.target.value)}
                        >
                          <option value="">Tipo de Moneda</option>
                          {Object.entries(countryCurrencies).reduce((acc, [countryName, currencies]) => {
                              const region = currencies[0]?.region; // Assuming all currencies for a country have the same region
                              if (region) {
                                if (!acc[region]) {
                                  acc[region] = [];
                                }
                                acc[region].push(...currencies);
                              }
                              return acc;
                            }, {} as Record<string, { symbol: string; name: string; region: string }[]>)
                            ? Object.entries(Object.entries(countryCurrencies).reduce((acc, [countryName, currencies]) => {
                                const region = currencies[0]?.region; // Assuming all currencies for a country have the same region
                                if (region) {
                                  if (!acc[region]) {
                                    acc[region] = [];
                                  }
                                  acc[region].push(...currencies);
                                }
                                return acc;
                              }, {} as Record<string, { symbol: string; name: string; region: string }[]>)).map(([region, currencies]) => (
                                <optgroup key={region} label={region}>
                                  {currencies.map((currency, index) => (
                                    <option key={index} value={currency.symbol}>
                                      {`${currency.symbol} (${currency.name})`}
                                    </option>
                                  ))}
                                </optgroup>
                              ))
                            : null}
                        </select>
                </div>
              </div>
            </div>
          </div>)}
        </div>

        {/* Customize App Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-4">
          <button
          onClick={toggleCustomizeApp}
          className="flex items-center justify-between w-full p-4 text-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg"
        >
          <div className="flex items-center">
            <HiColorSwatch className="h-5 w-5 mr-2" />
            <span>Personalizar App</span>
          </div>
            {isCustomizeAppOpen ? (
              <ChevronUp className="text-gray-600 dark:text-gray-400" />
            ) : (
              <ChevronDown className="text-gray-600 dark:text-gray-400" />
            )}
          </button>
          {isCustomizeAppOpen && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* App Theme Color Picker */}
              <div className="ml-4">
                 <label htmlFor="appThemeColor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                   Color del Tema de la Aplicación
                 </label>
                 <ColorPicker color={appThemeColor} onChange={handleAppThemeColorChange} />
               </div>

            </div>
          )}
        </div>
    </div>
  );
};

export default OptionsPage;
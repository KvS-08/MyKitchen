import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { MdOutlineDriveFileRenameOutline } from 'react-icons/md';
import { IoMdBusiness } from 'react-icons/io';
import { FaMapLocationDot, FaTreeCity } from 'react-icons/fa6';
import { BiWorld, BiSolidBank } from 'react-icons/bi';
import { MdOutlineEmail } from 'react-icons/md';
import { FaUserGear } from 'react-icons/fa6';
import { FaPhoneAlt } from 'react-icons/fa';

const OptionsPage: React.FC = () => {
  const [isBusinessInfoOpen, setIsBusinessInfoOpen] = useState(false);
  const [hasBusinessInfoChanged, setHasBusinessInfoChanged] = useState(false);
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre del Negocio</label>
                <div className="relative mt-1">
                  <MdOutlineDriveFileRenameOutline className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input type="text" id="businessName" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-8" value={businessName} onChange={(e) => {setBusinessName(e.target.value); setHasBusinessInfoChanged(true);}} />
                </div>
              </div>
              <div>
                <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de Negocio</label>
                <div className="relative mt-1">
                  <IoMdBusiness className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input type="text" id="businessType" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-8" value={businessType} onChange={(e) => {setBusinessType(e.target.value); setHasBusinessInfoChanged(true);}} />
                </div>
              </div>
              <div>
                <label htmlFor="businessLogo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Logo del Negocio</label>
                <input type="file" id="businessLogo" accept="image/*" className="mt-1 block w-full text-gray-700 dark:text-gray-300" onChange={(e) => {setBusinessLogo(e.target.files ? e.target.files[0].name : ''); setHasBusinessInfoChanged(true);}} />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Dirección</label>
                <div className="relative mt-1">
                  <FaMapLocationDot className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input type="text" id="address" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-8" value={address} onChange={(e) => {setAddress(e.target.value); setHasBusinessInfoChanged(true);}} />
                </div>
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ciudad</label>
                <div className="relative mt-1">
                  <FaTreeCity className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input type="text" id="city" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-8" value={city} onChange={(e) => {setCity(e.target.value); setHasBusinessInfoChanged(true);}} />
                </div>
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300">País</label>
                <div className="relative mt-1">
                  <BiWorld className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select id="country" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-8" value={country} onChange={(e) => {
                    setCountry(e.target.value);
                    setPhoneNumberPrefix(countryPrefixes[e.target.value] || '');
                    setHasBusinessInfoChanged(true);
                  }}>
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
                <label htmlFor="bankAccount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cuenta Bancaria</label>
                <div className="relative mt-1">
                  <BiSolidBank className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input type="text" id="bankAccount" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-8" value={bankAccount} onChange={(e) => {setBankAccount(e.target.value); setHasBusinessInfoChanged(true);}} />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">E-mail</label>
                <div className="relative mt-1">
                  <MdOutlineEmail className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input type="email" id="email" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-8" value={email} onChange={(e) => {setEmail(e.target.value); setHasBusinessInfoChanged(true);}} />
                </div>
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Número Telefónico</label>
                <div className="relative mt-1 flex items-center">
                  {phoneNumberPrefix && (
                    <span className="text-gray-500 dark:text-gray-400 text-sm bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded-md mr-2">
                      {phoneNumberPrefix}
                    </span>
                  )}
                  <div className="relative flex-1">
                    <FaPhoneAlt className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input type="tel" id="phoneNumber" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-8" value={phoneNumber} onChange={(e) => {setPhoneNumber(e.target.value); setHasBusinessInfoChanged(true);}} />
                  </div>
                </div>
              </div>
            </div>
            {hasBusinessInfoChanged && (
              <div className="flex justify-end mt-4">
                <a href="#" className="text-blue-600 dark:text-blue-400 text-sm">Guardar</a>
              </div>
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
                <label htmlFor="employeeName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre del empleado</label>
                <div className="relative mt-1">
                  <MdOutlineDriveFileRenameOutline className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input type="text" id="employeeName" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-8" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} />
                </div>
              </div>
              <div>
                <label htmlFor="employeeRole" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Rol</label>
                <div className="relative mt-1">
                  <FaUserGear className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select id="employeeRole" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-8" value={employeeRole} onChange={(e) => setEmployeeRole(e.target.value)}>
                    <option value="">Seleccione un rol</option>
                    <option value="Administrador">Administrador</option>
                    <option value="Cajero">Cajero</option>
                    <option value="Mesero">Mesero</option>
                    <option value="Cocinero">Cocinero</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="employeeEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <div className="relative mt-1">
                  <MdOutlineEmail className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input type="email" id="employeeEmail" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-8" value={employeeEmail} onChange={(e) => setEmployeeEmail(e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OptionsPage;
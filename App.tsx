import React, { useState, useContext, ChangeEvent, useRef } from 'react';
import './App.css';
import { TransactionContext } from './context/TransactionContext';
import { TonConnectButton } from "@tonconnect/ui-react";

interface Input2Props {
  placeholder: string;
  name: string;
  type: string;
  value: string;
  handleChange?: (e: ChangeEvent<HTMLInputElement>, name: string) => void;
}

const Input2: React.FC<Input2Props> = ({ placeholder, name, type, value, handleChange }) => {
  const handleChangeInternal = (e: ChangeEvent<HTMLInputElement>) => {
    if (handleChange) {
      handleChange(e, name); // Llama a handleChange solo si está definido
    }
  };

  return (
    <input
      placeholder={placeholder}
      type={type}
      step="1"
      value={value}
      onChange={handleChangeInternal}
      className={`placeholder-italic ${type === 'number' ? 'font-normal px-2' : ''}`}
    />
  );
};

interface TextareaProps {
  placeholder: string;
  name: string;
  value: string;
  handleChange?: (e: ChangeEvent<HTMLTextAreaElement>, name: string) => void;
}

const Textarea: React.FC<TextareaProps> = ({ placeholder, name, value, handleChange }) => (
  <textarea
    placeholder={placeholder}
    value={value}
    onChange={(e) => handleChange && handleChange(e, name)}
    className="placeholder-italic resize-none p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
    style={{ maxHeight: '200px', minHeight: '150px', minWidth: '200px', maxWidth: '300px' }}
  />
);

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref para acceder al input de archivo

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault(); // Evita comportamientos por defecto
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
      updatePreview(file);
      onFileSelect(file); //////

    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
      updatePreview(file);
      onFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click(); // Activa el input de archivo cuando se hace clic en el área
  };

  const updatePreview = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreviewUrl(null);
  };

  return (
    <div>
      <div
        onClick={handleClick} // Maneja clic aquí
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="flex border-dashed border-4 border-gray-300 py-1 px-5 text-center cursor-pointer"
        style={{ width: 300, minHeight: 150, maxHeight: "auto" }}
      >
        {previewUrl ? (
          <div className="relative">
            <div className="flex justify-center">
              <img src={previewUrl} alt="Preview" className="max-w-full max-h-96 object-contain" />
            </div>
            <div className="absolute top-0 right-0">
              <button onClick={handleRemoveFile} className="text-black rounded-full p-1 cursor-pointer hover:bg-blue-100 text-3xl">
                X
              </button>
            </div>
          </div>
        ) : (
          <div className="flex text-center text-gray-500 items-center justify-center">
            Drag and drop an image here, or click to select file
          </div>
        )}
        <input
          type="file"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          ref={fileInputRef} // Referencia al input
        />
      </div>
    </div>
  );
}

function App() {
  const { sendTransaction, handleChange, formData, isLoading } = useContext(TransactionContext) || {};
  const [formularioVisible, setFormularioVisible] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (file: File) => {
    setFile(file);
  };

  const handleTransaction = async (file: any) => {
    if (sendTransaction) {
      await sendTransaction(file);
      console.log('Transaction executed!');
    }
  };

  const toggleFormulario = () => {
    setFormularioVisible(!formularioVisible);
  };
  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>, name: string) => {
    // Implementar la lógica para input
    const value = e.target.value;
    // Actualizar el estado u otra lógica según sea necesario
  };
  
  const handleChangeTextarea = (e: ChangeEvent<HTMLTextAreaElement>, name: string) => {
    // Implementar la lógica para textarea
    const value = e.target.value;
    // Actualizar el estado u otra lógica según sea necesario
  };
  return (
    <div className="flex flex-col p-3 items-center max-h-screen sm:max-h-screen lg:max-h-screen md:max-h-screen">
      <TonConnectButton className="p-4" style={{ float: 'right' }} />

      <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row justify-center">
        <div className="flex flex-col items-center p-2">
          <p className="font-bold p-2">* Name your Jetton:</p>
          <Input2
            placeholder="Notcoin"
            name="MemeName"
            type="text"
            value={formData?.MemeName || ''}
            handleChange={handleChangeInput}
          />
        </div>
        <div className="flex flex-col items-center p-2">
          <p className="font-bold p-2">* Symbol:</p>
          <Input2
            placeholder="NOT"
            name="Symbol"
            type="text"
            value={formData?.Symbol || ''}
            handleChange={handleChange}
          />
        </div>
        <div className="flex flex-col items-center p-2">
          <p className="font-bold p-2">* Supply:</p>
          <Input2
            placeholder="100,000,000"
            name="Supply"
            type="number"
            value={formData?.Supply || ''}
            handleChange={handleChange}
          />
        </div>
      </div>

      <button className="p-4" onClick={toggleFormulario}>
        {formularioVisible ? (
          <div>Less Options</div>
        ) : (
          <div>More Options</div>
        )}
      </button>

      {formularioVisible && (
        <div className="flex flex-col sm:flex-row">
          <div className="flex flex-col flex-1 mb-4 md:mb-0 md:mr-4">
            <p className="font-bold text-center mb-2">Brief description:</p>
            <div className="flex flex-col justify-center items-center p-2 italic input-container">
              <Textarea
                placeholder="we are people who make memes that goes to da moon!!!!"
                name="description"
                value={formData?.description || ''}
                handleChange={handleChangeTextarea} // Definir esta función para textarea
              />
            </div>
          </div>

          <div className="flex flex-col flex-1">
            <div className="flex flex-col justify-center font-bold">
              <h1 className="text-center">Image:</h1>
            </div>
            <div className="flex justify-center p-2">
              <FileUpload onFileSelect={handleFileSelect} />
            </div>
          </div>
        </div>
      )}

{isLoading? (
        <div>Loading...</div> // Puedes reemplazar esto con tu componente Loader
      ) : (

        <div className="flex p-4">
          <button
            className="px-10 py-2 bg-blue-500 text-xl text-white rounded-2xl shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            type="button"
            onClick={() => handleTransaction(file)}
            >
            Create Jetton
          </button>
        </div>
      )}
    </div>
  );
}

export default App;

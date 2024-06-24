import React, { ReactNode, createContext, useState, ChangeEvent } from "react";
import { useTonConnectUI, useTonAddress } from '@tonconnect/ui-react';
import { deployContract, DetailsToken } from "./ContextTON/TONDeployer";
import Axios from "axios";

interface TransactionContextProps {
    sendTransaction: (file: File) => Promise<void>;
    handleChange: (e: ChangeEvent<HTMLInputElement>, name: string) => void;
    formData: { MemeName: string; Symbol: string; Supply: string; description: string };
    isLoading: boolean;
}

const saveImageToServer = async (imageFile: File): Promise<string | null> => {
    try {
        const formData = new FormData();
        formData.append('image', imageFile);

        const response = await Axios.post('https://app-memes-golden-g-goose.onrender.com/api/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (response?.data?.imageUrl) {
            console.log('Image uploaded successfully. Image name:', response.data.imageUrl);
            return response.data.imageUrl; 
        } else {
            console.error('Error: Image name not received from the server.');
            return null;
        }
    } catch (error) {
        console.error('Error uploading image:', error);
        return null;
    }
};

export const TransactionContext = createContext<TransactionContextProps | undefined>(undefined);

interface TransactionProviderProps {
    children: ReactNode;
}

export const TransactionProvider: React.FC<TransactionProviderProps> = ({ children }) => {
    const [formData, setFormData] = useState({ MemeName: '', Symbol: '', Supply: '', description: '' });
    const [tonConnectUI] = useTonConnectUI();
    const [isLoading, setIsLoading] = useState(false);
    const TONuserFriendlyAddress = useTonAddress();

    const handleChange = (e: ChangeEvent<HTMLInputElement>, name: string) => {
        setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
    };

    const sendTransaction = async (file: File) => {
        const { MemeName, Symbol, Supply, description } = formData;
        setIsLoading(true);

        try {
            const dataTON = {
                name: MemeName,
                symbol: Symbol,
                decimals: '9',
                mintAmount: (parseFloat(Supply) * 1.01),
                description: description,
                tokenImage: "https://ik.imagekit.io/PAMBIL/egg.gif?updatedAt=1718300067903"
            };

            const result = await deployContract(TONuserFriendlyAddress, tonConnectUI, dataTON);

            const image_meme_url = await saveImageToServer(file);

            if (result) {
                const dataTON_2 = {
                    name: MemeName,
                    symbol: Symbol,
                    decimals: '9',
                    description: description,
                    image: image_meme_url
                };

                await DetailsToken(
                    TONuserFriendlyAddress,
                    tonConnectUI,
                    result.contractAddr,
                    dataTON_2,
                    TONuserFriendlyAddress,
                    parseFloat(Supply) * 0.01,
                    result.ownerJWalletAddr
                );
                
            } else {
                console.error('Error: Image URL from saveImageToServer is undefined.');
            }
        } catch (error) {
            console.error('Error in sendTransaction:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <TransactionContext.Provider value={{ sendTransaction, handleChange, formData, isLoading }}>
            {children}
        </TransactionContext.Provider>
    );
};

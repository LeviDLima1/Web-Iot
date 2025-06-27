import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { apiGet, apiPut, apiDelete } from '../api';

const PetContext = createContext();

// Reducer for allPets
const petsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_PETS':
            return action.payload;
        case 'UPDATE_PET_LOCATION':
            return state.map(pet => {
                if (pet.macId === action.payload.petId) {
                    const newLocationEntry = {
                        ...action.payload.location,
                        timestamp: new Date().toISOString()
                    };
                    return {
                        ...pet,
                        location: action.payload.location,
                        locationHistory: [...(pet.locationHistory || []), newLocationEntry],
                        lastUpdate: new Date().toLocaleTimeString(),
                        isOnline: true
                    };
                }
                return pet;
            });
        case 'UPDATE_PET_ADDRESS':
            return state.map(pet =>
                pet.macId === action.payload.petId
                    ? { ...pet, address: action.payload.address }
                    : pet
            );
        case 'UPDATE_PET_HOME_AREA':
            return state.map(pet =>
                pet.macId === action.payload.petId
                    ? { ...pet, homeArea: action.payload.homeArea }
                    : pet
            );
        case 'ADD_PET':
            return [...state, action.payload];
        case 'UPDATE_PET':
            return state.map(pet =>
                pet.id === action.payload.id
                    ? { ...pet, ...action.payload }
                    : pet
            );
        case 'DELETE_PET':
            return state.filter(pet => pet.id !== action.payload);
        default:
            return state;
    }
};

export const PetProvider = ({ children }) => {
    const { user, token } = useAuth();
    const [allPets, dispatchPets] = useReducer(petsReducer, []);

    // Função para buscar pets do usuário logado
    const fetchPets = useCallback(async () => {
        if (!user || !token) return;
        try {
            const data = await apiGet(`/pets/user/${user.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log('Pets recebidos do backend:', data);
            if (Array.isArray(data)) {
                dispatchPets({ type: 'SET_PETS', payload: data });
            }
        } catch (err) {
            console.error('Erro ao buscar pets do usuário:', err);
        }
    }, [user, token]);

    // Buscar pets ao iniciar
    useEffect(() => {
        fetchPets();
    }, [fetchPets]);

    // Funções auxiliares para CRUD que usarão dispatchPets
    const addPet = useCallback(async (newPet) => {
        // O cadastro já é feito via API na tela de cadastro, aqui só força o refresh
        await fetchPets();
    }, [fetchPets]);

    const updatePet = useCallback(async (petId, updatedData) => {
        if (!token) return;
        try {
            const data = await apiPut(`/pets/${petId}`, updatedData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!data.error) {
                dispatchPets({ type: 'UPDATE_PET', payload: data });
            } else {
                console.error('Erro ao atualizar pet:', data.error);
            }
        } catch (err) {
            console.error('Erro de conexão ao atualizar pet:', err);
        }
    }, [token]);

    const deletePet = useCallback(async (petId) => {
        if (!token) return;
        try {
            const data = await apiDelete(`/pets/${petId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!data?.error) {
                dispatchPets({ type: 'DELETE_PET', payload: petId });
            } else {
                console.error('Erro ao remover pet:', data?.error);
            }
        } catch (err) {
            console.error('Erro de conexão ao remover pet:', err);
        }
    }, [token]);

    const updatePetLocation = useCallback((petId, location) => {
        dispatchPets({ type: 'UPDATE_PET_LOCATION', payload: { petId, location } });
    }, []);

    const updatePetAddress = useCallback((petId, address) => {
        dispatchPets({ type: 'UPDATE_PET_ADDRESS', payload: { petId, address } });
    }, []);

    const updatePetHomeArea = useCallback((petId, homeArea) => {
        dispatchPets({ type: 'UPDATE_PET_HOME_AREA', payload: { petId, homeArea } });
    }, []);

    const getPetById = useCallback((petId) => {
        return allPets.find(pet => String(pet.id) === String(petId));
    }, [allPets]);

    return (
        <PetContext.Provider
            value={{
                allPets,
                addPet,
                updatePet,
                deletePet,
                updatePetLocation,
                updatePetAddress,
                updatePetHomeArea,
                getPetById,
                dispatchPets
            }}
        >
            {children}
        </PetContext.Provider>
    );
};

export const usePet = () => {
    return useContext(PetContext);
}; 
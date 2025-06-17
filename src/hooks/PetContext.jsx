import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { petsData as initialPetsData } from '../components/HomePageFoulder/initialPetsData';

const PetContext = createContext();

// Reducer for allPets (copiado de HomePage.jsx)
const petsReducer = (state, action) => {
    switch (action.type) {
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
    const [allPets, dispatchPets] = useReducer(petsReducer, initialPetsData);

    // Funções auxiliares para CRUD que usarão dispatchPets
    const addPet = useCallback((newPet) => {
        dispatchPets({ type: 'ADD_PET', payload: newPet });
    }, []);

    const updatePetLocation = useCallback((petId, location) => {
        dispatchPets({ type: 'UPDATE_PET_LOCATION', payload: { petId, location } });
    }, []);

    const updatePetAddress = useCallback((petId, address) => {
        dispatchPets({ type: 'UPDATE_PET_ADDRESS', payload: { petId, address } });
    }, []);

    const updatePetHomeArea = useCallback((petId, homeArea) => {
        dispatchPets({ type: 'UPDATE_PET_HOME_AREA', payload: { petId, homeArea } });
    }, []);

    const updatePet = useCallback((petId, updatedData) => {
        dispatchPets({ type: 'UPDATE_PET', payload: { id: petId, ...updatedData } });
    }, []);

    const deletePet = useCallback((petId) => {
        dispatchPets({ type: 'DELETE_PET', payload: petId });
    }, []);

    const getPetById = useCallback((petId) => {
        return allPets.find(pet => pet.id === petId);
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
                dispatchPets // Mantido para flexibilidade, caso actions mais complexas sejam necessárias
            }}
        >
            {children}
        </PetContext.Provider>
    );
};

export const usePet = () => {
    return useContext(PetContext);
}; 
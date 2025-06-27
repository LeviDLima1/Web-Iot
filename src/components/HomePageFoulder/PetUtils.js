// Funções utilitárias para pets

export const getStatusColor = (status) => {
    if (status.includes('FORA')) {
        return 'text-red-600 font-semibold';
    }
    return 'text-green-600';
};

export const getOnlineStatusColor = (isOnline) => {
    return isOnline ? 'text-green-500' : 'text-red-500';
}; 
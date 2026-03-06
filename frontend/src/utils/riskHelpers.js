export const calculateRiskColor = (score) => {
    if (score > 70) return 'red';
    if (score > 40) return 'orange';
    return 'green';
};

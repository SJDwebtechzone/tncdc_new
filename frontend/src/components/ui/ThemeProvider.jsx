import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const ThemeProvider = ({ children }) => {
    const { primaryColor, secondaryColor } = useSelector(state => state.website?.siteSettings || {});

    useEffect(() => {
        document.documentElement.style.setProperty('--primary-color', primaryColor || '#10b981');
        document.documentElement.style.setProperty('--secondary-color', secondaryColor || '#059669');
    }, [primaryColor, secondaryColor]);

    return children;
};

export default ThemeProvider;
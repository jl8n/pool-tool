
import axios from 'axios';

const POOL_API_BASE_URL = 'http://65.130.181.10:4200'; // Pool API URL

// Function to make requests to the pool API
export const callPoolApi = async (endpoint: string, method: string, data: object = {}) => {

    try {
        const url = `${POOL_API_BASE_URL}/${endpoint}`;
        const response = await axios({ url, method, data });
        return response.data;
    } catch (error) {
        console.error('Error calling pool API:', error);
        throw error;
    }
};



// Filter out all features to show only those listed as visible
export function findVisibleFeatures(obj: object, results: object[] = []): object[] {

    if (typeof obj === 'object' && obj !== null) {
        if (Array.isArray(obj)) {
            for (const item of obj) {
                if (item.hasOwnProperty('showInFeatures') && item.showInFeatures === true) {
                    results.push(item);
                }
                findVisibleFeatures(item, results);
            }
        } else {
            Object.values(obj).forEach(value => findVisibleFeatures(value, results));
        }
    }
    return results;
}


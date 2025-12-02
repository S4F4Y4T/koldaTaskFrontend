/**
 * Handles server-side validation errors (Laravel 422 response)
 * @param {Error} err - The error object from axios
 * @param {Object} errorsRef - The Vue ref object containing form errors
 * @returns {boolean} - True if validation errors were handled, false otherwise
 */
export const handleServerErrors = (err, errorsRef) => {
    if (err.response && err.response.status === 422 && err.response.data.errors) {
        const serverErrors = err.response.data.errors;
        // Clear previous errors first? Maybe not, to keep client-side ones if any.
        // But usually we want to show what the server returned.

        Object.keys(serverErrors).forEach(key => {
            // Only map errors if the field exists in our errors object
            // This prevents trying to set errors for fields that don't exist in the UI
            if (errorsRef.value.hasOwnProperty(key)) {
                errorsRef.value[key] = serverErrors[key][0];
            }
        });
        return true;
    }
    return false;
};

/**
 * Extracts a global error message from an API error object
 * @param {Error} err - The error object from axios
 * @returns {string} - The error message
 */
export const getErrorMessage = (err) => {
    if (err.response) {
        // Check if data is an object and has a message property
        if (err.response.data && typeof err.response.data === 'object' && err.response.data.message) {
            return err.response.data.message;
        }
        // Fallback for non-JSON responses (e.g. HTML error pages)
        return `Server Error: ${err.response.status} ${err.response.statusText || 'Unknown Error'}`;
    }
    return err.message || 'An unexpected error occurred';
};

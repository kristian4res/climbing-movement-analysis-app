/**
 * Formats a given time in seconds into a string in the format HH:MM:SS.
 *
 * @param {number} time - The time in seconds to be formatted.
 * @returns {string} The formatted time string in the format HH:MM:SS.
 */
export const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time - hours * 3600) / 60);
    const seconds = time - hours * 3600 - minutes * 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};


/**
 * Generates a unique identifier string.
 *
 * This function generates a unique identifier by combining the current timestamp
 * (in milliseconds since the Unix epoch) and a random number. Both numbers are
 * converted to base36 strings to compact the identifier.
 *
 * @returns {string} A unique identifier string.
 */
export const generateUniqueId = () => {
    return `${Date.now().toString(36) + Math.random().toString(36).substr(2, 9)}`;
}
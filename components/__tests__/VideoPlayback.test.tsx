import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemeContext } from '@/context/themeContext';
import VideoPlayback from '@/components/VideoPlayback';

jest.mock('expo-media-library', () => ({
    getAlbumAsync: jest.fn(() => Promise.resolve({})),
    getAssetsAsync: jest.fn(() => Promise.resolve({ assets: [] })),
    deleteAssetsAsync: jest.fn(),
}));

describe('VideoPlayback component', () => {
    it('matches the snapshot', () => {
        const testFilename = 'Test filename';

        const { toJSON } = render(
            <ThemeContext.Provider value={{ isDark: false, toggleTheme: () => {} }}>
                <VideoPlayback filename={testFilename} />
            </ThemeContext.Provider>
        );

        expect(toJSON()).toMatchSnapshot();
    });

    it('renders the passed filename', async () => {
        const testFilename = 'Test filename';

        const { findByText } = render(
            <ThemeContext.Provider value={{ isDark: false, toggleTheme: () => {} }}>
                <VideoPlayback filename={testFilename} />
            </ThemeContext.Provider>
        );

        expect(await findByText(testFilename)).toBeTruthy();
    });
});
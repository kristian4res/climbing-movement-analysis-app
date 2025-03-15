import React from 'react';
import { render } from '@testing-library/react-native';
import PulsingCircle from '@/components/PulsingCircle';

describe('PulsingCircle component', () => {
    it('matches the snapshot', () => {
        const tree = render(<PulsingCircle isActive={true} />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('renders with red background when active', () => {
        const { getByTestId } = render(<PulsingCircle isActive={true} />);
        expect(getByTestId('pulsing-circle').props.style).toEqual({backgroundColor: "red", borderRadius: 10, height: 20, position: "absolute", top: 20, transform: [{scale: 1}], width: 20, zIndex: 11});
    });

    it('renders with white background when inactive', () => {
        const { getByTestId } = render(<PulsingCircle isActive={false} />);
        expect(getByTestId('pulsing-circle').props.style).toEqual({backgroundColor: "white", borderRadius: 10, height: 20, position: "absolute", top: 20, transform: [{scale: 1}], width: 20, zIndex: 11});
    });
});
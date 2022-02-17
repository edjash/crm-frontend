
import { render, screen } from '@testing-library/react';
import React from 'react';
import CountrySelect from '../components/CountrySelect';


test('sets default value', async () => {

    const defaultValue = { value: "US", label: "United States" };

    render(
        <CountrySelect
            name="country"
            defaultValue={defaultValue}
        />
    );

    screen.debug();
    // Arrange
    // Act
    // Assert
});
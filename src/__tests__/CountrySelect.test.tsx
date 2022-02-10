
import { render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import React from 'react';
import { useForm } from "react-hook-form";
import CountrySelect from '../components/CountrySelect';


test('sets default value', async () => {

    const defaultValue = { value: "US", label: "United States" };

    console.log(control);

    render(
        <CountrySelect
            name="country"
            control={control}
            defaultValue={defaultValue}
        />
    );
    // Arrange
    // Act
    // Assert
});
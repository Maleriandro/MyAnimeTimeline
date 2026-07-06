import React from 'react';
import './SegmentedControl.css';

interface SegmentedControlProps<T extends string> {
    name: string;
    options: { value: T; label: string }[];
    value: T;
    onChange: (value: T) => void;
}

export const SegmentedControl = <T extends string>(props: SegmentedControlProps<T>) => {
    return (
        <div className="segmented-control">
            {props.options.map(option => (
                <React.Fragment key={option.value}>
                    <input
                        type="radio"
                        id={`${props.name}-${option.value}`}
                        name={props.name}
                        value={option.value}
                        checked={props.value === option.value}
                        onChange={() => props.onChange(option.value)}
                    />
                    <label htmlFor={`${props.name}-${option.value}`}>{option.label}</label>
                </React.Fragment>
            ))}
        </div>
    );
};

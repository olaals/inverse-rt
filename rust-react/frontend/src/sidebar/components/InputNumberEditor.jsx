// This file is under license: MIT © https://gitlab.com/Vinarnt/react-input-number-editor

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

export const KEYS = {
    BACKSPACE: 'Backspace',
    ENTER: 'Enter',
    ESC: 'Escape',
    ARROW_UP: 'ArrowUp',
    ARROW_DOWN: 'ArrowDown'
};

function InputNumberEditor(props) {
    const {
        className,
        value,
        min,
        max,
        step,
        stepModifier,
        slideModifier,
        precision,
        readOnly,
        onChange
    } = props;

    const [displayValue, setDisplayValue] = useState(formatValue(value));
    const [internalValue, setInternalValue] = useState(
        Number(formatValue(value))
    );
    const [isEditing, setIsEditing] = useState(false);
    const [isPointerLocked, setIsPointerLocked] = useState(false);

    const selfRef = useRef();

    useEffect(() => {
        document.addEventListener(
            'pointerlockchange',
            handlePointerLockChange,
            false
        );
        return () => {
            document.removeEventListener(
                'pointerlockchange',
                handlePointerLockChange
            );
        };
    }, []);

    useEffect(() => {
        changeValue(value, true, false);
    }, [value]);

    function handleMouseDown() {
        if (!isPointerLocked && !readOnly) selfRef.current.requestPointerLock();
    }
    function handleMouseUp() {
        if (isPointerLocked && !readOnly) document.exitPointerLock();
    }
    function handleMouseMove({ movementX }) {
        if (isPointerLocked && movementX) {
            addValue(
                movementX * Math.pow(10, -precision) * slideModifier,
                true
            );
        }
    }

    function handleKeyDown(event) {
        const { key, shiftKey, ctrlKey } = event;
        if ((key === KEYS.ARROW_UP || key === KEYS.ARROW_DOWN) && !readOnly) {
            let value = step;
            if (shiftKey) value *= stepModifier;
            else if (ctrlKey) value /= stepModifier;
            if (key === KEYS.ARROW_DOWN) value = -value;
            addValue(value, true);
        } else if (key === KEYS.ENTER) {
            if (isEditing) confirmEditing();
        } else if (key === KEYS.ESC) {
            if (isEditing) cancelEditing();
            if (isPointerLocked) document.exitPointerLock();
        } else if (key === KEYS.BACKSPACE && isPointerLocked) {
            event.preventDefault();
        }
    }

    function handleBlur() {
        cancelEditing();
    }

    function handlePointerLockChange() {
        const locked = document.pointerLockElement === selfRef.current;
        setIsPointerLocked(locked);
    }

    function handleChange({ target }) {
        if (!isEditing) setIsEditing(true);

        setDisplayValue(target.value);
    }

    function cancelEditing() {
        setIsEditing(false);
        setDisplayValue(formatValue(internalValue));
    }

    function confirmEditing() {
        if (isPointerLocked) document.exitPointerLock();
        if (isEditing) setIsEditing(false);

        changeValue(displayValue, true);
    }

    function changeValue(value, updateDisplay = false, triggerEvent = true) {
        if (typeof value !== 'number') value = Number(value);
        if (isNaN(value)) value = internalValue;

        let newValue = value;
        if (min !== undefined && newValue < min) newValue = min;
        else if (max !== undefined && newValue > max) newValue = max;

        if (updateDisplay || Number(displayValue) !== newValue)
            setDisplayValue(formatValue(newValue));
        if (internalValue !== newValue) {
            const newInternalValue = Number(Number(newValue).toFixed(precision));
            setInternalValue(newInternalValue);
            if (onChange && triggerEvent) onChange(newInternalValue);
        }
    }

    function addValue(amount, updateDisplay) {
        if (typeof amount !== 'number') amount = Number(amount);
        let newValue = internalValue + amount;

        changeValue(newValue, updateDisplay);
    }

    function formatValue(value) {
        if (typeof value !== 'number') value = Number(value);
        return value.toFixed(precision);
    }

    const newProps = {
        ref: selfRef,
        value: displayValue,
        min: min,
        max: max,
        step: step,
        onMouseDown: handleMouseDown,
        onMouseUp: handleMouseUp,
        onMouseMove: handleMouseMove,
        onKeyDown: handleKeyDown,
        onBlur: handleBlur,
        readOnly: readOnly,
        onChange: handleChange
    };
    if (className) {
        Object.assign(newProps, { className: className });
    }
    if (isEditing) {
        if (newProps.className) newProps.className += ' editing';
        else Object.assign(newProps, { className: 'editing' });
    }

    return <input {...newProps} />;
}

InputNumberEditor.propTypes = {
    className: PropTypes.string,
    value: PropTypes.number.isRequired,
    max: PropTypes.number,
    min: PropTypes.number,
    precision: PropTypes.number,
    step: PropTypes.number,
    stepModifier: PropTypes.number,
    slideModifier: PropTypes.number,
    readOnly: PropTypes.bool,
    onChange: PropTypes.func
};
InputNumberEditor.defaultProps = {
    value: 0,
    step: 1,
    stepModifier: 10,
    slideModifier: 0.3,
    precision: 0
};

export default InputNumberEditor;

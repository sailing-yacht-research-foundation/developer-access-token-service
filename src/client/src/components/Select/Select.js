import React, { Component } from 'react'
import * as styles from './Select.module.css'

import { componentId } from '../../utils/utilities';
import Select from 'react-select';

const select = props => {

    const id = componentId('cb-')
    const onChange = selected => {
        let result = [...(props.options || [])].filter(t => props.getValue(t) === selected.value)
        
        props.onChange(result.length > 0 ? result[0] : null,props.name)
    }
    return (
        <div className={["form-group", styles.group, props.groupclass].join(' ')}>
            {props.label ? <label htmlFor={id} className={styles.label}>{props.label}</label> : null}
            <Select
                isDisabled={props.readOnly}
                placeholder={props.placeholder || "Pilih"}
                value={props.value ? {
                    value: props.getValue(props.value),
                    label: props.getText(props.value)
                }: null}
                onChange={onChange}
                options={(props.options || []).map(t => (
                    {
                        value: props.getValue((t||{})),
                        label: props.getText((t||{}))
                    }
                ))}
                className={['neuselect-container'].join(' ')} classNamePrefix="neuselect" />
        </div>
    )

}

export default select

import { useState } from 'react';
import { componentId } from '../utils/utilities';

const SearchBox = ({
    id: idProps,
    textarea,
    type,
    changed,
    append,
    prepend,
    label,
    groupclass,
    rows,
    error,
    placeholder,
    value,
    name,
    disabled,
    readOnly,
    onfocus,
    onblur,
    clicked,
    onPaste,
    helptext,
    autoComplete,
    searchDelay
}) => {

    const [state, setState] = useState({
        timeout: null,
        evt: null
    })

    const onSearch = (evt) => {
        return () => {
            changed(evt)
        }
    }
    
    const doSearch = (evt) => {
        
        if (state.timeout) clearTimeout(state.timeout);
        let timeout = setTimeout(onSearch(evt.target), searchDelay || 700);
        setState({ timeout: timeout, evt: evt })
    }


    const id = idProps || componentId('textBox');
    const inputClasses = ["form-control", '', 'neu-down'];
    const containerClass = [''];
    containerClass.push(containerClass)

    return (
        <div className={[groupclass,].join(' ')}>
            {label ? <label htmlFor={id} className="sr-only">{label}</label> : null}
            <input
                className={`border-gray-300 appearance-none rounded-md relative block w-full px-3 py-2 border  placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                type={type}
                rows={rows || 5}
                id={id} aria-describedby={'helper' + id}
                placeholder={placeholder}
                onChange={doSearch}
                value={value}
                name={name}
                disabled={disabled}
                readOnly={readOnly}
                onFocus={onfocus}
                onBlur={onblur}
                onClick={clicked}
                onPaste={onPaste}
                rows={rows}
                autoComplete={autoComplete}
            />
        </div>
    )
}





export default SearchBox
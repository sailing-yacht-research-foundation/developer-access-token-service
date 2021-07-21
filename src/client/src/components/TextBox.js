import React from 'react';

import { componentId } from '../utils/utilities';

const TextBox = React.forwardRef(
  (
    {
      id: idProps,
      textarea,
      type,
      changed,
      className,
      append,
      prepend,
      label,
      groupclass,
      rows,
      hasError,
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
      pattern,
      //ref,
      keypress,
      keyup,
      maxlength,
    },
    ref,
  ) => {
    const id = idProps || componentId('textBox');
    const I = textarea ? `textarea` : `input`;
    const border = hasError ? 'border-red-300' : 'border-gray-300';

    const onChange = (evt) => {
      if (type === 'number') {
        let numvalue = parseInt(evt.target.value);
        changed({
          ...evt,
          target: {
            ...evt.target,
            value: isNaN(numvalue) ? numvalue : evt.target.value,
            name: evt.target.name,
          },
        });
      } else {
        changed(evt);
      }
    };
    return (
      <div className={['mb-2', groupclass].join(' ')}>
        {label ? (
          <label htmlFor={id} className={disabled ? 'text-gray-400' : ''}>
            {label}
          </label>
        ) : null}
        <I
          className={`${className} ${border} appearance-none rounded-md relative block w-full px-3 py-2 border  placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
          type={type}
          rows={rows || 5}
          id={id}
          aria-describedby={'helper' + id}
          placeholder={placeholder}
          onChange={onChange}
          value={value}
          name={name}
          disabled={disabled}
          readOnly={readOnly}
          onFocus={onfocus}
          onBlur={onblur}
          onClick={clicked}
          onPaste={onPaste}
          autoComplete={autoComplete}
          pattern={pattern}
          ref={ref}
          onKeyPress={keypress}
          onKeyDown={keyup}
          maxlength={maxlength}
        />
        <span
          className={[
            'text-xs ',
            hasError ? 'text-red-300' : 'text-gray-800',
          ].join(' ')}
        >
          {helptext}
        </span>
      </div>
    );
  },
);

export default TextBox;

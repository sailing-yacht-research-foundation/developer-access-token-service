import React from 'react';
const Card = ({children,className, onClick}) => {
    
    return(
        <div className={["bg-white rounded-md shadow-md",className].join(' ')} onClick={onClick}>
            {children}
        </div>
    )
}

export default Card
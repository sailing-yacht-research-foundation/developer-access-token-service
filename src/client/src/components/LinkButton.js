import { Link } from 'react-router-dom'

const LinkButton = ({ rootelement, className:classNameProp,size = 'md', target, to, disabled, clicked, children, color="indigo" }) => {
    let className = `w-max group relative flex justify-center py-1 px-1 border border-transparent font-medium rounded-md text-white cursor-default`
    const E = rootelement === 'a' ? `a` : disabled ? `span` : Link
    let btnSize = ''
   
    
    switch (size) {
        case 'md':
            btnSize = 'py-1 px-2 text-sm'
            break;
        case 'sm':
            btnSize = 'py-1 px-2 text-xs'
            break;

        default:
            btnSize = 'py-2 px-4 text-sm'
            break;
    }
    
    const clss = [
        classNameProp,
        className, 
        btnSize ,
        disabled ? 'bg-gray-400 cursor-auto' : `bg-${color}-600 hover:bg-${color}-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${color}-500`
    ]

    return (
        <E className={clss.join(' ')} target={target} to={to} href={to} disabled={disabled || false} onClick={clicked}>{children}</E>
    )
}

export default LinkButton
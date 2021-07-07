


const CheckBox = ({checked, changed, className, inputClassName, label, clicked}) => {
    return (
        <label className={[className,"inline-flex items-center"].join(' ')}>
            <input type="checkbox" className={["form-checkbox h-5 w-5 text-orange-600",inputClassName]} checked={checked} onChange={changed} onClick={clicked}/>
            <span className="ml-2 text-gray-700">{label}</span>
        </label>
    )
}

export default CheckBox
import PropTypes from 'prop-types';

function Button(props) {
    const borderClass = props.borderColor ? `border-2 border-${props.borderColor}` : '';
    const fitClass = props.fit === 'fit' ? 'w-fit h-fit px-1 font-normal' : `h-[33px] w-[160px] font-bold`;

    return (
        <div>
            <button type="submit" className={`${fitClass} bg-${props.bgColor} text-${props.textColor} ${borderClass} rounded-[4px] flex justify-center items-center`}>
                {props.name}
            </button>
        </div>
    );
}

Button.propTypes = {
    name: PropTypes.string,
    bgColor: PropTypes.string,
    textColor: PropTypes.string,
    height: PropTypes.number,
    width: PropTypes.number,
    borderColor: PropTypes.string,
    fit: PropTypes.string
};

Button.defaultProps = {
    borderColor: '',
    fit: '',
};

export default Button;

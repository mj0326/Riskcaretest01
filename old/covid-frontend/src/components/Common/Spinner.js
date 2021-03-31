import './Spinner.scss';

function Spinner({ size = 20 }) {
    return (
        <div className="ispinner" style={{ width: size, height: size }}>
            <div className="ispinner-blade"></div>
            <div className="ispinner-blade"></div>
            <div className="ispinner-blade"></div>
            <div className="ispinner-blade"></div>
            <div className="ispinner-blade"></div>
            <div className="ispinner-blade"></div>
            <div className="ispinner-blade"></div>
            <div className="ispinner-blade"></div>
            <div className="ispinner-blade"></div>
            <div className="ispinner-blade"></div>
            <div className="ispinner-blade"></div>
            <div className="ispinner-blade"></div>
        </div>
    )
}

export default Spinner;
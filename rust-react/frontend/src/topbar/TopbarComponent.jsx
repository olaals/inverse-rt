

const TopbarComponent = ({ description, onClick }) => {
    return <div className="topbarComponent" onClick={onClick}>
        {description}
    </div>;
};

TopbarComponent.defaultProps = {
    description: 'defaultDescr',
    onClick: () => { console.log("default onClick") }
};

export default TopbarComponent;

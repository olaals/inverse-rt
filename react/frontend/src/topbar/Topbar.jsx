import './css/topbar.css';
import TopbarComponent from './TopbarComponent';
import { useNavigate } from 'react-router-dom';

const Topbar = () => {
    const navigate = useNavigate();

    let onClickSelectProject = () => {
        navigate('/project_select');
    }

    let onClick3DViewport = () => {
        navigate('/');
    }

    let onClick2DViewport = () => {
        navigate('/2dviewport');
    }



    return <div className="topbar">
        <TopbarComponent description={"Select project"} onClick={onClickSelectProject} />
        <TopbarComponent description={"3D viewport"} onClick={onClick3DViewport} />
        <TopbarComponent description={"2D viewport"} onClick={onClick2DViewport} />

    </div>;
};

export default Topbar;

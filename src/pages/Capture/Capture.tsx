import FaceRecoginitionsWithPosV2 from '../../components/Capture/FaceRecoginitionsWithPosV2';

const Capture = () => {
    return (
        <div className="faceContainer">
            <FaceRecoginitionsWithPosV2
                callback={(e) => {
                    console.error(e);
                }}
            />
        </div>
    );
};

export default Capture;
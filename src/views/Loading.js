import { ThreeDots } from "react-loading-icons";
import "../styles/loading.scss";
const Loading = () => {
  return (
    <>
      <div className="loading-opacity" style={{ display: "none" }}>
        <div className="loading-icon">
          <ThreeDots />
        </div>
      </div>
    </>
  );
};
export default Loading;

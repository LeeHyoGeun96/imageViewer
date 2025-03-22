import { FiPlus, FiMinus } from "react-icons/fi";
import { IoReloadSharp } from "react-icons/io5";

interface ZoomControlsProps {
  zoomIn: () => void;
  zoomOut: () => void;
  resetTransform: () => void;
}

const ZoomControls = ({
  zoomIn,
  zoomOut,
  resetTransform,
}: ZoomControlsProps) => {
  return (
    <div className="flex gap-1 tools absolute bottom-4 right-4 z-10 rounded">
      <button
        aria-label="확대"
        className="text-white bg-black/60 hover:bg-black/80 focus:bg-black/80 rounded cursor-pointer p-4"
        onClick={() => zoomIn()}
        tabIndex={0}
      >
        <FiPlus aria-hidden="true" />
      </button>
      <button
        aria-label="축소"
        className="text-white bg-black/60 hover:bg-black/80 focus:bg-black/80 rounded cursor-pointer p-4"
        onClick={() => zoomOut()}
        tabIndex={0}
      >
        <FiMinus aria-hidden="true" />
      </button>
      <button
        aria-label="배율 초기화"
        className="text-white bg-black/60 hover:bg-black/80 focus:bg-black/80 rounded cursor-pointer p-4"
        onClick={() => resetTransform()}
        tabIndex={0}
      >
        <IoReloadSharp aria-hidden="true" />
      </button>
    </div>
  );
};

export default ZoomControls;

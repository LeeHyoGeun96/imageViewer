import { TransformComponent } from "react-zoom-pan-pinch";
import { ImageData } from "../../api/imageApi";

interface ImageRendererProps {
  imageMetadata: ImageData;
}

const ImageRenderer = ({ imageMetadata }: ImageRendererProps) => {
  return (
    <TransformComponent
      wrapperStyle={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
      contentStyle={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src={imageMetadata.src}
        alt={imageMetadata.alt}
        className="w-full h-full object-cover"
      />
    </TransformComponent>
  );
};

export default ImageRenderer;

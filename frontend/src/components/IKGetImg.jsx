import {IKImage} from 'imagekitio-react';


const IKGetImage = ({ path="", className="", w=50, h=50, alt="default", transformation }) => {
  if (!path) return null;

  return (
    <IKImage
      urlEndpoint="https://ik.imagekit.io/zvk2bqqlk/"
      path={path}
      alt={alt}
      className={className}
      loading="lazy"
      lqip={{ active: true, quality: 20 }}
      width={w}
      height={h}
      transformation={transformation || [{ width: w, height: h, focus: "center" }]}
    />
  );
};

export default IKGetImage;
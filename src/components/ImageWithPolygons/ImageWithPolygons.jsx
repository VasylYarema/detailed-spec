import React from 'react';
import { Stage, Layer, Line, Image } from 'react-konva';
import useImage from 'use-image';

const ImageWithPolygons = ({width, height, imageUrl, polygons }) => {
  const [image] = useImage(imageUrl);

  return (
    <Stage width={width ? width :100} height={height ? height : 100}>
      <Layer >
        <Image image={image} width={width ? width : 100} height={height ? height : 100}/>
        {polygons?.map((polygon, index) => (
          <Line
            key={index}
            points={convertCoordinatesToPixels(image, polygon, width, height)}
            stroke="rgba(255, 215, 92, 1)"
            strokeWidth={2}
          />
        ))}
      </Layer>
    </Stage>
  );
};

const convertCoordinatesToPixels = (image, polygon, width, height) => {
  const points = [];
  const widthCurrent = width ? width :100
  const heightCurrent = height ? height : 100

  for (let i = 1; i < polygon.length; i += 2) {
    const x = polygon[i - 1] * image?.width * ( widthCurrent / image?.width);
    const y = polygon[i] * image?.height * (heightCurrent / image?.height);
    points.push(x, y);
  }

  return points;
};

export default ImageWithPolygons;

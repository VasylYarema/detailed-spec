import React, { useEffect, useState } from 'react';
import style from './Main.module.css'
import Tabs from '../Tabs/Tabs';
import Items from '../Items/Items';
import AWS from "aws-sdk";
import axios from "axios";
import Preloader from '../Preloader/Preloader';

const Main = () => {

  const [test, setTest] = useState([]);
  const [testLabels, setTestLabels] = useState([]);
  const [train, setTrain] = useState([]);
  const [trainLabels, setTrainLabels] = useState([]);
  const [valid, setValid] = useState([]);
  const [validLabels, setValidLabels] = useState([]);
  const [polygons, setPolygons] = useState([]);
  const [tab, setTab] = useState('train')
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true)

  AWS.config.update({
    region: "eu-central-1",
    credentials: new AWS.CognitoIdentityCredentials({
      IdentityPoolId: "eu-central-1:31ebe2ab-fc9d-4a2c-96a9-9dee9a9db8b9",
    }),
  });

  const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

  useEffect(() => {
    fetchAllPolygons();
}, [tab]);


useEffect(() => {
  fetchAllPolygons();
}, []);

useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
        await Promise.all([
            s3.listObjects({ Bucket: "dataspan.frontend-home-assignment", Prefix: "bone-fracture-detection/test/thumbnails/" }).promise(),
            s3.listObjects({ Bucket: "dataspan.frontend-home-assignment", Prefix: "bone-fracture-detection/test/labels/" }).promise(),
            s3.listObjects({ Bucket: "dataspan.frontend-home-assignment", Prefix: "bone-fracture-detection/train/thumbnails/" }).promise(),
            s3.listObjects({ Bucket: "dataspan.frontend-home-assignment", Prefix: "bone-fracture-detection/train/labels/" }).promise(),
            s3.listObjects({ Bucket: "dataspan.frontend-home-assignment", Prefix: "bone-fracture-detection/valid/thumbnails/" }).promise(),
            s3.listObjects({ Bucket: "dataspan.frontend-home-assignment", Prefix: "bone-fracture-detection/valid/labels/" }).promise(),
        ]).then(([testThumbnails, testLabels, trainThumbnails, trainLabels, validThumbnails, validLabels]) => {
            setTest(testThumbnails.Contents);
            setTestLabels(testLabels.Contents);
            setTrain(trainThumbnails.Contents);
            setTrainLabels(trainLabels.Contents);
            setValid(validThumbnails.Contents);
            setValidLabels(validLabels.Contents);
        }).catch(error => {
            console.error("Error fetching S3 objects:", error);
        });
        setLoading(false);
    };

    fetchData();
}, []);

useEffect(() => {
    if (testLabels.length > 0 && trainLabels.length > 0 && validLabels.length > 0) {
        fetchAllPolygons();
    }
}, [testLabels, trainLabels, validLabels]);

  const downloadYoloFile = async (fileUrl) => {
    try {
      const response = await axios.get(`https://s3.eu-central-1.amazonaws.com/dataspan.frontend-home-assignment/${fileUrl}`);
      const lines = response.data.split('\n');
      const parsedPolygons = lines.map(line => {
        const coords = line.split(' ').slice(1).map(Number);
        return coords;
      });
      return parsedPolygons;
    } catch (error) {
      console.error('Error downloading YOLO file:', error);
      return null;
    }
  };

  const fetchAllPolygons = async () => {
    setLoading(true);
    let labels = [];
    if (tab === 'train') {
      labels = trainLabels;
      setItems(train);
    } else if (tab === 'test') {
      labels = testLabels;
      setItems(test);
    } else if (tab === 'valid') {
      labels = validLabels;
      setItems(valid);
    } else {
      labels = [...trainLabels, ...validLabels, ...testLabels]
      setItems([...train, ...valid, ...test])
    }
    const downloads = labels.map(label => downloadYoloFile(label.Key));
    try {
      const allPolygons = await Promise.all(downloads);

      setPolygons(allPolygons.filter(polygons => polygons !== null));
    } catch (error) {
      console.error('Error downloading YOLO files:', error);
    }
    setLoading(false);
  };
  
  return (
    <div className={style.Main}>
      <div className={style.MainHeader}>
        <h2>Bone fracture detection</h2>
        <div>
          <span className={style.ItemsLength}>54</span> images
        </div>
      </div>
      <Tabs tab={tab} setTab={setTab}/>
      {loading ? <Preloader /> : <Items items={items} polygons={polygons}/>}
    </div>
  );
}

export default Main;
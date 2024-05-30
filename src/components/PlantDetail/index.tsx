import { useParams } from "react-router-dom";

const PlantDetail = () => {
  const { id } = useParams();
  return <div>Plant Detail Page for Plant ID: {id}</div>;
};

export default PlantDetail;

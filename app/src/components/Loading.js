import SquareLoader from "react-spinners/SquareLoader";

const Loading = ({color="#3c4880", size=150}) => {
  return (
      <SquareLoader color={color} size={size} />
  )
}

export default Loading
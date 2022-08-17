import SquareLoader from "react-spinners/SquareLoader";

const Loading = ({ color = "#3c4880", size = 150, type = "square" }) => {
  
  if (type === "square") {
    return (
      <SquareLoader color={color} size={size} />
    )
  }
}

export default Loading
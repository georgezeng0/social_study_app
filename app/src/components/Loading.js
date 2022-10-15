import SquareLoader from "react-spinners/SquareLoader";

const Loading = ({ color = "#3c4880", size = 150, type = "square" }) => {
  
  if (type === "square") {
    return (
      <div className="container text-center">
        <SquareLoader color={color} size={size} />
      </div>
      
    )
  }
}

export default Loading
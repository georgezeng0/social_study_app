import SquareLoader from "react-spinners/SquareLoader";

const Loading = ({ color = "#90e0ef", size = 150, type = "square" }) => {
  
  if (type === "square") {
    return (
      <div className="container text-center p-3">
        <SquareLoader color={color} size={size} />
      </div>
      
    )
  }
}

export default Loading
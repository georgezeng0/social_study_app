// Not Used in project, as requires upload even if user cancels form completion.
// Would require periodic cleaning with cloudinary admin API. Consider for future feature.
import React, { useEffect } from 'react'

const CloudinaryWidget = () => {

    useEffect(() => {
        const widget = window.cloudinary.createUploadWidget(
            {
                cloudName: "dvaeeygzx",
                uploadPreset: "pe4cq2rj"
            },
            (error, result) => {
                if (!error && result && result.event === "success") {
                    console.log("Done! Here is the image info: ", result.info);
                }
            }
        );
        const handleClick = function () {
            widget.open();
          }
        document.getElementById("upload_widget").addEventListener(
            "click",
            handleClick,
            false
        );
        return () => {
            document.getElementById("upload_widget").removeEventListener(
                "click",
                handleClick,
                false
            )
        }
    },[])

  return (
    <button type="button" id="upload_widget" className="cloudinary-button">
    Upload
  </button>
  )
}

export default CloudinaryWidget
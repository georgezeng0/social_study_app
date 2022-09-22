import React,{ useState } from 'react'
import YouTube from 'react-youtube'

const VideoPlayer = () => {
    const [urlInput, setUrlInput] = useState('')
    const [videoId, setVideoId] = useState('')

    // Taken from stackoverflow
    function youtube_parser(url){
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        var match = url.match(regExp);
        return (match&&match[7].length==11)? match[7] : false;
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const url_parsed = youtube_parser(urlInput)
        if (url_parsed) {
            setVideoId(url_parsed)
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text" value={urlInput}
                    onChange={e => setUrlInput(e.target.value)}
                    placeholder="Youtube url"                
                />
                <button>Set Video</button>
            </form>
        <YouTube
            videoId={videoId}
            />
            </div>
  )
}

export default VideoPlayer
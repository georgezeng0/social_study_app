import React,{ useState, useEffect } from 'react'
import YouTube from 'react-youtube'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';
import { videoControl, resetVideoResponse } from '../features/chatSlice'

const VideoPlayer = () => {
    const dispatch = useDispatch();
    const { c_id } = useParams()
    const { videoResponse } = useSelector(state=>state.chat)

    const [urlInput, setUrlInput] = useState('')
    const [videoId, setVideoId] = useState('')
    const [seekTime, setSeekTime] = useState({ min: 0, sec: 0 })

    // Sets the videoplayer element on videoplayer load - then can control playback using code
    const [playerElement, setPlayerElement] = useState(null)

    // Handle video response logic from state
    // Youtube iframe API https://developers.google.com/youtube/iframe_api_reference#Operations
    useEffect(() => {
        if (playerElement && videoResponse) {
            if (videoResponse === "PLAY") {
                playerElement.playVideo()
                dispatch(resetVideoResponse())
            }
            if (videoResponse === "PAUSE") {
                playerElement.pauseVideo()
                dispatch(resetVideoResponse())
            }
        }
    },[videoResponse, dispatch, playerElement])

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

    const handlePlayButton = () => {
        dispatch(videoControl({ c_id, actionType: "PLAY" }))
    }

    const handlePauseButton = () => {
        dispatch(videoControl({ c_id, actionType: "PAUSE" }))
    }

    const handleSeekButton = () => {

    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text" value={urlInput}
                    onChange={e => setUrlInput(e.target.value)}
                    placeholder="Youtube url"                
                />
                <button>Set Video for everyone</button>
            </form>
            <div>
                <h4>Group Controls</h4>
                <button onClick={handlePlayButton}>Play</button>
                <button onClick={handlePauseButton}>Pause</button>
                <label htmlFor="min">Minutes:</label>
                <input id="min" type="number" min="0" max="10000" value={seekTime.min} step="1"
                    onChange={(e) => setSeekTime({ ...seekTime, min: e.target.value })} />
                <label htmlFor="sec">Seconds:</label>
                <input id="sec" type="number" min="0" max="59" value={seekTime.sec} step="1"
                onChange={(e) => setSeekTime({ ...seekTime, sec: e.target.value })} />
                <button onClick={handleSeekButton}>Seek</button>
            </div>

        <YouTube
                videoId={videoId}
                // onError={(e) => console.log("ERROR",e)}
                onReady={(e)=> setPlayerElement(e.target)}
                onStateChange={(e) => {
                    console.log("STATECHANGE", e)
                    console.log("Current Time: ", e.target.getCurrentTime())
                }
                
                }
            />
            </div>
  )
}

export default VideoPlayer
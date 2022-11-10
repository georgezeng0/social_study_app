import React,{ useState, useEffect } from 'react'
import YouTube from 'react-youtube'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';
import { videoControl, resetVideoResponse } from '../features/chatSlice'
import { useRef } from 'react';
import { useLayoutEffect } from 'react';

const VideoPlayer = () => {
    const dispatch = useDispatch();
    const { c_id } = useParams()
    const { videoResponse: {type:videoResponseType, payload: videoResponsePayload}, chatRoom: {videoId} } = useSelector(state=>state.chat)

    // video player ref to get get width in order to calculate height for 16:9 ratio
    const videoRef = useRef(null)
    const [width, setWidth] = useState(0)

    const updateWidth = () => {
        if (videoRef.current) {
            setWidth(videoRef.current.getBoundingClientRect().width)
        }
    }

    useLayoutEffect(() => {
        setWidth(videoRef.current.offsetWidth);
      }, []);
    
    useEffect(() => {
        window.addEventListener('resize', updateWidth);
        return () => {
            window.removeEventListener('resize', updateWidth);
        }
    },[updateWidth])

    // Form control
    const [urlInput, setUrlInput] = useState('')
    const [seekTime, setSeekTime] = useState({ min: 0, sec: 0 })

    // Sets the videoplayer element on videoplayer load - then can control playback using code
    const [playerElement, setPlayerElement] = useState(null)

    // Handle video response logic from state
    // Youtube iframe API https://developers.google.com/youtube/iframe_api_reference#Operations
    useEffect(() => {
        if (playerElement && videoResponseType) {
            if (videoResponseType === "PLAY") {
                playerElement.playVideo()
                dispatch(resetVideoResponse())
            }
            if (videoResponseType === "PAUSE") {
                playerElement.pauseVideo()
                dispatch(resetVideoResponse())
            }
            if (videoResponseType === "SET_VIDEO") {
                // videoId updated in redux state
                dispatch(resetVideoResponse())
            }
            if (videoResponseType === "SEEK") {
                playerElement.seekTo(videoResponsePayload)
                dispatch(resetVideoResponse())
            }
        }
    },[videoResponseType,videoResponsePayload, dispatch, playerElement])

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
            dispatch(videoControl({c_id, actionType: "SET_VIDEO_ID", payload: url_parsed}))
        }
    }

    const handlePlayButton = () => {
        dispatch(videoControl({ c_id, actionType: "PLAY" }))
    }

    const handlePauseButton = () => {
        dispatch(videoControl({ c_id, actionType: "PAUSE" }))
    }

    const handleSeekButton = () => {
        const seekTimeInSeconds = parseInt(seekTime.min) * 60 + parseInt(seekTime.sec)
        dispatch(videoControl({c_id, actionType: "SEEK", payload: seekTimeInSeconds}))
    }

    return (
        <div className='border border-2 rounded'>
            <div className="border border-1 rounded-pill m-3 overflow-hidden">
                <form onSubmit={handleSubmit} className="row g-0">
                    <div className="col">
                        <input
                            className='border-0 shadow-none form-control ms-2'
                            type="text" value={urlInput}
                            onChange={e => setUrlInput(e.target.value)}
                            placeholder="Youtube url (affects entire chatroom)"                
                        />
                    </div>
                    <div className="col-auto">
                        <button className='btn btn-dark rounded-0'>Submit</button>
                    </div>
                    
                </form>
            </div>
            
            <div className=''>
                <h4 className='text-center display-6 mb-0'>Video Controls</h4>
                <div className="text-muted text-center mb-2">
                    Affects playback for those in the chatroom. Those that join during play have the video loaded but are not synchronised. Use global seek controls to re-synchronise the room.
                </div>
                <div className="row d-flex align-items-center h-auto bg-light border border-dark g-0">
                    <button onClick={handlePlayButton} className="btn btn-dark col rounded-0">Play</button>
                    <button onClick={handlePauseButton} className="btn btn-dark col rounded-0">Pause</button>
                    <div className="col d-flex align-items-center">
                    <label htmlFor="min" className='px-2'>Minutes: </label>
                    <input id="min" type="number" min="0" max="10000" value={seekTime.min} step="1"
                        onChange={(e) => setSeekTime({ ...seekTime, min: e.target.value })}
                        className="form-control rounded-0 shadow-none" style={{width:"80px"}} />
                    <label htmlFor="sec" className='px-2'>Seconds: </label>
                    <input id="sec" type="number" min="0" max="59" value={seekTime.sec} step="1"
                        onChange={(e) => setSeekTime({ ...seekTime, sec: e.target.value })}
                            className="form-control rounded-0 shadow-none" style={{ width: "80px" }} />
                    </div>
                    <button onClick={handleSeekButton} className="btn btn-dark col rounded-0">Seek</button>
                </div>
                
            </div>

        
            <div className="w-100 text-center" ref={videoRef}>
            <YouTube
                videoId={videoId}
                // onError={(e) => console.log("ERROR",e)}
                onReady={(e)=> setPlayerElement(e.target)}
                onStateChange={(e) => {
                    // console.log("STATECHANGE", e)
                    // console.log("Current Time: ", e.target.getCurrentTime())
                    }}  
                opts={
                    {
                        width: "100%",
                        height: width/(16/9)
                    }
                }
            />
        </div>
        
            </div>
  )
}

export default VideoPlayer
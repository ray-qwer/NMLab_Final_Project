import React,{useState,useEffect,useContext} from 'react'
import {useHistory,useParams,Prompt,useLocation} from 'react-router-dom'
import Button from '@material-ui/core/Button'
import Send from "@material-ui/icons/Send"
import HomeTwoToneIcon from '@material-ui/icons/HomeTwoTone';
import {UserContext} from '../utils/ReducerContext'

function VoteResult() {
    const {uState,accounts,web3,contract} = useContext(UserContext);    
    const [voteID,setVoteID] = useState("");
    const [content, setContent] = useState("");
    const [candidate,setCandidate] = useState([]);
    const [numofVote, setNumofVote] = useState([]);
    const [topic,setTopic] = useState("");
    const {id} = useParams();
    const history = useHistory();
    useEffect(()=>{
        const fetchDate = async()=>{
            if(voteID === ""){
                var ID = id;
                setVoteID(ID);
                // console.log(ID);
                await getResultInfo(ID);
            }
        }
        fetchDate();
    },[id])
    // TODO: to get information about the vote by id
    const getResultInfo = async (voteID) =>{
        // contract here
        setTopic("")
        setContent("")
        setCandidate([])
        setNumofVote([])
    }
    // end 
    const updateView = candidate.map((c,i)=>
        <div>
            <div key={i}>{c}: {numofVote[i]}</div>
        </div>
    );
    const backHome=()=>{
        history.push("/")
    }
    return(
        <div>
            <h2>{topic}</h2>
            <span>{content}</span>
            {updateView}
            <div><Button color='primary' variant="contained" size="large" onClick={()=>{backHome()}}><HomeTwoToneIcon/></Button></div>
        </div>
    )

}

export default VoteResult;
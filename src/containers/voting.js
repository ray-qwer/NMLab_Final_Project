import React,{useState,useEffect} from 'react'
import {useHistory,useParams,Prompt,useLocation} from 'react-router-dom'
import Button from '@material-ui/core/Button'
import Send from "@material-ui/icons/Send"
import HomeTwoToneIcon from '@material-ui/icons/HomeTwoTone';

function Voting() {
    const [voteID,setVoteID] = useState("");
    const [topic,setTopic] = useState("");
    const [content, setContent] = useState("");
    const [candidate,setCandidate] = useState([]);
    const [isVote,setIsVote] = useState(false);
    const [isChose,setIsChose] = useState(false);
    const [ansId, setAnsId] = useState([])
    const {id} = useParams();
    const history = useHistory();
    // const [id,setId] = useState("");
    useEffect(()=>{
        async function fetchDate(){
            if(voteID === ""){
                var ID = id;
                setVoteID(ID);
                // console.log(ID);
                await getVoteInfo(ID);
            }
        }
        
    },[id])
    
    // TODO: 
    const getVoteInfo = async (voteID) =>{
        var candidates = ["Elmo","Cookie Monster","Bert"];
        for(var i = 0;i<candidates.length;i=i+1){
            candidates[i] = {
                option: candidates[i],
                select: false
            }
        }
        setTopic("Choose a Monster");
        setCandidate(candidates);
        setContent("sesame street")
    }
    // TODO: 
    const updateView = candidate.map((chosen,i)=>
        <label>
            <input type="checkbox" key={i} onChange={()=>{clickCheckBox(i)}} defaultChecked={chosen.select} /><span>{chosen.option}</span>
        </label>
    );


    const clickCheckBox = (key) => {
        // console.log(candidate[key].select)
        var k = candidate;
        k[key].select = !k[key].select;
        setCandidate(k);
        setIsChose(true);
    }
    const submitAnswer= async()=>{
        let ans = [];
        let ansId =[];
        for (var i = 0;i<candidate.length;i+=1){
            if(candidate[i].select){
                ans.push(candidate[i].option);
                setAnsId([...ansId,i])
            }
        }
        var confirmVote =  await window.confirm(`Your selection is ${ans}, are you sure?`);
        if (confirmVote){
            setIsVote(true);
            setIsChose(false);
        }

    }
    const backHome=()=>{
        history.push("/")
    }
    return(
        <div>
            {!isVote?(
                <>
                    <Prompt when={isChose } message={'You are not voting yet. Are you sure to leave ?'}/>
                    <h2>{topic}</h2>
                    <span>{content}</span>
                    <div>
                    {updateView}
                    </div>
                    <Button size="large" color='primary' variant="contained" endIcon={<Send/>} onClick={()=>{submitAnswer()}}>Submit</Button>
                </>
            ):(
                <>
                    <h2>{topic}</h2>
                    <div>Thank you</div>
                    <div>You are voted!</div>
                    <div><Button color='primary' variant="contained" size="large" onClick={()=>{backHome()}}><HomeTwoToneIcon/></Button></div>
                    
                </>
            )}
        </div>
    );
}

export default Voting;
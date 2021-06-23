import React,{useState,useEffect,useContext} from 'react'
import {useHistory,useParams,Prompt,useLocation} from 'react-router-dom'
import Button from '@material-ui/core/Button'
import Send from "@material-ui/icons/Send"
import HomeTwoToneIcon from '@material-ui/icons/HomeTwoTone';
import {UserContext} from '../utils/ReducerContext'
import {hexTostring} from '../utils/utils'
import Container from "@material-ui/core/Container"
import Grid from "@material-ui/core/Grid"
import Paper from "@material-ui/core/Paper"
import InputLabel from "@material-ui/core/InputLabel"
import Input from "@material-ui/core/Input"
import '../App.css'

function Voting() {
    const {uState,accounts,web3,contract} = useContext(UserContext);    
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
        const fetchDate=async()=>{
            if(voteID === ""){
                var ID = id;
                setVoteID(ID);
                // console.log(ID);
                await getVoteInfo(ID);
            }
        }
        fetchDate();
    },[id])
    
    // TODO: to get information about the vote by id
    const getVoteInfo = async (voteID) =>{
        // var [_topic, _content,_duetime,_IntCandidates] = await contract.methods.getVote(voteID);
        // // new !! convert hex to string
        // var _candidates = [];
        // for (var i = 0; i<_IntCandidates.length;i+=1){
        //     var _can = hexTostring(_IntCandidates[i]);
        //     _candidates=[..._candidates,_can];
        // }
        // // 
        // setTopic(_topic);
        // setContent(_content);
        var _candidates = ["Elmo","Cookie Monster","Bert","aaa"];
        for(var i = 0;i<_candidates.length;i=i+1){
            _candidates[i] = {
                option: _candidates[i],
                select: false
            }
        }
        setCandidate(_candidates);
        
        setTopic("Choose a Monster");
        // setCandidate(candidates)。;
        setContent("sesame street")
    }
    // TODO: submit the answer 
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
        // i haven't added the limit of ballots, so here can vote as much as you like
        // contract
    }
    const updateView = candidate.map((chosen,i)=>
        <Grid item xs direction="row" style={{float:"left"}}>
            <label className="SelectOptions" >
                <input type="checkbox" key={i} onChange={()=>{clickCheckBox(i)}} defaultChecked={chosen.select} />
                <span style={{fontSize:30}}>{chosen.option}</span>
            </label>
        </Grid>
    );


    const clickCheckBox = (key) => {
        // console.log(candidate[key].select)
        var k = candidate;
        k[key].select = !k[key].select;
        setCandidate(k);
        setIsChose(true);
    }
    
    const backHome=()=>{
        history.push("/")
    }
    return(
        <Container maxWidth="lg">
            {!isVote?(
                <>
                    <Prompt when={isChose } message={'You are not voting yet. Are you sure to leave ?'}/>
                    <Paper variant="outlined" style={{margin:20}}>
                    <Grid container direction="column" justify="center" alignItems="center" style={{marginTop:20}} spacing={3}>
                        <Grid item><h2>{topic}</h2></Grid>
                        <Grid item ><p>{content}</p></Grid>
                        <Paper variant="outlined" style={{padding:20}}>
                            <Grid container direction="column" justify="center" alignItems="stretch" spacing={3}>
                                    {updateView}
                            </Grid>
                        </Paper>
                        <Grid item>
                        </Grid>
                    </Grid>
                    </Paper>
                    <Button size="large" color='primary' variant="contained" endIcon={<Send/>} onClick={()=>{submitAnswer()}}>Submit</Button>
                </>
            ):(
                <>
                    <Paper variant="outlined" style={{margin:20}}>

                    <h2>{topic}</h2>
                    <div>Thank you</div>
                    <div>You are voted!</div>
                    </Paper>
                    <Button color='primary' variant="contained" size="large" onClick={()=>{backHome()}}><HomeTwoToneIcon/></Button>
                </>
            )}
        </Container>
    );
}

export default Voting;
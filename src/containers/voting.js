import React,{useState,useEffect} from 'react'
import {useHistory,useParams,Prompt,useLocation} from 'react-router-dom'
import Button from '@material-ui/core/Button'
import Send from "@material-ui/icons/Send"
import HomeTwoToneIcon from '@material-ui/icons/HomeTwoTone';
import {UserContext} from '../utils/ReducerContext'
import {useContext} from 'react';
import {hexTostring} from '../utils/utils'
import {stringToHex} from '../utils/utils'
import Container from "@material-ui/core/Container"
import Grid from "@material-ui/core/Grid"
import Paper from "@material-ui/core/Paper"
import InputLabel from "@material-ui/core/InputLabel"
import Input from "@material-ui/core/Input"
import '../App.css'
import {getTime} from "../utils/utils"

function Voting() {
    const {uState,accounts,web3,contract} = useContext(UserContext);    
    const [voteID,setVoteID] = useState("");
    const [topic,setTopic] = useState("");
    const [content, setContent] = useState("");
    const [candidate,setCandidate] = useState([]);
    const [isVote,setIsVote] = useState(false);
    const [isChose,setIsChose] = useState(false);
    const [upLimit,setUpLimit] = useState(1);
    //const [ansId, setAnsId] = useState([])
    const {id} = useParams();
    const history = useHistory();
    // const [id,setId] = useState("");
    useEffect(()=>{
        const fetchDate=async()=>{
            if(voteID === ""){
                var ID = id;
                setVoteID(ID);
                //console.log(ID);
                await getVoteInfo(ID);
            }
        }
        fetchDate();
    },[id])
    
    // TODO: to get information about the vote by id
    /*const getVoteInfo = async (voteID) =>{
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
    }*/
    const getVoteInfo = async (voteID) =>{
        /*var [_topic,_content,_duetime,_candidates,_upperlimit] = await contract.methods.getVote(voteID).send({ from: accounts[0],gas: 200000, });
        // new !! convert hex to string
        _topic = hexTostring(_topic);
        _content = hexTostring(_content);
        _candidates = [];
        for (var i = 0; i<_IntCandidates.length;i+=1){
            var _can = hexTostring(_IntCandidates[i]);
            _candidates=[..._candidates,_can];
        }*/
        var _together = await contract.methods.getVote(voteID).call();
        var _topic = _together[0];
        var _content = _together[1];
        var _duetime = _together[2];
        var _cands = _together[3];
        //console.log(_cands[0]);
        var _numofvoters = _together[4];
        var _upLimit = _together[5];
        console.log(upLimit)
        var _candidates = [];
        for (var i = 0; i<_cands.length;i+=1){
            var _can = hexTostring(_cands[i]);
            _candidates=[..._candidates,_can];
        }
        if(getTime(_duetime)){
            history.push("/")
            return
        }
        setUpLimit(_upLimit)
        setTopic(_topic);
        setContent(_content);
        console.log(_candidates);
        for(var i = 0;i<_candidates.length;i=i+1){
            _candidates[i] = {
                option: _candidates[i],
                select: false
            }
        }
        setCandidate(_candidates);
    }
    // TODO: submit the answer 
    const submitAnswer= async()=>{
        let ans = [];
        let ansId =[];
        for (var i = 0;i<candidate.length;i+=1){
            if(candidate[i].select){
                ans.push(candidate[i].option);
                //setAnsId([...ansId,i])
                ansId.push(i);
            }
        }
        console.log(upLimit)
        if (ans.length>upLimit) {
            alert(`you at most vote for ${upLimit} options`)
            return
        }
        var confirmVote =  await window.confirm(`Your selection is ${ans}, are you sure?`);
        var hid = stringToHex(String(uState.id))
        if (confirmVote){
            try{
                console.log("ansId",ansId);
                await contract.methods.vote(voteID,ansId,hid).send({ from: accounts[0],gas: 200000, });
            } catch(e){
                alert(`something wrong..., please check your gas`)
                console.log(e)
                history.push('/')
                return
            }
            setIsVote(true);
            setIsChose(false);
        }

        // i haven't added the limit of ballots, so here can vote as much as you like
        // contract
    }
    const updateView = candidate.map((chosen,i)=>
        
            <label className="SelectOptions" >
                <input type="checkbox" key={i} onChange={()=>{clickCheckBox(i)}} defaultChecked={chosen.select} />
                <span style={{fontSize:30}}>{i+1}. {chosen.option}</span>
            </label>
        
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
                            <Grid item container xs direction="row" alignItems="stretch" style={{float:"left"}} spacing={3}>
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
                    <div>You have voted!!</div>
                    </Paper>
                    <Button color='primary' variant="contained" size="large" onClick={()=>{backHome()}}><HomeTwoToneIcon/></Button>
                </>
            )}
        </Container>
    );
}

export default Voting;
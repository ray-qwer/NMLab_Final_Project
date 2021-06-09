import React,{useContext,useState,Component} from 'react'
import {UserContext} from '../utils/ReducerContext'
import {Redirect} from 'react-router-dom'
import TextField from '@material-ui/core/TextField'
import  "../App.css"
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button'

function CreateVoting(){
    const {uState,accounts,web3,contract} = useContext(UserContext);
    const [topic,setTopic] = useState("");
    const [content,setContent] = useState("");
    const [candidates,setCandidates] = useState(["dd","ee"]);
    const [dueTime,setDueTime] = useState("");
    const candidateList = candidates.map((c,i)=>
        <div key={i}>
            <span>Candidate {i+1}</span>
            <TextField value={c} placeholder={`Candidate ${i}`} variant="outlined" onChange={(e)=>{setCandidates([...candidates.slice(0,i),e.target.value,...candidates.slice(i+1)])}}/>
            <Button variant="outlined" onClick={()=>{setCandidates([...candidates.slice(0,i),...candidates.slice(i+1)])}}><DeleteIcon/></Button>
        </div>
    )
    const Click = () =>{
        
        console.log(dueTime)
    }
    // TODO: 
    const buildVote = () =>{
        if(topic === "" || content === "" || dueTime === "" ||candidates.some((e)=>e==="")){
            alert("something is empty!!!")
            return
        }
        try{
            var time = dueTime.replace(/-/g,'/')
            time = time.replace(/T/,' ');
            time = time+':00'
        }catch(e){
            alert('error',e);
            return
        }
        console.log(time)
        const vote = {
            topic: topic,
            content: content,
            DueTime: time,
            candidates: candidates
        }
        console.log(vote);
        // TODO:
        // throw "vote" to contract
    }
    return (
        <div>
            {uState.isManager?(
                <div className="CreateVoteList">
                    <span>Topic</span>
                    <TextField label="Topic" placeholder="Topic" variant="outlined" onChange={(e)=>{setTopic(e.target.value)}}/>
                    <span>Content</span>
                    <TextField label="Content" placeholder="Content" variant="outlined" onChange={(e)=>{setContent(e.target.value)}}/>
                    <span>Due Time</span>
                    <TextField type="datetime-local" onChange={(e)=>{setDueTime(e.target.value)}}/>
                    {candidateList}
                    <button onClick={()=>{setCandidates([...candidates,""])}}>Add Candidate</button>
                    <button onClick={()=>{buildVote()}}>Build a Vote</button>                    
                </div>
            ):(<Redirect to='/'/>)}
        </div>
    );
}

export default CreateVoting;
import react ,{useState,Component,useEffect,useContext} from 'react'
import  "../App.css"
import {useHistory} from 'react-router-dom' 
import {getTime,hexTostring} from '../utils/utils'
import {UserContext} from '../utils/ReducerContext'
import Grid from "@material-ui/core/Grid"
/*
    voting structure:
        deadline,
        title,
        content,
        goVoting
*/
function VotingList(){
    // for Testing, can delete them, be careful that at useState also need to reclaim them 
    const myFirstVote = {
        deadLine: new Date("2021/6/30 21:00:00").getTime(),
        title: "1st Voteeeeeeeeeei",
        voteID: 1
    };
    const mySecVote = {
        deadLine: new Date("2021/6/4 11:20:00").getTime(),
        title: "2nd Vote",
        voteID: 2
    };
    // end testing
    const {uState,uDispatch,accounts,web3,contract} = useContext(UserContext);
    
    const [Voting_list,setVoting_list] = useState([myFirstVote,mySecVote]);
    const [time,setTime] = useState(Date.now());
    const history = useHistory();
    useEffect(()=>{
        const timer = setTimeout(() => {
            setTime(Date.now());
          }, 1000);
    },[time])
    useEffect(()=>{
        const getList = async() =>{
            await getVoting_list();
        }
        getList();
    },[])
    // TODO:
    const getVoting_list=async() =>{
        // get voting infomation
        // var _votingList = await contract.methods.getVotingList(); // contract: get the voteID
        // var _list = [];
        // for(var i = 0;i<_votingList.length;i+=1){
        //     var [_topic,_,_duetime,_,_] = await contract.methods.getVoteinfo(_votingList[i]); // contract: get the info of one voteID
        //     // new !! convert hex to string
        //     // 
        //     var vote = {
        //         title: _topic,
        //         deadLine:_duetime,
        //         voteID:_votingList[i]
        //     }
        //     _list = [..._list,vote];
        // }
        // setVoting_list(_list);
    }
    // TODO: identity checking: if he/she has the right to vote or time out
    const goVoting = async (voteItem) => {
        // console.log(voteID);
        // to the page to vote
        // var isRight = await contract.methods.ifHeHasRight(accounts[0],voteItem.voteID) // to know if he/she has right to vote
        // if (!isRight){
        //     alert("you can not vote this");
        //     return;
        // }
        var URL; 
        if(getTime(voteItem.deadLine)){
            URL = '/Voting/'+voteItem.voteID;
            history.push(URL);
            // check is voted?
        }
        else{
            alert("timeout") 
            // well i haven't done the checking page... sorry, ASAP
        }
    }
    // 

    const renderVoting_list = Voting_list.map((voteItem,i)=>
        
            <Grid container justify="space-around" className="VotingListItem" onClick={()=>goVoting(voteItem)} key={i}>
                <Grid item className="VotingListItemTitle"><p>{voteItem.title}</p></Grid>
                <Grid item className="VotingListItemCountdown">{getTimeStr(voteItem.deadLine)}</Grid>
            </Grid>
        
    );
    
    function getTimeStr (deadLine) {
        var countDown = getTime(deadLine);
        if(countDown){
            countDown= `${countDown.dd} Days ${countDown.hr} Hr ${countDown.mm} Min ${countDown.ss} Sec Left`;
        }
        else{
            countDown = "Time Out!!!"
        }
        return countDown;
    }
    return (
        <Grid container direction="column" justify="space-around" alignItems="stretch" className="VotingList">
            {renderVoting_list}
        </Grid>
    );
}

export default VotingList;
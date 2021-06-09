import react ,{useState,Component,useEffect,useContext} from 'react'
import  "../App.css"
import {useHistory} from 'react-router-dom' 
import {getTime} from '../utils/utils'
import {UserContext} from '../utils/ReducerContext'

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
        deadLine: "2021/6/8 21:00:00",
        title: "1st Vote",
        voteID: 1
    };
    const mySecVote = {
        deadLine: "2021/6/4 11:20:00",
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
    
    // TODO:
    const getVoting_list=async() =>{
        // get voting infomation

    }
    // TODO: identity checking: if he/she has the right to vote or time out
    const goVoting = (voteItem) => {
        // console.log(voteID);
        // to the page to vote
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
        
            <div className="VotingListItem" onClick={()=>goVoting(voteItem)} key={i}>
                <div className="VotingListItemTitle">{voteItem.title}</div>
                <div className="VotingListItemCountdown">{getTimeStr(voteItem.deadLine)}</div>
            </div>
        
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
        <div className="VotingList">
            {renderVoting_list}
        </div>
    );
}

export default VotingList;
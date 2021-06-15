pragma solidity >=0.4.21 <0.6.0;

contract Voting{
    //events
    event AddedVote(uint voteID);
    event AddedCandidate(uint candidateID);
    event Voted(uint voterID);

    //constructor & modifier
    address owner;
    constructor() public{
        owner=msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    //structs
    struct Voter{
        bytes32 vid;
        //address vaddr;
        uint[] allowed_votes;
    }

    struct Candidate{
        uint cid;
        bytes32 name;
        bool doesExist; 
    }

    struct Vote{
        uint vote_id;
        string topic;
        string content;
        string dueTime;
        uint num_candidates;
        uint num_voters;
        uint upperLimit;
        bytes32[] allowed_voters;
        bytes32[] participating_candidates;
        mapping (uint => Candidate) candidates;
        mapping (bytes32 => uint) cname_to_id;
        mapping (bytes32 => Voter) voters;
        mapping (uint => uint) ballot;
    }

    //declaration
    //Vote[] votes;
    mapping (uint => Vote) votes;
    uint num_votes;
    

    //type transfer functions
    function stringToBytes32(string memory source) public pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }
        assembly {
            result := mload(add(source, 32))
        }
    }

    function bytes32ToString(bytes32 _bytes32) public pure returns (string memory) {
        uint8 i = 0;
        while(i < 32 && _bytes32[i] != 0) {
            i++;
        }
        bytes memory bytesArray = new bytes(i);
        for (i = 0; i < 32 && _bytes32[i] != 0; i++) {
            bytesArray[i] = _bytes32[i];
        }
        return string(bytesArray);
    }

    //add functions
    function addCandidate(uint vote_id, bytes32 name) onlyOwner public returns(uint) {
        bytes32 nb = name;
        Vote storage cur_vote = votes[vote_id];
        // candidateID is the return variable
        uint candidateID = cur_vote.num_candidates++;
        // Create new Candidate Struct with name and saves it to storage.
        cur_vote.candidates[candidateID] = Candidate(candidateID,nb,true);
        cur_vote.cname_to_id[nb] = candidateID;
        cur_vote.participating_candidates.push(nb);
        emit AddedCandidate(candidateID);
        return (candidateID);
    }

    function addVote(string memory topic, string memory content,string memory dueTime,bytes32[] memory ini_vot,bytes32[] memory ini_cand, uint upperLimit) onlyOwner public returns(uint){
        uint voteID = num_votes++;
        //uint[] memory vot;
        bytes32[] memory vot = ini_vot;    
        bytes32[] memory cand = ini_cand;
        /*uint l = ini_cand.length;
        for (uint i = 0; i < l; i++) {
            cand[i] = ini_cand[i];
        }*/
        
        votes[voteID] = Vote(voteID,topic,content,dueTime,0,0,upperLimit,vot,cand);
        uint len = cand.length;
        for (uint i = 0; i < len; i++) {
            //string memory _cname = bytes32ToString(cand[i]);
            //addCandidate(voteID,_cname);
            addCandidate(voteID,cand[i]);
        }
        uint len2 = vot.length;
        for (uint i = 0; i < len2; i++) {
            //string memory _cname = bytes32ToString(cand[i]);
            //addCandidate(voteID,_cname);
            addVoter(voteID,vot[i]);
        }
        emit AddedVote(voteID);
        return (voteID); 
    }

    function addVoter(uint _vote_id, bytes32 _vid) onlyOwner public returns(uint){
        Vote storage cur_vote = votes[_vote_id];
        //uint voterID = cur_vote.num_voters++;
        cur_vote.allowed_voters.push(_vid);
        uint[] memory allv;
        cur_vote.voters[_vid] = Voter(_vid,allv);
        //cur_vote.voters[_vid] 
        cur_vote.num_voters+=1;
        return(cur_vote.num_voters);    
    }

    //vote function
    function vote(uint _vote_id,uint[] memory _chosen) public{
        Vote storage cur_vote = votes[_vote_id];
        uint len = _chosen.length;
        for (uint i = 0; i < len; i++) {
            cur_vote.ballot[_chosen[i]]+=1;
        }
    }

    //get methods
    function getVote(uint _vote_vid) view public returns(string memory, string memory, string memory,bytes32[] memory,uint){
        Vote storage cur_vote = votes[_vote_vid];
        uint nc = cur_vote.num_candidates;
        bytes32[] memory cb = new bytes32[](nc);
        
        for (uint i = 0; i < nc; i++) {
            cb[i]=cur_vote.candidates[i].name;
        }

        return(cur_vote.topic,cur_vote.content,cur_vote.dueTime,cb,cur_vote.upperLimit);
    }

    function getVotingList() view public returns(uint[] memory){
        uint numVotes = num_votes;
        uint[] memory cur_vid = new uint[](numVotes);
        for (uint i = 0; i < numVotes; i++) {
            //Vote storage cur_vote = votes[i];
            //uint id = cur_vote.vote_id;
            cur_vid[i]=votes[i].vote_id;
        }
        return(cur_vid);
    }

    function getVotingNum() view public returns(uint){
        return(num_votes);
    }

    function ifHeHasRight(uint _vote_id, bytes32 _vid) view public returns(bool){
        Vote storage cur_vote = votes[_vote_id];
        uint n = cur_vote.num_voters;
        //bool rv = false;
        for (uint i = 0; i < n; i++) {
            if (cur_vote.voters[cur_vote.allowed_voters[i]].vid == _vid){
                return true;
            }
        }
        return false;

    }
    
}
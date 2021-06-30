client.js
-------------------------------------------------------------------------------------------------

At the begining, you should call "regist" to create a new voter account.
Remember to record your id and private key(password) and save them carefully!

When voting, you should call "vote" with three parameters: your id, your candidate's id, and your password.
"vote" will fisrt sign your id to verify your identity, then you will recieve a diposable public key to encrypt your ballot.

After deadline, you may call "ballots" to check the result of the vote.



secret_server.js
-------------------------------------------------------------------------------------------------

While voting, user should repeatly call "createEnKeys", which will listen to the voter's request and create a diposable key pair for encrypting ballots. The decrypting key(private key) corresponding to the voter's id will be stored in "VoterKeys".

After deadline, user should call "tally" to count the number of ballot of each candidate.



encrypt.sol
-------------------------------------------------------------------------------------------------

This contract record some function to help the security system of e-voting work.


main function

addCandidate            (name)                    :  contract add a candidate to a vote
registVoter             (pubkey)                  :  contract create a new voter with given public key
addVoterToWhitelist     (vid)                     :  contract add the voter to whitelist, which allow him to vote

verifyVoterSignature    (vid, sign)               :  contract verify if voter's sign is valid
sendEncryptKey          (vid, pubkey)             :  secret server send public key(for encrypting ballot) to voter
saveEncryptedBallot     (vid, encrypted_ballot)   :  contract save the voter's encrypted ballots, waiting for secret server to tally
setBallot               (cid, ballots)            :  secret server count the ballots and send the reult to contract


getter function

ballot                  (cid)                     :  return # ballot the candidate get
numc                    ()                        :  return # candidate
numv                    ()                        :  return # registed voter
numwh                   ()                        :  return # voter who can vote
getc                    (cid)                     :  get the imformation of a candidate (cid, name, #ballot)
getcn                   (name)                    :  get the imformation of a candidate by searching his name
getv                    (vid)                     :  get the imformation of a voter (vid, pubkey(for sign))
getvpub                 (vid)                     :  get the public key(for sign) of a voter
getvBypub               (pubkey)                  :  get the voter's id by searching his public key
getwh                   (vid)                     :  get the imformation of a vote in whitelist (address, encrypted ballot, whether if he has casted)
getwhv                  (vid)                     :  get the imformation of a voter in whitelist
getenb                  (vid)                     :  get the encrypted ballot of a voter

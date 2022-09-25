import withRoot from "../withRoot";
import styles from "../css/Tap.module.css";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import VoteModal from "../components/VoteModal";
import Proposal from "../components/Proposal";
import NewPolicy from "../components/NewPolicy";
import { useNavigate } from "react-router-dom";
import StandByProposal from "../components/StandByProposal";

function Governance({ token, userInfo }) {
  const [voting, setVoting] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [updateNow, setUpdateNow] = useState(true);
  const [tryCount, setTryCount] = useState(0);
  const [standBy, setStandBy] = useState([]);

  const navigate = useNavigate();

  // 부모 컴포넌트 리렌더링을 위한 후크
  const updateFunc = () => {
    setUpdateNow(!updateNow);
  };

  // 제안 만료일 설정 (여기서는 7일)
  const EXPIRED_PROPOSAL_TIME = 7 * 24 * 60 * 60 * 1000;
  // 제안이 통과되기 위한 정족수(%)
  const QUORUM = 50;
  // 제안이 통과되기 위한 최소 참여자 수
  const minParticipants = 4;

  useEffect(() => {
    if (userInfo.account_type !== "worker") {
      window.alert("잘못된 접근입니다. 메인페이지로 이동합니다.");
      navigate("/");
    }
    // 새로 신청된 Try가 있는지 확인
    getTryCount();
    // 최근 업데이트된 정책 읽어오기
    getPolicies();
    // 진행중인 제안 읽어오기
    getProposals();
    getStandBy();
  }, []);

  // 데몬에서 종료된 투표 데이터를 읽어서 DB에 적재하면,
  // db에서 종료된 투표 데이터를 읽어오는 로직
  const getVotes = () => {};

  // 투표가 종료되고 실제로 정책에 반영되면
  // 반영된 내용을 DB에 저장하고...
  // 이 함수를 통해 그 내용을 DB에서 읽어옴
  const getPolicies = async () => {
    const res = await axios.get("http://localhost:4000/policies/", {
      headers: { authorization: token },
    });
    const recentPolicies = res.data.data;
    setPolicies(recentPolicies);
    console.log("policies list", recentPolicies);
  };
  //
  //
  //policies post

  const postData = async () => {
    const newPolicy = {
      title: "info 페이지 수정",
      content: "myinfo 페이지에 더 많은 내용을 볼 수 있도록 변경해주세요.",
      worker_id: "worker90@gig.com",
      for: 10,
      against: 2,
      transactionHash: "123",
    };
    const res = await axios.post(
      "http://localhost:4000/policies/newpolicy",
      newPolicy,
      {
        headers: { authorization: token },
      }
    );
    console.log("123123", res.data.data);
  };
  //
  //
  // standBy 상태 proposal 데이터 요청

  const getStandBy = async () => {
    const res = await axios.get(
      "http://localhost:4000/proposals/getStandByProposals",
      { headers: { authorization: token } }
    );
    const StandByProposal = res.data.data;
    setStandBy(StandByProposal);
  };

  // DB에서 현재 up/down 진행중인 제안을 읽어옴
  // 제안을 읽어옴과 동시에 기간이 만료된 제안은 상태를 변경하고 상태변수에 넣지 않는다.
  // 제안에 대한 최소 참여자 수와 정족수를 만족한 제안은 상태변수에 넣지 않고, DB정보를 업데이트 한다.
  const getProposals = async () => {
    const res = await axios.get(
      "http://localhost:4000/proposals/getOnPostProposals",
      { headers: { authorization: token } }
    );
    console.log(res.data.data);
    const proposalsData = res.data.data;

    let filteredProposal = [];
    for await (const proposal of proposalsData) {
      const up = proposal.up;
      const down = proposal.down;
      const checkMinParticipants = up + down >= minParticipants;
      const checkQuorum = (100 * up) / (up + down) >= QUORUM;

      if (proposal.createdAt + EXPIRED_PROPOSAL_TIME >= Date.now()) {
        await axios.patch(
          "http://localhost:4000/proposals/expiredProposal",
          proposal,
          { headers: { authorization: token } }
        );
        navigate("/ReRendering");
      } else if (checkMinParticipants && checkQuorum) {
        await axios.patch(
          "http://localhost:4000/proposals/successfulProposal",
          proposal,
          { headers: { authorization: token } }
        );
        navigate("/ReRendering");
      } else {
        filteredProposal.push(proposal);
      }
    }
    setProposals(filteredProposal);
  };

  const getTryCount = async () => {
    const res = await axios.get(
      `http://localhost:4000/tryagainst/getOnBoardTry`,
      { headers: { authorization: token } }
    );
    setTryCount(res.data.data.length);
  };

  return (
    <div style={{ padding: "10px" }}>
      <div style={{ borderBottom: "1px solid black", padding: "10px" }}>
        <li className={styles.taps}>
          <Grid container spacing={1}>
            {/* 투표에 가기 전 전체적인 공감대를 얻을 수 있는지 확인하기 위하여 새로운 제안을 생성한다 */}
            <Grid item xs={2}>
              {userInfo.mod_authority === true ? (
                <Button variant="contained" size="small">
                  <Link
                    style={{ color: "white" }}
                    component={RouterLink}
                    to="/createproposal"
                    state={{ token: token, userInfo: userInfo }}
                  >
                    Create Proposal
                  </Link>
                </Button>
              ) : (
                <Button variant="contained" disabled size="small">
                  Create Proposal
                </Button>
              )}
            </Grid>

            {/* 워커가 클라이언트의 평가에 납득하지 못하는 경우 try를 신청하면, moderator들이 판단을 한다. */}
            <Grid item xs={2}>
              {userInfo.mod_authority === true ? (
                <Button variant="contained" size="small">
                  <Link
                    style={{ color: "white" }}
                    component={RouterLink}
                    to="/judgeobjection"
                    state={{ token: token, userInfo: userInfo }}
                  >
                    Judge Estimation ({tryCount === 0 ? null : tryCount}건)
                  </Link>
                </Button>
              ) : (
                <Button variant="contained" disabled size="small">
                  Judge Estimation
                </Button>
              )}
            </Grid>

            {/* 투표, 펜딩전환, 토큰전송 등으로 발생한 트랜잭션 정보를 검색한다. */}
            <Grid item xs={2}>
              <Button variant="contained" size="small">
                View Transactions
              </Button>
            </Grid>

            {/* 어떤 제안을 올리기 전에 개발팀에게 기술적 범위에 대한 문의를 한다 */}
            <Grid item xs={2}>
              {userInfo.mod_authority === true ? (
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => navigate("/contactsupportteam", {state: {token: token, userInfo: userInfo}} )}
                >
                  Contact Support Team
                </Button>
              ) : (
                <Button variant="contained" disabled size="small">
                  Contact Support Team
                </Button>
              )}
            </Grid>
          </Grid>
        </li>
      </div>

      {/*------------voting in progress------------*/}
      <div style={{ borderBottom: "1px solid black", padding: "10px" }}>
        <div>
          <h3>Voting in progress</h3>
        </div>
        <li className={styles.taps}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              date:
            </Grid>
            <Grid item xs={10}>
              <div>content</div>
            </Grid>
            <Grid item xs={2}>
              {userInfo.mod_authority !== false ? <VoteModal /> : null}
            </Grid>
          </Grid>
        </li>
      </div>

      {/*------------voting result------------*/}
      <div style={{ borderBottom: "1px solid black", padding: "10px" }}>
        <div>
          <h3>Voting result</h3>
        </div>
        <li className={styles.taps}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              date:
            </Grid>
            <Grid item xs={12}>
              <div> content</div>
            </Grid>
          </Grid>
        </li>
      </div>

      {/*------------Changed Policy------------*/}
      <div style={{ borderBottom: "1px solid black", padding: "10px" }}>
        <div>
          <h3>Changed Policies</h3>
        </div>
        {policies.map((policy) => {
          return <NewPolicy key={policy._id} policy={policy} />;
        })}
      </div>

      {/*------------Passed Proposal------------*/}
      <div style={{ borderBottom: "1px solid black", padding: "10px" }}>
        <div>
          <h3>Passed Proposal</h3>
        </div>
        {standBy.map((proposal) => {
          return (
            <StandByProposal
              key={proposal.proposal_id}
              proposal={proposal}
              token={token}
              updateFunc={updateFunc}
            />
          );
        })}
      </div>

      {/*------------Proposal------------*/}
      <div style={{ borderBottom: "1px solid black", padding: "10px" }}>
        <div>
          <h3>Proposals</h3>
        </div>
        {proposals.map((proposal) => {
          return (
            <Proposal
              key={proposal.proposal_id}
              proposal={proposal}
              token={token}
              updateFunc={updateFunc}
            />
          );
        })}
      </div>
    </div>
  );
}

export default withRoot(Governance);

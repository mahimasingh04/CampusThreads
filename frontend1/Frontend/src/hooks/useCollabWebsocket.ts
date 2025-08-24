import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { collabPostsState, collabRequestsState } from "../store/Collab";
import { wsConnectedState } from "../store/wsAtoms";


export const useCollabWebSocket = (postId: string) => {
     const setPosts = useSetRecoilState(collabPostsState);
  const setRequests = useSetRecoilState(collabRequestsState);
  const setConnected = useSetRecoilState(wsConnectedState);

  useEffect(() => {
    const ws = new WebSocket(`${import.meta.env.VITE_WS_URL}/ws`);


    ws.onopen = () => {
 setConnected(true);
   ws.send(JSON.stringify({ type: 'subscribe', postId }));
     }

     ws.onmessage= (event) => {
        const msg = JSON.parse(event.data);
        switch(msg.type) {
            case "NEW_REQUEST": 
            setRequests((prev) => {
                const postReqs =prev[postId];
                 return {...prev, [postId] : [...postReqs,msg.data]};
            });
            break;


            case "REQUEST_UPDATE":
                setRequests((prev) =>{
                    const postReqs =prev[postId] || [];

                    return {
                        ...prev,
                        [postId] : postReqs.map((r) => 
                        r.id === msg.data.relatedId ? {...r, status:msg.data.type === "REQUEST_ACCEPTED" ? "accepted": "rejected"} : r),
                    };
                });
                break;

                case "SPOTS_UPDATE":
                    setPosts((prev) =>{
                        const post = prev[postId];
                        if(!post) return prev;
                        return {
                            ...prev,
                            [postId] :{
                                ...post,
                                filledSpots: msg.data.filledSpots,
                                spotsLeft : msg.data.spotsLeft,
                            }
                        }
                    });
                    break;
        }
     };

     ws.onclose = () => setConnected(false);

     return () => {
        ws.send(JSON.stringify({type: "unsubscribe", postId}));
        ws.close();
     };
  }, [postId, setPosts, setRequests, setConnected])
}

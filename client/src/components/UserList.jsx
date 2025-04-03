import React, { useEffect, useState} from "react";
import { Avatar, useChatChannel, useChatContext } from "stream-chat-react";
import { InviteIcon } from "../assets";

const ListContainer = ({ children }) => {
    return (
        <div className="user-list__container">
            <div className="user-list__header">
                <p>User</p>
                <p>Invite</p>
            </div>
            {children}
        </div>
    )
}

const UserItem = ({ user, setselectedUsers }) => {
    const [selected, setselected] = useState(false)

    const handleSelect = () => {
        if(selected) {
            setselectedUsers((prevUsers) => prevUsers.filter((prev) => prev !== user.id));
        } else {
            setselectedUsers((prevUsers) => [...prevUsers, user.id]);
        }

        setselected((prevUsers) => !prevUsers);
    }

    return (
        <div className="user-item__wrapper" onClick={handleSelect}>
            <div className="user-item__name-wrapper">
                <Avatar image={user.image} name={ user.fullname } className="avatar"/>
                <p className="user-item__name">{ user.fullname || user.id }</p>
            </div>
            {selected ? <InviteIcon /> : <div className="user-item__invite-empty" />}
        </div>
    )
}


const UserList = ({setselectedUsers}) => {
    const { client } = useChatContext();
    const [users, setUsers] = useState([]); 
    const [loading, setLoading] = useState(false);
    const [ListEmpty, setListEmpty] = useState(false)
    const [error, setError] = useState(false)

    useEffect(() => {
        const getUsers = async () => {
            if(loading) return;
            setLoading(true);
            try {
                const response = await client.queryUsers(
                    { id: { $ne: client.userID } },
                    { id: 1 },
                    { limit: 8 }
                );
                if(response.users.length) {
                    setUsers(response.users);
                } else {
                    setListEmpty(true);
                }
            } catch (error) {
                setError(true);
            }
            setLoading(false);
        }

        if(client) {
            getUsers();
        }
    }
    , []);

    if(error) {
        return (
            <ListContainer>
                <div className="user-list__message">
                    Error Loading... Please refresh the page
                </div>
            </ListContainer>
        )
    }

    if(ListEmpty) {
        return (
            <ListContainer>
                <div className="user-list__message">
                    No users found
                </div>
            </ListContainer>
        )
    }

    return(
        <ListContainer>
            {loading ? <div className="user-list__message">Loading Users...</div> : users.map((user, i) => (<UserItem index = {i} key = {user.id} user={user} setselectedUsers={setselectedUsers}/>))}      
        </ListContainer>
    )
}

export default UserList;
import React, { useState } from 'react'
import { useChatContext } from 'stream-chat-react';
import { UserList } from './';
import { CloseCreateChannel } from '../assets';

const ChannelNameInput = ({ channelName = '', setChannelName }) => {
  const handleChange = (event) => {
    event.preventDefault();
    setChannelName(event.target.value);
  }

  return (
    <div className="channel-name-input__wrapper">
      <p>Name</p>
      <input
        value={channelName}
        onChange={handleChange}
        placeholder="channel-name"
      />
      <p>Add Members</p>
    </div>
  )
};

const CreateChannel = ({ createType, setIsCreating }) => {
  const { client, setActiveChannel } = useChatContext();

  const [selectedUsers, setselectedUsers] = useState([client.userID || '']);

  const [channelName, setChannelName] = useState('');

  const CreateChannel = async (event) => {
    event.preventDefault();
    try {
      const newChannel = await client.channel(createType, channelName, {
        name: channelName,
        members: selectedUsers,
      });

      await newChannel.watch();

      setChannelName('');
      setIsCreating(false);
      setselectedUsers([client.userID]);
      setActiveChannel(newChannel);

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='create-channel__container'>
      <div className='create-channel__header'>
        <p>{createType === 'team' ? 'Create a New Project Channel' : 'Send a direct message' }</p>
        <CloseCreateChannel setIsCreating={setIsCreating}/>
      </div>

      {createType === 'team' && <ChannelNameInput channelName={channelName} setChannelName={setChannelName}/>}
      <UserList setselectedUsers={setselectedUsers}/>
      <div className='create-channel__button-wrapper' onClick={CreateChannel}>
        <p>{createType === 'team' ? 'Create Channel' : 'Create Message Group'}</p>
      </div>
    </div>
  )
}

export default CreateChannel
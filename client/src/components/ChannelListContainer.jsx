import React, { useState } from 'react'
import { ChannelList, useChatContext } from 'stream-chat-react';
import Cookies from 'universal-cookie';
import { ChannelSearch, TeamChannelList, TeamChannelPreview } from './';
import HospitalIcon from '../assets/hospital.png';
import LogoutIcon from '../assets/logout.png';

const cookies = new Cookies();

const SideBar = ({ logout }) => (
  <div className="channel-list__sidebar">
    <div className="channel-list__sidebar__icon1">
      <div className="icon1__inner">
        <img src={HospitalIcon} alt="Hospital" width = '30' />
      </div>
    </div>
    <div className="channel-list__sidebar__icon2">
      <div className="icon2__inner" onClick={logout}>
        <img src={LogoutIcon} alt="Logout" width = "30" />
      </div>
    </div>
  </div>
);

const CompanyHeader = () => (
  <div className="channel-list__header">
    <p className="channel-list__header__text">COLLABORATE</p>
  </div>
);

const customChannelTeamFilter = (channels) => {
  return channels.filter((channel) => channel.type === 'team');
}

const customChannelMessagingFilter = (channels) => {
  return channels.filter((channel) => channel.type === 'messaging');
}

const ChannelListContent = ({isCreating, setIsCreating, setCreateType, setIsEditing, setToggleContainer}) => {
  const { client } = useChatContext();

  const logout = () => {
    cookies.remove('userId');
    cookies.remove('username');
    cookies.remove('fullName');
    cookies.remove('avatarURL');
    cookies.remove('hashedPassword');
    cookies.remove('phoneNumber');
    cookies.remove('token');

    window.location.reload();
  }

  const filters = { members: { $in: [client.userID] } };

  return (
    <>
        <SideBar logout={logout}/>
        <div className="channel-list__list__wrapper">
            <CompanyHeader />
            <ChannelSearch setToggleContainer={setToggleContainer}/>
            <ChannelList 
                filters={filters}
                channelRenderFilterFn={customChannelTeamFilter}
                List={(listProps) => (
                    <TeamChannelList    {...listProps}
                        type="team"
                        isCreating={isCreating}
                        setIsCreating={setIsCreating}
                        setCreateType={setCreateType}
                        setIsEditing={setIsEditing}
                        setToggleContainer={setToggleContainer}
                    />
                )}
                Preview={(previewProps) => (
                    <TeamChannelPreview    {...previewProps}
                        type="team"
                        setIsCreating={setIsCreating}
                        setIsEditing={setIsEditing}
                        setToggleContainer={setToggleContainer}
                    />
                )}
            />
            <ChannelList
                filters={filters}
                channelRenderFilterFn={customChannelMessagingFilter}
                List={(listProps) => (
                    <TeamChannelList    {...listProps}
                        type="messaging"
                        isCreating={isCreating}
                        setIsCreating={setIsCreating}
                        setCreateType={setCreateType}
                        setIsEditing={setIsEditing}
                        setToggleContainer={setToggleContainer}
                    />
                )}
                Preview={(previewProps) => (
                    <TeamChannelPreview    {...previewProps}
                        type="messaging"
                        setIsCreating={setIsCreating}
                        setIsEditing={setIsEditing}
                        setToggleContainer={setToggleContainer}
                    />
                )}
            />
        </div>
    </>
  )
}

const ChannelListContainer = ({ setCreateType, setIsCreating, setIsEditing }) => {
  const [toggleContainer, setToggleContainer] = useState(false);
  return(
    <>
      <div className="channel-list__container">
        <ChannelListContent
          setCreateType={setCreateType}
          setIsCreating={setIsCreating}
          setIsEditing={setIsEditing}
        />
      </div>
      <div className="channel-list__container-responsive" 
        style = {{ left : toggleContainer ? '0%' : '-89%'}}>
          <div className='channel-list__container-toggle' onClick={() => setToggleContainer((prevToggleContainer) => !prevToggleContainer)}>

          </div>
          <ChannelListContent
            setCreateType={setCreateType}
            setIsCreating={setIsCreating}
            setIsEditing={setIsEditing}
            setToggleContainer={setToggleContainer}
          />
      </div>
    </>
  )
}

export default ChannelListContainer
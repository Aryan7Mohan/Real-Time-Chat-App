import React, { useState, useEffect } from "react";
import styled from "styled-components";
// import Logo from "../assets/logo.svg";
import Logo from "../assets/chat-app-logo.png";
import { useNavigate } from "react-router-dom";

const Contacts = ({ contacts, currentUser, changeChat }) => {
  const navigate = useNavigate();
  const [currentUsername, setCurrentUsername] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);

  useEffect(() => {
    // console.log(contacts);
    if (currentUser) {
      setCurrentUserImage(currentUser.avatarImage);
      setCurrentUsername(currentUser.username);
    }
  }, [currentUser]);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  const handleUsernameClick = () => {
    navigate(`/profile/${currentUser.username}`);
  }

  return (
    <>
      {currentUsername && (
        <Container>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h3>
              Chat<span>Vibe</span>
            </h3>
          </div>
          <div className="contacts">
            {contacts.map((contact, index) => {
              return (
                <div
                  className={`contact ${
                    index === currentSelected ? "selected" : ""
                  }`}
                  key={index}
                  onClick={() => changeCurrentChat(index, contact)}
                >
                  <div className="avatar">
                    {currentUserImage ? (
                      <img src="" alt="avatar" />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="40"
                        fill="currentColor"
                        class="bi bi-person-circle"
                        viewBox="0 0 16 16"
                      >
                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                        <path
                          fill-rule="evenodd"
                          d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                        />
                      </svg>
                    )}

                    {/* <img
                      src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                      alt="avatar"
                    /> */}
                  </div>
                  <div className="username">
                    <h3>{contact.username}</h3>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="current-user">
            <div className="avatar">
              {currentUserImage ? (
                <img src="" alt="avatar" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  fill="currentColor"
                  class="bi bi-person-circle"
                  viewBox="0 0 16 16"
                >
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                  <path
                    fill-rule="evenodd"
                    d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                  />
                </svg>
              )}

              {/* <img
                      src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                      alt="avatar"
                    /> */}
            </div>
            <div className="username" onClick={handleUsernameClick}>
              <h2>{currentUsername}</h2>
            </div>
          </div>
        </Container>
      )}
    </>
  );
};

const Container = styled.div`
  display: grid;
  border-radius: 25px 0px 0px 25px;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: #242526;
  /* background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
	background-size: 400% 400%;
	animation: gradient 15s ease infinite;
  @keyframes gradient {
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
} */

  .bi-person-circle {
    color: #cf9fff;
  }

  .brand {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    img {
      height: 2rem;
    }
    h3 {
      color: white;
      text-transform: uppercase;
      span {
        color: #cf9fff;
      }
    }
  }
  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .contact {
      /* background-color: #ffffff39; */
      border-radius: 20px;
      border:none;
      border-bottom: 3px solid #cf9fff;
      min-height: 5rem;
      width: 90%;
      cursor: pointer;
      /* border-radius: 0.2rem; */
      padding: 0.4rem;
      gap: 1rem;
      align-items: center;
      display: flex;
      transition: 0.5s ease-in-out;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
    .selected {
      background-color: #5d34a5;
    }
  }
  .current-user {
    background-color: #242526;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    .avatar {
      .bi-person-circle {
        color: white;
      }
      img {
        height: 4rem;
        max-inline-size: 100%;
      }
    }
    .username {
      cursor:pointer;
      h2 {
        color: white;
      }
    }

    .username:hover {
      h2 {
        color:lime;
      }
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }
`;

export default Contacts;

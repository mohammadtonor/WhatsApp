export const getUserChatRoomLists = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      ChatRooms {
        items {
          chatRoom {
            id
            name
            image
            isPrivate
            updatedAt
            users {
              items {
                user {
                  id
                  name
                  image
                }
              }
            }
            Messages {
              items {
                text
                id
                createdAt
                userID
              }
            }
            LastMessages {
              text
              id
              createdAt
            }
          }
        }
      }
    }
  }
`;

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
export const listMessagesByChatroom = /* GraphQL */ `
  query ListMessagesByChatroom(
    $chatroomID: ID!
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMessagesByChatroom(
      chatroomID: $chatroomID
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        text
        userID
        chatroomID
        createdAt
        images
        Attachments {
          items {
            id
            storageKey
            type
            width
            height
            duration
            messageID
            chatroomID
            createdAt
            updatedAt
            __typename
          }
        }
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;

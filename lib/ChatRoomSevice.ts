import { API, Auth, graphqlOperation } from "aws-amplify";

export const getChatRoomExist = async (userID: string) => {
  const authUser = await Auth.currentAuthenticatedUser();
  const response = await API.graphql(
    graphqlOperation(chatRoomUserList, { id: authUser.attributes.sub }),
  );
  //@ts-ignore
  const chatRoom = response?.data?.getUser?.ChatRooms?.items || [];
  //@ts-ignore
  return chatRoom.find((item) =>
    item?.chatRoom?.users?.items?.some(
      //@ts-ignore
      (userItem) => userItem?.user?.id === userID,
    ),
  );
};

const chatRoomUserList = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      ChatRooms {
        items {
          chatRoom {
            id
            users {
              items {
                user {
                  id
                }
              }
            }
          }
        }
      }
    }
  }
`;

export declare interface ChatItemProps {
  chat: {
    id: string;
    user: {
      id: string;
      name: string;
      image: string;
    };
    LastMessages: {
      id: string;
      text: string;
      createdAt: string;
    };
  };
}

export declare interface UserProps {
  id: string;
  name: string;
  image: string;
}

export declare interface ContactItemProps {
  user: {
    id: string;
    name: string;
    image: string;
    status?: string;
  };
}

export declare interface MessageProps {
  message: {
    id: string;
    text: string;
    createdAt: string;
    user: {
      id: string;
      name: string;
    };
  };
}

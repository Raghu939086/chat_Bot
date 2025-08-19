import { gql } from "@apollo/client";

// 1. Get list of chats
export const GET_CHATS = gql`
  query GetChats {
    chats(order_by: { created_at: desc }) {
      id
      title
      created_at
    }
  }
`;

// 2. Create new chat (user_id removed to rely on Hasura preset)
export const CREATE_CHAT = gql`
  mutation CreateChat($title: String!) {
    insert_chats_one(object: { title: $title }) {
      id
      title
      created_at
      user_id
    }
  }
`;

// 3. Get messages
export const GET_MESSAGES = gql`
  query GetMessages($chat_id: uuid!) {
    messages(
      where: { chat_id: { _eq: $chat_id } }
      order_by: { created_at: asc }
    ) {
      id
      content
      role
      created_at
    }
  }
`;

// 4. Subscribe to new messages
export const MESSAGES_SUBSCRIPTION = gql`
  subscription OnMessageAdded($chat_id: uuid!) {
    messages(
      where: { chat_id: { _eq: $chat_id } }
      order_by: { created_at: asc }
    ) {
      id
      content
      role
      created_at
    }
  }
`;

// 5. Send message
export const SEND_MESSAGE = gql`
  mutation SendMessage($chat_id: uuid!, $content: String!) {
    insert_messages_one(
      object: { chat_id: $chat_id, content: $content, role: "user" }
    ) {
      id
      content
      role
      created_at
    }
  }
`;

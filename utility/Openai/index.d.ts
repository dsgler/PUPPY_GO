/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  OpenAI as OpenAINode,
  type ClientOptions as ClientOptionsNode,
} from 'openai';
import EventSource from 'react-native-sse';
export type onError = (error: any) => void;
export type onOpen = () => void;
export type onDone = () => void;
export type onEvents = {
  onError?: onError;
  onOpen?: onOpen;
  onDone?: onDone;
};
export interface ClientOptions extends ClientOptionsNode {
  apiKey: string;
  baseURL: string;
}
export type onChatCompletionChunkData = (data: ChatCompletionChunk) => void;
export type onThreadRunData = (data: Beta.Threads.Run) => void;
export type Moderation = OpenAINode.Moderation;
export type ModerationCreateResponse = OpenAINode.ModerationCreateResponse;
export type ModerationCreateParams = OpenAINode.ModerationCreateParams;
export type Model = OpenAINode.Model;
export type ChatCompletionCreateParamsNonStreaming =
  OpenAINode.ChatCompletionCreateParamsNonStreaming;
export type ChatCompletionChunk = OpenAINode.ChatCompletionChunk;
export type ChatCompletion = OpenAINode.ChatCompletion;
export type FileObject = OpenAINode.FileObject;
export type FileContent = OpenAINode.FileContent;
export type FileDeleted = OpenAINode.FileDeleted;
export declare namespace Beta {
  type ThreadCreateParams = OpenAINode.Beta.ThreadCreateParams;
  type Thread = OpenAINode.Beta.Thread;
  type ThreadUpdateParams = OpenAINode.Beta.ThreadUpdateParams;
  type ThreadCreateAndRunParamsNonStreaming =
    OpenAINode.Beta.ThreadCreateAndRunParamsNonStreaming;
  type ThreadDeleted = OpenAINode.Beta.ThreadDeleted;
  type Assistant = OpenAINode.Beta.Assistant;
  type AssistantDeleted = OpenAINode.Beta.AssistantDeleted;
  namespace Assistants {
    type AssistantCreateParams =
      OpenAINode.Beta.Assistants.AssistantCreateParams;
  }
  namespace Threads {
    type Run = OpenAINode.Beta.Threads.Run;
    namespace Runs {
      type RunCreateParamsNonStreaming =
        OpenAINode.Beta.Threads.Runs.RunCreateParamsNonStreaming;
    }
    type Message = OpenAINode.Beta.Threads.Message;
    namespace Messages {
      type MessageCreateParams =
        OpenAINode.Beta.Threads.Messages.MessageCreateParams;
      type MessageListParams =
        OpenAINode.Beta.Threads.Messages.MessageListParams;
      type MessageDeleted = OpenAINode.Beta.Threads.Messages.MessageDeleted;
    }
  }
}
export declare class OpenAI {
  apiKey: string;
  baseURL: string;
  private client;
  constructor(opts: ClientOptions);
  models: {
    list: () => Promise<Model[]>;
  };
  moderations: {
    create: (body: ModerationCreateParams) => Promise<ModerationCreateResponse>;
  };
  beta: {
    assistants: {
      list: () => Promise<Beta.Assistant[]>;
      create: (
        body: Beta.Assistants.AssistantCreateParams,
      ) => Promise<Beta.Assistant>;
      del: (assistantId: string) => Promise<Beta.AssistantDeleted>;
      retrieve: (assistantId: string) => Promise<Beta.Assistant>;
      update: (
        assistantId: string,
        body: Beta.Assistants.AssistantCreateParams,
      ) => Promise<Beta.Assistant>;
    };
    threads: {
      create: (body?: Beta.ThreadCreateParams) => Promise<Beta.Thread>;
      retrieve: (threadId: string) => Promise<Beta.Thread>;
      update: (
        threadId: string,
        body: Beta.ThreadUpdateParams,
      ) => Promise<Beta.Thread>;
      del: (threadId: string) => Promise<Beta.ThreadDeleted>;
      createAndRunPoll: (
        body: Beta.ThreadCreateAndRunParamsNonStreaming,
      ) => Promise<Beta.Threads.Run>;
      messages: {
        list: (
          threadId: string,
          query?: Beta.Threads.Messages.MessageListParams,
        ) => Promise<Beta.Threads.Message[]>;
        del: (
          threadId: string,
          messageId: string,
        ) => Promise<Beta.Threads.Messages.MessageDeleted>;
        create: (
          threadId: string,
          body: Beta.Threads.Messages.MessageCreateParams,
        ) => Promise<Beta.Threads.Message>;
      };
      runs: {
        stream: (
          threadId: string,
          body: Beta.Threads.Runs.RunCreateParamsNonStreaming,
          onData: onThreadRunData,
          callbacks: onEvents,
        ) => void;
      };
    };
  };
  /**
   * Create a chat completion using the OpenAI API.
   * @param {OpenAIParams} params - Parameters for the OpenAI chat completion API.
   * @returns {void}
   */
  chat: {
    completions: {
      /**
       * Create a chat completion using the OpenAI API.
       * @body {ChatCompletionCreateParamsNonStreaming} body - Parameters for the OpenAI chat completion API.
       * @returns {Promise<ChatCompletion>}
       */
      create: (
        body: ChatCompletionCreateParamsNonStreaming,
      ) => Promise<ChatCompletion>;
      /**
       * Create a chat completion stream using the OpenAI API.
       * @param {ChatCompletionCreateParamsNonStreaming} params - Parameters for the OpenAI chat completion API since streaming is assumed.
       * @param {onChatCompletion} onData - Callback to handle incoming messages.
       * @param {onEvents} callbacks - Object containing optional callback functions.
       * @returns {void}
       */
      stream: (
        params: ChatCompletionCreateParamsNonStreaming,
        onData: onChatCompletionChunkData,
        callbacks: onEvents,
      ) => EventSource<never>;
    };
  };
  files: {
    /**
     * Upload file using the Expo FileSystem to the OpenAI API /v1/files endpoints
     * @param {string} filePath - The path of the file to upload.
     * @param {string} purpose - The purpose of the data (e.g., "fine-tune").
     * @see {@link https://docs.expo.dev/versions/latest/sdk/filesystem/ Expo FileSystem}
     * @see {@link https://beta.openai.com/docs/api-reference/files OpenAI Files API}
     * @returns {Promise<FileObject>}
     */
    create: (filePath: string, purpose: string) => Promise<FileObject>;
    content: (fileId: string) => Promise<Response>;
    delete: (fileId: string) => Promise<FileDeleted>;
    retrieve: (fileId: string) => Promise<FileObject>;
    list: () => Promise<FileObject[]>;
  };
  /**
   * Connect to a given OpenAI API endpoint and start streaming.
   * @param {string} url - The API endpoint to connect to.
   * @param {OpenAIParams} params - The parameters to send with the API request.
   * @param {onChatCompletion | onThreadRun} onData - Callback to handle incoming data.
   * @param {onEvents} callbacks - Object containing callback functions.
   * @param {onStreamError} [callbacks.onError] - Callback to handle errors.
   * @param {onStreamOpen} [callbacks.onOpen] - Callback to handle when the connection opens.
   * @param {onStreamDone} [callbacks.onDone] - Callback to handle when the stream ends.
   * @private
   */
  private _stream;
}
export default OpenAI;

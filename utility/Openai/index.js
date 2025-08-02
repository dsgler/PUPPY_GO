import EventSource from 'react-native-sse';
import * as FileSystem from 'expo-file-system';
import { OpenAI as OpenAINode } from 'openai';
export class OpenAI {
  apiKey;
  baseURL;
  client;
  constructor(opts) {
    this.apiKey = opts.apiKey;
    this.baseURL = opts.baseURL;
    // expo file system does not work in web anyway
    // opts.dangerouslyAllowBrowser = true;
    this.client = new OpenAINode(opts);
  }
  models = {
    list: async () => (await this.client.models.list()).data,
  };
  moderations = {
    create: async (body) => this.client.moderations.create(body),
  };
  beta = {
    assistants: {
      list: async () => (await this.client.beta.assistants.list()).data,
      create: async (body) => await this.client.beta.assistants.create(body),
      del: async (assistantId) =>
        await this.client.beta.assistants.del(assistantId),
      retrieve: async (assistantId) =>
        await this.client.beta.assistants.retrieve(assistantId),
      update: async (assistantId, body) =>
        await this.client.beta.assistants.update(assistantId, body),
    },
    threads: {
      create: async (body) => this.client.beta.threads.create(body),
      retrieve: async (threadId) => this.client.beta.threads.retrieve(threadId),
      update: async (threadId, body) =>
        this.client.beta.threads.update(threadId, body),
      del: async (threadId) => this.client.beta.threads.del(threadId),
      createAndRunPoll: async (body) =>
        this.client.beta.threads.createAndRunPoll(body),
      messages: {
        list: async (threadId, query) =>
          (await this.client.beta.threads.messages.list(threadId, query)).data,
        del: async (threadId, messageId) =>
          await this.client.beta.threads.messages.del(threadId, messageId),
        create: async (threadId, body) =>
          await this.client.beta.threads.messages.create(threadId, body),
      },
      runs: {
        stream: (threadId, body, onData, callbacks) =>
          this._stream(
            `${this.baseURL}/threads/${threadId}/runs`,
            body,
            onData,
            callbacks,
            {
              'OpenAI-Beta': 'assistants=v2',
            },
          ),
      },
    },
  };
  /**
   * Create a chat completion using the OpenAI API.
   * @param {OpenAIParams} params - Parameters for the OpenAI chat completion API.
   * @returns {void}
   */
  chat = {
    completions: {
      /**
       * Create a chat completion using the OpenAI API.
       * @body {ChatCompletionCreateParamsNonStreaming} body - Parameters for the OpenAI chat completion API.
       * @returns {Promise<ChatCompletion>}
       */
      create: async (body) => this.client.chat.completions.create(body),
      /**
       * Create a chat completion stream using the OpenAI API.
       * @param {ChatCompletionCreateParamsNonStreaming} params - Parameters for the OpenAI chat completion API since streaming is assumed.
       * @param {onChatCompletion} onData - Callback to handle incoming messages.
       * @param {onEvents} callbacks - Object containing optional callback functions.
       * @returns {void}
       */
      stream: (params, onData, callbacks) =>
        this._stream(
          `${this.baseURL}/chat/completions`,
          params,
          onData,
          callbacks,
        ),
    },
  };
  files = {
    /**
     * Upload file using the Expo FileSystem to the OpenAI API /v1/files endpoints
     * @param {string} filePath - The path of the file to upload.
     * @param {string} purpose - The purpose of the data (e.g., "fine-tune").
     * @see {@link https://docs.expo.dev/versions/latest/sdk/filesystem/ Expo FileSystem}
     * @see {@link https://beta.openai.com/docs/api-reference/files OpenAI Files API}
     * @returns {Promise<FileObject>}
     */
    create: async (filePath, purpose) => {
      const response = await FileSystem.uploadAsync(
        `${this.baseURL}/files`,
        filePath,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
          httpMethod: 'POST',
          fieldName: 'file',
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          parameters: {
            purpose: purpose,
          },
        },
      );
      const responseData = JSON.parse(response.body);
      return responseData;
    },
    content: async (fileId) => this.client.files.content(fileId),
    delete: async (fileId) => this.client.files.del(fileId),
    retrieve: async (fileId) => this.client.files.retrieve(fileId),
    list: async () => (await this.client.files.list()).data,
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
  _stream(url, params, onData, callbacks, headers = {}) {
    const { onError, onOpen, onDone } = callbacks;
    const requestBody = { ...params, stream: true };
    const eventSource = new EventSource(url, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...headers,
      },
      method: 'POST',
      body: JSON.stringify(requestBody),
    });
    eventSource.addEventListener('message', (event) => {
      if (event.data && event.data !== '[DONE]') {
        try {
          const data = JSON.parse(event.data);
          onData(data);
        } catch (error) {
          onError?.(
            new Error(
              `JSON Parse on ${event.data} with error ${error.message}`,
            ),
          );
          eventSource.close(); // Disconnect the EventSource
        }
      } else {
        onDone?.(); // Call onDone when the stream ends
        eventSource.close(); // Disconnect the EventSource
      }
    });
    eventSource.addEventListener('error', (error) => {
      onError?.(error);
      eventSource.close(); // Disconnect the EventSource
    });
    eventSource.addEventListener('open', () => {
      onOpen?.();
    });
    return eventSource;
  }
}
export default OpenAI;
